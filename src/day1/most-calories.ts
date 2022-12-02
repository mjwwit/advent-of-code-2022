import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { toSumFromNumbers } from '../common/sum'
import { toParsedCalorieCounts } from './parse'

export const toMostCaloriesCarriedBySingleElf = (
  input: string,
): E.Either<Error, number> =>
  pipe(
    input,
    toParsedCalorieCounts,
    E.map(RA.map(toSumFromNumbers)),
    E.map((caloriesPerElf) => Math.max(...caloriesPerElf)),
  )
