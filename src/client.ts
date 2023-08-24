import { httpMethods } from './constant';
import type { API, HttpMethod, RequestOptions } from './type';

function createClientWithProxy(options: {
  url: string;
  request: (...args: any[]) => any;
}): any {
  return new Proxy(() => {}, {
    get: (target, prop: HttpMethod) => {
      if (httpMethods.includes(prop)) {
        return (requestOptions: RequestOptions) => {
          return options.request({
            ...requestOptions,
            method: prop,
            url: options.url,
          });
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

export const createClient = <T extends {}, P = RequestInit>(options: {
  baseUrl: string;
  request: (options: RequestOptions<P>) => any;
}): API<T, P> => {
  return createClientWithProxy({
    url: options.baseUrl,
    request: options.request,
  });
};
