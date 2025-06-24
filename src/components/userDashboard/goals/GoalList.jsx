import { Modal, Card, Text, Button, Group, Progress, TextInput, Textarea, Stack, Checkbox, Divider } from '@mantine/core';
import { useForm } from '@mantine/form'
import { useState } from 'react';


const GoalForm = ({opened, onClose, onSubmit}) => {
  const form = useForm({
    mode:'uncontrolled',
    initialValues: {
      title: '',
      description: '',
      targetDate: '', // Assuming targetDate is a string in 'YYYY-MM-DD' format
    },
    validate: {
      title: (value) => (value.length < 2 ? 'Title must be at least 2 characters long' : null),
      description: (value) => (value.length < 5 ? 'Description must be at least 5 characters long' : null),
    },
  });
  return (<Modal opened={opened}
    onClose={onClose}
    title="Add New Goal"
    size="lg">
      <form onSubmit={form.onSubmit((values) => {
        onSubmit(values) ; form.reset(); onClose() })}>
        <TextInput type="text" mt={10} placeholder="Goal Title" label='Add Goal' required {...form.getInputProps('title')} />
        <Textarea placeholder="Goal Description" required label='Goal Description' mt={10} {...form.getInputProps('description')}/>
        <TextInput type="date" label="Target Date" {...form.getInputProps("targetDate")} />
        <Button type="submit" mt={10}>Create Goal</Button> 
      </form>
  </Modal>
    
  )
}



const GoalCard = ({goal,onAddSubgoal,onAddNote, onToggleSubgoal, onComplete}) => {
const subgoals = goal.subgoals || [];
const notes = goal.notes || [];

  const total = goal.subgoals?.length || 1
  const done = goal.subgoals?.filter((s)=> s.completed).length;
  const percent = Math.round((done/total)* 100)
  const [newSubgoal, setNewSubgoal] = useState(''); 
  const [newNote, setNewNote] = useState('');
  return (
    <Card withBorder p='md' shadow='sm' radius='md' my='md'>
      <Stack spacing='xs'>
        <Checkbox checked={goal.completed} onChange={onComplete} label={<Text>{goal.title}</Text>} />
        <Text size='sm' c='dimmed'>{goal.description}</Text>
        <Divider label="Subgoals" labelPosition="center" />
        </Stack>
      <Stack spacing='xs'>
          {subgoals?.length === 0 ? (
            <Text size='sm' c='dimmed'>No subgoals added yet.</Text>
          ) : (
            subgoals.map((subgoal) => (
              <Group key={subgoal.id} position="apart">
                <Text size='sm'>{subgoal.title}</Text>
                <Checkbox checked={subgoal.completed} onChange={() => onToggleSubgoal(subgoal.id)} />
              </Group>
            ))
          )}
          <TextInput
          placeholder='Add a subgoal'
          value={newSubgoal}
          onChange={(e)=>setNewSubgoal(e.target.value)}/>
          <Button onClick={() => { onAddSubgoal(newSubgoal); setNewSubgoal(''); }}>Add Subgoal</Button>
          <Divider label="Notes" labelPosition="center" />
          {goal.notes?.length === 0 ? (
            <Text size='sm' c='dimmed'>No notes added yet.</Text>
          ) : (
            goal.notes.map((note) => (
              <Text key={note.id} size='sm'>{note.content} <br />
              <i>{new Date(note.createdAt).toLocaleString()}</i>
              </Text>
              
            ))
          )}
          <TextInput placeholder='Add a Note ...' 
          value={newNote} onChange={(e)=>setNewNote(e.target.value)}/>

          <Button size='xs' color='gray' onClick={() => { onAddNote(newNote); setNewNote(''); }}>Add Note</Button>
        <Progress value={percent} size='sm' radius='xl' mt='md' />
      </Stack>
      
     

    </Card>
  )
}



export { GoalForm,  GoalCard }
