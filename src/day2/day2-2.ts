import { readFile } from 'fs/promises'
import { join } from 'path'
import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { toSumFromNumbers } from '../lib/sum'
import { toErrorFromValidation } from '../lib/validation-error'

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

const OutcomeColumnValue = t.union(
  [t.literal('X'), t.literal('Y'), t.literal('Z')],
  'OutcomeColumnValue',
)
type OutcomeColumnValue = t.TypeOf<typeof OutcomeColumnValue>

const theirMoveToShapeMap: Record<TheirMoveColumnValue, Shape> = {
  A: Shape.ROCK,
  B: Shape.PAPER,
  C: Shape.SCISSORS,
}

enum RoundScore {
  LOSS = 0,
  DRAW = 3,
  WIN = 6,
}

const outcomeToRoundScoreMap: Record<OutcomeColumnValue, RoundScore> = {
  X: RoundScore.LOSS,
  Y: RoundScore.DRAW,
  Z: RoundScore.WIN,
}

const toMatchupsFromStrategyGuide = (encryptedGuide: string) =>
  pipe(
    encryptedGuide,
    S.split('\n'),
    RA.filter(Boolean),
    RA.map(S.split(' ')),
    t.array(t.tuple([TheirMoveColumnValue, OutcomeColumnValue])).decode,
    E.mapLeft(toErrorFromValidation('Invalid strategy guide line')),
    E.map(
      RA.map(([them, outcome]): [Shape, RoundScore] => [
        theirMoveToShapeMap[them],
        outcomeToRoundScoreMap[outcome],
      ]),
    ),
    E.map(
      RA.map(
        ([them, score]) =>
          [them, toYourShapeFromTheirShapeAndRoundScore(them, score)] as const,
      ),
    ),
    E.map(RA.map(([them, you]) => toScoreFromRound(you, them))),
    E.map(toSumFromNumbers),
  )

const toYourShapeFromTheirShapeAndRoundScore = (
  theirShape: Shape,
  score: RoundScore,
) =>
  score === RoundScore.WIN && theirShape === Shape.ROCK
    ? Shape.PAPER
    : score === RoundScore.WIN && theirShape === Shape.PAPER
    ? Shape.SCISSORS
    : score === RoundScore.WIN && theirShape === Shape.SCISSORS
    ? Shape.ROCK
    : score === RoundScore.LOSS && theirShape === Shape.ROCK
    ? Shape.SCISSORS
    : score === RoundScore.LOSS && theirShape === Shape.PAPER
    ? Shape.ROCK
    : score === RoundScore.LOSS && theirShape === Shape.SCISSORS
    ? Shape.PAPER
    : theirShape

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
  TE.match(
    (e) => e.stack || e.message,
    (score) => `Total score: ${score}`,
  ),
  (task) => task(),
)

result.then(console.log).catch(console.error)
