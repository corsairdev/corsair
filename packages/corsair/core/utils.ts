type CamelToSpacedLowercase<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? First extends Uppercase<First>
      ? ` ${Lowercase<First>}${CamelToSpacedLowercase<Rest>}`
      : `${First}${CamelToSpacedLowercase<Rest>}`
    : S

type TrimLeadingSpace<S extends string> = S extends ` ${infer Rest}` ? Rest : S

type CamelToNaturalLanguage<S extends string> = TrimLeadingSpace<
  CamelToSpacedLowercase<S>
>

type FunctionMap<T> = {
  [K in keyof T as K extends string ? CamelToNaturalLanguage<K> : never]: T[K]
}

// Global mapping between natural language and camelCase keys
export const routeKeyMapping = new Map<string, string>()

export function operationsMap<T extends Record<string, any>>(
  module: T
): FunctionMap<T> {
  const result = {} as any

  for (const key in module) {
    if (typeof module[key] === 'function') {
      // camelCase to spaced lowercase
      const spacedKey = key
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()

      // Store the mapping for natural language -> camelCase lookup
      routeKeyMapping.set(spacedKey, key)

      result[spacedKey] = module[key]
    }
  }

  return result as FunctionMap<T>
}

// Create the router with camelCase keys but populate mapping
export function createRouterWithMapping<T extends Record<string, any>>(
  module: T
): T {
  const result = {} as any

  for (const key in module) {
    if (typeof module[key] === 'function') {
      // camelCase to spaced lowercase for mapping
      const spacedKey = key
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()

      // Store the mapping for natural language -> camelCase lookup
      routeKeyMapping.set(spacedKey, key)

      // Keep the original camelCase key for the router
      result[key] = module[key]
    }
  }

  return result as T
}

// Create a camelCase operations map for URL-safe tRPC routes
export function camelCaseOperationsMap<T extends Record<string, any>>(
  module: T
): T {
  const result = {} as any

  for (const key in module) {
    if (typeof module[key] === 'function') {
      // camelCase to spaced lowercase for mapping
      const spacedKey = key
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()

      // Store the mapping for natural language -> camelCase lookup
      routeKeyMapping.set(spacedKey, key)

      // Keep the original camelCase key for the router
      result[key] = module[key]
    }
  }

  return result as T
}

// Create operations map with BOTH natural language AND camelCase keys
export function dualKeyOperationsMap<T extends Record<string, any>>(
  module: T
): FunctionMap<T> & T {
  const result = {} as any

  for (const key in module) {
    if (typeof module[key] === 'function') {
      // camelCase to spaced lowercase
      const spacedKey = key
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()

      // Store the mapping for natural language -> camelCase lookup
      routeKeyMapping.set(spacedKey, key)

      // Register under BOTH keys - natural language for TypeScript interface
      result[spacedKey] = module[key]
      // AND camelCase for URL routing
      result[key] = module[key]
    }
  }

  return result as FunctionMap<T> & T
}
