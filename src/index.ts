/**
 * Lazily validate environment variables.
 * @packageDocumentation
 */
import type { ZodTypeAny, z } from 'zod'

/**
 * Returns a proxy object that validates environment variables on access.
 *
 * @remarks
 *  Validation is done the first time an environment variable is accessed.
 *  Environment variables that is not used at runtime will not be validated.
 *
 * @param spec - A map of environment variable names to Zod schemas.
 * @param source - The object to source the environment variables from.
 * @returns An object that returns the parsed values when accessed.
 * @public
 */
export function Env<T extends ZodTypeAny>(
  spec: T,
  source: object = process.env,
): z.infer<T> & { valid: boolean; error?: Error } {
  let result: { value: z.infer<T> } | undefined
  const getResult = () => {
    if (!result) {
      result = { value: spec.parse(source) }
    }
    return result.value
  }
  return new Proxy(source, {
    get(_target, prop) {
      switch (prop) {
        case 'valid':
          try {
            getResult()
            return true
          } catch {
            return false
          }
        case 'error':
          try {
            getResult()
            return undefined
          } catch (error) {
            return error
          }
        default:
          return getResult()[prop as keyof z.infer<T>]
      }
    },
  }) as any
}
