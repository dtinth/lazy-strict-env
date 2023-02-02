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

// One way to use it is to separate the schema into multiple slices.
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
