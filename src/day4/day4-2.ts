import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toCountOfOverlappingSectionAssignmentsWithinPairs } from './count-overlapping-section-assignments'

const calculatingResult = pipe(
  join(__dirname, 'pair-section-assignments.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherK(toCountOfOverlappingSectionAssignmentsWithinPairs),
  TE.map(
    (count: number) =>
      `The total count of overlapping section assignments within pairs is ${count}`,
  ),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
