import { toStringFromState } from './print'

describe('State printer', () => {
  it('should print', () => {
    expect(
      toStringFromState('Test')({
        rope: [
          [0, 0],
          [1, 0],
        ],
        tailVisited: new Set([[-1, 0]]),
      }),
    ).toBe('Test:\n#H1')

    expect(
      toStringFromState('Test')({
        rope: [
          [0, 0],
          [1, 0],
          [1, 1],
        ],
        tailVisited: new Set([[-1, 0]]),
      }),
    ).toBe('Test:\n..2\n#H1')
  })
})
