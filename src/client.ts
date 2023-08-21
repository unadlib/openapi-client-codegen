import { httpMethods } from './constant';
import type { API, HttpMethod } from './type';

function createClientWithProxy(options: {
  url: string;
  request: (...args: any[]) => any;
}): any {
  return new Proxy(() => {}, {
    get: (target, prop: HttpMethod) => {
      if (httpMethods.includes(prop)) {
        return () => {
          // TODO: handle fetch query, body and fetch instance params
          return options.request({method: prop, url: options.url});
        };
      }
      const url = `${options.url}/${String(prop)}`;
      return createClientWithProxy({
        url,
        request: options.request,
      });
    },

    apply: (target, thisArg, args) => {
      const argString = args.length ? `/${args.join('~')}` : '/~';
      const url = `${options.url}${argString}`;
      return createClientWithProxy({
        url,
        request: options.request,
      });
    },
  });
}

export const createClient = <T extends {}>(options: {
  baseUrl: string;
  request: (...args: any[]) => any;
}): API<T> => {
  return createClientWithProxy({
    url: options.baseUrl,
    request: options.request,
  });
};
