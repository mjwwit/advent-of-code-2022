import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import { flow } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { NumberFromString } from 'io-ts-types'
import { toErrorFromValidation } from '../common/validation-error'

export const toParsedCalorieCounts = flow(
  S.split('\n\n'),
  RA.map(S.split('\n')),
  RA.map(RA.filter(Boolean)),
  t.array(t.array(t.string.pipe(NumberFromString))).decode,
  E.mapLeft(toErrorFromValidation('Invalid number in list of calories')),
)
