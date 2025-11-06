import { Project, SyntaxKind, VariableDeclarationKind } from 'ts-morph'
import * as path from 'path'
import { promises as fs } from 'fs'
import { spawn } from 'child_process'
import { format } from 'prettier'
import { loadConfig, getResolvedPaths } from '../../config.js'

export interface OperationToWrite {
  operationName: string
  operationType: 'query' | 'mutation'
  prompt: string
  inputType: string
  handler: string
  dependencies?: {
    tables?: string[]
    columns?: string[]
  }
  pseudocode?: string
  functionNameSuggestion?: string
  targetFilePath?: string
}

function kebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export async function writeOperationToFile(
  operation: OperationToWrite
): Promise<void> {
  const projectRoot = process.cwd()
  const operationTypePlural =
    operation.operationType === 'query' ? 'queries' : 'mutations'

  // 1. Create the new operation file
  const newOperationFileName = `${kebabCase(operation.operationName)}.ts`
  const cfg = loadConfig()
  const pathsResolved = getResolvedPaths(cfg)
  const baseDir =
    operation.operationType === 'query'
      ? pathsResolved.queriesDir
      : pathsResolved.mutationsDir
  const newOperationFilePath = path.join(baseDir, newOperationFileName)

  const isQuery = operation.operationType === 'query'
  const variableName = operation.operationName
    .split(' ')
    .map((word, i) =>
      i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('')

  const sanitizedPseudocode = (operation.pseudocode ?? 'N/A').replace(
    /\*\//g,
    '* /'
  )
  let newOperationCode = `
    /**
     * @presudo ${sanitizedPseudocode}
     * @input_type ${operation.inputType}
     */
    import { z } from 'corsair/core'
    import { ${isQuery ? 'query' : 'mutation'} } from '../instances'
    import { drizzle } from 'corsair/db/types'

    export const ${variableName} = ${isQuery ? 'query' : 'mutation'}({
      prompt: "${operation.prompt.replace(/['"]/g, '')}",
      input_type: ${operation.inputType},
      `

  if (operation.pseudocode) {
    newOperationCode += `pseudocode: ${JSON.stringify(operation.pseudocode)},\n`
  }
  if (operation.functionNameSuggestion) {
    newOperationCode += `function_name: "${operation.functionNameSuggestion}",\n`
  }
  if (operation.dependencies) {
    newOperationCode += `dependencies: ${JSON.stringify(
      operation.dependencies,
      null,
      2
    )},\n`
  }

  newOperationCode += `
      handler: ${operation.handler},
    })
  `

  const formattedContent = await format(newOperationCode, {
    parser: 'typescript',
  })
  await fs.writeFile(newOperationFilePath, formattedContent)

  // 2. Ensure barrel export exists
  const barrelPath = path.join(baseDir, 'index.ts')

  try {
    const existingBarrel = await fs.readFile(barrelPath, 'utf8')
    const exportLine = `export * from './${newOperationFileName.replace('.ts', '')}'\n`
    if (!existingBarrel.includes(exportLine)) {
      await fs.appendFile(barrelPath, exportLine)
    }
  } catch {
    const exportLine = `export * from './${newOperationFileName.replace('.ts', '')}'\n`
    await fs.writeFile(barrelPath, exportLine)
  }

  // 3. Update operations.ts
  const operationsFilePath = pathsResolved.operationsFile
  const project = new Project()
  const operationsFile = project.addSourceFileAtPath(operationsFilePath)

  // Ensure namespace imports exist
  const moduleSpecifierRaw = path.relative(
    path.dirname(operationsFilePath),
    baseDir
  )
  let moduleSpecifier = moduleSpecifierRaw.replace(/\\/g, '/')
  if (!moduleSpecifier.startsWith('.')) {
    moduleSpecifier = './' + moduleSpecifier
  }
  const desiredNs = isQuery ? 'queriesModule' : 'mutationsModule'
  const existingNsImport = operationsFile
    .getImportDeclarations()
    .find(
      d =>
        d.getModuleSpecifierValue() === moduleSpecifier &&
        d.getNamespaceImport()
    )
  if (!existingNsImport) {
    operationsFile.addImportDeclaration({
      moduleSpecifier,
      namespaceImport: desiredNs,
    })
  }

  const operationsVar =
    operationsFile.getVariableDeclaration(operationTypePlural)
  const initializer = operationsVar?.getInitializerIfKind(
    SyntaxKind.ObjectLiteralExpression
  )

  if (initializer) {
    const propName = `"${operation.operationName}"`
    const moduleRef = `${desiredNs}.${variableName}`
    // Avoid duplicates
    const exists = initializer
      .getProperties()
      .some(p =>
        p.isKind(SyntaxKind.PropertyAssignment)
          ? p.getNameNode().getText() === propName
          : false
      )
    if (!exists) {
      initializer.addPropertyAssignment({
        name: propName,
        initializer: moduleRef,
      })
    }
  }

  operationsFile.formatText()
  await operationsFile.save()

  await new Promise<void>(resolve => {
    const child = spawn('npx', ['--yes', 'tsc', '--noEmit'], {
      stdio: 'inherit',
      shell: true,
      cwd: projectRoot,
      env: process.env,
    })
    child.on('close', () => resolve())
  })
}

export function parseInputTypeFromLLM(inputTypeString: string): string {
  const cleaned = inputTypeString.trim()

  if (cleaned.startsWith('z.object(') || cleaned.startsWith('z.')) {
    return cleaned
  }

  return `z.object(${cleaned})`
}

export function parseHandlerFromLLM(handlerString: string): string {
  const cleaned = handlerString.trim()

  if (cleaned.startsWith('async (')) {
    return cleaned
  }

  if (cleaned.startsWith('(')) {
    return `async ${cleaned}`
  }

  return cleaned
}
