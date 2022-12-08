export class CombinedError extends Error {
  constructor(message: string, public errors: readonly Error[]) {
    super(message)
  }
}
