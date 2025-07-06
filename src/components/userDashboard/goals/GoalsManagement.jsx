import { useState } from "react";
import { GoalCard } from "./GoalList";
import { GoalForm } from "./GoalList";
import { Container, Stack, Button, Modal,Text, Loader } from "@mantine/core";
import useGoalsStorge from './utils/goalStrapi'
 const STRAPI_AUTH_TOKEN = import.meta.env.VITE_STRAPI_AUTH_TOKEN
 import { useDisclosure } from "@mantine/hooks";


const GoalsManagement = () => {
   const [opened, {open, close}] = useDisclosure(false)
const {goals,addGoal,addNote,loading, addSubgoal ,deleteGoal, markGoalsAsComplete,removeGoals,deleteNotes,deleteSubgoals, toggleSubgoalCompletion} = useGoalsStorge(STRAPI_AUTH_TOKEN)

  const [formOpen, setFormOpen] = useState(false);
   console.log(goals.data)

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
        {goals.data?.length === 0 ? (
          <Text>No Goals Yet</Text>
        ) : (
          goals.data?.map((goal) => (
            loading?<Loader/>:
            <GoalCard
              mykey={goal.id}
              goal={goal}
         
              onMarkGoalAsCompleted={(checked) => markGoalsAsComplete(goal.documentId, checked)}
              onToggleSubgoal={(subgoalId) => toggleSubgoalCompletion(goal.documentId, subgoalId)}
              onAddSubgoal={(subgoalTitle) =>
                addSubgoal(goal.documentId, subgoalTitle)
              }
              onDeleteNotes = {(deletenotesId)=>deleteNotes(goal.documentId, deletenotesId)}
              onDeleteSubgoals = {(subgoalsId)=>deleteSubgoals(goal.documentId, subgoalsId)}
              onAddNote={(note) => addNote(goal.documentId, note)}
              onremoveGoal={()=>deleteGoal(goal.documentId)}
            />
          ))
        )}
      </Stack>
      {goals.data?.length === 0 ? null : <Button onClick={removeGoals}>clear all</Button> }
     
      {/**Goal detail Modal */}
      
    </Container>
  );
};

export default GoalsManagement;
