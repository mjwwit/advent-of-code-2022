import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toVisibleTreeCount } from './count-visible-trees'

const calculatingResult = pipe(
  join(__dirname, 'tree-heights.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherK(toVisibleTreeCount),
  TE.map((result) => `The number of visible trees is ${result}`),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
