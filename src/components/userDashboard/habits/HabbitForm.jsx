import React, { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import {
  Modal,
  Pagination,
  Textarea,
  Button,
  TextInput,
  Autocomplete,
  Select,
} from "@mantine/core";

const HabbitForm = ({ initialValues = null, onSubmit, onClose, opened }) => {
  const STRAPI_AUTH_TOKEN =
    "8028d866d1749f3da8e80af54837e6dc203de30c34eed26a91d180bbbbd3e923a5e6e41bd6f3c3c93220accf8e7fb59a5de57902b15258e8eb0ebb2fb1220e3a8f8e1164affc503672f8b913e607bca96cfbadf2e4e818988db0fe6d2676730cf47120ca8dbd004d0f967cdb3f33915b0d62f35de2422fe8499a5dda9e052738";

  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("http://localhost:1337/api/users", {
      headers: {
        Authorization: `Bearer ${STRAPI_AUTH_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUsers(res);
        console.log("Fetched users:", res.at(0));
      })
      .catch(console.error);
  }, []);
  users ? console.log(users) : "";
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      frequency: "",
      startDate: "", // Assuming startdate is a string in 'YYYY-MM-DD' format
      endDate: "", // Assuming endDate is a string in 'YYYY-MM-DD' format
      targetDate: "",
      accountabilityPartner: "",
      partnerSearch: "", // Assuming targetDate is a string in 'YYYY-MM-DD' format
      ...initialValues,
    },
    validate: {
      title: (value) =>
        value.length < 2 ? "Title must be at least 2 characters long" : null,
      description: (value) =>
        value.length < 5
          ? "Description must be at least 5 characters long"
          : null,
      startDate: (value) => {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log(date, today);
        return date < today ? "Start date must be in the future" : null;
      },
      endDate: (value) => {
        const startDate = new Date(form.values.startDate);
        const endDate = new Date(value);
        return endDate < startDate ? "End date must be after start date" : null;
      },

      frequency: (value) => (value.length < 1 ? "Frequency is required" : null),
      accountabilityPartner: (value, values) => {
        if (!value && !values.partnerSearch) {
          return "Please select an accountability partner";
        }
        return null;
      },
    },
  });
  useEffect(() => {
    if (initialValues) {
      form.setValues(initialValues);
    }
  }, [initialValues]);

  const handleSubmit = async (values) => {
    const formattedValues = {
      ...values,
      startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
      targetDate: values.targetDate
        ? dayjs(values.targetDate).format("YYYY-MM-DD")
        : null,
      accountabilityPartner: values.accountabilityPartner,
    };

    console.log(formattedValues);
    const STRAPI_AUTH_TOKEN =
      "8028d866d1749f3da8e80af54837e6dc203de30c34eed26a91d180bbbbd3e923a5e6e41bd6f3c3c93220accf8e7fb59a5de57902b15258e8eb0ebb2fb1220e3a8f8e1164affc503672f8b913e607bca96cfbadf2e4e818988db0fe6d2676730cf47120ca8dbd004d0f967cdb3f33915b0d62f35de2422fe8499a5dda9e052738";
    const res = await fetch("http://localhost:1337/api/habits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRAPI_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: formattedValues }),
    });
    const response = await res.json();
    if (!res.ok) {
      console.error(response);
      throw new Error(response.error?.message || "Failed to create habit");
    }
    notifications.show({
      title: "Habbit Created",
      message: "Your habbit created successfully",
      color: "green",
    });
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
          {...form.getInputProps("startDate")}
        />
        <TextInput
          type="date"
          label="endDate"
          {...form.getInputProps("endDate")}
        />
        <Autocomplete
          label="Accountability Partner"
          placeholder="Search by username or email"
          searchable
          nothingFound="No users found"
          value={form.values.partnerSearch}
          onChange={(val) => {
            form.setFieldValue("partnerSearch", val);
          }}
          onOptionSubmit={(val) => {
            const selectedUser = users?.find(
              (u) => `${u.username} (${u.email})` === val
            );

            form.setFieldValue("partnerSearch", val);
            form.setFieldValue(
              "accountabilityPartner",
              selectedUser ? selectedUser.id.toString() : ""
            );
          }}
          data={users?.map((user) => `${user.username} (${user.email})`) || []}
        />

        <Button type="submit" mt={10}>
          {initialValues ? "Update Habit" : "Create Habit"}
        </Button>
      </form>
    </Modal>
  );
};

export default HabbitForm;
