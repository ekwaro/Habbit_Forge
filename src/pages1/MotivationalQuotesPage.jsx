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
const STRAPI_QUOTES_API_URL = 'http://localhost:1337/api/motivational-quotes';
const STRAPI_RESOURCES_API_URL = 'http://localhost:1337/api/quote-resources';

function MotivationalQuotesPage() {
  // --- STATE FOR TEXT-BASED QUOTES ---
  const [newQuoteContent, setNewQuoteContent] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [editingQuoteId, setEditingQuoteId] = useState(null);
  const [editingQuoteContent, setEditingQuoteContent] = useState('');
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);
  const [errorQuotes, setErrorQuotes] = useState(null);

  // --- STATE FOR ONLINE RESOURCE LINKS ---
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceLink, setNewResourceLink] = useState('');
  const [resources, setResources] = useState([]);
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [editingResourceName, setEditingResourceName] = useState('');
  const [editingResourceLink, setEditingResourceLink] = useState('');
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [errorResources, setErrorResources] = useState(null);

  // --- useEffect for Fetching Text-Based Motivational Quotes ---
  useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoadingQuotes(true);
      setErrorQuotes(null);
      try {
        const response = await fetch(STRAPI_QUOTES_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // --- ADJUSTMENT HERE: Directly access 'content' ---
        const formattedQuotes = data.data.map(item => ({
          id: item.id.toString(),
          content: item.content, // CHANGED from item.attributes.content
        }));
        setQuotes(formattedQuotes);
      } catch (e) {
        console.error("Failed to fetch quotes:", e);
        setErrorQuotes("Failed to load quotes. Please try again. Ensure Strapi is running and 'Motivational Quote' permissions are set.");
      } finally {
        setIsLoadingQuotes(false);
      }
    };

    fetchQuotes();
  }, []);

  // --- useEffect for Fetching Online Resource Links ---
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoadingResources(true);
      setErrorResources(null);
      try {
        const response = await fetch(STRAPI_RESOURCES_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // --- ADJUSTMENT HERE: Directly access 'name' and 'link' ---
        const formattedResources = data.data.map(item => ({
          id: item.id.toString(),
          name: item.name, // CHANGED from item.attributes.name
          link: item.link, // CHANGED from item.attributes.link
        }));
        setResources(formattedResources);
      } catch (e) {
        console.error("Failed to fetch resources:", e);
        setErrorResources("Failed to load resources. Please try again. Ensure Strapi is running and 'Quote Resource' permissions are set.");
      } finally {
        setIsLoadingResources(false);
      }
    };

    fetchResources();
  }, []);

  // --- CRUD OPERATIONS FOR TEXT-BASED QUOTES ---

  const handleAddQuote = async () => {
    const trimmedContent = newQuoteContent.trim();
    if (trimmedContent) {
      setErrorQuotes(null);
      try {
        const response = await fetch(STRAPI_QUOTES_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { content: trimmedContent } }), // Strapi expects `data` wrapper for sending
        });
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMessage = errorJson.error.message;
            }
          } catch (parseError) {
            errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
          }
          throw new Error(errorMessage);
        }
        const addedQuote = await response.json();
        setQuotes((prevQuotes) => [
          ...prevQuotes,
          // --- ADJUSTMENT HERE: Directly access 'content' ---
          { id: addedQuote.data.id.toString(), content: addedQuote.data.content }, // CHANGED from addedQuote.data.attributes.content
        ]);
        setNewQuoteContent('');
      } catch (e) {
        console.error("Failed to add quote:", e);
        setErrorQuotes(`Failed to add quote: ${e.message}. Check Strapi permissions for 'create'.`);
      }
    } else {
      alert('Quote content cannot be empty.');
    }
  };

  const handleDeleteQuote = async (id) => {
    setErrorQuotes(null);
    try {
      const response = await fetch(`${STRAPI_QUOTES_API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error && errorJson.error.message) {
            errorMessage = errorJson.error.message;
          }
        } catch (parseError) {
          errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
        }
        throw new Error(errorMessage);
      }
      setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== id));
      if (editingQuoteId === id) {
        handleCancelQuoteEdit();
      }
    } catch (e) {
      console.error("Failed to delete quote:", e);
      setErrorQuotes(`Failed to delete quote: ${e.message}. Check Strapi permissions for 'delete'.`);
    }
  };

  const handleEditQuote = (quote) => {
    setEditingQuoteId(quote.id);
    setEditingQuoteContent(quote.content);
  };

  const handleUpdateQuote = async (id) => {
    const trimmedContent = editingQuoteContent.trim();
    if (trimmedContent) {
      setErrorQuotes(null);
      try {
        const response = await fetch(`${STRAPI_QUOTES_API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { content: trimmedContent } }), // Strapi expects `data` wrapper for sending
        });
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMessage = errorJson.error.message;
            }
          } catch (parseError) {
            errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
          }
          throw new Error(errorMessage);
        }
        const updatedQuoteData = await response.json();
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.id === id ? {
              id: updatedQuoteData.data.id.toString(),
              content: updatedQuoteData.data.content // CHANGED from updatedQuoteData.data.attributes.content
            } : quote
          )
        );
        setEditingQuoteId(null);
        setEditingQuoteContent('');
      } catch (e) {
        console.error("Failed to update quote:", e);
        setErrorQuotes(`Failed to update quote: ${e.message}. Check Strapi permissions for 'update'.`);
      }
    } else {
      alert('Quote content cannot be empty.');
    }
  };

  const handleCancelQuoteEdit = () => {
    setEditingQuoteId(null);
    setEditingQuoteContent('');
  };

  // --- CRUD OPERATIONS FOR ONLINE RESOURCE LINKS ---

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
          body: JSON.stringify({ data: { name: trimmedName, link: trimmedLink } }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMessage = errorJson.error.message;
            }
          } catch (parseError) {
            errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
          }
          throw new Error(errorMessage);
        }
        const addedResource = await response.json();
        setResources((prevResources) => [
          ...prevResources,
          // --- ADJUSTMENT HERE: Directly access 'name' and 'link' ---
          { id: addedResource.data.id.toString(), name: addedResource.data.name, link: addedResource.data.link }, // CHANGED from addedResource.data.attributes.name/link
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
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error && errorJson.error.message) {
            errorMessage = errorJson.error.message;
          }
        } catch (parseError) {
          errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
        }
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
          body: JSON.stringify({ data: { name: trimmedName, link: trimmedLink } }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMessage = errorJson.error.message;
            }
          } catch (parseError) {
            errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
          }
          throw new Error(errorMessage);
        }
        const updatedResourceData = await response.json();
        setResources((prevResources) =>
          prevResources.map((resource) =>
            resource.id === id ? {
              id: updatedResourceData.data.id.toString(),
              // --- ADJUSTMENT HERE: Directly access 'name' and 'link' ---
              name: updatedResourceData.data.name, // CHANGED from updatedResourceData.data.attributes.name
              link: updatedResourceData.data.link, // CHANGED from updatedResourceData.data.attributes.link
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
        <Title order={2} mb="lg" fw={700}>Motivational Quotes Management</Title>
        <Text mb="md">Add, edit, or delete motivational quotes and external resource links for your users.</Text>

        ---

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

          ---

          <Divider my="xl" label="Uploaded Quotes" labelPosition="center" />

          {errorQuotes && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error!" color="red" mb="md">
              {errorQuotes}
            </Alert>
          )}

          {isLoadingQuotes ? (
            <Group justify="center" mt="md">
              <Loader />
              <Text>Loading quotes...</Text>
            </Group>
          ) : (
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
          )}
        </Card>

        ---

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

          ---

          <Divider my="xl" label="Uploaded Resources" labelPosition="center" />

          {errorResources && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error!" color="red" mb="md">
              {errorResources}
            </Alert>
          )}

          {isLoadingResources ? (
            <Group justify="center" mt="md">
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

export default MotivationalQuotesPage;