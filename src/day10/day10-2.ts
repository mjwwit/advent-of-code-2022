import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toRenderedImageFromInstructions } from './render'

const calculatingResult = pipe(
  join(__dirname, 'instructions.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherKW(toRenderedImageFromInstructions),
  TE.map((result) => `The rendered CRT image is:\n${result}`),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
