import { createClient } from "../src";
import { paths } from './schema';

const client = createClient<paths>();

//
client.pet().delete;
client.store.order().get;