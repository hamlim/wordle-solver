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
  VisuallyHidden,
} from '@ds-pack/components'
import Link from '../components/Link'
import words from '../lib/words'

let template = `
// list === word[]
// first === character
// second === character
// third === character
// fourth === character
// fifth === character
// excluded === character[]
// included === character[]
// excludedPatterns === [character, position][]

return list.filter(word => {
  return (
    (first && first === word[0]) &&
    (second && second === word[1]) &&
    (third && third === word[2]) &&
    (fourth && fourth === word[3]) &&
    (fifth && fifth === word[4]) &&
    excluded.every(char => !word.includes(char)) &&
    included.every(pat => word.includes(char)) &&
    excludedPatterns.every(pat => word[pat[1]] !== pat[0])
  )
})
`

function VisualSolver() {
  let [firstCharacter, setFirstCharacter] = useState('')
  let [secondCharacter, setSecondCharacter] = useState('')
  let [thirdCharacter, setThirdCharacter] = useState('')
  let [fourthCharacter, setFourthCharacter] = useState('')
  let [fifthCharacter, setFifthCharacter] = useState('')
  let [excluded, setExcluded] = useState('')
  let [included, setIncluded] = useState('')
  let [excludedPatterns, setExcludedPatterns] = useState('')
  let [err, setError] = useState(null)
  let [matched, setMatch] = useState(null)

  function run() {
    try {
      let func = new Function(
        'list',
        'first',
        'second',
        'third',
        'fourth',
        'fifth',
        'excluded',
        'included',
        'excludedPatterns',
        template,
      )
      let res = func(
        words,
        firstCharacter,
        secondCharacter,
        thirdCharacter,
        fourthCharacter,
        fifthCharacter,
        excluded.split(' ').filter(Boolean),
        included.split(' ').filter(Boolean),
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
      <Box>Locked in Characters:</Box>
      <Stack gap="$4" inline>
        <Input
          value={firstCharacter}
          onChange={setFirstCharacter}
          inputProps={{ autoCapitalize: 'off' }}
        >
          <VisuallyHidden>First Character:</VisuallyHidden>
        </Input>
        <Input
          value={secondCharacter}
          onChange={setSecondCharacter}
          inputProps={{ autoCapitalize: 'off' }}
        >
          <VisuallyHidden>Second Character:</VisuallyHidden>
        </Input>
        <Input
          value={thirdCharacter}
          onChange={setThirdCharacter}
          inputProps={{ autoCapitalize: 'off' }}
        >
          <VisuallyHidden>Third Character:</VisuallyHidden>
        </Input>
        <Input
          value={fourthCharacter}
          onChange={setFourthCharacter}
          inputProps={{ autoCapitalize: 'off' }}
        >
          <VisuallyHidden>Fourth Character:</VisuallyHidden>
        </Input>
        <Input
          value={fifthCharacter}
          onChange={setFifthCharacter}
          inputProps={{ autoCapitalize: 'off' }}
        >
          <VisuallyHidden>Fifth Character:</VisuallyHidden>
        </Input>
      </Stack>
      <Input
        value={excluded}
        onChange={setExcluded}
        inputProps={{ autoCapitalize: 'off' }}
      >
        Excluded: (in a space separated list)
      </Input>
      <Input
        value={included}
        onChange={setIncluded}
        inputProps={{ autoCapitalize: 'off' }}
      >
        <Box is="span">Included characters (yellow and green characters):</Box>
      </Input>
      <Input
        value={excludedPatterns}
        onChange={setExcludedPatterns}
        inputProps={{ autoCapitalize: 'off' }}
      >
        <Box is="span">
          Positions of yellow characters (in the format of{' '}
          <InlineCode display="inline-flex">a,3 b,2</InlineCode>, position is
          0-indexed):
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
