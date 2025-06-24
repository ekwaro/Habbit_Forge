import React from "react";

import { Card, Center, Container,Text, Loader, Stack, Title, Button } from "@mantine/core";
import useTip from "./tipsutil";
const Tips = () => {
  const {tip, loading, error, fetchtip} = useTip()
 if(tip){
  console.log(tip)
 }
  return (
    <Container size="sm" py="xl">
      <Stack align="center" spacing="md">
        <Title order={2}>Daily Tip</Title>
        {loading ? (
          <Center>
            <Loader />
          </Center>
        ) : error ? (
          <Text c="red">{error}</Text>
        ) : (
          <Card shadow='md'padding='lg' radius='md' withBorder>
            {tip?.length > 0 ? (
  <Text>{tip[0].q}</Text>
) : (
  <Text color="dimmed">No tips available.</Text>
)}

          </Card>
        )}
        <Button onClick={fetchtip} mt='md'>Get New Tip</Button>
      </Stack>
    </Container>
  );
};

export default Tips;
