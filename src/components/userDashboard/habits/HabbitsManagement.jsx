import React, { useState } from "react";
import {
  Button,
  Text,
  Container,
  ScrollArea,
  Loader,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import "@mantine/dates/styles.css";

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
        updateItem(editingHabit.id, habit);
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
    <Container>
      <Text size="xl" weight={700} mb="md">
        Habits Management
      </Text>

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
        fullWidth
        onClick={() => {
          setEditingHabit(null);
          open();
        }}
      >
        Add Habit
      </Button>

      <ScrollArea mt={20} style={{ height: "60vh" }}>
        {loading ? (
          <Stack align="center" mt="md">
            <Loader />
            <Text>Loading habits...</Text>
          </Stack>
        ) : list?.length === 0 ? (
          <Text>No habits found. Please add one.</Text>
        ) : (
          <HabbitsList
            list={list}
            removeItem={removeItem}
            updateItem={updateItem}
            setEditingQuote={setEditingHabit}
            open={open}
          />
        )}

        <Button
          mt="md"
          color="yellow"
          variant="outline"
          onClick={clearList}
        >
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
