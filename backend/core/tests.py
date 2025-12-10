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

    def test_login_user_jwt(self):
        # Create user first
        user = User.objects.create_user(
            username='loginuser',
            email='login@example.com',
            first_name='Login',
            password='loginpassword123'
        )
        url = reverse('token_obtain_pair')
        data = {
            'email': 'login@example.com',
            'password': 'loginpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_update_profile(self):
        user = User.objects.create_user(
            username='updateuser',
            email='update@example.com',
            first_name='Original',
            password='password123'
        )
        self.client.force_authenticate(user=user)
        url = reverse('user_data')
        data = {'first_name': 'Updated'}
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.first_name, 'Updated')

    def test_update_restricted_fields(self):
        user = User.objects.create_user(
            username='restrictuser',
            email='restrict@example.com',
            phone_number='1234567890',
            password='password123'
        )
        self.client.force_authenticate(user=user)
        url = reverse('user_data')
        
        # Try to update email via main endpoint (should be ignored due to read_only)
        data = {'email': 'hacker@example.com'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.email, 'restrict@example.com')

        # Try specific endpoints
        url_email = reverse('update_email')
        response_email = self.client.put(url_email)
        self.assertEqual(response_email.status_code, status.HTTP_403_FORBIDDEN)
