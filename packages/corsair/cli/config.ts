import { existsSync } from 'fs'
import { resolve } from 'path'
import { config } from 'dotenv'
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


  if (existsSync(jsConfigPath)) {
    try {
      userConfig = parseJavaScriptConfig(jsConfigPath)
    } catch {}
  } else if (existsSync(tsConfigPath)) {
    try {
      userConfig = parseTypeScriptConfig(tsConfigPath)
    } catch {}
  }

  if (!userConfig) {
    return defaultConfig
  }

  return mergeWithDefaults(userConfig, defaultConfig)
}

function parseStringLiteral(node: any): string {
  return node.getLiteralText()
}

function parseNumericLiteral(node: any): number | string {
  const num = Number(node.getText())
  return Number.isNaN(num) ? node.getText() : num
}

function parseBooleanLiteral(node: any): boolean {
  return node.isKind(SyntaxKind.TrueKeyword)
}

function parseProcessEnv(node: any): string | undefined {
  const exprText = node.getExpression().getText()
  const name = node.getName()
  if (exprText === 'process.env') {
    return process.env[name]
  }
  return undefined
}

function parseObjectLiteral(node: any): Record<string, any> {
  const result: Record<string, any> = {}
  for (const prop of node.getProperties()) {
    if (prop.isKind(SyntaxKind.PropertyAssignment)) {
      const name = prop.getName().replace(/['"`]/g, '')
      const valueNode = prop.getInitializer()
      result[name] = parseAstNode(valueNode)
    }
  }
  return result
}

function parseArrayLiteral(node: any): any[] {
  return node.getElements().map((el: any) => parseAstNode(el))
}

function parseAstNode(node: any): any {
  if (!node) return undefined

  if (node.isKind(SyntaxKind.StringLiteral) || node.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)) {
    return parseStringLiteral(node)
  }

  if (node.isKind(SyntaxKind.NumericLiteral)) {
    return parseNumericLiteral(node)
  }

  if (node.isKind(SyntaxKind.TrueKeyword) || node.isKind(SyntaxKind.FalseKeyword)) {
    return parseBooleanLiteral(node)
  }

  if (node.isKind(SyntaxKind.NonNullExpression)) {
    return parseAstNode(node.getExpression())
  }

  if (node.isKind(SyntaxKind.PropertyAccessExpression)) {
    const envValue = parseProcessEnv(node)
    if (envValue !== undefined) return envValue
  }

  if (node.isKind(SyntaxKind.ObjectLiteralExpression)) {
    return parseObjectLiteral(node)
  }

  if (node.isKind(SyntaxKind.ArrayLiteralExpression)) {
    return parseArrayLiteral(node)
  }

  const text = node.getText()
  return typeof text === 'string' ? text.replace(/['"`]/g, '') : text
}

function parseTypeScriptConfig(configPath: string): any {
  const project = new Project()
  const sourceFile = project.addSourceFileAtPath(configPath)

  const exportAssignment = sourceFile.getExportAssignment(() => true)
  let configExpression = exportAssignment?.getExpression()

  if (!configExpression) {
    const configVariable = sourceFile.getVariableDeclaration('config')
    const initializer = configVariable?.getInitializer()
    if (initializer) {
      const objectLiteral = initializer.getFirstDescendantByKind(SyntaxKind.ObjectLiteralExpression)
      if (objectLiteral) {
        configExpression = objectLiteral
      }
    }
  }

  if (configExpression?.isKind(SyntaxKind.ObjectLiteralExpression)) {
    const configObject: Record<string, any> = {}
    for (const property of configExpression.getProperties()) {
      if (property.isKind(SyntaxKind.PropertyAssignment)) {
        const propertyName = property.getName().replace(/['"`]/g, '')
        const valueNode = property.getInitializer()
        const value = parseAstNode(valueNode)
        if (propertyName) configObject[propertyName] = value
      }
    }
    return configObject
  }

  return null
}

function parseJavaScriptConfig(configPath: string): any {
  const module = require(configPath)
  return module?.config ?? module?.default ?? module
}

function mergeWithDefaults(userConfig: any, defaultConfig: CorsairConfig): CorsairConfig {
  const convertToPaths = (config: any): CorsairPaths => {
    if (config.paths) {
      return {
        queries: config.paths.queries ?? defaultConfig.paths.queries,
        mutations: config.paths.mutations ?? defaultConfig.paths.mutations,
        schema: config.paths.schema ?? defaultConfig.paths.schema,
        apiEndpoint: config.paths.apiEndpoint ?? config.paths.api ?? defaultConfig.paths.apiEndpoint,
      }
    }
    return {
      queries: config.queries ?? defaultConfig.paths.queries,
      mutations: config.mutations ?? defaultConfig.paths.mutations,
      schema: config.schema ?? defaultConfig.paths.schema,
      apiEndpoint: config.apiEndpoint ?? config.api ?? defaultConfig.paths.apiEndpoint,
    }
  }

  return {
    ...userConfig,
    paths: convertToPaths(userConfig),
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
