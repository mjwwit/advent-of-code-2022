import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { identity, pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toIndexAfterFirstStartOfMessageMarker } from './start-of-message-marker'

const calculatingResult = pipe(
  join(__dirname, 'buffer.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherK(toIndexAfterFirstStartOfMessageMarker),
  TE.chainOptionK(() => new Error('No marker found'))(identity),
  TE.map(
    (result) =>
      `The index after the first start-of-message marker is ${result}`,
  ),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
