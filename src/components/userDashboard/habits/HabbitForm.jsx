import { TextInput } from "@mantine/core";
import React, { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Modal, Textarea, Button, Select } from "@mantine/core";

const HabbitForm = ({ initialValues = null, onSubmit, onClose, opened }) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      frequency: "",
      startdate: "", // Assuming startdate is a string in 'YYYY-MM-DD' format
      endDate: "", // Assuming endDate is a string in 'YYYY-MM-DD' format
      targetDate: "", // Assuming targetDate is a string in 'YYYY-MM-DD' format
      ...initialValues,
    },
    validate: {
      title: (value) =>
        value.length < 2 ? "Title must be at least 2 characters long" : null,
      description: (value) =>
        value.length < 5
          ? "Description must be at least 5 characters long"
          : null,
      startdate: (value) => {
        const date = new Date(value);
        const today = new Date();
        return date < today ? "Start date must be in the future" : null;
      },
      endDate: (value) => {
        const startDate = new Date(form.values.startdate);
        const endDate = new Date(value);
        return endDate < startDate ? "End date must be after start date" : null;
      },

      frequency: (value) => (value.length < 1 ? "Frequency is required" : null),
    },
  });
  useEffect(() => {
    if (initialValues) {
      form.setValues(initialValues);
    }
  }, [initialValues]);

  const handleSubmit = (values) => {
    if (onSubmit) {
      onSubmit(values);
    }
    form.reset();
    close(); // Close the modal after submission
  };
  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
        onClose();
      }}
      title={initialValues ? "Update Habit" : "Add New Habit"}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          type="text"
          mt={10}
          placeholder="Habit Title"
          label="Add Habit"
          required
          {...form.getInputProps("title")}
        />
        <Textarea
          placeholder="Habit Description"
          required
          label="Habit Description"
          mt={10}
          {...form.getInputProps("description")}
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
          type="date"
          required
          label="startDate"
          {...form.getInputProps("startdate")}
        />
        <TextInput
          type="date"
          label="endDate"
          {...form.getInputProps("endDate")}
        />

        <Button type="submit" mt={10}>
          {initialValues ? "Update Habit" : "Create Habit"}
        </Button>
      </form>
    </Modal>
  );
};

export default HabbitForm;
