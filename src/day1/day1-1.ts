import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toMostCaloriesCarriedBySingleElf } from './most-calories'

const calculatingResult = pipe(
  join(__dirname, 'calories.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherK(toMostCaloriesCarriedBySingleElf),
  TE.map(
    (count: number) => `The elf with the most calories has ${count} calories`,
  ),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
