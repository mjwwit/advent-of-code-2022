import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'

export const toTransposedMatrix = <T>(matrix: T[][]): T[][] =>
  pipe(
    matrix,
    A.mapWithIndex((rowIndex, row) =>
      pipe(
        row,
        A.mapWithIndex((colIndex) => matrix[colIndex][rowIndex]),
      ),
    ),
  )
