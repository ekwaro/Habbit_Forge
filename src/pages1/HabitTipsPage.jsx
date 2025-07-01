import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Paper,
  ActionIcon,
  rem,
  Divider,
  Anchor,
  Card,
  Loader, // Added for loading indicator
  Alert, // Added for error messages
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconLink,
  IconAlertCircle, // For error alerts
} from '@tabler/icons-react';

// Define your Strapi API URLs
const STRAPI_TIPS_API_URL = 'http://localhost:1337/api/habit-tips';
const STRAPI_RESOURCES_API_URL = 'http://localhost:1337/api/habit-resources';

function HabitTipsPage() {
  // --- STATE FOR TEXT-BASED HABIT TIPS ---
  const [newTipContent, setNewTipContent] = useState('');
  const [tips, setTips] = useState([]);
  const [editingTipId, setEditingTipId] = useState(null);
  const [editingTipContent, setEditingTipContent] = useState('');
  const [isLoadingTips, setIsLoadingTips] = useState(true);
  const [errorTips, setErrorTips] = useState(null);

  // --- STATE FOR ONLINE RESOURCE LINKS ---
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceLink, setNewResourceLink] = useState('');
  const [resources, setResources] = useState([]);
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [editingResourceName, setEditingResourceName] = useState('');
  const [editingResourceLink, setEditingResourceLink] = useState('');
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [errorResources, setErrorResources] = useState(null);

  // Helper function to parse Strapi errors (remains the same)
  const parseStrapiError = async (response) => {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.error && errorJson.error.message) {
        errorMessage = errorJson.error.message;
      }
    } catch (parseError) {
      console.error("Failed to parse Strapi error response:", parseError);
    }
    return errorMessage;
  };

  // --- useEffect for Fetching Text-Based Habit Tips ---
  useEffect(() => {
    const fetchTips = async () => {
      setIsLoadingTips(true);
      setErrorTips(null);
      try {
        const response = await fetch(STRAPI_TIPS_API_URL);
        if (!response.ok) {
          const errorMessage = await parseStrapiError(response);
          throw new Error(errorMessage);
        }
        const data = await response.json();
        const formattedTips = data.data.map(item => ({
          id: item.id.toString(),
          // FIX: Access content directly on 'item'
          content: item.content,
        }));
        setTips(formattedTips);
      } catch (e) {
        console.error("Failed to fetch tips:", e);
        setErrorTips(`Failed to load tips: ${e.message}. Ensure Strapi is running and 'Habit Tip' permissions are set.`);
      } finally {
        setIsLoadingTips(false);
      }
    };

    fetchTips();
  }, []);

  // --- useEffect for Fetching Online Resource Links ---
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoadingResources(true);
      setErrorResources(null);
      try {
        const response = await fetch(STRAPI_RESOURCES_API_URL);
        if (!response.ok) {
          const errorMessage = await parseStrapiError(response);
          throw new Error(errorMessage);
        }
        const data = await response.json();
        const formattedResources = data.data.map(item => ({
          id: item.id.toString(),
          // FIX: Access name and link directly on 'item'
          name: item.name,
          link: item.link,
        }));
        setResources(formattedResources);
      } catch (e) {
        console.error("Failed to fetch resources:", e);
        setErrorResources(`Failed to load resources: ${e.message}. Ensure Strapi is running and 'Habit Resource' permissions are set.`);
      } finally {
        setIsLoadingResources(false);
      }
    };

    fetchResources();
  }, []);

  // --- CRUD OPERATIONS FOR TEXT-BASED HABIT TIPS ---

  const handleAddTip = async () => {
    const trimmedContent = newTipContent.trim();
    if (trimmedContent) {
      setErrorTips(null);
      try {
        const response = await fetch(STRAPI_TIPS_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Strapi expects 'data' wrapper for sending new entries
          body: JSON.stringify({ data: { content: trimmedContent } }),
        });
        if (!response.ok) {
          const errorMessage = await parseStrapiError(response);
          throw new Error(errorMessage);
        }
        const addedTip = await response.json();
        setTips((prevTips) => [
          ...prevTips,
          // FIX: Access content directly on 'addedTip.data'
          { id: addedTip.data.id.toString(), content: addedTip.data.content },
        ]);
        setNewTipContent('');
      } catch (e) {
        console.error("Failed to add tip:", e);
        setErrorTips(`Failed to add tip: ${e.message}. Check Strapi permissions for 'create'.`);
      }
    } else {
      alert('Tip content cannot be empty.');
    }
  };

  const handleDeleteTip = async (id) => {
    setErrorTips(null);
    try {
      const response = await fetch(`${STRAPI_TIPS_API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorMessage = await parseStrapiError(response);
        throw new Error(errorMessage);
      }
      setTips((prevTips) => prevTips.filter((tip) => tip.id !== id));
      if (editingTipId === id) {
        handleCancelTipEdit();
      }
    } catch (e) {
      console.error("Failed to delete tip:", e);
      setErrorTips(`Failed to delete tip: ${e.message}. Check Strapi permissions for 'delete'.`);
    }
  };

  const handleEditTip = (tip) => {
    setEditingTipId(tip.id);
    setEditingTipContent(tip.content);
  };

  const handleUpdateTip = async (id) => {
    const trimmedContent = editingTipContent.trim();
    if (trimmedContent) {
      setErrorTips(null);
      try {
        const response = await fetch(`${STRAPI_TIPS_API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          // Strapi expects 'data' wrapper for sending updates
          body: JSON.stringify({ data: { content: trimmedContent } }),
        });
        if (!response.ok) {
          const errorMessage = await parseStrapiError(response);
          throw new Error(errorMessage);
        }
        const updatedTipData = await response.json();
        setTips((prevTips) =>
          prevTips.map((tip) =>
            tip.id === id ? {
              id: updatedTipData.data.id.toString(),
              // FIX: Access content directly on 'updatedTipData.data'
              content: updatedTipData.data.content
            } : tip
          )
        );
        setEditingTipId(null);
        setEditingTipContent('');
      } catch (e) {
        console.error("Failed to update tip:", e);
        setErrorTips(`Failed to update tip: ${e.message}. Check Strapi permissions for 'update'.`);
      }
    } else {
      alert('Tip content cannot be empty.');
    }
  };

  const handleCancelTipEdit = () => {
    setEditingTipId(null);
    setEditingTipContent('');
  };

  // --- CRUD OPERATIONS FOR ONLINE RESOURCE LINKS (HABIT TIPS) ---

  const handleAddResource = async () => {
    const trimmedName = newResourceName.trim();
    const trimmedLink = newResourceLink.trim();
    const isValidUrl = trimmedLink.startsWith('http://') || trimmedLink.startsWith('https://');

    if (trimmedName && trimmedLink && isValidUrl) {
      setErrorResources(null);
      try {
        const response = await fetch(STRAPI_RESOURCES_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Strapi expects 'data' wrapper for sending new entries
          body: JSON.stringify({ data: { name: trimmedName, link: trimmedLink } }),
        });
        if (!response.ok) {
          const errorMessage = await parseStrapiError(response);
          throw new Error(errorMessage);
        }
        const addedResource = await response.json();
        setResources((prevResources) => [
          ...prevResources,
          // FIX: Access name and link directly on 'addedResource.data'
          { id: addedResource.data.id.toString(), name: addedResource.data.name, link: addedResource.data.link },
        ]);
        setNewResourceName('');
        setNewResourceLink('');
      } catch (e) {
        console.error("Failed to add resource:", e);
        setErrorResources(`Failed to add resource: ${e.message}. Check Strapi permissions for 'create'.`);
      }
    } else {
      alert('Please provide a name and a valid URL (starting with http:// or https://) for the resource.');
    }
  };

  const handleDeleteResource = async (id) => {
    setErrorResources(null);
    try {
      const response = await fetch(`${STRAPI_RESOURCES_API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorMessage = await parseStrapiError(response);
        throw new Error(errorMessage);
      }
      setResources((prevResources) => prevResources.filter((resource) => resource.id !== id));
      if (editingResourceId === id) {
        handleCancelResourceEdit();
      }
    } catch (e) {
      console.error("Failed to delete resource:", e);
      setErrorResources(`Failed to delete resource: ${e.message}. Check Strapi permissions for 'delete'.`);
    }
  };

  const handleEditResource = (resource) => {
    setEditingResourceId(resource.id);
    setEditingResourceName(resource.name);
    setEditingResourceLink(resource.link);
  };

  const handleUpdateResource = async (id) => {
    const trimmedName = editingResourceName.trim();
    const trimmedLink = editingResourceLink.trim();
    const isValidUrl = trimmedLink.startsWith('http://') || trimmedLink.startsWith('https://');

    if (trimmedName && trimmedLink && isValidUrl) {
      setErrorResources(null);
      try {
        const response = await fetch(`${STRAPI_RESOURCES_API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          // Strapi expects 'data' wrapper for sending updates
          body: JSON.stringify({ data: { name: trimmedName, link: trimmedLink } }),
        });
        if (!response.ok) {
          const errorMessage = await parseStrapiError(response);
          throw new Error(errorMessage);
        }
        const updatedResourceData = await response.json();
        setResources((prevResources) =>
          prevResources.map((resource) =>
            resource.id === id ? {
              id: updatedResourceData.data.id.toString(),
              // FIX: Access name and link directly on 'updatedResourceData.data'
              name: updatedResourceData.data.name,
              link: updatedResourceData.data.link,
            } : resource
          )
        );
        setEditingResourceId(null);
        setEditingResourceName('');
        setEditingResourceLink('');
      } catch (e) {
        console.error("Failed to update resource:", e);
        setErrorResources(`Failed to update resource: ${e.message}. Check Strapi permissions for 'update'.`);
      }
    } else {
      alert('Please provide a name and a valid URL (starting with http:// or https://) for the resource.');
    }
  };

  const handleCancelResourceEdit = () => {
    setEditingResourceId(null);
    setEditingResourceName('');
    setEditingResourceLink('');
  };

  return (
    <Container size="xl" my="lg">
      <Paper p="xl" shadow="xs" radius="md">
        <Title order={2} mb="lg" fw={700}>Habit Tips & Tricks Management</Title>
        <Text mb="md">Manage valuable tips, strategies, and resources for building good habits.</Text>

        <Divider my="xl" label="Habit Tips" labelPosition="center" />

        {/* Section 1: Text-Based Habit Tips */}
        <Card withBorder p="lg" radius="md" mb="xl">
          <Title order={3} mb="lg">Add New Tip</Title>
          <Textarea
            label="Tip Content"
            placeholder="e.g., Start small, track your progress, find an accountability partner."
            value={newTipContent}
            onChange={(event) => setNewTipContent(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleAddTip();
              }
            }}
            rows={4}
            autosize
            minRows={2}
            mb="md"
          />
          <Button leftSection={<IconPlus size={16} />} onClick={handleAddTip}>
            Add Tip
          </Button>

          <Divider my="xl" label="Uploaded Tips" labelPosition="center" />

          {errorTips && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error!" color="red" mb="md">
              {errorTips}
            </Alert>
          )}

          {isLoadingTips ? (
            <Group position="center" mt="md">
              <Loader />
              <Text>Loading tips...</Text>
            </Group>
          ) : (
            <Stack>
              {tips.length === 0 ? (
                <Text c="dimmed" ta="center">No tips added yet. Add one above!</Text>
              ) : (
                tips.map((tip) => (
                  <Card key={tip.id} withBorder p="md" radius="sm" shadow="sm">
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      {editingTipId === tip.id ? (
                        <Textarea
                          flex={1}
                          value={editingTipContent}
                          onChange={(event) => setEditingTipContent(event.currentTarget.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                              event.preventDefault();
                              handleUpdateTip(tip.id);
                            }
                          }}
                          autoFocus
                          rows={3}
                          autosize
                          minRows={2}
                        />
                      ) : (
                        <Text style={{ flexGrow: 1 }}>{tip.content}</Text>
                      )}

                      <Group gap="xs" ml="md">
                        {editingTipId === tip.id ? (
                          <>
                            <ActionIcon
                              variant="filled"
                              color="green"
                              onClick={() => handleUpdateTip(tip.id)}
                              size="lg"
                              aria-label="Update tip"
                            >
                              <IconCheck style={{ width: rem(20), height: rem(20) }} />
                            </ActionIcon>
                            <ActionIcon
                              variant="filled"
                              color="red"
                              onClick={handleCancelTipEdit}
                              size="lg"
                              aria-label="Cancel edit"
                            >
                              <IconX style={{ width: rem(20), height: rem(20) }} />
                            </ActionIcon>
                          </>
                        ) : (
                          <>
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => handleEditTip(tip)}
                              size="lg"
                              aria-label="Edit tip"
                            >
                              <IconEdit style={{ width: rem(20), height: rem(20) }} />
                            </ActionIcon>
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => handleDeleteTip(tip.id)}
                              size="lg"
                              aria-label="Delete tip"
                            >
                              <IconTrash style={{ width: rem(20), height: rem(20) }} />
                            </ActionIcon>
                          </>
                        )}
                      </Group>
                    </Group>
                  </Card>
                ))
              )}
            </Stack>
          )}
        </Card>

        <Divider my="xl" label="Habit Resource Links" labelPosition="center" />

        {/* Section 2: Online Habit Resource Links */}
        <Card withBorder p="lg" radius="md">
          <Title order={3} mb="lg">Add New Resource Link</Title>
          <Stack spacing="md">
            <TextInput
              label="Resource Name"
              placeholder="e.g., Atomic Habits Book, Habit Tracker App"
              value={newResourceName}
              onChange={(event) => setNewResourceName(event.currentTarget.value)}
            />
            <TextInput
              label="Resource Link (URL)"
              placeholder="e.g., https://www.atomichabits.com"
              value={newResourceLink}
              onChange={(event) => setNewResourceLink(event.currentTarget.value)}
              type="url"
            />
            <Button leftSection={<IconPlus size={16} />} onClick={handleAddResource}>
              Add Resource
            </Button>
          </Stack>

          <Divider my="xl" label="Uploaded Resources" labelPosition="center" />

          {errorResources && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error!" color="red" mb="md">
              {errorResources}
            </Alert>
          )}

          {isLoadingResources ? (
            <Group position="center" mt="md">
              <Loader />
              <Text>Loading resources...</Text>
            </Group>
          ) : (
            <Stack>
              {resources.length === 0 ? (
                <Text c="dimmed" ta="center">No resources added yet. Add one above!</Text>
              ) : (
                resources.map((resource) => (
                  <Card key={resource.id} withBorder p="md" radius="sm" shadow="sm">
                    <Group justify="space-between" align="center" wrap="nowrap">
                      {editingResourceId === resource.id ? (
                        <Stack flex={1} spacing="xs">
                          <TextInput
                            placeholder="Resource Name"
                            value={editingResourceName}
                            onChange={(event) => setEditingResourceName(event.currentTarget.value)}
                            autoFocus
                            size="sm"
                          />
                          <TextInput
                            placeholder="Resource Link (URL)"
                            value={editingResourceLink}
                            onChange={(event) => setEditingResourceLink(event.currentTarget.value)}
                            type="url"
                            size="sm"
                          />
                        </Stack>
                      ) : (
                        <Anchor
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ flexGrow: 1 }}
                          leftSection={<IconLink size={14} />}
                        >
                          {resource.name}
                        </Anchor>
                      )}

                      <Group gap="xs" ml="md">
                        {editingResourceId === resource.id ? (
                          <>
                            <ActionIcon
                              variant="filled"
                              color="green"
                              onClick={() => handleUpdateResource(resource.id)}
                              size="lg"
                              aria-label="Update resource"
                            >
                              <IconCheck style={{ width: rem(20), height: rem(20) }} />
                            </ActionIcon>
                            <ActionIcon
                              variant="filled"
                              color="red"
                              onClick={handleCancelResourceEdit}
                              size="lg"
                              aria-label="Cancel edit"
                            >
                              <IconX style={{ width: rem(20), height: rem(20) }} />
                            </ActionIcon>
                          </>
                        ) : (
                          <>
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => handleEditResource(resource)}
                              size="lg"
                              aria-label="Edit resource"
                            >
                              <IconEdit style={{ width: rem(20), height: rem(20) }} />
                            </ActionIcon>
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => handleDeleteResource(resource.id)}
                              size="lg"
                              aria-label="Delete resource"
                            >
                              <IconTrash style={{ width: rem(20), height: rem(20) }} />
                            </ActionIcon>
                          </>
                        )}
                      </Group>
                    </Group>
                  </Card>
                ))
              )}
            </Stack>
          )}
        </Card>
      </Paper>
    </Container>
  );
}

export default HabitTipsPage;