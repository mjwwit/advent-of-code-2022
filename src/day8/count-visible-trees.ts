import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import { pipe } from 'fp-ts/lib/function'
import { toParsedTreeHeightGrid } from './parse'
import { toTransposedMatrix } from './transpose'

export const toVisibleTreeCount = (treeHeights: string) =>
  pipe(
    treeHeights,
    I.map(toParsedTreeHeightGrid),
    E.bindTo('normal'),
    E.bindW('transposed', ({ normal }) =>
      pipe(toTransposedMatrix(normal), E.of),
    ),
    E.bindW('normalVisible', ({ normal }) =>
      pipe(
        normal,
        A.map((row) =>
          A.mapWithIndex((index) => isVisibleFromAnySide(index)(row))(row),
        ),
        E.of,
      ),
    ),
    E.bindW('transposedVisible', ({ transposed }) =>
      pipe(
        transposed,
        A.map((column) =>
          A.mapWithIndex((index) => isVisibleFromAnySide(index)(column))(
            column,
          ),
        ),
        I.map(toTransposedMatrix),
        E.of,
      ),
    ),
    E.map(({ normalVisible, transposedVisible }) =>
      pipe(
        normalVisible,
        A.mapWithIndex((rowIndex, rowVisibility) =>
          pipe(
            rowVisibility,
            A.mapWithIndex(
              (colIndex, isVisible) =>
                isVisible || transposedVisible[rowIndex][colIndex],
            ),
          ),
        ),
      ),
    ),
    E.map(
      A.reduce(0, (totalVisible, row) =>
        pipe(
          row,
          A.reduce(
            0,
            (totalRowVisible, isVisible) =>
              totalRowVisible + (isVisible ? 1 : 0),
          ),
          (totalRowVisible) => totalVisible + totalRowVisible,
        ),
      ),
    ),
  )

const isVisibleFromAnySide = (index: number) => (list: number[]) =>
  pipe(list.slice(0, index + 1), isHighestInList(index)) ||
  pipe(list.slice(index), isHighestInList(0))

const isHighestInList = (index: number) => (list: number[]) =>
  list.every((value, i) => i === index || list[index] > value)
