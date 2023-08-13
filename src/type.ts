type Method =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch";

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
  ? []
  : S extends `${infer T}${D}${infer Rest}`
  ? [T, ...Split<Rest, D>]
  : [S];

type BuildObjectPath<T extends string[], P> = T extends [
  infer First,
  ...infer Rest
]
  ? First extends `{${string}}`
    ? First extends string
      ? Rest extends string[]
        ? () => BuildObjectPath<Rest, P>
        : P
      : P
    : First extends string
    ? Rest extends string[]
      ? { [K in First]: BuildObjectPath<Rest, P> }
      : { [K in First]: P }
    : P
  : P;

type FunctionChaining<S extends string, P> = BuildObjectPath<Split<S, "/">, P>;

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

type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
  ? L
  : never;

type UnionToTuple<T, Last = LastInUnion<T>> = [T] extends [never]
  ? []
  : [Last, ...UnionToTuple<Exclude<T, Last>>];

type MergeDeepMultiple<T extends any[]> = T extends [infer First, ...infer Rest]
  ? Rest extends any[]
    ? DeepMerge<First, MergeDeepMultiple<Rest>>
    : never
  : {};

type DeepMerge<T, U> = T extends (...args: any[]) => any
  ? U extends (...args: any[]) => any
    ? (...args: Parameters<T>) => DeepMerge<ReturnType<T>, ReturnType<U>>
    : T
  : U extends (...args: any[]) => any
  ? U
  : T extends object
  ? U extends object
    ? {
        [K in keyof T | keyof U]: K extends Method
          ? K extends keyof U
            ? U[K]
            : K extends keyof T
            ? T[K]
            : never
          : K extends keyof T & keyof U
          ? DeepMerge<T[K], U[K]>
          : K extends keyof T
          ? T[K]
          : K extends keyof U
          ? U[K]
          : never;
      }
    : T
  : U;

export type API<T extends {}> =
  MergeDeepMultiple<UnionToTuple<ToFunctionChaining<T>>>;
