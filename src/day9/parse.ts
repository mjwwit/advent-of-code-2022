import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import { flow } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { IntFromString } from 'io-ts-types'
import { toErrorFromValidation } from '../common/validation-error'

export const Direction = t.union(
  [t.literal('U'), t.literal('R'), t.literal('D'), t.literal('L')],
  'Direction',
)
export type Direction = t.TypeOf<typeof Direction>

export type Motion = [Direction, t.Int]

export const toParsedMotions = flow(
  S.split('\n'),
  RA.filter(Boolean),
  RA.map(S.split(' ')),
  t.array(t.tuple([Direction, IntFromString])).decode,
  E.mapLeft(toErrorFromValidation('Invalid input')),
)
