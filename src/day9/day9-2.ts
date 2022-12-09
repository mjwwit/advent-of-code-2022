import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toNumberOfVisitedByTailPositionsUsingRopeOfLength } from './visited-locations-by-tail'

const calculatingResult = pipe(
  join(__dirname, 'motions.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherKW(toNumberOfVisitedByTailPositionsUsingRopeOfLength(10)),
  TE.map((result) => `The solution to part 2 is ${result}`),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
