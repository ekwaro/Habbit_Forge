import React from 'react';
import { Title, Text, Container } from '@mantine/core';

function ContactUsPage() {
  return (
    <Container size="sm" style={{ marginTop: '50px' }}>
      <Title order={1} mb="md">Contact Us</Title>
      <Text>
        Have questions or feedback? Feel free to reach out to us!
      </Text>
      <Text mt="md">
        Email: <a href="mailto:support@habitsforge.com">support@habitsforge.com</a>
      </Text>
      <Text>
        Phone: +1 (123) 456-7890
      </Text>
    </Container>
  );
}

export default ContactUsPage;