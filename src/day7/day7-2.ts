import { join } from 'path'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toSizeOfSmallestDirectoryToDelete } from './find-smallest-dir-to-delete'

const calculatingResult = pipe(
  join(__dirname, 'terminal-output.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherK(toSizeOfSmallestDirectoryToDelete),
  TE.map(
    O.fold(
      () => 'There is no solution',
      (result) => `The solution is ${result}`,
    ),
  ),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
