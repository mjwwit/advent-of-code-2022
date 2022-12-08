import * as E from 'fp-ts/Either'
import { toSumOfDirectoriesAtMost100kb } from './sum-100kb-dir-size copy'

const input = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`

describe('Day 7 challenge 1', () => {
  it('should calculate the solution', () => {
    expect(toSumOfDirectoriesAtMost100kb(input)).toEqual(E.right(95437))
  })
})
