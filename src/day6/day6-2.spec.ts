import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { toIndexAfterFirstStartOfMessageMarker } from './start-of-message-marker'

const inputs = [
  { input: 'mjqjpqmgbljsphdztnvjfqwrcgsmlb', solution: 19 },
  { input: 'bvwbjplbgvbhsrlpgdmjqwftvncz', solution: 23 },
  { input: 'nppdvjthqldpwncqszvftbrmjlhg', solution: 23 },
  { input: 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', solution: 29 },
  { input: 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', solution: 26 },
]

describe('Day 6 challenge 2', () => {
  it.each(inputs)(
    'should calculate the index after the first start-of-message marker',
    ({ input, solution }) => {
      expect(toIndexAfterFirstStartOfMessageMarker(input)).toEqual(
        E.right(O.some(solution)),
      )
    },
  )
})
