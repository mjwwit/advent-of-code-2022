import * as E from 'fp-ts/Either'
import { toCountOfOverlappingSectionAssignmentsWithinPairs } from './count-overlapping-section-assignments'

const input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`

describe('Day 4 challenge 2', () => {
  it('should count assignment pairs that have overlapping sections', () => {
    expect(toCountOfOverlappingSectionAssignmentsWithinPairs(input)).toEqual(
      E.right(4),
    )
  })
})
