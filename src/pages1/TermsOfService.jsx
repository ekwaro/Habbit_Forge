import React from 'react';
import { Container, Title, Text, List, ListItem, Divider, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom'; 

function TermsOfService() {
  return (
    <Container size="md" my="lg"> 
      <Title order={1} mb="md" fw={700}>Terms of Service</Title>
      <Text c="dimmed" mb="xl">
        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </Text>

      <Text mb="lg">
        Welcome to Habits Forge! These Terms of Service ("Terms") govern your use of our website and services. By accessing or using Habits Forge, you agree to be bound by these Terms.
      </Text>

      <Divider my="lg" />

      <Title order={2} mb="md">1. Acceptance of Terms</Title>
      <Text mb="lg">
        By creating an account or using our services, you signify your agreement to these Terms, as well as our Privacy Policy. If you do not agree, please do not use our services.
      </Text>

      <Title order={2} mb="md">2. Your Account</Title>
      <Text mb="sm">
        You are responsible for maintaining the confidentiality of your account login information and are fully responsible for all activities that occur under your account. You agree to:
      </Text>
      <List mb="lg">
        <ListItem>Provide accurate, current, and complete information during the registration process.</ListItem>
        <ListItem>Maintain and promptly update your account information.</ListItem>
        <ListItem>Notify us immediately of any unauthorized use of your account.</ListItem>
      </List>

      <Title order={2} mb="md">3. User Conduct</Title>
      <Text mb="lg">
        You agree not to use Habits Forge for any unlawful or prohibited activities. This includes, but is not limited to, posting offensive content, harassing other users, or attempting to breach our security.
      </Text>

      <Title order={2} mb="md">4. Intellectual Property</Title>
      <Text mb="lg">
        All content and materials available on Habits Forge, including but not limited to text, graphics, website name, code, images, and logos are the intellectual property of Habits Forge and are protected by applicable copyright and trademark law.
      </Text>

      <Title order={2} mb="md">5. Limitation of Liability</Title>
      <Text mb="lg">
        Habits Forge is provided "as is" without any warranties. We are not liable for any damages arising from your use of the service.
      </Text>

      <Title order={2} mb="md">6. Changes to Terms</Title>
      <Text mb="lg">
        We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the service after such changes constitutes your acceptance of the new Terms.
      </Text>

      <Title order={2} mb="md">7. Contact Us</Title>
      <Text mb="lg">
        If you have any questions about these Terms, please contact us at <Anchor component={Link} to="/contact">our Contact Us page</Anchor>.
      </Text>
    </Container>
  );
}

export default TermsOfService;