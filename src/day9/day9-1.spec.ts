import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { toNumberOfVisitedByTailPositionsUsingRopeOfLength } from './visited-locations-by-tail'

const input = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`

describe('Day 9 challenge 1', () => {
  it('should calculate the number of visited locations by the tail', () => {
    expect(
      pipe(input, toNumberOfVisitedByTailPositionsUsingRopeOfLength(2)),
    ).toEqual(E.right(13))
  })
})
