import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as NEA from 'fp-ts/NonEmptyArray'
import { flow, pipe } from 'fp-ts/function'
import { toCpuStatesFromInstructions } from './solution'

export const toRenderedImageFromInstructions = (instructions: string) =>
  pipe(
    instructions,
    I.map(toCpuStatesFromInstructions),
    E.map(NEA.tail),
    E.map(A.map((s) => s.during.x)),
    E.map(A.chunksOf(40)),
    E.map(
      A.map(
        A.mapWithIndex((i, x) =>
          pipe(x, I.map(toSpriteFromRegister), toPixelUsingSpriteFromIndex(i)),
        ),
      ),
    ),
    E.map(
      flow(
        A.map(
          flow(
            A.map((v) => (v ? '#' : '.')),
            (line) => line.join(''),
          ),
        ),
        (lines) => lines.join('\n'),
      ),
    ),
  )

const toSpriteFromRegister = (register: number) =>
  A.makeBy(40, (i) => Math.abs(register - i) <= 1)

const toPixelUsingSpriteFromIndex = (i: number) => (sprite: boolean[]) =>
  sprite[i]
