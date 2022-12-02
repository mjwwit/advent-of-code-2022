import { readFile } from 'fs/promises'
import { join } from 'path'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'
import { flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { toSumFromNumbers } from '../common/sum'
import { toErrorFromValidation } from '../common/validation-error'

enum Shape {
  ROCK = 'ROCK',
  PAPER = 'PAPER',
  SCISSORS = 'SCISSORS',
}

const shapeScore: Record<Shape, number> = {
  [Shape.ROCK]: 1,
  [Shape.PAPER]: 2,
  [Shape.SCISSORS]: 3,
}

const TheirMoveColumnValue = t.union(
  [t.literal('A'), t.literal('B'), t.literal('C')],
  'TheirMoveColumnValue',
)
type TheirMoveColumnValue = t.TypeOf<typeof TheirMoveColumnValue>

const YourMoveColumnValue = t.union(
  [t.literal('X'), t.literal('Y'), t.literal('Z')],
  'YourMoveColumnValue',
)
type YourMoveColumnValue = t.TypeOf<typeof YourMoveColumnValue>

const theirMoveToShapeMap: Record<TheirMoveColumnValue, Shape> = {
  A: Shape.ROCK,
  B: Shape.PAPER,
  C: Shape.SCISSORS,
}

const yourMoveToShapeMap: Record<YourMoveColumnValue, Shape> = {
  X: Shape.ROCK,
  Y: Shape.PAPER,
  Z: Shape.SCISSORS,
}

enum RoundScore {
  LOSS = 0,
  DRAW = 3,
  WIN = 6,
}

const toMatchupsFromStrategyGuide = flow(
  S.split('\n'),
  RA.filter(Boolean),
  RA.map(S.split(' ')),
  t.array(t.tuple([TheirMoveColumnValue, YourMoveColumnValue])).decode,
  E.mapLeft(toErrorFromValidation('Invalid strategy guide line')),
  E.map(
    RA.map(([them, you]): [Shape, Shape] => [
      theirMoveToShapeMap[them],
      yourMoveToShapeMap[you],
    ]),
  ),
)

const toTotalScoreFromMatchups = flow(
  RA.map(([them, you]: [Shape, Shape]) => toScoreFromRound(you, them)),
  I.map(toSumFromNumbers),
)

const toScoreFromRound = (you: Shape, them: Shape): number =>
  shapeScore[you] +
  ((you === Shape.ROCK && them == Shape.SCISSORS) ||
  (you === Shape.SCISSORS && them === Shape.PAPER) ||
  (you === Shape.PAPER && them === Shape.ROCK)
    ? RoundScore.WIN
    : you === them
    ? RoundScore.DRAW
    : RoundScore.LOSS)

const result = pipe(
  join(__dirname, 'encrypted-strategy-guide.txt'),
  TE.tryCatchK((filename) => readFile(filename, 'utf8'), E.toError),
  TE.chainEitherK(toMatchupsFromStrategyGuide),
  TE.map(toTotalScoreFromMatchups),
  TE.match(
    (e) => e.stack || e.message,
    (score) => `Total score: ${score}`,
  ),
  (task) => task(),
)

result.then(console.log).catch(console.error)
