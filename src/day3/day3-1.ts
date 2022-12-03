import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toSumOfWronglyPackedItemPrioritiesFromRucksackContents } from './sum-wrongly-packed-item-priorities'

const calculatingResult = pipe(
  join(__dirname, 'rucksack-contents.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherK(toSumOfWronglyPackedItemPrioritiesFromRucksackContents),
  TE.map(
    (count: number) =>
      `The total priority of misplaced rucksack items is ${count}`,
  ),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
