from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.conf import settings
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.shortcuts import get_object_or_404
import datetime
import uuid
import requests
from allauth.socialaccount.models import SocialAccount
from django.urls import path

from .models import User
from .serializers import UserSerializer, ContactFormSerializer

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Users can only see their own profile unless they are staff
        """
        user = self.request.user
        if user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Get the current user's profile
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='profile-image')
    def upload_profile_image(self, request):
        """
        Upload a profile image
        """
        user = request.user
        image = request.data.get('image')
        
        if not image:
            return Response(
                {'error': 'No image provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # In a real implementation, you would process the image,
        # upload it to media storage, and update the user's profile
        
        # Mock implementation:
        user.picture = "http://example.com/media/profile/image.jpg"
        user.save()
        
        serializer = self.get_serializer(user)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    """
    Login endpoint for superuser and email-based authentication
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    print(f"Login attempt for email: {email}")
    
    if not email or not password:
        print("Missing email or password")
        return Response(
            {'error': 'Please provide both email and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    # Authenticate the user
    user = authenticate(username=email, password=password)
    
    if not user:
        print(f"Authentication failed for {email}")
        print(f"User exists: {User.objects.filter(email=email).exists()}")
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    print(f"User authenticated: {user.email} (ID: {user.id})")
    
    # Create or get token
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'picture': user.picture
        }
    })
    
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """
    Register a new user with email verification
    """
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    if not email or not password:
        return Response(
            {'error': 'Please provide email and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if user with this email already exists
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'A user with this email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create user with unverified status
    verification_code = str(uuid.uuid4())
    
    # Use username as the email to maintain uniqueness
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        is_active=False  # User is inactive until email is verified
    )
    
    # Store verification code (in a real app, use a proper verification model)
    user.verification_code = verification_code
    user.save()
    
    # Send verification email
    verification_url = f"{settings.FRONTEND_URL}/verify-email/{verification_code}"
    send_verification_email(user, verification_url)
    
    return Response({
        'message': 'User registered successfully. Please check your email to verify your account.',
        'email': email
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def verify_email(request, verification_code):
    """
    Verify a user's email
    """
    user = get_object_or_404(User, verification_code=verification_code)
    
    # Activate the user
    user.is_active = True
    user.verification_code = None  # Clear the verification code
    user.save()
    
    return Response({
        'message': 'Email verified successfully. You can now log in.'
    })

def send_verification_email(user, verification_url):
    """
    Send verification email to user
    """
    subject = 'Verify your email address'
    message = f"""
    Hello {user.first_name or user.email},
    
    Thank you for registering. Please click the link below to verify your email address:
    
    {verification_url}
    
    If you did not request this, please ignore this email.
    
    Best regards,
    The Family History Team
    """
    
    # In development, just print the message to console
    print(f"Would send email to {user.email} with verification URL: {verification_url}")
    
    # In production, uncomment this:
    # send_mail(
    #     subject,
    #     message,
    #     settings.DEFAULT_FROM_EMAIL,
    #     [user.email],
    #     fail_silently=False,
    # )

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_callback(request):
    """
    Handle Google OAuth callback
    """
    code = request.data.get('code')
    redirect_uri = request.data.get('redirect_uri')
    
    if not code or not redirect_uri:
        return Response(
            {'error': 'Missing required parameters'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Exchange code for tokens
        token_url = 'https://oauth2.googleapis.com/token'
        token_data = {
            'code': code,
            'client_id': settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id'],
            'client_secret': settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['secret'],
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code'
        }
        
        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()
        tokens = token_response.json()
        
        # Get user info from Google
        userinfo_url = 'https://www.googleapis.com/oauth2/v3/userinfo'
        userinfo_response = requests.get(
            userinfo_url,
            headers={'Authorization': f'Bearer {tokens["access_token"]}'}
        )
        userinfo_response.raise_for_status()
        userinfo = userinfo_response.json()
        
        # Get or create user
        try:
            social_account = SocialAccount.objects.get(provider='google', uid=userinfo['sub'])
            user = social_account.user
        except SocialAccount.DoesNotExist:
            # Create new user
            user = User.objects.create_user(
                username=userinfo['email'],
                email=userinfo['email'],
                first_name=userinfo.get('given_name', ''),
                last_name=userinfo.get('family_name', ''),
                is_active=True
            )
            # Create social account
            SocialAccount.objects.create(
                user=user,
                provider='google',
                uid=userinfo['sub'],
                extra_data=userinfo
            )
        
        # Create or get token
        token, created = Token.objects.get_or_create(user=user)
        
        # Return user info and token
        user_data = UserSerializer(user).data
        user_data['is_staff'] = user.is_staff
        user_data['is_superuser'] = user.is_superuser
        
        response = Response({
            'token': token.key,
            'user': user_data,
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff
        })
        
        # Set CORS headers explicitly
        response["Access-Control-Allow-Origin"] = request.META.get('HTTP_ORIGIN', '*')
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Origin, Content-Type, Accept, Authorization"
        
        return response
        
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to authenticate with Google: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST', 'OPTIONS', 'GET'])
@permission_classes([permissions.AllowAny])
def contact_form(request):
    print("contact_form view called. Request method:", request.method, "Request data:", request.data)
    if request.method == 'GET':
         # (Temporary branch for debugging: log a GET request and return a dummy response.)
         return Response({"message": "contact_form view (GET) hit (debugging branch)."})
    serializer = ContactFormSerializer(data=request.data)
    if serializer.is_valid():
         name = serializer.validated_data['name']
         email = serializer.validated_data['email']
         message = serializer.validated_data['message']
         subject = f"New Contact Form Submission from {name}"
         body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
         send_mail(
             subject,
             body,
             settings.DEFAULT_FROM_EMAIL,
             [settings.CONTACT_FORM_RECIPIENT],
             fail_silently=False,
         )
         return Response({'success': True, 'message': 'Message sent successfully.'})
     else:
         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset(request):
    """
    Send password reset email to user
    """
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'Please provide an email address'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Don't reveal whether the email exists or not
        return Response(
            {'message': 'If an account exists with this email, a password reset link has been sent.'},
            status=status.HTTP_200_OK
        )
    
    # Generate reset token
    reset_token = str(uuid.uuid4())
    user.reset_token = reset_token
    user.reset_token_expires = timezone.now() + datetime.timedelta(hours=24)
    user.save()
    
    # Send reset email
    reset_url = f"{settings.FRONTEND_URL}/reset-password/{reset_token}"
    send_password_reset_email(user, reset_url)
    
    return Response(
        {'message': 'If an account exists with this email, a password reset link has been sent.'},
        status=status.HTTP_200_OK
    )

# Update the auth_urls list to include both endpoints
auth_urls = [
    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('verify-email/<str:verification_code>/', verify_email, name='verify-email'),
    path('google/callback/', google_callback, name='google-callback'),
    path('password-reset/', password_reset, name='password-reset'),
    path('contact/', contact_form, name='contact-form'),
]
