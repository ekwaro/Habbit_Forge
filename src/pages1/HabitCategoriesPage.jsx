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
  Card,
  Loader,
  Alert,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconAlertCircle,
} from '@tabler/icons-react';

// Define your Strapi API URL for habit categories
const STRAPI_CATEGORIES_API_URL = 'http://localhost:1337/api/habit-categories';

function HabitCategoriesPage() {
  // --- STATE FOR HABIT CATEGORIES ---
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingCategoryDescription, setEditingCategoryDescription] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  // --- useEffect for Fetching Habit Categories ---
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setErrorCategories(null);
      try {
        const response = await fetch(STRAPI_CATEGORIES_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // --- ADJUSTMENT HERE: Directly access 'name' and 'description' ---
        // Strapi returns data in a 'data' array, but 'attributes' is NOT nested.
        const formattedCategories = data.data.map(item => ({
          id: item.id.toString(),
          name: item.name,          // CHANGED: from item.attributes.name to item.name
          description: item.description, // CHANGED: from item.attributes.description to item.description
        }));
        setCategories(formattedCategories);
      } catch (e) {
        console.error("Failed to fetch categories:", e);
        setErrorCategories("Failed to load categories. Please try again. Make sure your Strapi server is running and permissions are set.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount

  // --- CRUD OPERATIONS FOR HABIT CATEGORIES ---

  const handleAddCategory = async () => {
    const trimmedName = newCategoryName.trim();
    const trimmedDescription = newCategoryDescription.trim();

    if (trimmedName) { // Description is optional, but name is required
      setErrorCategories(null);
      try {
        const response = await fetch(STRAPI_CATEGORIES_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: { // When sending, Strapi v5 still expects `data` wrapper for attributes
              name: trimmedName,
              description: trimmedDescription,
            }
          }),
        });

        if (!response.ok) {
          // Attempt to parse error message from Strapi
          const errorText = await response.text();
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMessage = errorJson.error.message;
            }
          } catch (parseError) {
            // If it's not JSON, use the raw text
            errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
          }
          throw new Error(errorMessage);
        }

        const addedCategory = await response.json();
        setCategories((prevCategories) => [
          ...prevCategories,
          {
            id: addedCategory.data.id.toString(),
            // --- ADJUSTMENT HERE: Directly access 'name' and 'description' ---
            name: addedCategory.data.name,          // CHANGED: from addedCategory.data.attributes.name to addedCategory.data.name
            description: addedCategory.data.description, // CHANGED: from addedCategory.data.attributes.description to addedCategory.data.description
          },
        ]);
        setNewCategoryName('');
        setNewCategoryDescription('');
      } catch (e) {
        console.error("Failed to add category:", e);
        setErrorCategories(`Failed to add category: ${e.message}. Check Strapi permissions for 'create'.`);
      }
    } else {
      alert('Category name cannot be empty.');
    }
  };

  const handleDeleteCategory = async (id) => {
    setErrorCategories(null);
    try {
      const response = await fetch(`${STRAPI_CATEGORIES_API_URL}/${id}`, {
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
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
      if (editingCategoryId === id) {
        handleCancelCategoryEdit();
      }
    } catch (e) {
      console.error("Failed to delete category:", e);
      setErrorCategories(`Failed to delete category: ${e.message}. Check Strapi permissions for 'delete'.`);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setEditingCategoryDescription(category.description);
  };

  const handleUpdateCategory = async (id) => {
    const trimmedName = editingCategoryName.trim();
    const trimmedDescription = editingCategoryDescription.trim();

    if (trimmedName) {
      setErrorCategories(null);
      try {
        const response = await fetch(`${STRAPI_CATEGORIES_API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: { // When sending, Strapi v5 still expects `data` wrapper for attributes
              name: trimmedName,
              description: trimmedDescription,
            }
          }),
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

        const updatedCategoryData = await response.json();
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === id
              ? {
                  id: updatedCategoryData.data.id.toString(),
                  // --- ADJUSTMENT HERE: Directly access 'name' and 'description' ---
                  name: updatedCategoryData.data.name,          // CHANGED
                  description: updatedCategoryData.data.description, // CHANGED
                }
              : category
          )
        );
        setEditingCategoryId(null);
        setEditingCategoryName('');
        setEditingCategoryDescription('');
      } catch (e) {
        console.error("Failed to update category:", e);
        setErrorCategories(`Failed to update category: ${e.message}. Check Strapi permissions for 'update'.`);
      }
    } else {
      alert('Category name cannot be empty.');
    }
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
    setEditingCategoryDescription('');
  };

  return (
    <Container size="xl" my="lg">
      <Paper p="xl" shadow="xs" radius="md">
        <Title order={2} mb="lg" fw={700}>Habit Categories Management</Title>
        <Text mb="md">Define and manage different categories for habits.</Text>

        <Divider my="xl" label="Add New Category" labelPosition="center" />

        {/* Section: Add New Habit Category */}
        <Card withBorder p="lg" radius="md" mb="xl">
          <Title order={3} mb="lg">Add Category</Title>
          <Stack spacing="md">
            <TextInput
              label="Category Name"
              placeholder="e.g., Health, Learning, Finance"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleAddCategory();
                }
              }}
              required
            />
            <Textarea
              label="Category Description (Optional)"
              placeholder="Brief description of this category"
              value={newCategoryDescription}
              onChange={(event) => setNewCategoryDescription(event.currentTarget.value)}
              autosize
              minRows={2}
            />
            <Button leftSection={<IconPlus size={16} />} onClick={handleAddCategory}>
              Add Category
            </Button>
          </Stack>
        </Card>

        <Divider my="xl" label="Existing Categories" labelPosition="center" />

        {/* Section: Display and Manage Existing Habit Categories */}
        {errorCategories && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error!" color="red" mb="md">
            {errorCategories}
          </Alert>
        )}

        {isLoadingCategories ? (
          <Group justify="center" mt="md">
            <Loader />
            <Text>Loading categories...</Text>
          </Group>
        ) : (
          <Stack>
            {categories.length === 0 ? (
              <Text c="dimmed" ta="center">No categories added yet. Add one above!</Text>
            ) : (
              categories.map((category) => (
                <Card key={category.id} withBorder p="md" radius="sm" shadow="sm">
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    {editingCategoryId === category.id ? (
                      <Stack flex={1} spacing="xs">
                        <TextInput
                          placeholder="Category Name"
                          value={editingCategoryName}
                          onChange={(event) => setEditingCategoryName(event.currentTarget.value)}
                          autoFocus
                          size="sm"
                          required
                        />
                        <Textarea
                          placeholder="Category Description"
                          value={editingCategoryDescription}
                          onChange={(event) => setEditingCategoryDescription(event.currentTarget.value)}
                          autosize
                          minRows={2}
                          size="sm"
                        />
                      </Stack>
                    ) : (
                      <Stack flex={1} spacing={4}>
                        <Text fw={500}>{category.name}</Text>
                        {category.description && (
                          <Text size="sm" c="dimmed">{category.description}</Text>
                        )}
                      </Stack>
                    )}

                    <Group gap="xs" ml="md">
                      {editingCategoryId === category.id ? (
                        <>
                          <ActionIcon
                            variant="filled"
                            color="green"
                            onClick={() => handleUpdateCategory(category.id)}
                            size="lg"
                            aria-label="Update category"
                          >
                            <IconCheck style={{ width: rem(20), height: rem(20) }} />
                          </ActionIcon>
                          <ActionIcon
                            variant="filled"
                            color="red"
                            onClick={handleCancelCategoryEdit}
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
                            onClick={() => handleEditCategory(category)}
                            size="lg"
                            aria-label="Edit category"
                          >
                            <IconEdit style={{ width: rem(20), height: rem(20) }} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleDeleteCategory(category.id)}
                            size="lg"
                            aria-label="Delete category"
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
      </Paper>
    </Container>
  );
}

export default HabitCategoriesPage;