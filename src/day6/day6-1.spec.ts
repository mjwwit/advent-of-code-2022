import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { toIndexAfterFirstStartOfPacketMarker } from './start-of-packet-marker'

const inputs = [
  { input: 'mjqjpqmgbljsphdztnvjfqwrcgsmlb', solution: 7 },
  { input: 'bvwbjplbgvbhsrlpgdmjqwftvncz', solution: 5 },
  { input: 'nppdvjthqldpwncqszvftbrmjlhg', solution: 6 },
  { input: 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', solution: 10 },
  { input: 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', solution: 11 },
]

describe('Day 6 challenge 1', () => {
  it.each(inputs)(
    'should calculate the index after the first start-of-packet marker',
    ({ input, solution }) => {
      expect(toIndexAfterFirstStartOfPacketMarker(input)).toEqual(
        E.right(O.some(solution)),
      )
    },
  )
})
