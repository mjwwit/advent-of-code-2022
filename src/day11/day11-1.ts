import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toMonkeyBusinessLevelAfterRounds } from './monkey-business-level'

const calculatingResult = pipe(
  join(__dirname, 'notes.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherKW(toMonkeyBusinessLevelAfterRounds(20)),
  TE.map((result) => `The solution to part 1 is ${result}`),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
