import { readFile } from 'fs/promises'
import { join } from 'path'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toMostCaloriesCarriedBySingleElf } from './most-calories'

const calculatingResult = pipe(
  join(__dirname, 'calories.txt'),
  TE.tryCatchK((filename) => readFile(filename, 'utf8'), E.toError),
  TE.chainEitherK(toMostCaloriesCarriedBySingleElf),
  TE.map(
    (count: number) => `The elf with the most calories has ${count} calories`,
  ),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
