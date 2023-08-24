import { createClient } from '../src';
import { paths } from '../examples/schema';

test('base', async () => {
  const client = createClient<paths>({
    baseUrl: 'http://localhost:8080',
    request: async (options) => {
      console.log(options);
      return options;
    },
  });
  const a = await client.pet().get();
  expect(a).toMatchInlineSnapshot(`
{
  "method": "get",
  "url": "http://localhost:8080/pet/~",
}
`);
  const b = await client.store.order().get();
  expect(b).toMatchInlineSnapshot(`
{
  "method": "get",
  "url": "http://localhost:8080/store/order/~",
}
`);
  const c = await client.store.inventory.get();
  expect(c).toMatchInlineSnapshot(`
{
  "method": "get",
  "url": "http://localhost:8080/store/inventory",
}
`);
  const d = await client.pet.findByTags.get();
  expect(d).toMatchInlineSnapshot(`
{
  "method": "get",
  "url": "http://localhost:8080/pet/findByTags",
}
`);
  const e = await client.pet().post();
  expect(e).toMatchInlineSnapshot(`
{
  "method": "post",
  "url": "http://localhost:8080/pet/~",
}
`);
  const f = await client.pet.post({
    body: {
      name: 's',
      photoUrls: ['1'],
    },
  });
  expect(f).toMatchInlineSnapshot(`
{
  "body": {
    "name": "s",
    "photoUrls": [
      "1",
    ],
  },
  "method": "post",
  "url": "http://localhost:8080/pet",
}
`);
  const g = await client.pet('1').delete({
    header: {
      api_key: '1',
    },
  });
  expect(g).toMatchInlineSnapshot(`
{
  "header": {
    "api_key": "1",
  },
  "method": "delete",
  "url": "http://localhost:8080/pet/1",
}
`);
});
