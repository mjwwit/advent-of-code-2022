import { readFile } from 'fs/promises'
import { join } from 'path'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toSumOfTop3HighestCalories } from './top3-calories-sum'

const calculatingResult = pipe(
  join(__dirname, 'calories.txt'),
  TE.tryCatchK((filename) => readFile(filename, 'utf8'), E.toError),
  TE.chainEitherK(toSumOfTop3HighestCalories),
  TE.map((n) => `The top 3 elves have ${n} calories`),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
