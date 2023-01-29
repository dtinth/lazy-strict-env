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

it('defaults to process.env', () => {
  const env = Env(z.object({ PATH: z.string() }))
  expect(env.PATH).toBe(process.env.PATH)
})

describe('.valid', () => {
  it('is true when env matches schema', () => {
    const target = { X: 'meow' }
    const env = Env(z.object({ X: z.string() }), target)
    expect(env.valid).toBe(true)
  })
  it('is false when env does not match schema', () => {
    const target = {}
    const env = Env(z.object({ X: z.string() }), target)
    expect(env.valid).toBe(false)
  })
})

describe('.error', () => {
  it('is undefined when env matches schema', () => {
    const target = { X: 'meow' }
    const env = Env(z.object({ X: z.string() }), target)
    expect(env.error).toBeUndefined()
  })
  it('is the error object when env does not match schema', () => {
    const target = {}
    const env = Env(z.object({ X: z.string() }), target)
    expect(env.error).toBeInstanceOf(Error)
  })
})
