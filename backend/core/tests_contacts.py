from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import User, Contact

class ContactTests(APITestCase):
    def setUp(self):
        # Create users
        self.user_a = User.objects.create_user(username='user_a', email='a@example.com', password='password123', first_name='A')
        self.user_b = User.objects.create_user(username='user_b', email='b@example.com', password='password123', first_name='B')
        self.user_c = User.objects.create_user(username='user_c', email='c@example.com', password='password123', first_name='C')

        # Auth as User A
        self.client = APIClient()
        self.client.force_authenticate(user=self.user_a)

        self.list_url = reverse('contact-list')

    def test_create_contact_success(self):
        """User A adds User B by username"""
        data = {'username': 'user_b'}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contact.objects.count(), 1)
        self.assertEqual(Contact.objects.get().contact, self.user_b)

    def test_add_self_fail(self):
        """User A cannot add User A"""
        data = {'username': 'user_a'}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("cannot add yourself", str(response.data))

    def test_add_unknown_fail(self):
        """Cannot add non-existent user"""
        data = {'username': 'unknown_user'}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("does not exist", str(response.data))

    def test_add_duplicate_fail(self):
        """Cannot add same contact twice if active"""
        Contact.objects.create(user=self.user_a, contact=self.user_b)
        data = {'username': 'user_b'}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already in your contacts", str(response.data))

    def test_soft_delete(self):
        """Deleting a contact sets is_deleted=True"""
        contact = Contact.objects.create(user=self.user_a, contact=self.user_b)
        url = reverse('contact-detail', args=[contact.id])
        
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify DB state
        contact.refresh_from_db()
        self.assertTrue(contact.is_deleted)
        self.assertIsNotNone(contact.deleted_at)

    def test_list_contacts(self):
        """List should only show active contacts"""
        # Active
        Contact.objects.create(user=self.user_a, contact=self.user_b)
        # Soft Deleted
        c = Contact.objects.create(user=self.user_a, contact=self.user_c)
        c.is_deleted = True
        c.save()

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['contact']['username'], 'user_b')

    def test_readd_soft_deleted(self):
        """Adding a soft-deleted contact should reactivate them"""
        c = Contact.objects.create(user=self.user_a, contact=self.user_b, is_deleted=True)
        
        data = {'username': 'user_b'}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Should be 200 or 201 typically, serializer returns the object so 201/200 depending on view logic. ModelViewSet creates usually 201.")
        
        c.refresh_from_db()
        self.assertFalse(c.is_deleted)

    def test_update_settings(self):
        """Verify we can partial update settings"""
        contact = Contact.objects.create(user=self.user_a, contact=self.user_b)
        url = reverse('contact-detail', args=[contact.id])
        
        data = {'allow_transactions': False}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        contact.refresh_from_db()
        self.assertFalse(contact.allow_transactions)
