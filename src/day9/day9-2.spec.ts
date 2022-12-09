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

const largerInput = `
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`

describe('Day 9 challenge 2', () => {
  it('should calculate the number of visited locations by the tail', () => {
    expect(
      pipe(input, toNumberOfVisitedByTailPositionsUsingRopeOfLength(10)),
    ).toEqual(E.right(1))
  })

  it('should calculate the number of visited locations by the tail using a bigger input', () => {
    expect(
      pipe(largerInput, toNumberOfVisitedByTailPositionsUsingRopeOfLength(10)),
    ).toEqual(E.right(36))
  })
})
