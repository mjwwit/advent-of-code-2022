import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toMaximumScenicScoreForTrees } from './max-scenic-score'

const calculatingResult = pipe(
  join(__dirname, 'tree-heights.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherK(toMaximumScenicScoreForTrees),
  TE.map((result) => `The maximum scenic score of all trees is ${result}`),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
