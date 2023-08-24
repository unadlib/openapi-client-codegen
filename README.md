# openapi-client-codegen

![Node CI](https://github.com/unadlib/openapi-client-codegen/workflows/Node%20CI/badge.svg)
[![npm](https://img.shields.io/npm/v/mutative.svg)](https://www.npmjs.com/package/openapi-client-codegen)
![license](https://img.shields.io/npm/l/openapi-client-codegen)

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

// use function chaining client with type
const result0 = await client.pet().get();
const result1 = await client.store.order().get();
const result2 = await client.store.inventory.get();
const result3 = await client.pet.findByTags.get();
const result4 = await client.pet().post();
const result5 = await client.pet.post({
  body: {
    name: 'dog',
    photoUrls: ['http://example.com/dog.jpg'],
  },
});
```

## License

openapi-client-codegen is [MIT licensed](https://github.com/unadlib/openapi-client-codegen/blob/main/LICENSE).
