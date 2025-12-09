from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthTests(APITestCase):
    def test_register_user(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'first_name': 'Test',
            'phone_number': '1234567890',
            'password': 'strongpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'test@example.com')

    def test_login_user(self):
        # Create user first
        user = User.objects.create_user(
            username='loginuser',
            email='login@example.com',
            first_name='Login',
            password='loginpassword123'
        )
        url = reverse('login')
        data = {
            'email': 'login@example.com',
            'password': 'loginpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('email', response.data)
