import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import { flow, pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { Int } from 'io-ts'
import { MonkeyNotes, toParsedNotes } from './parse'

export const toMonkeyBusinessLevelAfterRounds =
  (rounds: number) => (input: string) =>
    pipe(
      input,
      I.map(toParsedNotes),
      E.map((state) => {
        const handledItemsByMonkey = A.makeBy(state.length, () => 0)
        for (let round = 0; round < rounds; ++round) {
          state.forEach((monkey) => {
            monkey.items = monkey.items.map(
              toWorryLevelAfterApplyingOperation(monkey.operation),
            )
            monkey.items.forEach((worryLevel) => {
              worryLevel % monkey.testDivisibleBy === 0
                ? state[monkey.throwToIfDivisibleBy].items.push(worryLevel)
                : state[monkey.throwToIfNotDivisibleBy].items.push(worryLevel)
              handledItemsByMonkey[monkey.id]++
            })
            monkey.items = []
          })
        }
        return handledItemsByMonkey
      }),
      E.map(flow(A.sort(N.Ord), A.takeRight(2))),
      E.map(([a, b]) => a * b),
    )

const toWorryLevelAfterApplyingOperation =
  ({ operator, scalar }: MonkeyNotes['operation']) =>
  (oldLevel: Int): Int =>
    pipe(
      scalar === 'old' ? oldLevel : scalar,
      (scalarValue) =>
        operator === '*' ? oldLevel * scalarValue : oldLevel + scalarValue,
      (level) => Math.floor(level / 3) as Int,
    )
