import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { identity, pipe } from 'fp-ts/function'
import { toSumFromNumbers } from '../common/sum'
import { rucksackItemTypeToPriorityMap } from './item-type-priority'
import { RucksackItemType, toParsedRucksackContents } from './parse'

export const toSumOfWronglyPackedItemPrioritiesFromRucksackContents = (
  input: string,
) =>
  pipe(
    input,
    toParsedRucksackContents,
    E.map(RA.map(findFirstCommonItemTypeInRucksackCompartments)),
    E.map(RA.filterMap(identity)),
    E.map(RA.map((itemType) => rucksackItemTypeToPriorityMap[itemType])),
    E.map(toSumFromNumbers),
  )

const findFirstCommonItemTypeInRucksackCompartments = ([left, right]: [
  RucksackItemType[],
  RucksackItemType[],
]) =>
  pipe(
    left,
    RA.findFirst((l) =>
      pipe(
        right,
        RA.findIndex((r) => l === r),
        O.isSome,
      ),
    ),
  )
