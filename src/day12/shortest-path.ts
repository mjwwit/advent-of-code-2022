import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { toParsedRawHeightMap } from './parse'

export const toLengthOfShortestPathFromStartToGoal = (input: string) =>
  pipe(
    input,
    I.map(toParsedRawHeightMap),
    E.bindTo('input'),
    E.bindW('heightMap', ({ input }) => pipe(toHeightMap(input), E.of)),
    E.bind('start', ({ input }) =>
      pipe(
        input,
        findMarker('S'),
        E.fromOption(() => new Error('No start marker found')),
      ),
    ),
    E.bind('goal', ({ input }) =>
      pipe(
        input,
        findMarker('E'),
        E.fromOption(() => new Error('No goal marker found')),
      ),
    ),
    E.bindW('movementMap', ({ heightMap, start, goal }) =>
      pipe(toMovementCostMap(heightMap, start, goal), E.of),
    ),
    E.chainOptionK(() => new Error('No path found to goal!'))(
      ({ movementMap, start }) => toShortestPathToGoalFrom(start)(movementMap),
    ),
    E.map((node) => node.cost),
  )

export const toHeightMap = (rawHeightMap: string[][]) =>
  pipe(
    rawHeightMap,
    A.map(
      A.map((c) =>
        c === 'S' ? 0 : c === 'E' ? 25 : c.charCodeAt(0) - 'a'.charCodeAt(0),
      ),
    ),
  )

export type Location = [number, number]

export const findMarker =
  (marker: string) =>
  (rawHeightMap: string[][]): O.Option<Location> => {
    for (let y = 0; y < rawHeightMap.length; ++y) {
      for (let x = 0; x < rawHeightMap[y].length; ++x) {
        if (rawHeightMap[y][x] === marker) {
          return O.some([x, y])
        }
      }
    }
    return O.none
  }

export type MovementMapNode = {
  location: Location
  height: number
  visited: boolean
  cost: number
  isStart: boolean
  isGoal: boolean
  path: Location[]
}

export const toMovementCostMap = (
  heightMap: number[][],
  start: Location,
  goal: Location,
) =>
  pipe(
    heightMap,
    A.mapWithIndex((y, row) =>
      pipe(
        row,
        A.mapWithIndex(
          (x, height): MovementMapNode => ({
            location: [x, y],
            height,
            visited: false,
            cost:
              x === start[0] && y === start[1] ? 0 : Number.POSITIVE_INFINITY,
            isStart: x === start[0] && y === start[1],
            isGoal: x === goal[0] && y === goal[1],
            path: [],
          }),
        ),
      ),
    ),
  )

export const toShortestPathToGoalFrom =
  (start: Location) =>
  (map: MovementMapNode[][]): O.Option<MovementMapNode> => {
    const queue: MovementMapNode[] = [map[start[1]][start[0]]]

    while (queue.length > 0) {
      const currentNode = queue.shift() as MovementMapNode

      if (currentNode.visited) {
        continue
      }

      const neighbors = toTraversableUnvisitedNeighbors(currentNode.location)(
        map,
      )

      for (const neighbor of neighbors) {
        if (currentNode.cost + 1 < neighbor.cost) {
          neighbor.cost = currentNode.cost + 1
          neighbor.path = [...currentNode.path, neighbor.location]
        }

        if (neighbor.isGoal) {
          return O.some(neighbor)
        }
      }

      queue.push(...neighbors)
      currentNode.visited = true
    }

    console.log('No route found :(. Map:\n', renderMap(map))
    return O.none
  }

const toTraversableUnvisitedNeighbors =
  (location: Location) => (map: MovementMapNode[][]) =>
    pipe(
      map,
      toValidNeighboringLocations(location),
      A.filter(
        (node) =>
          !node.visited &&
          toIsTraversableFrom(map[location[1]][location[0]].height)(
            node.height,
          ),
      ),
    )

const toValidNeighboringLocations =
  (location: Location) => (map: MovementMapNode[][]) =>
    pipe(
      location,
      I.map(toNeighboringLocations),
      A.filter(
        ([x, y]) => x >= 0 && y >= 0 && y < map.length && x < map[0].length,
      ),
      A.map(([x, y]) => map[y][x]),
    )

const toNeighboringLocations = (location: Location): Location[] => [
  // up
  [location[0], location[1] - 1],
  // right
  [location[0] + 1, location[1]],
  // down
  [location[0], location[1] + 1],
  // left
  [location[0] - 1, location[1]],
]

const toIsTraversableFrom = (from: number) => (to: number) => from + 1 >= to

const renderMap = (map: MovementMapNode[][]) =>
  map.map((row) => row.map((n) => renderNumber(n.cost)).join(' ')).join('\n')

const renderNumber = (n: number) =>
  !Number.isFinite(n) ? `--` : n < 10 ? `0${n}` : `${n}`
