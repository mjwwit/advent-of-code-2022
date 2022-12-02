import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

export const TEtoPromise = <A>(te: TE.TaskEither<unknown, A>): Promise<A> =>
  pipe(
    te,
    TE.fold(
      (e) => () => Promise.reject(e),
      (a) => () => Promise.resolve(a),
    ),
    (task) => task(),
  )
