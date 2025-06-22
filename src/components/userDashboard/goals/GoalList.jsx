import { Modal, Card, Text, Button, Group, Progress, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form'


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



const GoalCard = ({goal, onView, onComplete}) => {
  const total = goal.subgoals?.length || 1
  const done = goal.subgoals?.filter((s)=> s.completed).length;
  const percent = Math.round((done/total)* 100)
  return (
    <Card withBorder p='md' shadow='sm'>
      <Group position='apart'>
        <Text fw={500}>{goal.title}</Text>
        <Text size='sm'>{goal.targetDate}</Text>
       </Group>
       <Text size='sm' c='dimmed'>{goal.description}</Text>
       <Progress value={percent} mt='md'/>
       <Group >
        <Button size='xs' onClick={onView}>Details</Button>
        <Button size='xs' disabled={goal.completed} color={goal.completed? 'gray':'green'} onClick={onComplete}>
          {goal.completed ? 'Completed' : 'Mark as Completed'}
        </Button>
       </Group>

    </Card>
  )
}


const GoalsFilter = () => {
  return (
    <div>GoalsFilter</div>

  )

}
export { GoalForm,GoalsFilter,  GoalCard }
