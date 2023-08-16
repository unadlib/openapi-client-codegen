import { httpMethods } from './constant';
import type { API, HttpMethod } from './type';

function createClientWithProxy(base = '.'): any {
  return new Proxy(() => {}, {
    get: (target, prop: HttpMethod) => {
      if (httpMethods.includes(prop)) {
        return () => {
          console.log(base);
        };
      }
      return createClientWithProxy(`${base}/${String(prop)}`);
    },

    apply: (target, thisArg, args) => {
      const argString = args.length ? `/${args.join('~')}` : '/~';
      return createClientWithProxy(`${base}${argString}`);
    },
  });
}

export const createClient = <T extends {}>(options?: {}): API<T> => {
  return createClientWithProxy();
};
