import * as E from 'fp-ts/Either'
import { toSumOfWronglyPackedItemPrioritiesFromRucksackContents } from './sum-wrongly-packed-item-priorities'

const input = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`

describe('Day 3 challenge 1', () => {
  it('should sum wrongly packed rucksack item type priorities', () => {
    expect(
      toSumOfWronglyPackedItemPrioritiesFromRucksackContents(input),
    ).toEqual(E.right(157))
  })
})
