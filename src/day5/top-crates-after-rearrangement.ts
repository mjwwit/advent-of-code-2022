import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Record'
import { flow, pipe } from 'fp-ts/function'
import {
  MovementInstruction,
  Stacks,
  toParsedInitialStateAndMovementsFromInput,
} from './parse'

export const toTopCratesAfterRearrangingOneAtATime = (input: string) =>
  pipe(
    input,
    I.map(toParsedInitialStateAndMovementsFromInput),
    E.chain(({ initialState, movements }) =>
      pipe(
        movements,
        A.reduce(E.of<Error, Stacks>(initialState), (stateOrError, movement) =>
          pipe(
            stateOrError,
            E.chain(toStateAfterApplyingMoveByMovingOneAtATime(movement)),
          ),
        ),
      ),
    ),
    E.map(toTopCratesSortedByStackNumberFromStacks),
  )

export const toTopCratesAfterRearrangingMultipleAtATime = (input: string) =>
  pipe(
    input,
    I.map(toParsedInitialStateAndMovementsFromInput),
    E.chain(({ initialState, movements }) =>
      pipe(
        movements,
        A.reduce(E.of<Error, Stacks>(initialState), (stateOrError, movement) =>
          pipe(
            stateOrError,
            E.chain(toStateAfterApplyingMoveByMultiple(movement)),
          ),
        ),
      ),
    ),
    E.map(toTopCratesSortedByStackNumberFromStacks),
  )

const toStateAfterApplyingMoveByMovingOneAtATime =
  ({ amount, from, to }: MovementInstruction) =>
  (state: Stacks) =>
    pipe(
      state,
      R.lookup(from),
      E.fromOption(() => new Error(`Stack ${from} does not exist`)),
      E.chainFirst(
        flow(A.size, (stackSize) =>
          stackSize < amount
            ? E.left(
                new Error(
                  `Attempting to move ${amount} items from ${from} to ${to}, but only ${stackSize} items remain`,
                ),
              )
            : E.right(undefined),
        ),
      ),
      E.bindTo('fromStack'),
      E.apS(
        'toStack',
        pipe(
          state,
          R.lookup(to),
          E.fromOption(() => new Error(`Stack ${to} does not exist`)),
        ),
      ),
      E.map(({ fromStack, toStack }) =>
        Object.assign({}, state, {
          [from]: pipe(fromStack, A.dropLeft(amount)),
          [to]: pipe(
            fromStack,
            A.takeLeft(amount),
            A.reverse,
            A.concat(toStack),
          ),
        }),
      ),
    )

const toStateAfterApplyingMoveByMultiple =
  ({ amount, from, to }: MovementInstruction) =>
  (state: Stacks) =>
    pipe(
      state,
      R.lookup(from),
      E.fromOption(() => new Error(`Stack ${from} does not exist`)),
      E.chainFirst(
        flow(A.size, (stackSize) =>
          stackSize < amount
            ? E.left(
                new Error(
                  `Attempting to move ${amount} items from ${from} to ${to}, but only ${stackSize} items remain`,
                ),
              )
            : E.right(undefined),
        ),
      ),
      E.bindTo('fromStack'),
      E.apS(
        'toStack',
        pipe(
          state,
          R.lookup(to),
          E.fromOption(() => new Error(`Stack ${to} does not exist`)),
        ),
      ),
      E.map(({ fromStack, toStack }) =>
        Object.assign({}, state, {
          [from]: pipe(fromStack, A.dropLeft(amount)),
          [to]: pipe(fromStack, A.takeLeft(amount), A.concat(toStack)),
        }),
      ),
    )

const toTopCratesSortedByStackNumberFromStacks = (stacks: Stacks) =>
  Object.entries(stacks)
    .sort(([a], [b]) => a.charCodeAt(0) - b.charCodeAt(0))
    .map(([, stack]) =>
      pipe(
        stack,
        A.lookup(0),
        O.getOrElse(() => '-'),
      ),
    )
    .join('')
