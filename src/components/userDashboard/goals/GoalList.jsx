import {
  Modal,
  Card,
  Text,
  Button,
  Autocomplete,
  Group,
  Progress,
  TextInput,
  Select,
  Textarea,
  Stack,
  Checkbox,
  Divider,
} from "@mantine/core";
import dayjs from "dayjs";
import { IconTrash } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { useForm, isNotEmpty } from "@mantine/form";
import { useState ,useEffect} from "react";
import { useDisclosure } from "@mantine/hooks";


const STRAPI_AUTH_TOKEN = import.meta.env.VITE_STRAPI_AUTH_TOKEN

const GoalForm = ({ opened, onClose, onSubmit }) => {
   const [users, setUsers] = useState([]);
  useEffect(()=>{fetch("http://localhost:1337/api/users", {

              headers: {
        Authorization: `Bearer ${STRAPI_AUTH_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);},[])
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      targetDate: "",
      accountabilityPartner: ''
    },
    validate: {
      title: (value) =>
        value.length < 2 ? "Title must be at least 2 characters long" : null,
      description: (value) =>
        value.length < 5
          ? "Description must be at least 5 characters long"
          : null,

      accountabilityPartner: (value, values) => {
        if (!value && !values.partnerSearch) {
          return "Please select an accountability partner";
        }
        return null;
      },
     
     
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
        <Autocomplete
          label="Accountability Partner"
          placeholder="Search by username or email"
          searchable
          nothingFound="No users found"
          mt="sm"
          value={form.values.partnerSearch}
          onChange={(val) => form.setFieldValue("partnerSearch", val)}
        onOptionSubmit={(val) => {
            const selectedUser = users.find(
              (u) => `${u.username} (${u.email})` === val
            );
            form.setFieldValue("partnerSearch", val);
            form.setFieldValue("accountabilityPartner", selectedUser?.id);
          }}
          data={users?.map((u) => `${u.username} (${u.email})`)}
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
  mykey,
  onDeleteNotes,
  onDeleteSubgoals,
  onMarkGoalAsCompleted,
  onremoveGoal
}) => {
  const subgoals = goal.subgoals || [];
  const notes = goal.notes || [];

  const total = goal.subgoals?.length || 1;
  const done = goal.subgoals?.filter((s) => s.completed).length;
  const percent = Math.round((done / total) * 100);

  const [openedSubgoal, { open: openSubgoal, close: closeSubgoal }] =
    useDisclosure(false);
  const [opendNotes, { open: openNotes, close: closeNotes }] =
    useDisclosure(false);

  const subgoalForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      priority: "",
    },
    validate: {
      title: isNotEmpty("Title cannot be empty"),
      description: (value) => {
        if (value.length > 100) {
          return "Description too long";
        }
      },
    },
  });

  const noteForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
    },
    validate: {},
  });

  const handleAddSubgoal = (values) => {
    console.log(values);
    console.log(goal.documentId, goal.subgoals);

    onAddSubgoal(values);
    subgoalForm.reset();
    closeSubgoal();
  };

  const handleAddNote = (values) => {
    onAddNote(values);

    noteForm.reset();
    closeNotes();
  };

  return (
    <Card withBorder p="md" shadow="sm" radius="md" my="md" key={mykey}>
      <Stack spacing="xs">
        <Group>
          <Checkbox
            checked={goal.completed}
            onChange={(e) => onMarkGoalAsCompleted(e.currentTarget.checked)}
            label={<Text>{goal.title}</Text>}
          />
          <Button
            onClick={onremoveGoal}
            variant="transparent"
          >
            <IconTrash size={20} stroke={1.5} color="red" />
          </Button>
        </Group>

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
              <Button
                onClick={() => onDeleteSubgoals(subgoal.id)}
                variant="transparent"
              >
                <IconTrash size={20} stroke={1.5} color="red" />
              </Button>
            </Group>
          ))
        )}
        <Modal
          opened={openedSubgoal}
          onClose={closeSubgoal}
          title="Add Subgoal"
        >
          <form onSubmit={subgoalForm.onSubmit(handleAddSubgoal)}>
            <TextInput
              placeholder="Enter the subgoaltitle"
              {...subgoalForm.getInputProps("title")}
              label="Title"
            />
            <Textarea
              placeholder="Enter Description"
              label="description"
              {...subgoalForm.getInputProps("description")}
            />
            <DatePickerInput
              label="Start Date"
              {...subgoalForm.getInputProps("startDate")}
            />
            <DatePickerInput
              label="End Date"
              {...subgoalForm.getInputProps("endDate")}
            />
            <Select
              mb="xs"
              label="Priority"
              data={["Low", "Medium", "High"]}
              defaultValue="Medium"
              {...subgoalForm.getInputProps("priority")}
            />
            <Button type="submit">Add Subgoal</Button>
          </form>
        </Modal>
        <Button onClick={openSubgoal}>Add Subgoals</Button>

        <Divider label="Notes" labelPosition="center" />
        {goal.notes?.length === 0 ? (
          <Text size="sm" c="dimmed">
            No notes added yet.
          </Text>
        ) : (
          goal.notes.map((note) => (
            <Group>
              <Text key={note.id} size="sm">
                {note.description} <br />
                <i>
                  {note.createdAt
                    ? dayjs(note.createdAt).format("YYYY-MM-DD HH:mm")
                    : "No timestamp"}
                </i>
              </Text>
              <Button
                onClick={() => onDeleteNotes(note.id)}
                variant="transparent"
              >
                <IconTrash size={20} stroke={1.5} color="red" />
              </Button>
            </Group>
          ))
        )}
        <Modal opened={opendNotes} onClose={closeNotes} title="Add goal notes">
          <form onSubmit={noteForm.onSubmit(handleAddNote)}>
            <TextInput
              label="Title"
              placeholder="Your notes Title"
              {...noteForm.getInputProps("title")}
            />
            <Textarea
              label="Description"
              placeholder="Add description"
              {...noteForm.getInputProps("description")}
            />
            <Button type="submit" mt="xs">
              Add
            </Button>
          </form>
        </Modal>
        <Button onClick={openNotes}>Add Notes</Button>

        <Divider label="Goal Completion" labelPosition="center" />
        <Progress value={percent} size="sm" radius="xl" mt="md" />
        <Text c="dimmed">{percent}% completed</Text>
      </Stack>
    </Card>
  );
};

export { GoalForm, GoalCard };
