import type { ZodTypeAny, z } from 'zod'

/**
 * Registers a lazily-validated schema on the environment variables
 * (`process.env`, or a custom object specified by the `target` parameter).
 *
 * @remarks
 *  Validation is done the first time an environment variable is accessed.
 *  Environment variables that is not used at runtime will not be validated.
 *
 * @param spec - A map of environment variable names to Zod schemas.
 * @param target - The object to register the environment variables on
 *  (defaults to `process.env`)
 * @returns The environment variables object (`process.env` or `target`).
 * @public
 */
export function Env<T extends Record<string, ZodTypeAny>>(
  spec: T,
  target: Record<string, string> = process.env as any,
): InferProps<T> {
  for (const key of Object.keys(spec)) {
    const schema = spec[key]
    const proxy = new EnvProxy(target[key], schema)
    Object.defineProperty(target, key, {
      get() {
        return proxy.getValue()
      },
      set(value) {
        proxy.setValue(value)
      },
      enumerable: true,
      configurable: true,
    })
  }
  return target as any
}

class EnvProxy<T> {
  parsed?: { value: T }
  constructor(private value: unknown, private schema: ZodTypeAny) {}
  getValue() {
    if (!this.parsed) {
      this.parsed = { value: this.schema.parse(this.value) }
    }
    return this.parsed.value
  }
  setValue(value: unknown) {
    this.parsed = { value: this.schema.parse(value) }
  }
}

/**
 * Takes a mapped type of Zod schemas and returns a mapped type of the inferred types.
 * @public
 */
export type InferProps<T extends Record<string, ZodTypeAny>> = {
  [K in keyof T]: T[K] extends ZodTypeAny ? z.infer<T[K]> : never
}

/**
 * Infers the object type based on the return value of {@link (Env:function)}.
 * Use it to augment the global `NodeJS.ProcessEnv` interface.
 *
 * @remarks
 *  This type simply resolves to itself to work around a TypeScript limitation
 *  where {@link https://github.com/Microsoft/TypeScript/issues/18271 | `typeof` cannot be used in the `implements` clause}.
 * @public
 */
export type Env<T extends Record<string, any>> = T
