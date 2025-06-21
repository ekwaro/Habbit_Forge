import React, { useState, useEffect, useRef } from 'react';
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
  Badge, // Using Badge for tip display, or you can use Text/Card
  rem,
  Divider,
  Anchor,
  Card,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconLink,
} from '@tabler/icons-react';

function HabitTipsPage() {
  // --- STATE FOR TEXT-BASED HABIT TIPS ---
  const [newTipContent, setNewTipContent] = useState('');
  const [tips, setTips] = useState([]);
  const [editingTipId, setEditingTipId] = useState(null);
  const [editingTipContent, setEditingTipContent] = useState('');

  // --- STATE FOR ONLINE RESOURCE LINKS ---
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceLink, setNewResourceLink] = useState('');
  const [resources, setResources] = useState([]);
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [editingResourceName, setEditingResourceName] = useState('');
  const [editingResourceLink, setEditingResourceLink] = useState('');

  // --- REFS FOR ROBUST LOCAL STORAGE SAVING ON UNLOAD ---
  const tipsRef = useRef([]);
  const resourcesRef = useRef([]);

  useEffect(() => {
    tipsRef.current = tips;
  }, [tips]);

  useEffect(() => {
    resourcesRef.current = resources;
  }, [resources]);

  // --- LOCAL STORAGE LOAD & UNLOAD LISTENER (Combined for both data types) ---
  useEffect(() => {
    // Load tips
    const storedTips = localStorage.getItem('habitTips');
    if (storedTips) {
      try {
        setTips(JSON.parse(storedTips));
      } catch (e) {
        console.error("Failed to parse habit tips from local storage:", e);
        localStorage.removeItem('habitTips');
      }
    }

    // Load resources
    const storedResources = localStorage.getItem('habitTipResources');
    if (storedResources) {
      try {
        setResources(JSON.parse(storedResources));
      } catch (e) {
        console.error("Failed to parse habit tip resources from local storage:", e);
        localStorage.removeItem('habitTipResources');
      }
    }

    // Handle beforeunload event for robust saving
    const handleBeforeUnload = () => {
      localStorage.setItem('habitTips', JSON.stringify(tipsRef.current));
      localStorage.setItem('habitTipResources', JSON.stringify(resourcesRef.current));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup: remove the event listener when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // Empty dependency array: runs only once on mount/unmount

  // --- LOCAL STORAGE SAVE EFFECTS (Separate for each data type) ---
  useEffect(() => {
    localStorage.setItem('habitTips', JSON.stringify(tips));
  }, [tips]);

  useEffect(() => {
    localStorage.setItem('habitTipResources', JSON.stringify(resources));
  }, [resources]);

  // --- CRUD OPERATIONS FOR TEXT-BASED HABIT TIPS ---

  const handleAddTip = () => {
    const trimmedContent = newTipContent.trim();
    if (trimmedContent) {
      const newTip = {
        id: Date.now().toString(),
        content: trimmedContent,
      };
      setTips((prevTips) => [...prevTips, newTip]);
      setNewTipContent('');
    }
  };

  const handleDeleteTip = (id) => {
    setTips((prevTips) => prevTips.filter((tip) => tip.id !== id));
    if (editingTipId === id) {
      handleCancelTipEdit();
    }
  };

  const handleEditTip = (tip) => {
    setEditingTipId(tip.id);
    setEditingTipContent(tip.content);
  };

  const handleUpdateTip = (id) => {
    const trimmedContent = editingTipContent.trim();
    if (trimmedContent) {
      setTips((prevTips) =>
        prevTips.map((tip) =>
          tip.id === id ? { ...tip, content: trimmedContent } : tip
        )
      );
      setEditingTipId(null);
      setEditingTipContent('');
    }
  };

  const handleCancelTipEdit = () => {
    setEditingTipId(null);
    setEditingTipContent('');
  };

  // --- CRUD OPERATIONS FOR ONLINE RESOURCE LINKS (HABIT TIPS) ---

  const handleAddResource = () => {
    const trimmedName = newResourceName.trim();
    const trimmedLink = newResourceLink.trim();
    // Basic URL validation
    const isValidUrl = trimmedLink.startsWith('http://') || trimmedLink.startsWith('https://');

    if (trimmedName && trimmedLink && isValidUrl) {
      const newResource = {
        id: Date.now().toString(),
        name: trimmedName,
        link: trimmedLink,
      };
      setResources((prevResources) => [...prevResources, newResource]);
      setNewResourceName('');
      setNewResourceLink('');
    } else {
      alert('Please provide a name and a valid URL (starting with http:// or https://) for the resource.');
    }
  };

  const handleDeleteResource = (id) => {
    setResources((prevResources) => prevResources.filter((resource) => resource.id !== id));
    if (editingResourceId === id) {
      handleCancelResourceEdit();
    }
  };

  const handleEditResource = (resource) => {
    setEditingResourceId(resource.id);
    setEditingResourceName(resource.name);
    setEditingResourceLink(resource.link);
  };

  const handleUpdateResource = (id) => {
    const trimmedName = editingResourceName.trim();
    const trimmedLink = editingResourceLink.trim();
    const isValidUrl = trimmedLink.startsWith('http://') || trimmedLink.startsWith('https://');

    if (trimmedName && trimmedLink && isValidUrl) {
      setResources((prevResources) =>
        prevResources.map((resource) =>
          resource.id === id ? { ...resource, name: trimmedName, link: trimmedLink } : resource
        )
      );
      setEditingResourceId(null);
      setEditingResourceName('');
      setEditingResourceLink('');
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
        </Card>
      </Paper>
    </Container>
  );
}

export default HabitTipsPage;