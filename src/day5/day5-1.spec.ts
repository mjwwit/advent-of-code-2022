import * as E from 'fp-ts/Either'
import { toTopCratesAfterRearrangingOneAtATime } from './top-crates-after-rearrangement'

const input = `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`

describe('Day 5 challenge 1', () => {
  it('should determine the top crates for each stack after rearrangement by moving one by one', () => {
    expect(toTopCratesAfterRearrangingOneAtATime(input)).toEqual(E.right('CMZ'))
  })
})
