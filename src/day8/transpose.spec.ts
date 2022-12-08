import { pipe } from 'fp-ts/lib/function'
import { toTransposedMatrix } from './transpose'

const input = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

describe('Array transpose', () => {
  it('should transpose an array', () => {
    expect(toTransposedMatrix(input)).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ])

    expect(pipe(input, toTransposedMatrix, toTransposedMatrix)).toEqual(input)
  })
})
