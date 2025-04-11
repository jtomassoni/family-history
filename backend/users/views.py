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
from rest_framework.authentication import TokenAuthentication, SessionAuthentication

from .models import User
from .serializers import UserSerializer

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
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
    try:
        user = User.objects.get(verification_code=verification_code)
        user.is_active = True
        user.has_clicked_activation_link = True
        user.save()
        return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)

def send_verification_email(user, verification_url):
    """
    Send verification email to user
    """
    subject = 'Verify your email address'
    
    # HTML email content
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .container {{
                background-color: #f9f9f9;
                border-radius: 8px;
                padding: 30px;
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 24px;
                background-color: #4CAF50;
                color: white;  /* Button text color */
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 30px;
                font-size: 12px;
                color: #666;
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Welcome to Family History!</h2>
            </div>
            <p>Hello {user.first_name or user.email},</p>
            <p>Thank you for registering with Family History. To complete your registration, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
                <a href="{verification_url}" class="button" style="color: white;">Verify Email Address</a>
            </div>
            <p>If you did not request this, please ignore this email.</p>
            <div class="footer">
                <p>Best regards,<br>The Family History Team</p>
                <p>If the button above doesn't work, you can copy and paste this link into your browser:<br>
                <small>{verification_url}</small></p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text fallback
    plain_message = f"""
    Hello {user.first_name or user.email},
    
    Thank you for registering with Family History. To complete your registration, please verify your email address by clicking the link below:
    
    {verification_url}
    
    If you did not request this, please ignore this email.
    
    Best regards,
    The Family History Team
    """
    
    try:
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"Verification email sent to {user.email}")
    except Exception as e:
        print(f"Failed to send verification email: {str(e)}")

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
