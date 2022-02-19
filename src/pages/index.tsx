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

let template = `
// list === word[]
// included === character[]
// excluded === character[]
// patterns === [character, position][]
// excludedPatterns === [character, position][]

return list.filter(word => {
  return (
    included.every(char => word.includes(char)) &&
    excluded.every(char => !word.includes(char)) &&
    patterns.every(pat => word[pat[1]] === pat[0]) &&
    excludedPatterns.every(pat => word[pat[1]] !== pat[0])
  )
})
`

function VisualSolver() {
  let [included, setIncluded] = useState('')
  let [excluded, setExcluded] = useState('')
  let [patterns, setPatterns] = useState('')
  let [excludedPatterns, setExcludedPatterns] = useState('')
  let [err, setError] = useState(null)
  let [matched, setMatch] = useState(null)

  function run() {
    try {
      let func = new Function(
        'list',
        'included',
        'excluded',
        'patterns',
        'excludedPatterns',
        template,
      )
      let res = func(
        words,
        included.split(' ').filter(Boolean),
        excluded.split(' ').filter(Boolean),
        patterns
          .split(' ')
          .filter(Boolean)
          .map((pat) => pat.split(',')),
        excludedPatterns
          .split(' ')
          .filter(Boolean)
          .map((pat) => pat.split(',')),
      )
      if (res.length === 0) {
        setError('Error')
      }
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
          <Button ml={10} variant="text" onClick={() => setError(null)}>
            Clear
          </Button>
        </Banner>
      ) : null}
      {matched ? (
        <>
          <Box display="flex" justifyContent="space-between">
            <Text fontWeight="bold">Matched:</Text>
            <Button variant="text" onClick={() => setMatch(null)}>
              Clear Suggestions
            </Button>
          </Box>
          <List variant="ul">
            {matched.map((word) => (
              <ListItem key={word}>{word}</ListItem>
            ))}
          </List>
        </>
      ) : null}
      <Input
        value={included}
        onChange={setIncluded}
        inputProps={{ autoCapitalize: 'off' }}
      >
        Included: (in a space separated list)
      </Input>
      <Input
        value={excluded}
        onChange={setExcluded}
        inputProps={{ autoCapitalize: 'off' }}
      >
        Excluded: (in a space separated list)
      </Input>
      <Input
        value={patterns}
        onChange={setPatterns}
        inputProps={{ autoCapitalize: 'off' }}
      >
        <Box is="span">
          Positions: (in the format of{' '}
          <InlineCode display="inline-flex">a,3 b,2</InlineCode>, position is
          0-indexed)
        </Box>
      </Input>
      <Input
        value={excludedPatterns}
        onChange={setExcludedPatterns}
        inputProps={{ autoCapitalize: 'off' }}
      >
        <Box is="span">
          Excluded Positions - e.g. characters in the word but in the wrong
          place: (in the format of{' '}
          <InlineCode display="inline-flex">a,3 b,2</InlineCode>, position is
          0-indexed)
        </Box>
      </Input>
      <Button onClick={run}>Run</Button>
    </Stack>
  )
}

export default function App() {
  return (
    <Box display="grid" gridTemplateRows="auto 2fr auto" flexGrow={1}>
      <Box is="header">
        <Heading is="h1" variant="h1" textAlign="center">
          Wordle Solver
        </Heading>
      </Box>
      <Box is="main">
        <VisualSolver />
      </Box>
      <Box is="footer" py="$8">
        <Link href="/template">Simplified Solver</Link>
        <Box pr="$4" display="inline-block" />
        <Link href="/code">Code</Link>
        <Box pr="$4" display="inline-block" />
        <Link href="/about">About</Link>
      </Box>
    </Box>
  )
}
