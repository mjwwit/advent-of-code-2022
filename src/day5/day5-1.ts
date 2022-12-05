import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toTopCratesAfterRearrangingOneAtATime } from './top-crates-after-rearrangement'

const calculatingResult = pipe(
  join(__dirname, 'stacks-and-movements.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherK(toTopCratesAfterRearrangingOneAtATime),
  TE.map((result) => `The top crates in each stack are "${result}"`),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
