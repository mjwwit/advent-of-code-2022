import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { identity, pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toIndexAfterFirstStartOfPacketMarker } from './start-of-packet-marker'

const calculatingResult = pipe(
  join(__dirname, 'buffer.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherK(toIndexAfterFirstStartOfPacketMarker),
  TE.chainOptionK(() => new Error('No marker found'))(identity),
  TE.map(
    (result) => `The index after the first start-of-packet marker is ${result}`,
  ),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
