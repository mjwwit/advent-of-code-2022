import * as A from 'fp-ts/Array'
import * as I from 'fp-ts/Identity'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/Set'
import { pipe } from 'fp-ts/function'
import { eqLocation, Location } from './location'

const toMinAndMax = (ns: number[]): [number, number] => [
  Math.min(...ns),
  Math.max(...ns),
]
const toDimensions = (
  locations: Location[],
): [[number, number], [number, number]] => [
  toMinAndMax(locations.map((l) => l[0])),
  toMinAndMax(locations.map((l) => l[1])),
]

export const toStringFromState =
  (text: string) =>
  ({
    rope,
    tailVisited: visited,
  }: {
    rope: NEA.NonEmptyArray<Location>
    tailVisited: Set<Location>
  }) =>
    `${text}:\n${pipe(
      [...rope, ...visited],
      I.map(toDimensions),
      ([[lx, ux], [ly, uy]]) =>
        A.makeBy(uy - ly + 1, (y) =>
          A.makeBy(ux - lx + 1, (x) =>
            pipe(
              rope,
              NEA.head,
              (head) => eqLocation.equals(head, [x + lx, y + ly]),
              (b) => (b ? O.some('H') : O.none),
              O.alt(() =>
                pipe(
                  rope,
                  A.findIndex((rs) => eqLocation.equals(rs, [x + lx, y + ly])),
                  O.map((ropeSegmentIndex) =>
                    ropeSegmentIndex === 0 ? 'H' : String(ropeSegmentIndex),
                  ),
                ),
              ),
              O.alt(() =>
                x + lx === 0 && y + ly === 0 ? O.some('s') : O.none,
              ),
              O.alt(() =>
                pipe(visited, S.elem(eqLocation)([x + lx, y + ly]))
                  ? O.some('#')
                  : O.none,
              ),
              O.getOrElse(() => '.'),
            ),
          ),
        ),
      A.reverse,
      A.map((row) => row.join('')),
      (rows) => rows.join('\n'),
    )}`
