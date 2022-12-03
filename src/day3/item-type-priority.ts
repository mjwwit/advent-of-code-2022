import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'

const lowerCaseAlphabetArray = new Array(26)
  .fill(0)
  .map((_, i) => i + 'a'.charCodeAt(0))
const upperCaseAlphabetArray = new Array(26)
  .fill(0)
  .map((_, i) => i + 'A'.charCodeAt(0))

export const rucksackItemTypeToPriorityMap = pipe(
  [...lowerCaseAlphabetArray, ...upperCaseAlphabetArray],
  RA.map((charCode) => String.fromCharCode(charCode)),
  RA.reduceWithIndex({} as Record<string, number>, (i, acc, char) =>
    Object.assign(acc, { [char]: i + 1 }),
  ),
)
