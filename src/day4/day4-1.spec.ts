import * as E from 'fp-ts/Either'
import { toCountOfFullyContainedSectionAssignmentsWithinPairs } from './count-fully-contained-section-assignments'

const input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`

describe('Day 4 challenge 1', () => {
  it('should count assignment pairs where one section range is fully contained within the other', () => {
    expect(toCountOfFullyContainedSectionAssignmentsWithinPairs(input)).toEqual(
      E.right(2),
    )
  })
})
