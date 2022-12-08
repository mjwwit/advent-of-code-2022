import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import * as B from 'fp-ts/boolean'
import { flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as t from 'io-ts'
import { IntFromString } from 'io-ts-types'
import { CombinedError } from '../common/combined-error'
import { toErrorFromValidation } from '../common/validation-error'

export const Executable = t.union(
  [t.literal('cd'), t.literal('ls')],
  'Executable',
)
export type Executable = t.TypeOf<typeof Executable>

export interface ChangeDirectoryCommand {
  type: 'COMMAND'
  executable: 'cd'
  argument: string
}

export interface ListingCommand {
  type: 'COMMAND'
  executable: 'ls'
}

export interface FileSystemListingDirectory {
  type: 'DIRECTORY'
  name: string
}

export interface FileSystemListingFile {
  type: 'FILE'
  name: string
  size: t.Int
}

export const toParsedTerminalOutput = (rawTerminalOutput: string) =>
  pipe(
    rawTerminalOutput,
    S.split('\n'),
    RA.filter(Boolean),
    RA.map(toParsedLine),
    (lines) =>
      RA.lefts(lines).length
        ? E.left(new CombinedError('Invalid terminal output', RA.lefts(lines)))
        : E.right(RA.rights(lines)),
    E.map(RA.toArray),
  )

const toParsedLine = (rawTerminalOutputLine: string) =>
  pipe(
    rawTerminalOutputLine.startsWith('$ '),
    B.match<
      E.Either<
        Error,
        | ChangeDirectoryCommand
        | ListingCommand
        | FileSystemListingDirectory
        | FileSystemListingFile
      >
    >(
      () => toParsedFilesystemListingOutput(rawTerminalOutputLine),
      () => toParsedTerminalCommand(rawTerminalOutputLine),
    ),
  )

const toParsedFilesystemListingOutput = (rawTerminalOutputLine: string) =>
  pipe(
    rawTerminalOutputLine.startsWith('dir'),
    B.match<
      E.Either<Error, FileSystemListingFile | FileSystemListingDirectory>
    >(
      () =>
        pipe(
          rawTerminalOutputLine,
          S.split(' '),
          t.tuple([IntFromString, t.string]).decode,
          E.mapLeft(toErrorFromValidation('Invalid ls output')),
          E.map(([size, name]) => ({
            type: 'FILE',
            name,
            size,
          })),
        ),
      () =>
        pipe(
          rawTerminalOutputLine,
          S.split(' '),
          RA.lookup(1),
          E.fromOption(() => new Error('No directory name')),
          E.map((name) => ({
            type: 'DIRECTORY',
            name,
          })),
        ),
    ),
  )

const toParsedTerminalCommand = flow(
  S.split(' '),
  RA.tail,
  E.fromOption(() => new Error('No executable given')),
  E.chain(
    flow(
      t.union([
        t.tuple([t.literal('ls')]),
        t.tuple([t.literal('cd'), t.string]),
      ]).decode,
      E.mapLeft(toErrorFromValidation('Invalid terminal command')),
    ),
  ),
  E.map((cmd): ChangeDirectoryCommand | ListingCommand => ({
    type: 'COMMAND',
    ...(cmd[0] === 'cd'
      ? {
          executable: 'cd',
          argument: cmd[1],
        }
      : { executable: 'ls' }),
  })),
)
