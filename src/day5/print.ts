import * as A from 'fp-ts/Array'
import * as I from 'fp-ts/Identity'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { Stacks } from './parse'

const toStringFromCrate = (crate: string) => `[${crate}]`
export const toStringFromState = (state: Stacks) =>
  pipe(
    Object.entries(state).sort(([a], [b]) => a.charCodeAt(0) - b.charCodeAt(0)),
    A.map(([i, stack]) => [i, pipe(stack, A.reverse)] as const),
    I.bindTo('sorted'),
    I.bind('maxSize', ({ sorted }) =>
      Math.max(...sorted.map(([, stack]) => stack.length)),
    ),
    I.map(({ sorted, maxSize }) =>
      pipe(
        new Array(maxSize).fill(''),
        A.mapWithIndex((i) =>
          pipe(
            sorted,
            A.map(([, stack]) =>
              pipe(
                stack,
                A.lookup(i),
                O.fold(() => '   ', toStringFromCrate),
              ),
            ),
            (layer) => layer.join(' '),
          ),
        ),
        A.reverse,
        (line) => line.join('\n'),
        (lines) => `${lines}\n${sorted.map(([n]) => ` ${n} `).join(' ')}`,
      ),
    ),
  )
