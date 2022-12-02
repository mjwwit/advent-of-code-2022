import * as E from 'fp-ts/Either'
import { Errors } from 'io-ts'
import { PathReporter } from 'io-ts/PathReporter'

export const toErrorFromValidation =
  (message: string) =>
  (errors: Errors): Error =>
    new Error(
      `${message}:\n\t${PathReporter.report(E.left(errors)).join('\n\t')}`,
    )
