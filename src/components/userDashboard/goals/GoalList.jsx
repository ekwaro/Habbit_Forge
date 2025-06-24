import {
  Modal,
  Card,
  Text,
  Button,
  Group,
  Progress,
  TextInput,
  Textarea,
  Stack,
  Checkbox,
  Divider,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useState } from "react";

const GoalForm = ({ opened, onClose, onSubmit }) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      targetDate: "", // Assuming targetDate is a string in 'YYYY-MM-DD' format
    },
    validate: {
      title: (value) =>
        value.length < 2 ? "Title must be at least 2 characters long" : null,
      description: (value) =>
        value.length < 5
          ? "Description must be at least 5 characters long"
          : null,
    },
  });
  return (
    <Modal opened={opened} onClose={onClose} title="Add New Goal" size="lg">
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(values);
          form.reset();
          onClose();
        })}
      >
        <TextInput
          type="text"
          mt={10}
          placeholder="Goal Title"
          label="Add Goal"
          required
          {...form.getInputProps("title")}
        />
        <Textarea
          placeholder="Goal Description"
          required
          label="Goal Description"
          mt={10}
          {...form.getInputProps("description")}
        />
        <TextInput
          type="date"
          label="Target Date"
          {...form.getInputProps("targetDate")}
        />
        <Button type="submit" mt={10}>
          Create Goal
        </Button>
      </form>
    </Modal>
  );
};

const GoalCard = ({
  goal,
  onAddSubgoal,
  onAddNote,
  onToggleSubgoal,
  onMarkGoalAsCompleted,
}) => {
  const subgoals = goal.subgoals || [];
  const notes = goal.notes || [];
  const total = goal.subgoals?.length || 1;
  const done = goal.subgoals?.filter((s) => s.completed).length;
  const percent = Math.round((done / total) * 100);
  const [newSubgoal, setNewSubgoal] = useState("");
  const [subgoalError, setsubgoalError] = useState(null);
  const [error, setError] = useState("");
  const [newNote, setNewNote] = useState("");
  const validateSubgoalErrors = (text) => {
    if (!text.trim()) {
      return "Subgoal cannot be empty";
    }
    if (text.trim().length < 3) {
      return "Subgoal is too short";
    }
    if (text.trim().length > 100) {
      return "Subgoal is too long";
    }
    return null;
  };

  const validateAddNoteErrors = (text) => {
    if (!text.trim()) {
      return "Notes cannot be empty";
    }
    if (text.trim().length < 3) {
      return "Notes is too short";
    }
    if (text.trim().length > 100) {
      return "Notes is too long";
    }
    return null;
  };

  const handleAddSubgoal = () => {
    const validateSubgoals = validateSubgoalErrors(newSubgoal);
    if (validateSubgoals) {
      setsubgoalError(validateSubgoals);
      return;
    }
    onAddSubgoal(newSubgoal.trim());
    setNewSubgoal("");
    setsubgoalError(null);
  };
  const handleAddNote = () => {
    const validationNotes = validateAddNoteErrors(newNote);
    if (validationNotes) {
      setError(validationNotes);
      return;
    }
    onAddNote(newNote.trim());
    setNewNote("");
    setError("");
  };
  return (
    <Card withBorder p="md" shadow="sm" radius="md" my="md">
      <Stack spacing="xs">
        <Checkbox
          checked={goal.completed}
          onChange={(e) => onMarkGoalAsCompleted(e.currentTarget.checked)}
          label={<Text>{goal.title}</Text>}
        />
        <Text size="sm" c="dimmed">
          {goal.description}
        </Text>
        <Divider label="Subgoals" labelPosition="center" />
      </Stack>
      <Stack spacing="xs">
        {subgoals?.length === 0 ? (
          <Text size="sm" c="dimmed">
            No subgoals added yet.
          </Text>
        ) : (
          subgoals.map((subgoal) => (
            <Group key={subgoal.id} position="apart">
              <Text size="sm">{subgoal.title}</Text>
              <Checkbox
                checked={subgoal.completed}
                onChange={() => onToggleSubgoal(subgoal.id)}
              />
            </Group>
          ))
        )}
        <TextInput
          placeholder="Add a subgoal"
          value={newSubgoal}
          onChange={(e) => setNewSubgoal(e.target.value)}
          error={subgoalError}
        />
        <Button onClick={handleAddSubgoal}>Add Subgoal</Button>

        <Divider label="Notes" labelPosition="center" />
        {goal.notes?.length === 0 ? (
          <Text size="sm" c="dimmed">
            No notes added yet.
          </Text>
        ) : (
          goal.notes.map((note) => (
            <Text key={note.id} size="sm">
              {note.content} <br />
              <i>{new Date(note.createdAt).toLocaleString()}</i>
            </Text>
          ))
        )}
        <TextInput
          placeholder="Add a Note ..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          error={error}
        />

        <Button size="xs" color="gray" onClick={handleAddNote}>
          Add Note
        </Button>
        <Divider label='Goal Completion' labelPosition='center'/>
        <Progress value={percent} size="sm" radius="xl" mt="md" />
        <Text c='dimmed'>{percent}% completed</Text>
      </Stack>
    </Card>
  );
};

export { GoalForm, GoalCard };
