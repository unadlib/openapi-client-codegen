import type { httpMethods } from './constant';

export type HttpMethod = (typeof httpMethods)[number];

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
  ? []
  : S extends `${infer T}${D}${infer Rest}`
  ? [T, ...Split<Rest, D>]
  : [S];

/**
 * the default value is `~`
 */
type Param = string;

type BuildObjectPath<T extends string[], P, O> = T extends [
  infer First,
  ...infer Rest,
]
  ? First extends `{${string}}`
    ? First extends string
      ? Rest extends string[]
        ? (param?: Param) => BuildObjectPath<Rest, P, O>
        : P
      : P
    : First extends string
    ? Rest extends string[]
      ? { [K in First]: BuildObjectPath<Rest, P, O> }
      : { [K in First]: P }
    : P
  : DeepTransform<P, O>;

type FunctionChaining<S extends string, P, O> = BuildObjectPath<
  Split<S, '/'>,
  P,
  O
>;

type RemoveLeadingSlash<T extends string> = T extends `/${infer Rest}`
  ? RemoveLeadingSlash<Rest>
  : T;

type ToFunctionChaining<T extends {}, O> = {
  [K in keyof T]: K extends string
    ? FunctionChaining<RemoveLeadingSlash<K>, T[K], O>
    : never;
}[keyof T];

type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => 0 : never
) extends (arg: infer I) => 0
  ? I
  : never;

export type API<T extends {}, O> = UnionToIntersection<
  ToFunctionChaining<T, O>
>;

type DeepTransform<T, O> = T extends (...args: any[]) => any
  ? (...args: Parameters<T>) => DeepTransform<ReturnType<T>, O>
  : {
      [K in keyof T]: T[K] extends (...args: any[]) => infer R
        ? (...args: Parameters<T[K]>) => DeepTransform<R, O>
        : K extends HttpMethod
        ? APIRequest<T[K], O>
        : DeepTransform<T[K], O>;
    };

type APIRequest<T, O> = (
  ...args: T extends {
    parameters: infer P;
    requestBody: {
      content?: {
        'application/json'?: infer B;
      };
    };
  }
    ? P extends { query: infer Q }
      ? [{ body: B; query: Q; params?: O }]
      : P extends { query?: infer Q }
      ? [{ body: B; query?: Q; params?: O }]
      : [{ body: B; params?: O }]
    : T extends {
        parameters: infer P;
      }
    ? P extends { query: infer Q }
      ? [{ query: Q; params?: O }]
      : P extends { query?: infer Q }
      ? [{ query?: Q; params?: O }?]
      : [{ params?: O }?]
    : T extends {
        requestBody: {
          content?: {
            'application/json'?: infer B;
          };
        };
      }
    ? [{ body: B; params?: O }]
    : [{ params?: O }?]
) => Promise<
  T extends {
    responses: {
      200: {
        content: {
          'application/json': infer R;
        };
      };
    };
  }
    ? R
    : any
>;

export type RequestOptions<O = any> = {
  /**
   * request URL
   */
  url: string;
  /**
   * request method
   */
  method: HttpMethod;
  /**
   * request query
   */
  query?: Record<string, any>;
  /**
   * request body
   */
  body?: any;
  /**
   * request params
   */
  params?: O;
};
