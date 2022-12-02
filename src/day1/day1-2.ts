import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import {
  toParsedCalorieCounts,
  toRawCalorieCountsPerElf,
  toSumFromNumbers,
} from './day1-1'
import { day1Input } from './day1.data'

const toResultString = (n: number) => `The top 3 elves have ${n} calories`

const result = pipe(
  day1Input,
  I.map(toRawCalorieCountsPerElf),
  RA.map(toParsedCalorieCounts),
  RA.filterMap(O.fromEither),
  RA.map(toSumFromNumbers),
  RA.sort(N.Ord),
  RA.takeRight(3),
  I.map(toSumFromNumbers),
  I.map(toResultString),
)

console.log(result)
