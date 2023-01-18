# lazy-strict-env

Registers a lazily-validated Zod schema on the environment variables.
Validation is done the first time an environment variable is accessed, so environment variables that is not used at runtime will not be validated.

## Synopsis

```ts
import Env from 'lazy-strict-env'
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
```
