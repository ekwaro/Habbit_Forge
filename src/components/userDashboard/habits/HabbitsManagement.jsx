import React, { useState } from "react";
import {
  Button,
  Text,
  Container,
  ScrollArea,
  Loader,
  Stack,
  Paper,
  Title,
  Group,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import "@mantine/dates/styles.css";
import { IconPlus, IconTrash } from '@tabler/icons-react';

import HabbitForm from "./HabbitForm";
import useStrapiHabits from "./useLocalStorage";
import { HabbitsList, DailyHabitView } from "./HabbitsList";

const HabbitsManagement = () => {
  const [editingHabit, setEditingHabit] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const authToken = import.meta.env.VITE_STRAPI_AUTH_TOKEN; 
  const {
    list,
    loading,
    addItem,
    removeItem,
    clearList,
    updateItem,
    toggleHabbitCompletion
  } = useStrapiHabits(authToken);

  const handleSubmit = (habit) => {
   /** 
    * const habit = {
      title: values.title,
      description: values.description,
      frequency: values.frequency,
      startDate: values.starDdate,
      endDate: values.endDate,
      partnerId: values.partnerId
     completedDates: editingHabit?.completedDates || [],
    };
    * */ 

    try {
      if (editingHabit) {
        updateItem(editingHabit.documentId, habit);
      } else {
        addItem(habit);
      }
    } catch (error) {
      console.error("Error adding/updating habit:", error);
    } finally {
      setEditingHabit(null);
      close();
    }
  };

  return (
    <Container size="lg">
      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #ffe0b2',
          boxShadow: '0 4px 32px 0 rgba(255,146,43,0.10)',
        }}
      >
        <Group justify="space-between" mb="xl">
          <div>
            <Title
              order={1}
              style={{
                color: '#ff922b',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem'
              }}
            >
              Habits Management
            </Title>
            <Text size="lg" color="#222" style={{ fontWeight: 500 }}>
              Create, track, and manage your daily habits
            </Text>
          </div>
        </Group>

        <HabbitForm
          opened={opened}
          onClose={() => {
            setEditingHabit(null);
            close();
          }}
          initialValues={editingHabit}
          onSubmit={handleSubmit}
        />

        <Button
          variant="gradient"
          gradient={{ from: '#ff922b', to: '#ffa726', deg: 45 }}
          fullWidth
          size="lg"
          onClick={() => {
            setEditingHabit(null);
            open();
          }}
          leftSection={<IconPlus size={20} />}
          style={{
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(255,146,43,0.25)',
            marginBottom: '2rem',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 16px rgba(255,146,43,0.35)'
            }
          }}
        >
          Add New Habit
        </Button>


        <ScrollArea mt={20} style={{ height: "60vh" }}>
          {loading ? (
            <Stack align="center" mt="md">
              <Loader size="lg" color="orange" />
              <Text size="lg" style={{ color: '#ff922b', fontWeight: 600 }}>
                Loading your habits...
              </Text>
            </Stack>
          ) : list?.length === 0 ? (
            <Box
              style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                borderRadius: 16,
                border: '2px dashed #ffd180'
              }}
            >
              <Text size="xl" style={{ color: '#ff922b', fontWeight: 700, marginBottom: '1rem' }}>
                No habits yet!
              </Text>
              <Text size="md" color="#666">
                Start building your habits by adding your first one above.
              </Text>
            </Box>
          ) : (
            <HabbitsList
              list={list}
              removeItem={removeItem}
              updateItem={updateItem}
              setEditingQuote={setEditingHabit}
              open={open}
            />
          )}

          {list?.length > 0 && (
            <Button
              mt="xl"
              color="red"
              variant="light"
              onClick={clearList}
              leftSection={<IconTrash size={16} />}
              style={{
                background: '#ffebee',
                color: '#d32f2f',
                fontWeight: 600,
                border: '1px solid #ffcdd2'
              }}
            >
              Clear All Habits
            </Button>
          )}
        </ScrollArea>

        <DailyHabitView
          list={list}
          removeItem={removeItem}
          updateItem={updateItem}
        />
      </Paper>

    </Container>
  );
};

export default HabbitsManagement;
