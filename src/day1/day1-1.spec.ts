import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import { pipe } from 'fp-ts/function'
import { toMostCaloriesCarriedBySingleElf } from './most-calories'

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

describe('Day 1 challenge 1', () => {
  it('should correctly calculate how many calories the elf with the most calories is carrying', () => {
    expect(pipe(input, I.map(toMostCaloriesCarriedBySingleElf))).toEqual(
      E.right(24000),
    )
  })
})
