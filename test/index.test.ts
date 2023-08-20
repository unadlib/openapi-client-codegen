import { createClient } from '../src';
import { paths } from '../examples/schema';

test('base', async () => {
  const client = createClient<paths>();

  const a = await client.pet().get();
  const b = await client.store.order().get();
  const c = await client.store.inventory.get();
  const d = await client.pet.findByTags.get();
  const e = await client.pet().post();
  const f = await client.pet.post({
    name: 's',
    photoUrls: ['1'],
  });
});
