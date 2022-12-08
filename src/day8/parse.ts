import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import * as B from 'fp-ts/boolean'
import { flow } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { IntFromString } from 'io-ts-types'
import { toErrorFromValidation } from '../common/validation-error'

export const toParsedTreeHeightGrid = flow(
  S.split('\n'),
  RA.filter(Boolean),
  RA.map(S.split('')),
  t.array(t.array(IntFromString)).decode,
  E.mapLeft(toErrorFromValidation('Invalid input')),
  E.chainFirst(
    flow(
      RA.map(RA.size),
      RA.uniq(N.Eq),
      RA.size,
      (size) => size === 1,
      B.match(
        () =>
          E.left(new Error('Every input grid row should have the same length')),
        () => E.right(undefined),
      ),
    ),
  ),
  E.map(RA.toArray),
)
