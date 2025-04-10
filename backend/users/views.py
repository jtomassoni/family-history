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

from .models import User
from .serializers import UserSerializer

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
        return Response(
            {'error': 'Please provide both email and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    # Authenticate the user
    user = authenticate(username=email, password=password)
    
    if not user:
        print(f"Authentication failed for {email}")
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    print(f"User authenticated: {user.email} (ID: {user.id})")
    
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
