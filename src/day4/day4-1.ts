import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toCountOfFullyContainedSectionAssignmentsWithinPairs } from './count-fully-contained-section-assignments'

const calculatingResult = pipe(
  join(__dirname, 'pair-section-assignments.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherK(toCountOfFullyContainedSectionAssignmentsWithinPairs),
  TE.map(
    (count: number) =>
      `The total count of fully contained section assignments within pairs is ${count}`,
  ),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
