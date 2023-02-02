# lazy-strict-env

Registers a lazily-validated Zod schema on the environment variables.
Validation is done the first time an environment variable is accessed, so environment variables that is not used at runtime will not be validated.

## Synopsis

```ts
import { Env } from 'lazy-strict-env'
import { z } from 'zod'

// No errors thrown here if PORT or DATABASE_URL is not set.
const env = Env(
  z.object({
    PORT: z.coerce.number(),
    DATABASE_URL: z.string(),
  }),
)

// The first time it is accessed, schema is validated and
// an error is thrown if PORT or DATABASE_URL is not specified.
env.PORT

// Three more APIs are available:
env.valid // true if env conforms to schema
env.error // zod error object if env does not conform to schema
env.validate() // performs validation immediately (make it eager)

// When an error is thrown or returned from `.error`,
// the error object will be an instance of `EnvError`,
// and its message will look like this:
//
//     EnvError: env.PORT: Expected number, received nan (invalid_type), env.DATABASE_URL: Required (invalid_type)

// One way to use it is to separate the schema into multiple slices.
// It allows different slices to be validated separately at different times.
// This can be useful for e.g. CLI scripts where operations that require
// certain environment variables can be validated separately.
const config = {
  aws: Env(
    z.object({
      AWS_ACCESS_KEY_ID: z.string(),
      AWS_SECRET_ACCESS_KEY: z.string(),
      AWS_REGION: z.string(),
    }),
  ),
  cloudflare: Env(
    z.object({
      CLOUDFLARE_API_TOKEN: z.string(),
      CLOUDFLARE_ZONE_ID: z.string(),
    }),
  ),
  github: Env(
    z.object({
      GITHUB_TOKEN: z.string(),
    }),
  ),
}
```
