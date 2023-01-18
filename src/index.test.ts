import { z } from 'zod'
import { Env } from '.'

const env = Env({
  HAIYAA: z.string().default('haiyaa'),
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env<typeof env> {}
  }
}

it('returns the target', () => {
  const target = {}
  const result = Env({}, target)
  expect(result).toBe(target)
})

it('does not throw errors immediately', () => {
  const target = {}
  Env({ X: z.string() }, target)
})

it('throws errors when attempting to access invalid value', () => {
  const target = {}
  const env = Env({ X: z.string() }, target)
  expect(() => env.X).toThrow()
})

it('allows valid values to be set', () => {
  const target = {}
  const env = Env({ X: z.string() }, target)
  env.X = 'hello'
  expect(env.X).toBe('hello')
})

it('throws errors when attempting to set invalid value', () => {
  const target = { X: 'cool' as any }
  Env({ X: z.string() }, target)
  expect(() => (target.X = 123)).toThrow()
})

it('coerces values', () => {
  const target = { X: '123' }
  const env = Env({ X: z.coerce.number() }, target)
  expect(env.X).toBe(123)
})

it('supports default values', () => {
  expect(process.env.HAIYAA).toBe('haiyaa')
})
