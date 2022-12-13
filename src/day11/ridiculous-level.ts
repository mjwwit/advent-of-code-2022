import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import { flow, pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { MonkeyNotes, toParsedNotes } from './parse'

type BigNumberMonkey = Omit<
  MonkeyNotes,
  'items' | 'operation' | 'testDivisibleBy'
> & {
  items: bigint[]
  operation: {
    operator: MonkeyNotes['operation']['operator']
    scalar: bigint | 'old'
  }
  testDivisibleBy: bigint
}

const BIG_ZERO = 0n

export const toMonkeyRidiculousBusinessLevelAfterRounds =
  (rounds: number) => (input: string) =>
    pipe(
      input,
      I.map(toParsedNotes),
      E.map((notes) => {
        const state: BigNumberMonkey[] = notes.map((monkey) => ({
          ...monkey,
          items: monkey.items.map((item) => BigInt(item)),
          operation: {
            ...monkey.operation,
            scalar:
              monkey.operation.scalar === 'old'
                ? monkey.operation.scalar
                : BigInt(monkey.operation.scalar),
          },
          testDivisibleBy: BigInt(monkey.testDivisibleBy),
        }))
        const superMod = state.reduce(
          (acc, monkey) => monkey.testDivisibleBy * acc,
          1n,
        )
        const handledItemsByMonkey = A.makeBy(state.length, () => 0)
        for (let round = 0; round < rounds; ++round) {
          for (let monkeyId = 0; monkeyId < state.length; ++monkeyId) {
            const monkey = state[monkeyId]
            for (let i = 0; i < monkey.items.length; ++i) {
              const oldItemWorryLevel = monkey.items[i]
              const scalarValue =
                monkey.operation.scalar === 'old'
                  ? oldItemWorryLevel
                  : monkey.operation.scalar

              const worryLevel =
                monkey.operation.operator === '*'
                  ? (oldItemWorryLevel * scalarValue) % superMod
                  : (oldItemWorryLevel + scalarValue) % superMod

              if (worryLevel % monkey.testDivisibleBy === BIG_ZERO) {
                state[monkey.throwToIfDivisibleBy].items.push(worryLevel)
              } else {
                state[monkey.throwToIfNotDivisibleBy].items.push(worryLevel)
              }

              handledItemsByMonkey[monkey.id]++
            }
            monkey.items = []
          }
        }
        return handledItemsByMonkey
      }),
      E.map(flow(A.sort(N.Ord), A.takeRight(2))),
      E.map(([a, b]) => a * b),
    )
