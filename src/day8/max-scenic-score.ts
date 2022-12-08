import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import { flow, pipe } from 'fp-ts/function'
import { toParsedTreeHeightGrid } from './parse'
import { toTransposedMatrix } from './transpose'

export const toMaximumScenicScoreForTrees = (treeHeights: string) =>
  pipe(
    treeHeights,
    I.map(toParsedTreeHeightGrid),
    E.bindTo('normal'),
    E.bindW('transposed', ({ normal }) =>
      pipe(toTransposedMatrix(normal), E.of),
    ),
    E.bindW('normalScenicScores', ({ normal }) =>
      pipe(
        normal,
        A.map((row) =>
          A.mapWithIndex((i) => toSingleSideScenicScore(i)(row))(row),
        ),
        E.of,
      ),
    ),
    E.bindW('transposedScenicScores', ({ transposed }) =>
      pipe(
        transposed,
        A.map((col) =>
          A.mapWithIndex((i) => toSingleSideScenicScore(i)(col))(col),
        ),
        I.map(toTransposedMatrix),
        E.of,
      ),
    ),
    E.map(({ normalScenicScores, transposedScenicScores }) =>
      pipe(
        normalScenicScores,
        A.mapWithIndex((rowIndex, rowScenicScores) =>
          pipe(
            rowScenicScores,
            A.mapWithIndex(
              (colIndex, rowScenicScore) =>
                rowScenicScore * transposedScenicScores[rowIndex][colIndex],
            ),
          ),
        ),
      ),
    ),
    E.map(
      flow(
        A.map((scores) => Math.max(...scores)),
        (scores) => Math.max(...scores),
      ),
    ),
  )

const toSingleSideScenicScore = (index: number) => (list: number[]) =>
  toViewingDistance(list.slice(index)) *
  toViewingDistance(list.slice(0, index + 1).reverse())

const toViewingDistance = (list: number[]) =>
  pipe(
    list.slice(1),
    A.takeLeftWhile((height) => height < list[0]),
    A.size,
    (distance) => Math.min(distance + 1, list.length - 1),
  )
