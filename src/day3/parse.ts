import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import * as B from 'fp-ts/boolean'
import { flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { toErrorFromValidation } from '../common/validation-error'

const RUCKSACK_ITEM_TYPE_REGEX = /^[a-z]$/i
export interface RucksackItemTypeBrand {
  readonly RucksackItemType: unique symbol
}
export const RucksackItemType = t.brand(
  t.string,
  (input): input is t.Branded<string, RucksackItemTypeBrand> =>
    RUCKSACK_ITEM_TYPE_REGEX.test(input),
  'RucksackItemType',
)
export type RucksackItemType = t.Branded<string, RucksackItemTypeBrand>

const toVerifiedRucksackContentsSizesAreEven = flow(
  RA.map(RA.size),
  RA.every((n) => n % 2 === 0),
  B.match(
    () => E.left(new Error('Rucksack contents size should be even!')),
    () => E.right(true),
  ),
)

const splitInHalf = <A>(a: A[]) => pipe(a, RA.chunksOf(a.length / 2))

export const toParsedRucksackContents = flow(
  S.split('\n'),
  RA.filter(Boolean),
  RA.map(S.split('')),
  t.array(t.array(RucksackItemType)).decode,
  E.mapLeft(toErrorFromValidation('Invalid rucksack contents')),
  E.chainFirst(toVerifiedRucksackContentsSizesAreEven),
  E.map(RA.map(splitInHalf)),
  E.chain(
    flow(
      t.array(t.tuple([t.array(RucksackItemType), t.array(RucksackItemType)]))
        .decode,
      E.mapLeft(toErrorFromValidation('Invalid rucksack datastructure')),
    ),
  ),
)
