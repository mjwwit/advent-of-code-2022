import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import { flow, pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { toParsedRawHeightMap } from './parse'
import {
  findMarker,
  Location,
  toHeightMap,
  toMovementCostMap,
  toShortestPathToGoalFrom,
} from './shortest-path'

export const toLengthOfBestPathToGoal = (input: string) =>
  pipe(
    input,
    I.map(toParsedRawHeightMap),
    E.bindTo('input'),
    E.bindW('heightMap', ({ input }) => pipe(toHeightMap(input), E.of)),
    E.bindW('startLocations', ({ heightMap }) =>
      pipe(heightMap, findPossibleStartLocations, E.of),
    ),
    E.bind('goal', ({ input }) =>
      pipe(
        input,
        findMarker('E'),
        E.fromOption(() => new Error('No goal marker found')),
      ),
    ),
    E.map(({ heightMap, startLocations, goal }) =>
      pipe(
        startLocations,
        A.map((start) =>
          pipe(
            toMovementCostMap(heightMap, start, goal),
            I.map(toShortestPathToGoalFrom(start)),
            O.map((node) => node.cost),
          ),
        ),
      ),
    ),
    E.chainOptionK(() => new Error('No possible route to goal'))(
      flow(A.compact, A.sort(N.Ord), A.head),
    ),
  )

const findPossibleStartLocations = (heightMap: number[][]): Location[] =>
  pipe(
    heightMap,
    A.reduceWithIndex([] as Location[], (y, possibleStartLocations, row) =>
      pipe(
        row,
        A.filterMapWithIndex((x, height) =>
          height === 0 ? O.some<Location>([x, y]) : O.none,
        ),
        A.concat,
        (concatTo) => concatTo(possibleStartLocations),
      ),
    ),
  )
