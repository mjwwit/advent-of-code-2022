import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as S from 'fp-ts/Set'
import * as B from 'fp-ts/boolean'
import { flow, pipe } from 'fp-ts/lib/function'
import { eqLocation, Location } from './location'
import { Direction, Motion, toParsedMotions } from './parse'

type RopeState = NEA.NonEmptyArray<Location>
type State = { rope: RopeState; tailVisited: Set<Location> }

const getInitialState = (length: number): State => ({
  rope: pipe(
    length,
    NEA.makeBy(() => [0, 0]),
  ),
  tailVisited: new Set<Location>(),
})

export const toNumberOfVisitedByTailPositionsUsingRopeOfLength =
  (ropeLength: number) => (input: string) =>
    pipe(
      input,
      I.map(toParsedMotions),
      E.map(A.map(toAppliedMotionFromState)),
      E.map(
        A.reduce(getInitialState(ropeLength), (state, toNewState) =>
          pipe(state, I.map(toNewState)),
        ),
      ),
      E.map((state) => state.tailVisited.size),
    )

const toAppliedMotionFromState =
  (motion: Motion) =>
  (state: State): State =>
    pipe(
      A.makeBy(motion[1], () => motion[0]),
      A.map(toAppliedMotionDirectionFromState),
      A.reduce(state, (formerState, toNewState) => toNewState(formerState)),
    )

const toAppliedMotionDirectionFromState = (direction: Direction) =>
  flow(({ rope, tailVisited }: State) =>
    pipe(
      rope,
      I.map(toNewRopeStateFromDirection(direction)),
      I.bindTo('rope'),
      I.bind('tailVisited', ({ rope }) =>
        pipe(tailVisited, I.map(toVisitedLocationsIncluding(NEA.last(rope)))),
      ),
    ),
  )

const toNewRopeStateFromDirection =
  (direction: Direction) =>
  (rope: RopeState): RopeState =>
    pipe(
      rope,
      NEA.tail,
      A.reduce(
        pipe(
          rope,
          NEA.head,
          I.map(toNewLocationFromDirection(direction)),
          NEA.of,
        ),
        (leadingSegments, segment) =>
          pipe(
            leadingSegments,
            NEA.concat(
              pipe(
                segment,
                I.map(
                  toNewSegmentLocationAfterMovingLeadingSegment(
                    pipe(leadingSegments, NEA.last),
                  ),
                ),
                NEA.of,
              ),
            ),
          ),
      ),
    )

const toNewLocationFromDirection =
  (direction: Direction) =>
  (fromLocation: Location): Location =>
    [
      direction === 'L'
        ? fromLocation[0] - 1
        : direction === 'R'
        ? fromLocation[0] + 1
        : fromLocation[0],
      direction === 'U'
        ? fromLocation[1] + 1
        : direction === 'D'
        ? fromLocation[1] - 1
        : fromLocation[1],
    ]

const toNewSegmentLocationAfterMovingLeadingSegment =
  (leadingSegment: Location) =>
  (segment: Location): Location =>
    pipe(
      leadingSegment,
      I.map(doesSegmentNeedToMove(segment)),
      B.match(
        () => segment,
        () => pipe(segment, toSegmentFollowedLeadingSegment(leadingSegment)),
      ),
    )

const doesSegmentNeedToMove =
  (segment: Location) => (leadingSegment: Location) =>
    pipe(
      leadingSegment,
      I.map(toDistanceToLocation(segment)),
      (distance) => distance > 1,
    )

const toDistanceToLocation = (a: Location) => (b: Location) =>
  Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]))

export const toSegmentFollowedLeadingSegment =
  (leadingSegment: Location) =>
  (segment: Location): Location =>
    pipe(
      segment,
      segment[0] !== leadingSegment[0] && segment[1] !== leadingSegment[1]
        ? toLocationMovedTowardsLeadingSegmentDiagonally(leadingSegment)
        : toLocationMovedTowardsLeadingSegmentNormally(leadingSegment),
    )

const toLocationMovedTowardsLeadingSegmentDiagonally =
  (leadingSegment: Location) =>
  (segment: Location): Location =>
    [
      leadingSegment[0] > segment[0] ? segment[0] + 1 : segment[0] - 1,
      leadingSegment[1] > segment[1] ? segment[1] + 1 : segment[1] - 1,
    ]

const toLocationMovedTowardsLeadingSegmentNormally =
  (leadingSegment: Location) =>
  (segment: Location): Location =>
    leadingSegment[0] !== segment[0]
      ? [
          leadingSegment[0] > segment[0] ? segment[0] + 1 : segment[0] - 1,
          segment[1],
        ]
      : [
          segment[0],
          leadingSegment[1] > segment[1] ? segment[1] + 1 : segment[1] - 1,
        ]

const toVisitedLocationsIncluding = (location: Location) =>
  S.insert(eqLocation)(location)
