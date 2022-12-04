import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import { pipe } from 'fp-ts/function'
import { PairSectionAssignments, toParsedPairSectionAssignments } from './parse'

export const toCountOfOverlappingSectionAssignmentsWithinPairs = (
  input: string,
) =>
  pipe(
    input,
    I.map(toParsedPairSectionAssignments),
    E.map(A.filter(isOverlappingSectionAssignmentPair)),
    E.map(A.size),
  )

const isOverlappingSectionAssignmentPair = ([
  [l1, u1],
  [l2, u2],
]: PairSectionAssignments) => l1 <= u2 && l2 <= u1
