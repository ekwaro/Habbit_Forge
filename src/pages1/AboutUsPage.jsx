import React from 'react';
import { Title, Text, Container } from '@mantine/core';

function AboutUsPage() {
  return (
    <Container size="sm" style={{ marginTop: '50px' }}>
      <Title order={1} mb="md">About Habits Forge</Title>
      <Text>
        We are dedicated to helping individuals cultivate positive habits and achieve their personal growth goals. Our platform provides tools and resources to track, monitor, and reinforce new behaviors.
      </Text>
      <Text mt="md" c="dimmed">
        Learn more about our mission and vision.
      </Text>
    </Container>
  );
}

export default AboutUsPage;