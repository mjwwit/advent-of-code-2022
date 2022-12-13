import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toLengthOfBestPathToGoal } from './best-path'

const calculatingResult = pipe(
  join(__dirname, 'heightmap.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherKW(toLengthOfBestPathToGoal),
  TE.map((result) => `The length of the best path to the goal is ${result}`),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
