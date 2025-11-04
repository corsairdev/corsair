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
  pseudocode?: string
  functionNameSuggestion?: string
  targetFilePath?: string
}

export function writeOperationToFile(operation: OperationToWrite): void {
  const projectRoot = process.cwd()
  const fileName = operation.operationType === 'query' ? 'queries' : 'mutations'
  const defaultFilePath = path.join(projectRoot, 'corsair', `${fileName}.ts`)

  const candidatePaths = operation.targetFilePath
    ? [operation.targetFilePath, defaultFilePath]
    : [defaultFilePath]

  const project = new Project()
  let sourceFile = undefined as
    | ReturnType<Project['addSourceFileAtPath']>
    | undefined
  let operationsVar = undefined as
    | ReturnType<NonNullable<typeof sourceFile>['getVariableDeclaration']>
    | undefined
  let chosenPath: string | undefined

  for (const candidate of candidatePaths) {
    try {
      const sf = project.addSourceFileAtPath(candidate)
      const ov = sf.getVariableDeclaration(fileName)
      if (ov) {
        sourceFile = sf
        operationsVar = ov
        chosenPath = candidate
        break
      }
    } catch (_) {
      continue
    }
  }

  if (!sourceFile || !operationsVar) {
    const first = candidatePaths[0]
    throw new Error(`Could not find ${fileName} variable in ${first}`)
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

  if (operation.pseudocode) {
    const pseudo = JSON.stringify(operation.pseudocode)
    newOperationCode += `    pseudocode: ${pseudo},\n`
  }

  if (operation.functionNameSuggestion) {
    newOperationCode += `    function_name: "${operation.functionNameSuggestion}",\n`
  }

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
