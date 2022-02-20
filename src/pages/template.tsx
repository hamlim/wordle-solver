import React, { useState } from 'react'
import {
  Box,
  Text,
  Heading,
  Input,
  InlineCode,
  Button,
  List,
  ListItem,
  Banner,
  Stack,
} from '@ds-pack/components'
import Link from '../components/Link'
import words from '../lib/words'

let solverFunction = `
// list === word[]
// template === string
// excluded === character[]

let patterns = template.split('').map((char, idx) => [char !== '_' ? char : undefined, idx]).filter(pat => pat[0]);

return list.filter(word => {
  return excluded.every(char => !word.includes(char)) && patterns.every(pat => word[pat[1]] === pat[0])
})
`

function TemplateSolver() {
  let [template, setTemplate] = useState('_____')
  let [excluded, setExcluded] = useState('')
  let [err, setError] = useState(null)
  let [matched, setMatch] = useState(null)

  function run() {
    try {
      let func = new Function('list', 'template', 'excluded', solverFunction)
      let res = func(words, template, excluded.split(' ').filter(Boolean))
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
      <Box display="flex" alignItems="flex-end">
        <Input
          value={template}
          onChange={setTemplate}
          inputProps={{
            maxLength: 5,
          }}
          flexGrow={1}
        >
          <Box is="span">
            Template, use <InlineCode>_</InlineCode> (underscores) as
            placeholders:
          </Box>
        </Input>
        <Button ml="$4" onClick={() => setTemplate('_____')} variant="ghost">
          Reset
        </Button>
      </Box>
      <Input value={excluded} onChange={setExcluded}>
        Excluded: (in a space separated list)
      </Input>
      <Button onClick={run}>Run</Button>
    </Stack>
  )
}

export default function App() {
  return (
    <Box display="grid" gridTemplateRows="auto 2fr auto" flexGrow={1}>
      <Box is="header">
        <Heading is="h1" variant="h2" textAlign="center">
          Wordle Solver
        </Heading>
      </Box>
      <Box is="main">
        <TemplateSolver />
      </Box>
      <Box is="footer" py="$8">
        <Link href="/visual">Visual Solver</Link>
        <Box pr="$4" display="inline-block" />
        <Link href="/">Basic Solver</Link>
        <Box pr="$4" display="inline-block" />
        <Link href="/code">Code</Link>
        <Box pr="$4" display="inline-block" />
        <Link href="/about">About</Link>
      </Box>
    </Box>
  )
}
