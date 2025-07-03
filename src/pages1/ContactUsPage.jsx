import React, { useState } from 'react';
import { Title, Text, Container, Paper, Group, TextInput, Textarea, Button, Box, Divider, Center, ThemeIcon } from '@mantine/core';
import { IconMail, IconPhone, IconUser, IconMessage, IconCheck } from '@tabler/icons-react';

const illustrationUrl = 'https://undraw.co/api/illustrations/2e7e1e7e-7e7e-4e7e-8e7e-7e7e7e7e7e7e'; // Example undraw illustration

function ContactUsPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <Box
      style={{
        minHeight: 'calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))',
        background: 'linear-gradient(120deg, #e0e7ff 0%, #b2f2bb 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 0',
      }}
    >
      <Container size="sm" px="md">
        <Paper
          shadow="xl"
          radius="xl"
          p="xl"
          style={{
            background: 'rgba(255,255,255,0.97)',
            border: '2.5px solid',
            borderImage: 'linear-gradient(120deg, #228be6 0%, #51cf66 100%) 1',
            boxShadow: '0 8px 40px 0 rgba(34,139,230,0.13)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Soft Illustration */}
          <Center mb={8}>
            <img src="https://undraw.co/api/illustrations/2e7e1e7e-7e7e-4e7e-8e7e-7e7e7e7e7e7e" alt="Contact illustration" style={{ width: 120, marginBottom: 8, opacity: 0.92 }} />
          </Center>
          <Center mb={8}>
            <ThemeIcon size={48} radius="xl" color="blue" variant="light" style={{ boxShadow: '0 2px 12px 0 rgba(34,139,230,0.10)' }}>
              <IconMail size={32} />
            </ThemeIcon>
          </Center>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <Title order={1} mb={4} style={{ fontWeight: 900, fontSize: '2rem', color: '#222', fontFamily: 'Inter, sans-serif' }}>
              Contact Us
            </Title>
            <Text size="md" color="dimmed" mb={2} style={{ fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
              We're here to help and answer any question you might have.
            </Text>
            <Text size="sm" color="gray" mb={4}>
              Our team will get back to you as soon as possible.
            </Text>
          </div>

          <Divider my="md" label="Or reach us directly" labelPosition="center" />

          {/* Contact Methods */}
          <Group gap={32} mb={32} position="center" wrap="wrap">
            <Group gap={8} align="center">
              <IconMail size={20} color="#228be6" />
              <Text size="md" style={{ fontWeight: 600 }}>
                <a href="mailto:support@habitsforge.com" style={{ color: '#228be6', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#1864ab'} onMouseOut={e => e.target.style.color = '#228be6'}>support@habitsforge.com</a>
              </Text>
            </Group>
            <Group gap={8} align="center">
              <IconPhone size={20} color="#228be6" />
              <Text size="md" style={{ fontWeight: 600 }}>
                +1 (123) 456-7890
              </Text>
            </Group>
          </Group>

          <Divider my="md" />

          {/* Contact Form */}
          <form onSubmit={handleSubmit} autoComplete="off">
            <Group direction="column" gap={16} grow>
              <TextInput
                label="Your Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                icon={<IconUser size={18} />}
                placeholder="Enter your name"
                size="md"
                styles={{ input: { fontFamily: 'Inter, sans-serif', fontSize: 16 } }}
              />
              <TextInput
                label="Your Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                icon={<IconMail size={18} />}
                placeholder="Enter your email"
                size="md"
                type="email"
                styles={{ input: { fontFamily: 'Inter, sans-serif', fontSize: 16 } }}
              />
              <Textarea
                label="Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                icon={<IconMessage size={18} />}
                placeholder="How can we help you?"
                minRows={4}
                size="md"
                styles={{ input: { fontFamily: 'Inter, sans-serif', fontSize: 16 } }}
              />
              <Button
                type="submit"
                size="md"
                radius="xl"
                color="blue"
                style={{ fontWeight: 700, transition: 'background 0.2s, box-shadow 0.2s' }}
                onMouseOver={e => { e.target.style.background = '#1864ab'; e.target.style.boxShadow = '0 2px 12px 0 rgba(34,139,230,0.15)'; }}
                onMouseOut={e => { e.target.style.background = ''; e.target.style.boxShadow = ''; }}
              >
                Send Message
              </Button>
            </Group>
            {submitted && (
              <Center mt="md">
                <ThemeIcon color="teal" size={40} radius="xl" variant="light" style={{ marginRight: 8 }}>
                  <IconCheck size={24} />
                </ThemeIcon>
                <Text color="teal" align="center" style={{ fontWeight: 600, fontSize: 18 }}>
                  Thank you for reaching out! We'll get back to you soon.
                </Text>
              </Center>
            )}
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default ContactUsPage;