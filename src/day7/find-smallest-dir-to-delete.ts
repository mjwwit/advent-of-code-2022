import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import { Ord } from 'fp-ts/lib/Ord'
import { pipe } from 'fp-ts/lib/function'
import { toSumFromNumbers } from '../common/sum'
import {
  DirectoryWithSize,
  toCommandsWithOutput,
  toDirectoriesWithSize,
  toDirectoriesWithTotalSize,
  toFullDirectoriesWithFiles,
} from './file-system'
import { toParsedTerminalOutput } from './parse'

export const toSizeOfSmallestDirectoryToDelete = (rawTerminalOutput: string) =>
  pipe(
    toParsedTerminalOutput(rawTerminalOutput),
    E.map(toCommandsWithOutput),
    E.map(toFullDirectoriesWithFiles),
    E.map(toDirectoriesWithSize),
    E.bindTo('directoriesWithSize'),
    E.bind('directoriesWithTotalSize', ({ directoriesWithSize }) =>
      E.of<Error, DirectoryWithSize[]>(
        toDirectoriesWithTotalSize(directoriesWithSize),
      ),
    ),
    E.apS('totalDiskSpace', E.of<Error, number>(70_000_000)),
    E.apS('requiredDiskSpace', E.of<Error, number>(30_000_000)),
    E.bind(
      'usedDiskSpace',
      ({ directoriesWithSize }): E.Either<Error, number> =>
        pipe(
          directoriesWithSize,
          A.map((d) => d.size),
          I.map(toSumFromNumbers),
          E.of,
        ),
    ),
    E.map(
      ({
        directoriesWithTotalSize,
        totalDiskSpace,
        requiredDiskSpace,
        usedDiskSpace,
      }) =>
        pipe(
          directoriesWithTotalSize,
          A.sort(toObjectPropertyOrd<DirectoryWithSize, 'size'>('size')),
          A.findFirst(
            (d) =>
              totalDiskSpace - (usedDiskSpace - d.size) >= requiredDiskSpace,
          ),
        ),
    ),
    E.map(O.map((d) => d.size)),
  )

const toObjectPropertyOrd = <O extends Record<K, number>, K extends keyof O>(
  key: K,
): Ord<O> => ({
  equals: (a, b) => a[key] === b[key],
  compare: (a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0),
})
