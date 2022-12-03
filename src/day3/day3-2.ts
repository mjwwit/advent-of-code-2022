import { join } from 'path'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { TEtoPromise } from '../common/fp-ts-task-either'
import { toTextFileContentsFromFilename } from '../common/read-file'
import { toSumOfElfGroupBadgeTypePriorities } from './sum-elf-group-badge-priorities'

const calculatingResult = pipe(
  join(__dirname, 'rucksack-contents.txt'),
  toTextFileContentsFromFilename,
  TE.chainEitherK(toSumOfElfGroupBadgeTypePriorities),
  TE.map((n: number) => `The total priority of group badges is ${n}`),
  TEtoPromise,
)

calculatingResult.then(console.log).catch(console.error)
