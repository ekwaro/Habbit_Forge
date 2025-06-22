import {
  Button,
  Text,
  Table,
  Card,
  Group,
  Badge,
  ScrollArea,
  Stack,
  Checkbox,
  Progress,
  Container,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { DatePicker } from "@mantine/dates";
import { LineChart } from "@mantine/charts";
import { useEffect } from "react";
import useLocalStorage from "../useLocalStorage";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  isTodayMatchingFrequency,
  getHabitProgress,
} from "./utils/TodaysHabit";
import { buildChartData } from "./utils/LineChart";
import { useMemo } from "react";
const HabbitsList = ({ list, removeItem, updateItem }) => {
  const navigate = useNavigate();
  const rows = list.map((habit) => (
    <Table.Tr key={habit.id }>
      <Table.Td>{habit.habitName}</Table.Td>
      <Table.Td>{habit.frequency}</Table.Td>
      <Table.Td>{new Date(habit.startDate).toLocaleDateString()}</Table.Td>
      <Table.Td>{new Date(habit.endDate).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Button
          size="xs"
          variant="outline"
          color="red"
          mr={5}
          onClick={() => removeItem(habit)}
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
          onClick={() => updateItem(habit.id, habit)}
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
            <Table.Th>Habit Name</Table.Th>
            <Table.Th>Frequency</Table.Th>
            <Table.Th>Start Date</Table.Th>
            <Table.Th>End Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      
    </>
  );
};

const HabbitsItem = () => {
  const { list } = useLocalStorage("habitData", []);
  const params = useParams();
  const habit = list.find((habit) => habit.id.toString() === params.id);
  console.log(params, habit);
  return (
    <>
      <Card withBorder shadow="sm" p="lg" my="md">
        <Group position="apart" mb="xs">
          <Text weight={500}>Habit Details</Text>
        </Group>
        {!habit ? (
          <Text color="dimmed">Habit not found.</Text>
        ) : (
          <Stack>
            <Text size="lg" fw={500}>
              {habit.habitName}
            </Text>
            <Text>Frequency: {habit.frequency}</Text>
            <Text>
              Start Date: {dayjs(habit.startDate).format("MMM D, YYYY")}
            </Text>
            <Text>End Date: {dayjs(habit.endDate).format("MMM D, YYYY")}</Text>
          </Stack>
        )}
        <Group justify="space-between" mt="md">
          <Card mt={20} withBorder shadow="sm" p="lg" style={{ flex: 1, minWidth: 300, maxWidth: 600 }}>
            <LineChart
              mt={20}
              h={300}
              data={buildChartData(habit)}
              title="Habit Completion Over Time"
              xAxisLabel="Date"
              curveType="monotone"
              yAxisLabel="Completed"
              margin={{ top: 20, right: 20, bottom: 20, left: 50 }}
              xAxisFormatter={(value) => dayjs(value).format("MMM D")}
              yAxisFormatter={(value) => (value ? "Yes" : "No")}
              dataKey="date"
              series={[{ name: "Completed", color: "teal" }]}
            />
          </Card>
          <Card mt={20} withBorder shadow="sm" p="lg" style={{ flex: 1, minWidth: 200, maxWidth: 300 }}>
            <HabitCalenderView habit={habit} />
          </Card>
        </Group>
      </Card>
    </>
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
                variant='transparent'
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
  useEffect(() => {
  const now = dayjs();

  list.forEach((habit) => {
    if (!habit.reminderTime || !isTodayMatchingFrequency(habit)) return;

    const [hour, minute] = habit.reminderTime.split(":").map(Number);
    const reminderTime = dayjs().hour(hour).minute(minute).second(0);

    const delay = reminderTime.diff(now);

    if (delay > 0) {
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(`⏰ Habit Reminder`, {
            body: `Don't forget to do "${habit.habitName}" today!`,
          });
        }
      }, delay);
    }
  });
}, [list]);

  const todayStr = dayjs().format("YYYY-MM-DD");
  // This component can be used to display a detailed view of a daily habit
  // It can include progress indicators, notes, and other relevant information
  const isTodayInRange = (startDate, endDate) => {
    const today = dayjs(new Date()).startOf("day");
    console.log(today, dayjs(startDate), endDate);
    return dayjs(startDate) <= today && today <= dayjs(endDate);
  };
  const getTodaysHabit = (habits) =>
    habits
      .filter((habit) => isTodayMatchingFrequency(habit))
      .filter((habit) => isTodayInRange(habit.startDate, habit.endDate));
  const todaysHabbit = useMemo(() => getTodaysHabit(list), [list]);
  console.log("Today's Habits:", todaysHabbit);
  console.log(list);

  const markHabbitComplete = (index) => {
    const today = dayjs().format("YYYY-MM-DD");
    const habit = list[index];
    const alreadyCompleted = habit.completedDates?.includes(today);

    const updatedHabit = {
      ...habit,
      completedDates: alreadyCompleted
        ? habit.completedDates.filter((date) => date !== todayStr)
        : [...(habit.completedDates || []), today],
    };
    updateItem(index, updatedHabit);
  };
  return (
    <Card withBorder shadow="sm" p="lg" my="md">
      <Group position="apart" mb="xs">
        <Text weight={500}>Today's Habit</Text>
        <Text>{dayjs().format("dddd, MMM D")}</Text>
      </Group>
      <ScrollArea h={350}>
        <Stack>
          {todaysHabbit.length === 0 ? (
            <Text>("No daily habits for today.")</Text>
          ) : (
            todaysHabbit.map((habit, index) => {
              const progress = getHabitProgress(habit);
              const isCompleted = habit.completedDates?.includes(todayStr);
              return (
                <Card
                  withBorder
                  shadow="sm"
                  p="lg"
                  key={index}
                  style={{
                    backgroundColor: isCompleted ? "#d4edda" : "#f8d7da",
                  }}
                >
                  <Group position="apart" mb="xs">
                    <Checkbox
                      label={habit.habitName}
                      checked={habit.completedDates?.includes(todayStr)}
                      onChange={() => markHabbitComplete(index)}
                    />
                    <Badge color="teal" variant="light">
                      {habit.frequency}
                    </Badge>
                  </Group>
                  <Text size="sm" mt="xs" c="dimmed">
                    {`Start: ${dayjs(habit.startDate).format(
                      "MMM D, YYYY"
                    )} | End: ${dayjs(habit.endDate).format("MMM D, YYYY")}`}
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
                      onClick={() => removeItem(index)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => updateItem(index, habit)}
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
