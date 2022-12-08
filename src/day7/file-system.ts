import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import {
  ChangeDirectoryCommand,
  FileSystemListingDirectory,
  FileSystemListingFile,
  ListingCommand,
} from './parse'

export type CommandWithOutput<T> = T & {
  output: (FileSystemListingDirectory | FileSystemListingFile)[]
}

export const toCommandsWithOutput = (
  terminalOutput: (
    | ChangeDirectoryCommand
    | ListingCommand
    | FileSystemListingDirectory
    | FileSystemListingFile
  )[],
) =>
  pipe(
    terminalOutput,
    A.reduce(
      [] as CommandWithOutput<ListingCommand | ChangeDirectoryCommand>[],
      (commands, outputLine) =>
        outputLine.type === 'COMMAND'
          ? [...commands, { ...outputLine, output: [] }]
          : pipe(
              commands,
              A.last,
              O.map((lastCommand) => ({
                ...lastCommand,
                output: [...lastCommand.output, outputLine],
              })),
              O.map((cmd) => [...commands.slice(0, -1), cmd]),
              O.getOrElse(() => commands),
            ),
    ),
  )

interface DirectoryWithFiles {
  directory: string[]
  files: FileSystemListingFile[]
}

export const toFullDirectoriesWithFiles = (
  commandsWithOutput: CommandWithOutput<
    ChangeDirectoryCommand | ListingCommand
  >[],
) =>
  pipe(
    commandsWithOutput,
    A.reduce(
      [{ directory: [], files: [] }] as NEA.NonEmptyArray<DirectoryWithFiles>,
      (state, cmd) =>
        cmd.executable === 'cd'
          ? pipe(
              state,
              NEA.last,
              (node) => ({
                ...node,
                directory:
                  cmd.argument === '..'
                    ? node.directory.slice(0, -1)
                    : [...node.directory, cmd.argument],
              }),
              (node) => pipe(state, NEA.init, NEA.concat([node])),
            )
          : pipe(
              state,
              NEA.last,
              (node) => ({
                ...node,
                files: pipe(
                  cmd.output,
                  A.filter(
                    (item): item is FileSystemListingFile =>
                      item.type === 'FILE',
                  ),
                ),
              }),
              (node) =>
                pipe(
                  state,
                  NEA.init,
                  NEA.concat([node, { directory: node.directory, files: [] }]),
                ),
            ),
    ),
    NEA.init,
  )

export interface DirectoryWithSize {
  directory: string[]
  size: number
}

export const toDirectoriesWithSize = (directories: DirectoryWithFiles[]) =>
  pipe(
    directories,
    A.reduce([] as DirectoryWithSize[], (directories, node) => [
      ...directories,
      {
        directory: node.directory,
        size: node.files.reduce((sum, file) => sum + file.size, 0),
      },
    ]),
  )

export const toDirectoriesWithTotalSize = (directories: DirectoryWithSize[]) =>
  pipe(
    directories,
    A.reduce([] as DirectoryWithSize[], (dirs, node) => [
      ...dirs,
      {
        directory: node.directory,
        size: directories
          .filter((otherNode) =>
            directoryIsChildOf(otherNode.directory)(node.directory),
          )
          .reduce((sum, otherNode) => sum + otherNode.size, 0),
      },
    ]),
  )

const directoryIsChildOf = (possibleChild: string[]) => (directory: string[]) =>
  possibleChild.join('/').startsWith(directory.join('/'))
