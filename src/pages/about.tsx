import React from 'react'
import { Stack, Text, Heading } from '@ds-pack/components'
import Link from '../components/Link'

export default function App() {
  return (
    <Stack
      gap="$4"
      flexGrow={1}
      maxWidth={{
        _: '95vw',
        1000: '50vw',
      }}
      margin="0 auto"
    >
      <Heading is="h1" variant="h2" textAlign="center">
        About Wordle Solver:
      </Heading>
      <Text>
        This site is meant to be a quick and easy way for you to
        programmatically narrow down the possible answer to the Wordle challenge
        of the day!
      </Text>
      <Text>
        <Link href="/">Back</Link>
      </Text>
    </Stack>
  )
}
