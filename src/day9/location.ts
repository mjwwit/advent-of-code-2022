export type Location = [number, number]
export const eqLocation = {
  equals: (a: Location, b: Location) => a[0] === b[0] && a[1] === b[1],
}
