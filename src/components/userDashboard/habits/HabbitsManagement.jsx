import {
  Button,
  Select,
  Table,
  Container,
  Modal,
  Text,
  TextInput,
  List,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import useLocalStorage from "../useLocalStorage";
import { HabbitsList, DailyHabitView } from "./HabbitsList";

const HabbitsManagement = () => {
  const { list, addItem, removeItem, clearList, updateItem } = useLocalStorage(
    "habitData",
    []
  );
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      habitName: "",
      frequency: "",
      startDate: new Date(),
      endDate: new Date(),
    },
    validate: {
      habitName: (value) =>
        value.length < 2
          ? "Habit name must be at least 2 characters long"
          : null,
      frequency: (value) => (value.length < 1 ? "Frequency is required" : null),
    },
  });
  const [opened, { open, close }] = useDisclosure(false);
  const handleSubmit = (values) => {
    // Handle form submission logic here
    console.log("Form submitted with values:", values);
    let itemList = {
      id: Date.now(), // Unique ID for the habit
      habitName: values.habitName,
      frequency: values.frequency,
      startDate: values.startDate,
      endDate: values.endDate,
      reminderTime: values.reminderTime || "09:00", // Default reminder time if not provided
      completedDates: [],
    };
    console.log(itemList);
    addItem(itemList);

    form.reset(); // Reset the form after submission
    // Here you can handle the form submission, e.g., send data to an API
    close(); // Close the modal after submission
  };
  return (
    <Container>
      {/* write ui for habbits using mantine components */}

      <Text size="xl" weight={700} mb="md">
        Habbits Management
      </Text>
      <Modal
        opened={opened}
        onClose={close}
        title="Add Your Habbits"
        m={20}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Habit Name"
            placeholder="Enter your habit name"
            {...form.getInputProps("habitName")}
          />
          <Select
            label="Frequency"
            placeholder="Pick one"
            data={["Daily", "Weekly", "Monthly"]}
            {...form.getInputProps("frequency")}
            mb="md"
            mt="md"
            withAsterisk
          />
          <TextInput
            mt="md"
            label="Reminder Time"
            type="time"
             placeholder="HH:MM"
            {...form.getInputProps("reminderTime")}
          />
          <TextInput
            mt="md"
            withAsterisk
            label="Start Date"
            type="date"
            {...form.getInputProps("startDate")}
          />
          <TextInput
            mt="md"
            label="End Date"
            type="date"
            {...form.getInputProps("endDate")}
          />
          <Button type="submit" variant="gradient" mt="md">
            Add Habit
          </Button>
        </form>
      </Modal>

      <Button variant="gradient" onClick={open}>
        Add Habbit
      </Button>
      <ScrollArea mt={20} style={{ height: "60vh" }} mx="auto">
        {list?.length === 0 ? (
          <Text>No habits found. Please add a habit.</Text>
        ) : (
          <HabbitsList
            list={list}
            removeItem={removeItem}
            updateItem={updateItem}
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
