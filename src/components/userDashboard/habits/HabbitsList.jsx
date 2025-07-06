import {
  Button,
  Text,
  Table,
  Card,
  Group,
  Badge,
  ScrollArea,
  Stack,
  Center,
  Loader,
  Checkbox,
  Pagination,
  Progress,
  Divider,
  Container,
} from "@mantine/core";
import useStrapiHabits from "./useLocalStorage";
import "@mantine/dates/styles.css";
import { DatePicker } from "@mantine/dates";
import { LineChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  isTodayMatchingFrequency,
  getHabitProgress,
} from "./utils/TodaysHabit";
import { buildChartData } from "./utils/LineChart";
import { useMemo } from "react";
import { IconArrowLeft, IconSignLeftFilled } from "@tabler/icons-react";
const HabbitsList = ({
  list,
  removeItem,
  updateItem,
  setEditingQuote,
  open,
}) => {
  const [activePage, setPage] = useState(1)
  const pageSize = 5

  console.log(list)
  const paginatedList =(Array.isArray(list)?list:[]).slice((activePage - 1) * pageSize, activePage*pageSize)


  const navigate = useNavigate();
  console.log("HabbitsList Rendered", paginatedList[0].id);
  const rows = paginatedList.map((habit) => (
    <Table.Tr key={habit.id}>
      <Table.Td>{habit.id}</Table.Td>
      <Table.Td>{habit.title}</Table.Td>
      <Table.Td>{habit.frequency}</Table.Td>
      <Table.Td>{new Date(habit.startDate).toLocaleDateString()}</Table.Td>
      <Table.Td>{new Date(habit.endDate).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Button
          size="xs"
          variant="outline"
          color="red"
          mr={5}
          onClick={() => removeItem(habit.documentId)}
        >
          Delete
        </Button>
        <Button
          size="xs"
          mr={5}
          variant="outline"
          onClick={() =>
            navigate(`/user-dashboard/habbits-management/${habit.id}`)
          }
        >
          View
        </Button>
        <Button
          size="xs"
          variant="light"
          onClick={() => {
            setEditingQuote(habit);
            open();
          }}
        >
          Update
        </Button>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Table
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        verticalSpacing="md"
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Frequency</Table.Th>
            <Table.Th>Start Date</Table.Th>
            <Table.Th>End Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      {list?.length > pageSize && (
  <Pagination
    value={activePage}
    onChange={setPage}
    total={Math.ceil(list?.length / pageSize)}
    mt="md"
    position="center"
  />
)}
    </>
  );
};


const HabbitsItem = () => {
  const { id } = useParams();
  console.log(typeof(id))
  const navigate = useNavigate();
  const authToken = import.meta.env.VITE_STRAPI_AUTH_TOKEN;

  const { list, loading } = useStrapiHabits(authToken);
  console.log(list)

  const habit = Array.isArray(list)?list.find((habit) => habit.id.toString() === id):null;

  if (loading) {
    return (
      <Center mt="xl">
        <Loader />
        <Text ml="sm">Loading habit details...</Text>
      </Center>
    );
  }

  return (
    <Card withBorder shadow="sm" p="lg" my="md">
      <Group justify="space-between" mb="md">
        <Text fw={600} size="xl">
          Habit Details
        </Text>
        {habit && (
          <Badge color="teal" variant="light" size="lg">
            {habit.frequency}
          </Badge>
        )}
      </Group>

      {!habit ? (
        <Text c="dimmed" align="center">
          Habit not found.
        </Text>
      ) : (
        <Stack spacing="xs">
          <Text fw={700} size="lg" c="blue">
            {habit.title}
          </Text>

          <Divider my="xs" />

          <Text size="sm" c="gray">
            <strong>Start Date:</strong>{" "}
            {dayjs(habit.startDate).format("MMM D, YYYY")}
          </Text>
          <Text size="sm" c="gray">
            <strong>End Date:</strong>{" "}
            {dayjs(habit.endDate).format("MMM D, YYYY")}
          </Text>
        </Stack>
      )}

      {habit && (
        <Group justify="space-between" mt="md" wrap="wrap">
          <Card
            mt={20}
            withBorder
            shadow="sm"
            p="lg"
            style={{ flex: 1, minWidth: 300, maxWidth: 600 }}
          >
            <LineChart
              mt={20}
              h={300}
              data={buildChartData(habit)}
              title="Habit Completion Over Time"
              xAxisLabel="Date"
              curveType="monotone"
              yAxisLabel="Completed"
              margin={{ top: 20, right: 20, bottom: 20, left: 50 }}
              dataKey="date"
              series={[{ name: "Completed", color: "teal" }]}
            />
          </Card>

          <Card
            mt={20}
            withBorder
            shadow="sm"
            p="lg"
            style={{ flex: 1, minWidth: 200, maxWidth: 300 }}
          >
            <HabitCalenderView habit={habit} />
          </Card>
        </Group>
      )}

      <Button
        onClick={() => navigate(-1)}
        variant="transparent"
        leftSection={<IconArrowLeft />}
        mt="md"
      >
        Back
      </Button>
    </Card>
  );
};
const HabitCalenderView = ({ habit }) => {
  console.log("Habit in Calendar View:", habit);
  return (
    <DatePicker
      value={null}
      renderDay={(date) => {
        const dateStr = dayjs(date).format("YYYY-MM-DD");
        const isCompleted = habit.completedDates?.includes(dateStr);

        return (
          <Container
            style={{
              backgroundColor: isCompleted ? "teal" : undefined,
              borderRadius: "50%",
              width: 24,

              height: 24,
              color: isCompleted ? "white" : undefined,
              textAlign: "center",
              lineHeight: "24px",
              position: "relative",
            }}
          >
            {dayjs(date).date()}
            {/* Display a checkmark badge if the habit is completed on this date */}
            {isCompleted && (
              <Badge
                color="green"
                variant="transparent"
                size="xs"
                style={{ position: "absolute", top: 0, right: 0 }}
              >
                ✔️
              </Badge>
            )}
          </Container>
        );
      }}
    />
  );
  // This component can be used to display a calendar view of habits
};

const DailyHabitView = ({ list, removeItem, updateItem }) => {
  const todayStr = dayjs().format("YYYY-MM-DD");

  const isTodayInRange = (startdate, endDate) => {
    const today = dayjs().startOf("day");
    return dayjs(startdate) <= today && today <= dayjs(endDate);
  };

  const getTodaysHabit = (habits) => (Array.isArray(habits)?habits:[])
    
      .filter((habit) => isTodayMatchingFrequency(habit))
      .filter((habit) => isTodayInRange(habit.startdate, habit.endDate));

  const todaysHabits = useMemo(() => getTodaysHabit(list), [list]);

  const markHabitComplete = (habit) => {
    const today = todayStr;
    const alreadyCompleted = habit.completedDates?.includes(today) ?? false;

    const updatedHabit = {
      ...habit,
      completedDates: alreadyCompleted
        ? habit.completedDates.filter((date) => date !== today)
        : [...(habit.completedDates || []), today],
    };

    updateItem(habit.id, updatedHabit);
  };

  return (
    <Card withBorder shadow="sm" p="lg" my="md">
      <Group position="apart" mb="xs">
        <Text fw={500}>Today's Habits</Text>
        <Text>{dayjs().format("dddd, MMM D")}</Text>
      </Group>

      <ScrollArea h={350}>
        <Stack>
          {todaysHabits.length === 0 ? (
            <Text c="dimmed">No daily habits for today.</Text>
          ) : (
            todaysHabits.map((habit) => {
              const progress = getHabitProgress(habit);
              const isCompleted = habit.completedDates?.includes(todayStr) ?? false;

              return (
                <Card
                  withBorder
                  shadow="sm"
                  p="lg"
                  key={habit.id}
                  style={{
                    backgroundColor: isCompleted ? "#d4edda" : "#f8d7da",
                  }}
                >
                  <Group position="apart" mb="xs" align="center">
                    <Checkbox
                      label={habit.title}
                      checked={isCompleted}
                      onChange={() => markHabitComplete(habit)}
                    />
                    <Badge color="teal" variant="light">
                      {habit.frequency}
                    </Badge>
                  </Group>

                  <Text size="sm" mt="xs" c="dimmed">
                    {`Start: ${dayjs(habit.startdate).format("MMM D, YYYY")} | End: ${dayjs(habit.endDate).format("MMM D, YYYY")}`}
                  </Text>

                  <Progress value={progress} mt="md" size="sm" radius="xl" />
                  <Text size="xs" c="dimmed" mt={6}>
                    {progress}% completed
                  </Text>

                  <Group mt="sm" position="right">
                    <Button
                      size="xs"
                      variant="light"
                      color="red"
                      onClick={() => removeItem(habit.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => updateItem(habit.id, habit)}
                    >
                      Update
                    </Button>
                  </Group>
                </Card>
              );
            })
          )}
        </Stack>
      </ScrollArea>
    </Card>
  );
};



export { HabbitsList, HabbitsItem, DailyHabitView };
