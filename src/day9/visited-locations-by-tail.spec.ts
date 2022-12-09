import { pipe } from 'fp-ts/function'
import { toSegmentFollowedLeadingSegment } from './visited-locations-by-tail'

describe('Rope mechanics', () => {
  it('should work', () => {
    expect(pipe([3, 0], toSegmentFollowedLeadingSegment([4, 2]))).toEqual([
      4, 1,
    ])

    expect(pipe([2, 0], toSegmentFollowedLeadingSegment([4, 1]))).toEqual([
      3, 1,
    ])

    expect(pipe([1, 0], toSegmentFollowedLeadingSegment([3, 1]))).toEqual([
      2, 1,
    ])

    expect(pipe([0, 0], toSegmentFollowedLeadingSegment([2, 1]))).toEqual([
      1, 1,
    ])
  })
})
