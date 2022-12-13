import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import { flow } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { toErrorFromValidation } from '../common/validation-error'

export const toParsedRawHeightMap = flow(
  S.split('\n'),
  RA.filter(Boolean),
  RA.map(S.split('')),
  t.array(t.array(t.string)).decode,
  E.mapLeft(toErrorFromValidation('Invalid input')),
)
