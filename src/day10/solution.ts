import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/State'
import { pipe } from 'fp-ts/function'
import { toSumFromNumbers } from '../common/sum'
import { AddxInstruction, Instruction, toParsedInstructions } from './parse'

type CpuState = {
  during: {
    x: number
  }
  after: {
    x: number
  }
}

export const toSolution = (input: string) =>
  pipe(
    input,
    I.map(toCpuStatesFromInstructions),
    E.map(
      A.filterMapWithIndex((i, s) =>
        i === 20 || (i - 20) % 40 === 0 ? O.some(i * s.during.x) : O.none,
      ),
    ),
    E.map(toSumFromNumbers),
  )

export const toCpuStatesFromInstructions = (input: string) =>
  pipe(
    input,
    I.map(toParsedInstructions),
    E.map(A.map(toProcessedInstruction)),
    E.map(S.sequenceArray),
    E.map((startWith) => startWith(NEA.of(toCpuState({ x: 1 })))),
    E.map(([, states]) => states),
  )

const toProcessedInstruction = (instruction: Instruction) =>
  instruction[0] === 'noop'
    ? toProcessedNoopInstruction()
    : toProcessedAddxInstruction(instruction)

const toProcessedNoopInstruction =
  (): S.State<NEA.NonEmptyArray<CpuState>, number> => (state) =>
    pipe(
      state,
      NEA.concat([
        {
          during: { ...NEA.last(state).after },
          after: { ...NEA.last(state).after },
        },
      ]),
      (newState) => [NEA.last(state).during.x, newState],
    )

const toProcessedAddxInstruction =
  (
    instruction: AddxInstruction,
  ): S.State<NEA.NonEmptyArray<CpuState>, number> =>
  (state) =>
    pipe(
      state,
      NEA.concat([
        {
          during: NEA.last(state).after,
          after: NEA.last(state).after,
        },
        {
          during: NEA.last(state).after,
          after: {
            ...NEA.last(state).after,
            x: NEA.last(state).after.x + instruction[1],
          },
        },
      ]),
      (newState) => [NEA.last(state).during.x, newState],
    )

const toCpuState = (registerValues: CpuState['during']): CpuState => ({
  during: registerValues,
  after: registerValues,
})
