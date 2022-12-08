import * as E from 'fp-ts/Either'
import { toVisibleTreeCount } from './count-visible-trees'

const input = `
30373
25512
65332
33549
35390
`

describe('Day 8 challenge 1', () => {
  it('should calculate the number of visible trees', () => {
    expect(toVisibleTreeCount(input)).toEqual(E.right(21))
  })
})
