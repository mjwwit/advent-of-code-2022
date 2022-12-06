import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as B from 'fp-ts/boolean'
import { flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { toParsedBuffer } from './parse'

export const toIndexOfFirstMarkerOfLength = (length: number) =>
  flow(
    I.map(toParsedBuffer),
    E.map(S.split('')),
    E.map(RA.toArray),
    E.map(A.reduce([], toPossibleMarkersOfAtMostLength(length))),
    E.map(A.findIndex(isMarkerOfLength(length))),
  )

const toPossibleMarkersOfAtMostLength =
  (length: number) => (possibleMarkers: string[][], charToAdd: string) =>
    [
      ...possibleMarkers.map((possibleMarker) =>
        pipe(
          possibleMarker,
          RA.size,
          (markerLength) => markerLength < length,
          B.match(
            () => possibleMarker,
            () => [...possibleMarker, charToAdd],
          ),
        ),
      ),
      pipe(
        possibleMarkers,
        RA.last,
        O.fold(
          () => [charToAdd],
          (lastPossibleMarker) =>
            lastPossibleMarker.length >= 1 ? [charToAdd] : [],
        ),
      ),
    ]

const isMarkerOfLength = (length: number) => (chunk: string[]) =>
  chunk.length === length && new Set(chunk).size === length
