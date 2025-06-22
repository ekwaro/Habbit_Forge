import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Stack,
  Paper,
  ActionIcon,
  Badge,
  rem,
  Divider,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconCheck, IconX } from '@tabler/icons-react';



function HabitCategoriesPage() {
  // State for the new category input field
  const [newCategoryName, setNewCategoryName] = useState('');

  // State for the list of all categories
  // The type of 'categories' will be inferred by React based on initial value []
  // and subsequent operations.
  const [categories, setCategories] = useState([]);

  // State to track which category is currently being edited
  // Null means no category is being edited.
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState(''); // Value for the editing input

  // --- useEffect for Local Storage ---

  // Load categories from local storage on component mount
  useEffect(() => {
    const storedCategories = localStorage.getItem('habitCategories');
    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories));
      } catch (e) {
        console.error("Failed to parse categories from local storage:", e);
        // If data is corrupt, remove it to prevent continuous errors
        localStorage.removeItem('habitCategories');
      }
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Save categories to local storage whenever the 'categories' state changes
  useEffect(() => {
    //  console.log('Saving categories to local storage:', categories); 
    localStorage.setItem('habitCategories', JSON.stringify(categories));
  }, [categories]); // Dependency array: runs when 'categories' state changes

  // --- CRUD Operations ---

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (trimmedName) {
      // Generate a unique ID (simple timestamp for now)
     
      const newCategory = {
        id: Date.now().toString(), // Using timestamp as a simple unique ID
        name: trimmedName,
      };
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategoryName(''); // Clear the input field
    }
  };

  const handleDeleteCategory = (id) => { // 'id' will be a string
    setCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== id));
    // If the deleted item was currently being edited, exit edit mode
    if (editingCategoryId === id) {
      handleCancelEdit();
    }
  };

  const handleEditCategory = (category) => { // 'category' will be an object {id, name}
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleUpdateCategory = (id) => { // 'id' will be a string
    const trimmedName = editingCategoryName.trim();
    if (trimmedName) {
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === id ? { ...cat, name: trimmedName } : cat
        )
      );
      setEditingCategoryId(null); // Exit edit mode
      setEditingCategoryName(''); // Clear editing input
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  return (
    <Container size="xl" my="lg">
      <Paper p="xl" shadow="xs" radius="md">
        <Title order={2} mb="lg" fw={700}>Habit Categories Management</Title>
        <Text mb="md">Add, edit, and delete your habit categories here.</Text>

        {/* Section to Add New Category */}
        <Group align="flex-end" mb="xl">
          <TextInput
            flex={1} // Takes available space
            label="New Category Name"
            placeholder="e.g., Health, Productivity, Learning"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAddCategory();
              }
            }}
            size="md"
          />
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleAddCategory}
            size="md"
          >
            Add Category
          </Button>
        </Group>

        <Divider my="md" label="Existing Categories" labelPosition="center" />

        {/* Section to Display Categories */}
        {categories.length === 0 ? (
          <Text c="dimmed" ta="center" mt="md">No categories added yet. Start by adding one above!</Text>
        ) : (
          <Stack mt="md">
            {/* Map over categories to display each one */}
            {categories.map((category) => (
              <Group key={category.id} justify="space-between" align="center" wrap="nowrap">
                {editingCategoryId === category.id ? (
                  // Render TextInput when in edit mode for this category
                  <TextInput
                    flex={1}
                    value={editingCategoryName}
                    onChange={(event) => setEditingCategoryName(event.currentTarget.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleUpdateCategory(category.id);
                      }
                    }}
                    autoFocus 
                    size="md"
                  />
                ) : (
                  // Render Badge when in display mode for this category
                  <Badge
                    variant="light"
                    size="lg"
                    py="sm" // Vertical padding
                    px="md" // Horizontal padding
                    radius="sm"
                    color="teal"
                    style={{ cursor: 'default', flexGrow: 1, textAlign: 'left' }}
                  >
                    {category.name}
                  </Badge>
                )}

                {/* Action Buttons (Edit/Delete or Update/Cancel) */}
                <Group gap="xs">
                  {editingCategoryId === category.id ? (
                    // Show Update and Cancel buttons when editing
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
                        onClick={handleCancelEdit}
                        size="lg"
                        aria-label="Cancel edit"
                      >
                        <IconX style={{ width: rem(20), height: rem(20) }} />
                      </ActionIcon>
                    </>
                  ) : (
                    // Show Edit and Delete buttons when displaying
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
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  );
}

export default HabitCategoriesPage;