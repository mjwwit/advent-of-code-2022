import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { toLengthOfBestPathToGoal } from './best-path'

const input = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`

describe('Day 12 challenge 2', () => {
  it('should calculate the length of the best path to the goal', () => {
    expect(pipe(input, toLengthOfBestPathToGoal)).toEqual(E.right(29))
  })
})
