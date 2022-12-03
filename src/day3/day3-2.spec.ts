import * as E from 'fp-ts/Either'
import { toSumOfElfGroupBadgeTypePriorities } from './sum-elf-group-badge-priorities'

const input = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`

describe('Day 3 challenge 2', () => {
  it('should sum the priority of the badge types for all elf groups', () => {
    expect(toSumOfElfGroupBadgeTypePriorities(input)).toEqual(E.right(70))
  })
})
