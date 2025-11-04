import { Project, SyntaxKind, VariableDeclarationKind } from 'ts-morph'
import * as path from 'path'
import { promises as fs } from 'fs'
import { format } from 'prettier'

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
  const newOperationFilePath = path.join(
    projectRoot,
    'corsair',
    operationTypePlural,
    newOperationFileName
  )

  const functionType =
    operation.operationType === 'query' ? 'createQuery' : 'createMutation'
  const variableName = operation.operationName
    .split(' ')
    .map((word, i) =>
      i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('')

  let newOperationCode = `
    import { ${functionType}, z } from 'corsair/core'
    import { type DatabaseContext } from '../types'
    import { drizzle } from 'corsair/db/types'

    const ${operation.operationType} = ${functionType}<DatabaseContext>()

    export const ${variableName} = ${operation.operationType}({
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

  // 2. Update operations.ts
  const operationsFilePath = path.join(projectRoot, 'corsair', 'operations.ts')
  const project = new Project()
  const operationsFile = project.addSourceFileAtPath(operationsFilePath)

  // Add import
  operationsFile.addImportDeclaration({
    moduleSpecifier: `./${operationTypePlural}/${newOperationFileName.replace(
      '.ts',
      ''
    )}`,
    namedImports: [variableName],
  })

  const operationsVar =
    operationsFile.getVariableDeclaration(operationTypePlural)
  const initializer = operationsVar?.getInitializerIfKind(
    SyntaxKind.ObjectLiteralExpression
  )

  if (initializer) {
    initializer.addPropertyAssignment({
      name: `"${operation.operationName}"`,
      initializer: variableName,
    })
  }

  operationsFile.formatText()
  await operationsFile.save()
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
