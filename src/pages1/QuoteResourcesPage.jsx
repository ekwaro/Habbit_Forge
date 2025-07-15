import React from 'react';
import { Container, Title, Divider } from '@mantine/core';
import QuoteResources from '../components/userDashboard/quotes/QuoteResources.jsx';

const QuoteResourcesPage = () => (
  <Container size="md" py="xl">
    <Title order={1} align="center" mb="lg" style={{ color: '#ff922b', fontWeight: 900 }}>
      Quote Resources
    </Title>
    <Divider my="md" />
    <QuoteResources />
  </Container>
);

export default QuoteResourcesPage; 