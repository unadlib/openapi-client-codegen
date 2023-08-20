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

type BuildObjectPath<T extends string[], P> = T extends [
  infer First,
  ...infer Rest,
]
  ? First extends `{${string}}`
    ? First extends string
      ? Rest extends string[]
        ? (param?: Param) => BuildObjectPath<Rest, P>
        : P
      : P
    : First extends string
    ? Rest extends string[]
      ? { [K in First]: BuildObjectPath<Rest, P> }
      : { [K in First]: P }
    : P
  : DeepTransform<P>;

type FunctionChaining<S extends string, P> = BuildObjectPath<Split<S, '/'>, P>;

type RemoveLeadingSlash<T extends string> = T extends `/${infer Rest}`
  ? RemoveLeadingSlash<Rest>
  : T;

type ToFunctionChaining<T extends {}> = {
  [K in keyof T]: K extends string
    ? FunctionChaining<RemoveLeadingSlash<K>, T[K]>
    : never;
}[keyof T];

type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => 0 : never
) extends (arg: infer I) => 0
  ? I
  : never;

export type API<T extends {}> = UnionToIntersection<ToFunctionChaining<T>>;

type DeepTransform<T> = T extends (...args: any[]) => any
  ? (...args: Parameters<T>) => DeepTransform<ReturnType<T>>
  : {
      [K in keyof T]: T[K] extends (...args: any[]) => infer R
        ? (...args: Parameters<T[K]>) => DeepTransform<R>
        : K extends HttpMethod
        ? APIRequest<T[K]>
        : DeepTransform<T[K]>;
    };

type PathKey = 'path';

type APIRequest<T> = (
  ...args: T extends {
    parameters: infer P;
    requestBody: {
      content?: {
        'application/json'?: infer B;
      };
    };
  }
    ? Exclude<keyof P, PathKey> extends never
      ? [B]
      : ExcludeRequiredKeys<P> extends never
      ? [B, ExcludeKey<P>?]
      : [B, ExcludeKey<P>]
    : T extends {
        parameters: infer P;
      }
    ? Exclude<keyof P, PathKey> extends never
      ? []
      : ExcludeRequiredKeys<P> extends never
      ? [ExcludeKey<P>?]
      : [ExcludeKey<P>]
    : T extends {
        requestBody: {
          content?: {
            'application/json'?: infer B;
          };
        };
      }
    ? [B]
    : []
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

type ExcludeRequiredKeys<T> = Exclude<keyof T, OptionalKeys<T> | PathKey>;

type ExcludeKey<T> = Pick<T, Exclude<keyof T, PathKey>>;

type OptionalKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];
