import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import { flow } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { IntFromString } from 'io-ts-types'
import { toErrorFromValidation } from '../common/validation-error'

export const NoopInstruction = t.tuple([t.literal('noop', 'NoopInstruction')])
export type NoopInstruction = t.TypeOf<typeof NoopInstruction>

export const AddxInstruction = t.tuple(
  [t.literal('addx'), IntFromString],
  'AddxInstruction',
)
export type AddxInstruction = t.TypeOf<typeof AddxInstruction>

export const Instruction = t.union(
  [NoopInstruction, AddxInstruction],
  'Instruction',
)
export type Instruction = t.TypeOf<typeof Instruction>

export const toParsedInstructions = flow(
  S.split('\n'),
  RA.filter(Boolean),
  RA.map(S.split(' ')),
  t.array(Instruction).decode,
  E.mapLeft(toErrorFromValidation('Invalid input')),
)
