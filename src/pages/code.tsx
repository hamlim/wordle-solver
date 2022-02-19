import React, { useState } from 'react'
import words from '../lib/words'
import {
  Box,
  Text,
  Heading,
  Textarea,
  Button,
  List,
  ListItem,
  Banner,
  Stack,
} from '@ds-pack/components'
import Link from '../components/Link'

function Editor() {
  let [code, setCode] = useState(
    `// \`list\` is an array of words that are valid!
return list.filter(word => word.startsWith('a'));`,
  )
  let [err, setError] = useState(null)
  let [matched, setMatch] = useState(null)

  function run() {
    try {
      let func = new Function('list', code)
      let res = func(words)
      setMatch(res)
    } catch (e) {
      setError(e)
    }
  }
  return (
    <Stack gap="$4">
      {err ? (
        <Banner variant="error">
          An error occured, check your code!{' '}
          <Button variant="text" onClick={() => setError(null)}>
            Clear
          </Button>
        </Banner>
      ) : null}
      {matched ? (
        <>
          <Box display="flex" justifyContent="space-between">
            <Text fontWeight="bold">Matched:</Text>
            <Button variant="text" onClick={() => setMatch(null)}>
              Clear
            </Button>
          </Box>
          <List variant="ul">
            {matched.map((word) => (
              <ListItem key={word}>{word}</ListItem>
            ))}
          </List>
        </>
      ) : null}
      <Textarea minHeight={500} value={code} onChange={setCode}>
        Code:
      </Textarea>
      <Button onClick={run}>Run</Button>
    </Stack>
  )
}

export default function Code() {
  return (
    <Box display="grid" gridTemplateRows="auto 2fr auto" flexGrow={1}>
      <Box is="header">
        <Heading is="h1" variant="h1" textAlign="center">
          Wordle Solver
        </Heading>
      </Box>
      <Box is="main">
        <Editor />
      </Box>
      <Box is="footer" py="$8">
        <Link href="/visual">Visual Solver</Link>
        <Box pr="$4" display="inline-block" />
        <Link href="/">Basic Solver</Link>
        <Box pr="$4" display="inline-block" />
        <Link href="/template">Simplified Solver</Link>
        <Box pr="$4" display="inline-block" />
        <Link href="/about">About</Link>
      </Box>
    </Box>
  )
}
