import React, { useReducer, useState } from 'react'
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
// rows === char[][]
// excluded === character[]
// excludedPatterns === [character, position][]

let includedChars = rows.reduce((acc, row) => [...acc, ...row.filter(Boolean)], []);

return list.filter(word => {
  return (
    (first ? first.toLowerCase() === word[0] : true) &&
    (second ? second.toLowerCase() === word[1] : true) &&
    (third ? third.toLowerCase() === word[2] : true) &&
    (fourth ? fourth.toLowerCase() === word[3] : true) &&
    (fifth ? fifth.toLowerCase() === word[4] : true) &&
    rows.every(row => row.every((char, idx) => word[idx] !== char.toLowerCase())) &&
    includedChars.every(char => word.includes(char.toLowerCase())) &&
    excluded.every(char => !word.includes(char.toLowerCase()))
  )
})
`

function rowReducer(state, action) {
  switch (action.type) {
    case 'edit': {
      let { rowNum, charNum, char } = action
      return state.reduce(
        (accs: Array<Array<string>>, row: Array<string>, idx: number) => {
          if (rowNum === idx) {
            return [
              ...accs,
              row.map((ch: string, chIdx: number) => {
                if (chIdx === charNum) {
                  return char
                }
                return ch
              }),
            ]
          }
          return [...accs, row]
        },
        [],
      )
    }
  }
}

function Row({ row, rowNum, dispatch }) {
  return (
    <Box>
      Guess Number {rowNum + 1}:
      <Stack inline gap={5}>
        {row.map((char: string, idx: number) => (
          <Input
            key={idx}
            value={char}
            onChange={(newChar: string) =>
              dispatch({
                type: 'edit',
                rowNum,
                char: newChar,
                charNum: idx,
              })
            }
            inputProps={{ autoCapitalize: 'off' }}
          >
            <VisuallyHidden>Character:</VisuallyHidden>
          </Input>
        ))}
      </Stack>
    </Box>
  )
}

function VisualSolver() {
  let [firstCharacter, setFirstCharacter] = useState('')
  let [secondCharacter, setSecondCharacter] = useState('')
  let [thirdCharacter, setThirdCharacter] = useState('')
  let [fourthCharacter, setFourthCharacter] = useState('')
  let [fifthCharacter, setFifthCharacter] = useState('')
  let [excluded, setExcluded] = useState('')
  let [err, setError] = useState(null)
  let [matched, setMatch] = useState(null)

  let [rows, dispatch] = useReducer(rowReducer, [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ])

  function run() {
    try {
      let func = new Function(
        'list',
        'first',
        'second',
        'third',
        'fourth',
        'fifth',
        'rows',
        'excluded',
        template,
      )
      let res = func(
        words,
        firstCharacter,
        secondCharacter,
        thirdCharacter,
        fourthCharacter,
        fifthCharacter,
        rows,
        excluded.split(' ').filter(Boolean),
      )
      if (res.length === 0) {
        setError(new Error('No words found matching criteria!'))
        return
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
          An error occured!
          <Box ml={10} is="pre">
            "{err.message}"
          </Box>
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
      <Box>Green Characters:</Box>
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
      <Box>Yellow Characters:</Box>
      {rows.map((row, rowIdx) => (
        <Row row={row} key={rowIdx} rowNum={rowIdx} dispatch={dispatch} />
      ))}
      <Input
        value={excluded}
        onChange={setExcluded}
        inputProps={{ autoCapitalize: 'off' }}
      >
        Excluded (gray characters): (in a space separated list)
      </Input>
      <Button onClick={run}>Run</Button>
    </Stack>
  )
}

export default function App() {
  let [key, setKey] = useState(0)
  return (
    <Box display="grid" gridTemplateRows="auto 2fr auto" flexGrow={1}>
      <Box is="header">
        <Heading is="h1" variant="h2" textAlign="center">
          Wordle Solver
        </Heading>
      </Box>
      <Box is="main">
        <VisualSolver key={key} />
        <Box mt={4}>
          <Button variant="text" onClick={() => setKey(key + 1)}>
            Clear Board
          </Button>
        </Box>
      </Box>
      <Box is="footer" py="$8">
        <Link href="/">Basic Solver</Link>
        <Box pr="$4" display="inline-block" />
        <Link href="/template">Simplified Solver</Link>
        <Box pr="$4" display="inline-block" />
        <Link href="/code">Code</Link>
        <Box pr="$4" display="inline-block" />
        <Link href="/about">About</Link>
      </Box>
    </Box>
  )
}
