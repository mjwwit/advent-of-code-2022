import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as R from 'fp-ts/Record'
import { flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { IntFromString } from 'io-ts-types'
import { toErrorFromValidation } from '../common/validation-error'

const Operator = t.union([t.literal('+'), t.literal('*')])
export const MonkeyNotes = t.strict(
  {
    id: IntFromString,
    items: t.array(IntFromString),
    operation: t.strict({
      operator: Operator,
      scalar: t.union([IntFromString, t.literal('old')]),
    }),
    testDivisibleBy: IntFromString,
    throwToIfDivisibleBy: IntFromString,
    throwToIfNotDivisibleBy: IntFromString,
  },
  'MonkeyNotes',
)
export type MonkeyNotes = t.TypeOf<typeof MonkeyNotes>

const MONKEY_ID_REGEX = /^(?<id>\d+):$/
const STARTING_ITEMS_REGEX = /^Starting items: (?<worryLevels>.+)$/
const OPERATION_REGEX =
  /^Operation: new = old (?<operator>.) (?<scalar>\d+|old)$/
const TEST_REGEX = /^Test: divisible by (?<factor>\d+)$/
const TEST_TRUE_REGEX = /^If true: throw to monkey (?<id>\d+)$/
const TEST_FALSE_REGEX = /^If false: throw to monkey (?<id>\d+)$/

const toCapturedRegexGroupFromString =
  (regex: RegExp, group: string) => (s: string) =>
    pipe(
      regex.exec(s),
      O.fromNullable,
      O.chain(({ groups }) =>
        pipe(groups, O.fromNullable, O.chain(R.lookup(group))),
      ),
    )

export const toParsedNotes = flow(
  S.split('Monkey '),
  RA.map(S.split('\n')),
  RA.map(RA.map(S.trim)),
  RA.map(RA.filter(Boolean)),
  RA.filter(flow(RA.size, Boolean)),
  RA.map((rawNotes) =>
    pipe(
      E.Do,
      E.apS(
        'id',
        pipe(
          rawNotes,
          RA.lookup(0),
          O.chain(toCapturedRegexGroupFromString(MONKEY_ID_REGEX, 'id')),
          E.fromOption(
            () => new Error(`Monkey id not found in ${rawNotes.join('\n')}`),
          ),
        ),
      ),
      E.apS(
        'items',
        pipe(
          rawNotes,
          RA.lookup(1),
          O.chain(
            toCapturedRegexGroupFromString(STARTING_ITEMS_REGEX, 'worryLevels'),
          ),
          O.map(S.split(', ')),
          E.fromOption(() => new Error('Starting items not found')),
        ),
      ),
      E.apS(
        'operation',
        pipe(
          rawNotes,
          RA.lookup(2),
          O.chain(toCapturedRegexGroupFromString(OPERATION_REGEX, 'operator')),
          E.fromOption(
            () => new Error(`Operator not found in ${rawNotes.join('\n')}`),
          ),
          E.bindTo('operator'),
          E.apS(
            'scalar',
            pipe(
              rawNotes,
              RA.lookup(2),
              O.chain(
                toCapturedRegexGroupFromString(OPERATION_REGEX, 'scalar'),
              ),
              E.fromOption(
                () => new Error(`Scalar not found in ${rawNotes.join('\n')}`),
              ),
            ),
          ),
        ),
      ),
      E.apS(
        'testDivisibleBy',
        pipe(
          rawNotes,
          RA.lookup(3),
          O.chain(toCapturedRegexGroupFromString(TEST_REGEX, 'factor')),
          E.fromOption(() => new Error('Test not found')),
        ),
      ),
      E.apS(
        'throwToIfDivisibleBy',
        pipe(
          rawNotes,
          RA.lookup(4),
          O.chain(toCapturedRegexGroupFromString(TEST_TRUE_REGEX, 'id')),
          E.fromOption(() => new Error('If true not found')),
        ),
      ),
      E.apS(
        'throwToIfNotDivisibleBy',
        pipe(
          rawNotes,
          RA.lookup(5),
          O.chain(toCapturedRegexGroupFromString(TEST_FALSE_REGEX, 'id')),
          E.fromOption(() => new Error('If false not found')),
        ),
      ),
    ),
  ),
  E.sequenceArray,
  E.chain(
    flow(
      t.array(MonkeyNotes).decode,
      E.mapLeft(toErrorFromValidation('Invalid input')),
    ),
  ),
)
