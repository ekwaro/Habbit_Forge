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
  Badge,
  rem,
  Divider,
  Anchor, // Import Anchor for clickable links
  Card, // Optional: for better visual grouping of items
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconLink, // For resource links
} from '@tabler/icons-react';

function MotivationalQuotesPage() {
  // --- STATE FOR TEXT-BASED QUOTES ---
  const [newQuoteContent, setNewQuoteContent] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [editingQuoteId, setEditingQuoteId] = useState(null);
  const [editingQuoteContent, setEditingQuoteContent] = useState('');

  // --- STATE FOR ONLINE RESOURCE LINKS ---
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceLink, setNewResourceLink] = useState('');
  const [resources, setResources] = useState([]);
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [editingResourceName, setEditingResourceName] = useState('');
  const [editingResourceLink, setEditingResourceLink] = useState('');

  // --- REFS FOR ROBUST LOCAL STORAGE SAVING ON UNLOAD ---
  const quotesRef = useRef([]);
  const resourcesRef = useRef([]);

  useEffect(() => {
    quotesRef.current = quotes;
  }, [quotes]);

  useEffect(() => {
    resourcesRef.current = resources;
  }, [resources]);

  // --- LOCAL STORAGE LOAD & UNLOAD LISTENER (Combined for both data types) ---
  useEffect(() => {
    // Load quotes
    const storedQuotes = localStorage.getItem('motivationalQuotes');
    if (storedQuotes) {
      try {
        setQuotes(JSON.parse(storedQuotes));
      } catch (e) {
        console.error("Failed to parse motivational quotes from local storage:", e);
        localStorage.removeItem('motivationalQuotes');
      }
    }

    // Load resources
    const storedResources = localStorage.getItem('quoteResources');
    if (storedResources) {
      try {
        setResources(JSON.parse(storedResources));
      } catch (e) {
        console.error("Failed to parse quote resources from local storage:", e);
        localStorage.removeItem('quoteResources');
      }
    }

    // Handle beforeunload event for robust saving
    const handleBeforeUnload = () => {
      localStorage.setItem('motivationalQuotes', JSON.stringify(quotesRef.current));
      localStorage.setItem('quoteResources', JSON.stringify(resourcesRef.current));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup: remove the event listener when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // Empty dependency array: runs only once on mount/unmount

  // --- LOCAL STORAGE SAVE EFFECTS (Separate for each data type) ---
  useEffect(() => {
    localStorage.setItem('motivationalQuotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('quoteResources', JSON.stringify(resources));
  }, [resources]);

  // --- CRUD OPERATIONS FOR TEXT-BASED QUOTES ---

  const handleAddQuote = () => {
    const trimmedContent = newQuoteContent.trim();
    if (trimmedContent) {
      const newQuote = {
        id: Date.now().toString(),
        content: trimmedContent,
      };
      setQuotes((prevQuotes) => [...prevQuotes, newQuote]);
      setNewQuoteContent('');
    }
  };

  const handleDeleteQuote = (id) => {
    setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== id));
    if (editingQuoteId === id) {
      handleCancelQuoteEdit();
    }
  };

  const handleEditQuote = (quote) => {
    setEditingQuoteId(quote.id);
    setEditingQuoteContent(quote.content);
  };

  const handleUpdateQuote = (id) => {
    const trimmedContent = editingQuoteContent.trim();
    if (trimmedContent) {
      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === id ? { ...quote, content: trimmedContent } : quote
        )
      );
      setEditingQuoteId(null);
      setEditingQuoteContent('');
    }
  };

  const handleCancelQuoteEdit = () => {
    setEditingQuoteId(null);
    setEditingQuoteContent('');
  };

  // --- CRUD OPERATIONS FOR ONLINE RESOURCE LINKS ---

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
        <Title order={2} mb="lg" fw={700}>Motivational Quotes Management</Title>
        <Text mb="md">Add, edit, or delete motivational quotes and external resource links for your users.</Text>

        <Divider my="xl" label="Text-Based Quotes" labelPosition="center" />

        {/* Section 1: Text-Based Motivational Quotes */}
        <Card withBorder p="lg" radius="md" mb="xl">
          <Title order={3} mb="lg">Add New Quote</Title>
          <Textarea
            label="Quote Content"
            placeholder="Enter a motivational quote"
            value={newQuoteContent}
            onChange={(event) => setNewQuoteContent(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) { // Prevent adding on Shift+Enter
                event.preventDefault(); // Prevent new line
                handleAddQuote();
              }
            }}
            rows={4}
            autosize
            minRows={2}
            mb="md"
          />
          <Button leftSection={<IconPlus size={16} />} onClick={handleAddQuote}>
            Add Quote
          </Button>

          <Divider my="xl" label="Uploaded Quotes" labelPosition="center" />

          <Stack>
            {quotes.length === 0 ? (
              <Text c="dimmed" ta="center">No quotes added yet. Add one above!</Text>
            ) : (
              quotes.map((quote) => (
                <Card key={quote.id} withBorder p="md" radius="sm" shadow="sm">
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    {editingQuoteId === quote.id ? (
                      <Textarea
                        flex={1}
                        value={editingQuoteContent}
                        onChange={(event) => setEditingQuoteContent(event.currentTarget.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            handleUpdateQuote(quote.id);
                          }
                        }}
                        autoFocus
                        rows={3}
                        autosize
                        minRows={2}
                      />
                    ) : (
                      <Text style={{ flexGrow: 1 }}>{quote.content}</Text>
                    )}

                    <Group gap="xs" ml="md">
                      {editingQuoteId === quote.id ? (
                        <>
                          <ActionIcon
                            variant="filled"
                            color="green"
                            onClick={() => handleUpdateQuote(quote.id)}
                            size="lg"
                            aria-label="Update quote"
                          >
                            <IconCheck style={{ width: rem(20), height: rem(20) }} />
                          </ActionIcon>
                          <ActionIcon
                            variant="filled"
                            color="red"
                            onClick={handleCancelQuoteEdit}
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
                            onClick={() => handleEditQuote(quote)}
                            size="lg"
                            aria-label="Edit quote"
                          >
                            <IconEdit style={{ width: rem(20), height: rem(20) }} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleDeleteQuote(quote.id)}
                            size="lg"
                            aria-label="Delete quote"
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

        <Divider my="xl" label="Online Quote Resources" labelPosition="center" />

        {/* Section 2: Online Quote Resources */}
        <Card withBorder p="lg" radius="md">
          <Title order={3} mb="lg">Add New Resource</Title>
          <Stack spacing="md">
            <TextInput
              label="Resource Name"
              placeholder="e.g., BrainyQuote, GoodReads"
              value={newResourceName}
              onChange={(event) => setNewResourceName(event.currentTarget.value)}
            />
            <TextInput
              label="Resource Link (URL)"
              placeholder="e.g., https://www.brainyquote.com"
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

export default MotivationalQuotesPage;