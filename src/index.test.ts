import { z } from 'zod'
import { Env } from '.'

it('does not throw errors immediately', () => {
  const target = {}
  Env(z.object({ X: z.string() }), target)
})

it('throws errors when attempting to access invalid value', () => {
  const target = {}
  const env = Env(z.object({ X: z.string() }), target)
  expect(() => env.X).toThrow()
})

it('coerces values', () => {
  const target = { X: '123' }
  const env = Env(z.object({ X: z.coerce.number() }), target)
  expect(env.X).toBe(123)
})
