import * as RA from 'fp-ts/ReadonlyArray'

export const toSumFromNumbers = RA.reduce<number, number>(
  0,
  (acc, n) => acc + n,
)
