import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as B from 'fp-ts/boolean'
import { flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { IntFromString } from 'io-ts-types'
import { toErrorFromValidation } from '../common/validation-error'

export type Stacks = Record<string, string[]>

export const MovementInstruction = t.strict(
  {
    amount: IntFromString,
    from: t.string,
    to: t.string,
  },
  'MovementInstruction',
)
export type MovementInstruction = t.TypeOf<typeof MovementInstruction>

export const toParsedInitialStateAndMovementsFromInput = (input: string) =>
  pipe(
    input,
    I.map(toRawInitialStateAndMovementsFromInput),
    E.map(([rawInitialState, rawMovements]) => ({
      rawInitialState,
      rawMovements,
    })),
    E.bind('initialState', ({ rawInitialState }) =>
      pipe(rawInitialState, toParsedInitialState),
    ),
    E.bind('movements', ({ rawMovements }) =>
      pipe(rawMovements, toParsedMovements),
    ),
    E.chain(({ initialState, movements }) =>
      pipe(
        movements,
        A.every(
          ({ from, to }) =>
            Array.isArray(initialState[from]) &&
            Array.isArray(initialState[to]),
        ),
        B.match(
          () =>
            E.left(new Error('Movement instruction for non-existent stack')),
          () => E.right({ initialState, movements }),
        ),
      ),
    ),
  )

const toRawInitialStateAndMovementsFromInput = flow(
  S.split('\n\n'),
  t.tuple([t.string, t.string]).decode,
  E.mapLeft(toErrorFromValidation('Invalid input file')),
)

const toLayerOfCratesFromLine = (line: string) =>
  pipe(
    `${line} `,
    S.split(''),
    RA.chunksOf(4),
    RA.map(RA.lookup(1)),
    RA.map(
      O.chain((crateOrSpace) =>
        pipe(
          crateOrSpace === ' ',
          B.match(
            () => O.some(crateOrSpace),
            () => O.none,
          ),
        ),
      ),
    ),
  )

const toParsedInitialState = flow(
  S.split('\n'),
  RA.filter(Boolean),
  RA.dropRight(1),
  RA.map(toLayerOfCratesFromLine),
  RA.reduce([] as readonly string[][], (stacks, layer) =>
    stacks.length > 0
      ? pipe(
          stacks,
          RA.mapWithIndex((i, stack) =>
            pipe(
              layer,
              RA.lookup(i),
              O.flatten,
              O.fold(
                () => stack,
                (crate) => [...stack, crate],
              ),
            ),
          ),
        )
      : pipe(
          layer,
          RA.map(
            O.fold(
              () => [],
              (crate) => [crate],
            ),
          ),
        ),
  ),
  t.array(t.array(t.string)).decode,
  E.mapLeft(toErrorFromValidation('Invalid initial state')),
  E.map(
    A.reduceWithIndex({} as Stacks, (i, stacks, stack) =>
      Object.assign(stacks, { [`${i + 1}`]: stack }),
    ),
  ),
)

const MOVEMENT_INSTRUCTION_REGEX =
  /^move (?<amount>\d+) from (?<from>\d+) to (?<to>\d+)$/
const toOptionalResultsFromMovementInstructionRegex = (s: string) =>
  O.fromNullable(MOVEMENT_INSTRUCTION_REGEX.exec(s))

const toParsedMovements = (input: string) =>
  pipe(
    input,
    S.split('\n'),
    RA.filter(Boolean),
    RA.map(toOptionalResultsFromMovementInstructionRegex),
    RA.filterMap(
      flow(
        O.chain((result) =>
          pipe(
            O.Do,
            O.apS('amount', O.fromNullable(result.groups?.amount)),
            O.apS('from', O.fromNullable(result.groups?.from)),
            O.apS('to', O.fromNullable(result.groups?.to)),
          ),
        ),
      ),
    ),
    t.array(MovementInstruction).decode,
    E.mapLeft(toErrorFromValidation('Invalid movement instruction')),
  )
