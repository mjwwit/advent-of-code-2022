import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import * as B from 'fp-ts/boolean'
import { flow } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { IntFromString } from 'io-ts-types'
import { toErrorFromValidation } from '../common/validation-error'

export const SectionRange = t.tuple(
  [IntFromString, IntFromString],
  'SectionRange',
)
export type SectionRange = t.TypeOf<typeof SectionRange>

export const PairSectionAssignments = t.tuple(
  [SectionRange, SectionRange],
  'PairSectionAssignments',
)
export type PairSectionAssignments = t.TypeOf<typeof PairSectionAssignments>

export const toParsedPairSectionAssignments = flow(
  S.split('\n'),
  RA.filter(Boolean),
  RA.map(S.split(',')),
  RA.map(RA.map(S.split('-'))),
  t.array(PairSectionAssignments).decode,
  E.mapLeft(toErrorFromValidation('Invalid pair section assignment')),
  E.chainFirst(
    flow(
      A.every(([[l1, u1], [l2, u2]]) => l1 <= u1 && l2 <= u2),
      B.match(
        () =>
          E.left(
            new Error(
              'Found section range where the lower bound is higher than the upper bound',
            ),
          ),
        () => E.right(true),
      ),
    ),
  ),
)
