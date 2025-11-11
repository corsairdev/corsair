type CamelToKebab<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? ` ${Lowercase<First>}${CamelToKebab<Rest>}`
    : `${First}${CamelToKebab<Rest>}`
  : S

type CamelToSpacedLowercase<S extends string> =
  CamelToKebab<S> extends ` ${infer Rest}` ? Rest : CamelToKebab<S>

type FunctionMap<T> = {
  [K in keyof T as K extends string ? CamelToSpacedLowercase<K> : never]: T[K]
}

export function operationsMap<T extends Record<string, Function>>(
  module: T
): FunctionMap<T> {
  const result = {} as any

  for (const key in module) {
    if (typeof module[key] === 'function') {
      const spacedKey = key
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()

      result[spacedKey] = module[key]
    }
  }

  return result
}
