import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { toLengthOfShortestPathFromStartToGoal } from './shortest-path'

const input = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`

describe('Day 12 challenge 1', () => {
  it('should calculate the length of the shortest path from start to goal', () => {
    expect(pipe(input, toLengthOfShortestPathFromStartToGoal)).toEqual(
      E.right(31),
    )
  })
})
