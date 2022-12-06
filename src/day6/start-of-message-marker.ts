import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { toIndexOfFirstMarkerOfLength } from './marker'

export const toIndexAfterFirstStartOfMessageMarker = flow(
  I.map(toIndexOfFirstMarkerOfLength(14)),
  E.map(O.map((i) => i + 14)),
)
