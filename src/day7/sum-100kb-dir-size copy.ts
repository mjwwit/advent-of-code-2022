import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { toSumFromNumbers } from '../common/sum'
import {
  toCommandsWithOutput,
  toDirectoriesWithSize,
  toDirectoriesWithTotalSize,
  toFullDirectoriesWithFiles,
} from './file-system'
import { toParsedTerminalOutput } from './parse'

export const toSumOfDirectoriesAtMost100kb = (rawTerminalOutput: string) =>
  pipe(
    toParsedTerminalOutput(rawTerminalOutput),
    E.map(toCommandsWithOutput),
    E.map(toFullDirectoriesWithFiles),
    E.map(toDirectoriesWithSize),
    E.map(toDirectoriesWithTotalSize),
    E.map(A.filter((node) => node.size <= 100_000)),
    E.map(A.map((node) => node.size)),
    E.map(toSumFromNumbers),
  )
