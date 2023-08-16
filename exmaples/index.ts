import { createClient } from "../src";
import { paths } from './schema';

const client = createClient<paths>();

const a = await client.pet().get();
const b = await client.store.order().get();
const c = await client.store.inventory.get();
// const d = await client.pet.findByTags;
// const e = await client.pet().post();
