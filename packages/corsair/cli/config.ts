import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { config } from 'dotenv'
import { pathToFileURL } from 'url'
import { Project, SyntaxKind } from 'ts-morph'

export interface CorsairPaths {
  queries: string
  mutations: string
  schema: string
  apiEndpoint: string
}

export interface CorsairConfig {
  paths: CorsairPaths
  envFile?: string
  out?: string
}

export function loadConfig(): CorsairConfig {
  const tsConfigPath = resolve(process.cwd(), 'corsair.config.ts')
  const jsConfigPath = resolve(process.cwd(), 'corsair.config.js')

  const defaultConfig: CorsairConfig = {
    paths: {
      queries: 'corsair/queries',
      mutations: 'corsair/mutations',
      schema: 'corsair/schema.ts',
      apiEndpoint: 'api/corsair',
    },
    envFile: '.env.local',
    out: './corsair/drizzle',
  }

  let userConfig: any = null

  const getNodeValue = (node: any): any => {
    if (!node) return undefined

    if (
      node.isKind(SyntaxKind.StringLiteral) ||
      node.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)
    ) {
      return node.getLiteralText()
    }

    if (node.isKind(SyntaxKind.NumericLiteral)) {
      const num = Number(node.getText())
      return Number.isNaN(num) ? node.getText() : num
    }

    if (node.isKind(SyntaxKind.TrueKeyword)) return true
    if (node.isKind(SyntaxKind.FalseKeyword)) return false

    if (node.isKind(SyntaxKind.NonNullExpression)) {
      return getNodeValue(node.getExpression())
    }

    if (node.isKind(SyntaxKind.PropertyAccessExpression)) {
      const exprText = node.getExpression().getText()
      const name = node.getName()
      if (exprText === 'process.env') {
        return process.env[name]
      }
    }

    if (node.isKind(SyntaxKind.ObjectLiteralExpression)) {
      const result: Record<string, any> = {}
      for (const prop of node.getProperties()) {
        if (prop.isKind(SyntaxKind.PropertyAssignment)) {
          const name = prop.getName().replace(/['"`]/g, '')
          const valueNode = prop.getInitializer()
          result[name] = getNodeValue(valueNode)
        }
      }
      return result
    }

    if (node.isKind(SyntaxKind.ArrayLiteralExpression)) {
      return node.getElements().map((el: any) => getNodeValue(el))
    }

    const text = node.getText()
    return typeof text === 'string' ? text.replace(/['"`]/g, '') : text
  }

  if (existsSync(jsConfigPath)) {
    try {
      const mod = require(jsConfigPath)
      userConfig = mod?.config ?? mod?.default ?? mod
    } catch {}
  } else if (existsSync(tsConfigPath)) {
    try {
      const project = new Project()
      const sf = project.addSourceFileAtPath(tsConfigPath)
      const exportAssignment = sf.getExportAssignment(() => true)
      let expr = exportAssignment?.getExpression()

      if (!expr) {
        const configVar = sf.getVariableDeclaration('config')
        const init = configVar?.getInitializer()
        if (init) {
          const objLiteral = init.getFirstDescendantByKind(
            SyntaxKind.ObjectLiteralExpression
          )
          if (objLiteral) {
            expr = objLiteral
          }
        }
      }

      if (expr?.isKind(SyntaxKind.ObjectLiteralExpression)) {
        const obj: Record<string, any> = {}
        for (const prop of expr.getProperties()) {
          if (prop.isKind(SyntaxKind.PropertyAssignment)) {
            const name = prop.getName().replace(/['"`]/g, '')
            const valueNode = prop.getInitializer()
            const value = getNodeValue(valueNode)
            if (name) obj[name] = value
          }
        }
        userConfig = obj
      }
    } catch {}
  }

  if (!userConfig) {
    return defaultConfig
  }

  const flatToPaths = (cfg: any): CorsairPaths => {
    if (cfg.paths) {
      return {
        queries: cfg.paths.queries ?? defaultConfig.paths.queries,
        mutations: cfg.paths.mutations ?? defaultConfig.paths.mutations,
        schema: cfg.paths.schema ?? defaultConfig.paths.schema,
        apiEndpoint:
          cfg.paths.apiEndpoint ??
          cfg.paths.api ??
          defaultConfig.paths.apiEndpoint,
      }
    }
    return {
      queries: cfg.queries ?? defaultConfig.paths.queries,
      mutations: cfg.mutations ?? defaultConfig.paths.mutations,
      schema: cfg.schema ?? defaultConfig.paths.schema,
      apiEndpoint:
        cfg.apiEndpoint ?? cfg.api ?? defaultConfig.paths.apiEndpoint,
    }
  }

  return {
    ...userConfig,
    paths: flatToPaths(userConfig),
    envFile: userConfig.envFile ?? defaultConfig.envFile,
    out: userConfig.out ?? defaultConfig.out,
  }
}

export function loadEnv(envFile: string): void {
  const possibleEnvFiles = [envFile, '.env.local', '.env']

  for (const file of possibleEnvFiles) {
    const envPath = resolve(process.cwd(), file)
    if (existsSync(envPath)) {
      config({ path: envPath })
      return
    }
  }
}

export function checkDatabaseUrl(): void {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment')
    console.error('   Please set DATABASE_URL in your .env file\n')
    process.exit(1)
  }
}

export function getResolvedPaths(cfg: CorsairConfig): {
  queriesDir: string
  mutationsDir: string
  schemaFile: string
  operationsFile: string
} {
  const queriesDir = resolve(process.cwd(), cfg.paths.queries)
  const mutationsDir = resolve(process.cwd(), cfg.paths.mutations)
  const schemaFile = resolve(process.cwd(), cfg.paths.schema)
  const operationsFile = resolve(queriesDir, '..', 'operations.ts')
  return { queriesDir, mutationsDir, schemaFile, operationsFile }
}

export function validatePaths(cfg: CorsairConfig): string[] {
  const warnings: string[] = []
  const { queriesDir, mutationsDir } = getResolvedPaths(cfg)
  if (!existsSync(queriesDir)) warnings.push(`queries: ${queriesDir}`)
  if (!existsSync(mutationsDir)) warnings.push(`mutations: ${mutationsDir}`)
  return warnings
}
