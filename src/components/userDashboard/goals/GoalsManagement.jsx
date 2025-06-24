import { useState } from "react";
import { GoalCard } from "./GoalList";
import { GoalForm } from "./GoalList";
import { Container, Stack, Button, Modal,Text } from "@mantine/core";
import useLocalStorageGoals from "./utils/goalStorage";

const GoalsManagement = () => {
  const { addGoals, goals,removeGoals, markGoalAsComplete,addSubgoal, addNote, toggleSubgoalCompletion, } = useLocalStorageGoals();

  const [formOpen, setFormOpen] = useState(false);

  return (
    <Container>
      <Text size="xl" fw={700}>
        Goal Management
      </Text>
      <Button onClick={() => setFormOpen(true)}>Add Goal</Button>
      <GoalForm
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={addGoals}
      />
      <Stack mt="md">
        {goals?.length === 0 ? (
          <Text>No Goals Yet</Text>
        ) : (
          goals?.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
         
              onComplete={() => markGoalAsComplete(goal.id)}
              onToggleSubgoal={(subgoalId) => toggleSubgoalCompletion(goal.id, subgoalId)}
              onAddSubgoal={(subgoalTitle) =>
                addSubgoal(goal.id, subgoalTitle)
              }
              onAddNote={(note) => addNote(goal.id, note)}
              onremoveGoal={removeGoals}
            />
          ))
        )}
      </Stack>
      {goals?.length == 0 ? null : <Button onClick={removeGoals}>clear all</Button> }
     
      {/**Goal detail Modal */}
      
    </Container>
  );
};

export default GoalsManagement;
