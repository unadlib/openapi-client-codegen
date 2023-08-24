# openapi-client-codegen

Node.js library that generates Typescript function chaining clients based on the OpenAPI specification.

- Full type
- Faster
- Small
- Powerful

## Usage

```sh
npx openapi-typescript examples/example.yaml -o examples/schema.d.ts
```

```ts
import { createClient } from 'openapi-client-codegen';

const client = createClient<paths>({
  baseUrl: 'http://localhost:8080',
  request: async (options) => {
    // using fetch or custom fetch API
  },
});
```
