import React, { useState, useEffect } from 'react';
import { Card, TextInput, Button, Stack, Title, Loader, Group, Anchor, ActionIcon, Alert, Divider } from '@mantine/core';
import { IconPlus, IconTrash, IconLink, IconAlertCircle } from '@tabler/icons-react';

const STRAPI_RESOURCES_API_URL = 'http://localhost:1337/api/quote-resource';

const QuoteResources = () => {
  const [resources, setResources] = useState([]);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceLink, setNewResourceLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(STRAPI_RESOURCES_API_URL);
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json();
      setResources(data.data.map(item => ({
        id: item.id,
        name: item.name,
        link: item.link
      })));
    } catch (e) {
      setError('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleAddResource = async () => {
    const trimmedName = newResourceName.trim();
    const trimmedLink = newResourceLink.trim();
    if (!trimmedName || !trimmedLink) {
      setError('Please provide both name and link.');
      return;
    }
    setAdding(true);
    setError(null);
    try {
      const response = await fetch(STRAPI_RESOURCES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { name: trimmedName, link: trimmedLink } })
      });
      if (!response.ok) throw new Error('Failed to add resource');
      setNewResourceName('');
      setNewResourceLink('');
      fetchResources();
    } catch (e) {
      setError('Failed to add resource.');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteResource = async (id) => {
    setError(null);
    try {
      const response = await fetch(`${STRAPI_RESOURCES_API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete resource');
      setResources(resources.filter(r => r.id !== id));
    } catch (e) {
      setError('Failed to delete resource.');
    }
  };

  return (
    <Card withBorder shadow="sm" p="lg" my="md" style={{ maxWidth: 600, margin: 'auto' }}>
      <Title order={2} mb="md">Quote Resources</Title>
      <Divider my="md" />
      <Stack spacing="md">
        <TextInput
          label="Resource Name"
          placeholder="e.g., BrainyQuote"
          value={newResourceName}
          onChange={e => setNewResourceName(e.currentTarget.value)}
        />
        <TextInput
          label="Resource Link (URL)"
          placeholder="e.g., https://www.brainyquote.com"
          value={newResourceLink}
          onChange={e => setNewResourceLink(e.currentTarget.value)}
        />
        <Button leftSection={<IconPlus size={16} />} onClick={handleAddResource} loading={adding} color="teal">
          Add Resource
        </Button>
        {error && <Alert icon={<IconAlertCircle size={16} />} color="red">{error}</Alert>}
        <Divider my="md" label="Uploaded Resources" labelPosition="center" />
        {loading ? (
          <Group justify="center"><Loader /></Group>
        ) : resources.length === 0 ? (
          <div>No resources added yet.</div>
        ) : (
          <Stack>
            {resources.map(resource => (
              <Group key={resource.id} position="apart">
                <Anchor href={resource.link} target="_blank" rel="noopener noreferrer" leftSection={<IconLink size={14} />}>{resource.name}</Anchor>
                <ActionIcon color="red" onClick={() => handleDeleteResource(resource.id)}><IconTrash size={18} /></ActionIcon>
              </Group>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default QuoteResources; 