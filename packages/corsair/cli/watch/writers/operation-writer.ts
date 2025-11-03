import { Project, SyntaxKind, VariableDeclarationKind } from 'ts-morph'
import * as path from 'path'

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
}

export function writeOperationToFile(operation: OperationToWrite): void {
  const projectRoot = process.cwd()
  const fileName = operation.operationType === 'query' ? 'queries' : 'mutations'
  const filePath = path.join(projectRoot, 'corsair', `${fileName}.ts`)

  const project = new Project()
  const sourceFile = project.addSourceFileAtPath(filePath)

  const operationsVar = sourceFile.getVariableDeclaration(fileName)

  if (!operationsVar) {
    throw new Error(`Could not find ${fileName} variable in ${filePath}`)
  }

  const initializer = operationsVar.getInitializer()

  if (!initializer?.isKind(SyntaxKind.ObjectLiteralExpression)) {
    throw new Error(`${fileName} variable is not an object literal expression`)
  }

  const cleanPrompt = operation.prompt.replace(/['"]/g, '')
  const functionType =
    operation.operationType === 'query' ? 'query' : 'mutation'

  let newOperationCode = `  "${operation.operationName}": ${functionType}({\n`
  newOperationCode += `    prompt: "${cleanPrompt}",\n`
  newOperationCode += `    input_type: ${operation.inputType},\n`

  if (operation.dependencies) {
    newOperationCode += `    dependencies: {\n`
    if (operation.dependencies.tables) {
      newOperationCode += `      tables: [${operation.dependencies.tables
        .map(t => `"${t}"`)
        .join(', ')}],\n`
    }
    if (operation.dependencies.columns) {
      newOperationCode += `      columns: [${operation.dependencies.columns
        .map(c => `"${c}"`)
        .join(', ')}],\n`
    }
    newOperationCode += `    },\n`
  }

  newOperationCode += `    handler: ${operation.handler},\n`
  newOperationCode += `  })`

  const existingProperties = initializer.getProperties()
  const lastProperty = existingProperties[existingProperties.length - 1]

  if (lastProperty) {
    lastProperty.replaceWithText(
      lastProperty.getText() + ',\n\n' + newOperationCode
    )
  } else {
    initializer.addPropertyAssignment({
      name: `"${operation.operationName}"`,
      initializer: newOperationCode.trim(),
    })
  }

  sourceFile.formatText()
  sourceFile.saveSync()
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

