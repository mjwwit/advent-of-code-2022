import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { NumberFromString } from 'io-ts-types'
import { toSumFromNumbers } from '../lib/sum'
import { toErrorFromValidation } from '../lib/validation-error'
import { day1Input } from './day1.data'

export const toRawCalorieCountsPerElf = flow(S.split('\n\n'))

export const toParsedCalorieCounts = flow(
  S.split('\n'),
  t.array(t.string.pipe(NumberFromString)).decode,
  E.mapLeft(toErrorFromValidation('Invalid number in list of calories')),
)

const toMaxWithIndex = RA.reduceWithIndex<number, [number, number]>(
  [-1, 0],
  (currentIndex, [lastHighestIndex, lastHighestNumber], currentNumber) =>
    currentNumber > lastHighestNumber
      ? [currentIndex, currentNumber]
      : [lastHighestIndex, lastHighestNumber],
)

const toStringFromIndex = (index: number) =>
  index === 0
    ? '1st'
    : index === 1
    ? '2nd'
    : index === 2
    ? '3rd'
    : `${index + 1}th`

const toResultStringFromIndexAndCount = ([index, count]: [number, number]) =>
  `The ${toStringFromIndex(index)} elf has ${count} calories`

const result = pipe(
  day1Input,
  I.map(toRawCalorieCountsPerElf),
  RA.map(toParsedCalorieCounts),
  RA.filterMap(O.fromEither),
  RA.map(toSumFromNumbers),
  I.map(toMaxWithIndex),
  I.map(toResultStringFromIndexAndCount),
)

console.log(result)
