import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { toSumFromNumbers } from '../common/sum'
import { toParsedCalorieCounts } from './parse'

export const toSumOfTop3HighestCalories = (input: string) =>
  pipe(
    input,
    toParsedCalorieCounts,
    E.map(RA.map(toSumFromNumbers)),
    E.map(RA.sort(N.Ord)),
    E.map(RA.takeRight(3)),
    E.map(toSumFromNumbers),
  )
