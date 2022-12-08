import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toSumOfDirectoriesAtMost100kb } from './sum-100kb-dir-size copy'

const calculatingResult = pipe(
  join(__dirname, 'terminal-output.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherKW(toSumOfDirectoriesAtMost100kb),
  TE.map((result) => `The total size is ${result}`),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
