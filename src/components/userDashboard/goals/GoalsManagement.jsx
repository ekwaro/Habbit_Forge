import { useState } from "react";
import { GoalCard } from "./GoalList";
import { GoalForm } from "./GoalList";
import { Container, Stack, Button, Modal,Text } from "@mantine/core";
const GoalsManagement = () => {
  const [goals, setGoals] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const addGoal = (goal) => {
    setGoals([...goals, { ...goal, subgoal: [], notes: [], completed: false }]);
  };
 const markGoalAsompletev=(index)=>{
  const updatedGoals = [...goals];
  updatedGoals[index].completed = true;
  setGoals(updatedGoals);
 }
 const handleView=(goal)=>{
  setSelectedGoal(goal)
 }
  return (
    <Container>
      <Text size="xl" fw={700}>
        Goal Management
      </Text>
      <Button onClick={() => setFormOpen(true)}>Add Goal</Button>
      <GoalForm
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={addGoal}
      />
      <Stack mt="md">
        {goals.length === 0 ? (
          <Text>No Goals Yet</Text>
        ) : (
          goals.map((goal, index) => (
            <GoalCard
              key={index}
              goal={goal}
              onView={() => handleView(goal)}
              onComplete={() => markGoalAsompletev(index)}
            />
          ))
        )}
      </Stack>
      {/**Goal detail Modal */}
      <Modal
        opened={!!selectedGoal}
        onClose={() => setSelectedGoal(null)}
        title="Goal Details"
        size="lg">
        {selectedGoal && (
          <Stack>
            <Text size="lg" fw={500}>
              {selectedGoal.title}
            </Text>
            <Text size="sm" c="dimmed">
              {selectedGoal.description}
            </Text>
            <Text size="sm">Target Date: {selectedGoal.targetDate}</Text>
            <Text size="sm">Subgoals:</Text>
            {selectedGoal.subgoals?.length === 0 ? (
              <Text>No subgoals added yet.</Text>
            ) : (
              selectedGoal.subgoals?.map((subgoal, index) => (
                <Text key={index} size="sm">
                  - {subgoal.title} ({subgoal.completed ?  '✔': '✖'})
                </Text>
              ))
            )}
          </Stack>
        )}

        </Modal>
    </Container>
  );
};

export default GoalsManagement;
