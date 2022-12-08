import * as E from 'fp-ts/Either'
import { toMaximumScenicScoreForTrees } from './max-scenic-score'

const input = `
30373
25512
65332
33549
35390
`

describe('Day 8 challenge 2', () => {
  it('should calculate the maximum scenic score of all trees', () => {
    expect(toMaximumScenicScoreForTrees(input)).toEqual(E.right(8))
  })
})
