import type { ZodTypeAny, z } from 'zod'

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

export type InferProps<T extends Record<string, ZodTypeAny>> = {
  [K in keyof T]: T[K] extends ZodTypeAny ? z.infer<T[K]> : never
}

export type Env<T extends Record<string, any>> = T
