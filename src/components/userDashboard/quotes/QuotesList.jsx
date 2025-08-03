import{ Box, Card, Text, Anchor, Badge} from '@mantine/core'

const QuoteList = ({ quotes }) => (
  <Box>
    {quotes.length ===0?<Text color="dimmed" align="center">
          No quotes available.
        </Text>:quotes?.map((quote) => (
      <QuoteCard key={quote.id} quote={quote} />
    ))}
    
  </Box>
);

const QuoteCard = ({ quote }) => (
  <Card shadow="sm" mb="sm" p="md" radius="md">
    <Text size="lg" italic>"{quote.text}"</Text>
    <Text size="sm" c="dimmed">- {quote.author}</Text>
    {quote?.source && (
      <Text size="xs">Source: {quote.source}</Text>
    )}
  </Card>
);

const ResourceList = ({ resources }) => (
  <Box>
    
    {resources.length ===0 ?<Text align='center' c='dimmed'>No resources available</Text>:resources?.map((resource) => (
      <Card key={resource.id} withBorder radius="md" mb="sm">
        <Group position="apart">
          <Text weight={600}>{resource.name}</Text>
          <Badge>{resource.attributes.type}</Badge>
        </Group>
        <Text size="sm" c="dimmed" my={4}>{resource.name}</Text>
        <Anchor href={resource.link} target="_blank" c="blue">
          Visit Resource
        </Anchor>
      </Card>
    ))}
  </Box>
);

export {QuoteList, ResourceList}