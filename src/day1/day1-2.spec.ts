import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import { pipe } from 'fp-ts/function'
import { toSumOfTop3HighestCalories } from './top3-calories-sum'

const input = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
`

describe('Day 1 challenge 2', () => {
  it('should correctly calculate how many calories the top 3 elves with the most calories are carrying', () => {
    expect(pipe(input, I.map(toSumOfTop3HighestCalories))).toEqual(
      E.right(45000),
    )
  })
})
