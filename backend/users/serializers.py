from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the custom User model.
    """
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'picture', 'bio', 'phone_number', 'location', 
                 'birth_date', 'date_joined', 'full_name', 'is_google_user']
        read_only_fields = ['email', 'date_joined', 'is_google_user']
    
    def get_full_name(self, obj):
        """
        Get the user's full name.
        """
        return obj.get_full_name() 