import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import { flow, identity, pipe } from 'fp-ts/function'
import { toSumFromNumbers } from '../common/sum'
import { rucksackItemTypeToPriorityMap } from './item-type-priority'
import { RucksackItemType, toParsedRucksackContents } from './parse'

export const toSumOfElfGroupBadgeTypePriorities = (input: string) =>
  pipe(
    input,
    I.map(toParsedRucksackContents),
    E.map(A.chunksOf(3)),
    E.map(A.map(toCommonItemTypeFromGroup)),
    E.map(A.filterMap(identity)),
    E.map(A.map((itemType) => rucksackItemTypeToPriorityMap[itemType])),
    E.map(toSumFromNumbers),
  )

const toCommonItemTypeFromGroup = (
  group: [RucksackItemType[], RucksackItemType[]][],
) => pipe(group, A.map(A.flatten), findFirstCommonItemTypeInGroup)

const findFirstCommonItemTypeInGroup = (group: RucksackItemType[][]) =>
  pipe(
    group,
    A.head,
    O.map(
      A.findFirst((item) =>
        pipe(
          group,
          A.tail,
          O.map(
            flow(
              A.every(
                flow(
                  A.findIndex((other) => item === other),
                  O.isSome,
                ),
              ),
            ),
          ),
          O.getOrElse(() => false),
        ),
      ),
    ),
    O.flatten,
  )
