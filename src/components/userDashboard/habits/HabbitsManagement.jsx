import React, { useState } from "react";
import {
  Button,
  Text,
  Container,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import "@mantine/dates/styles.css"; 

import HabbitForm from "./HabbitForm";
import useLocalStorage from "./useLocalStorage";
import { HabbitsList, DailyHabitView } from "./HabbitsList";

const HabbitsManagement = () => {
  const [editingQuote, setEditingQuote] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const { list, addItem, removeItem, clearList, updateItem } = useLocalStorage(
    "habitData",
    []
  );

  const handleSubmit = (values) => {
    const habit = {
      id: editingQuote?.id || Date.now(),
      title: values.title,
      description: values.description,
      frequency: values.frequency,
      startdate: values.startdate,
      endDate: values.endDate,
      targetDate: values.targetDate,
      completedDates: editingQuote?.completedDates || [],
    };

    try {
      if (editingQuote) {
        // If editing an existing habit, update it
        updateItem(editingQuote.id, habit);
      } else {
        addItem(habit);
      }
    } catch (error) {
      console.error("Error adding/updating habit:", error);
    } finally {
      setEditingQuote(null);
      close();
    }
  };

  return (
    <Container>
      <Text size="xl" weight={700} mb="md">
        Habits Management
      </Text>

      {/* Modal Form */}
      <HabbitForm
        opened={opened}
        onClose={() => {
          setEditingQuote(null);
          close();
        }}
        initialValues={editingQuote}
        onSubmit={handleSubmit}
      />

      <Button
        variant="gradient"
        fullWidth
        onClick={() => {
          setEditingQuote(null);
          open();
        }}
      >
        Add Habit
      </Button>

      <ScrollArea mt={20} style={{ height: "60vh" }}>
        {list?.length === 0 ? (
          <Text>No habits found. Please add one.</Text>
        ) : (
          <HabbitsList
            list={list}
            removeItem={removeItem}
            updateItem={updateItem}
            setEditingQuote={setEditingQuote}
            open={open}
          />
        )}

        <Button mt="md" color="yellow" variant="outline" onClick={clearList}>
          Clear All
        </Button>
      </ScrollArea>

      <DailyHabitView
        list={list}
        removeItem={removeItem}
        updateItem={updateItem}
      />
    </Container>
  );
};

export default HabbitsManagement;
