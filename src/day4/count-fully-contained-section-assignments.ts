import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import { pipe } from 'fp-ts/function'
import { PairSectionAssignments, toParsedPairSectionAssignments } from './parse'

export const toCountOfFullyContainedSectionAssignmentsWithinPairs = (
  input: string,
) =>
  pipe(
    input,
    I.map(toParsedPairSectionAssignments),
    E.map(A.filter(isFullyContainedSectionAssignmentPair)),
    E.map(A.size),
  )

const isFullyContainedSectionAssignmentPair = ([
  [l1, u1],
  [l2, u2],
]: PairSectionAssignments) => (l1 >= l2 && u1 <= u2) || (l2 >= l1 && u2 <= u1)
