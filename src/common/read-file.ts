import { readFile } from 'fs/promises'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'

export const toTextFileContentsFromFilename = TE.tryCatchK(
  (filename: string) => readFile(filename, 'utf8'),
  E.toError,
)
