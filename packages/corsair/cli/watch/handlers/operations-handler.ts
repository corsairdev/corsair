import { eventBus } from '../core/event-bus.js'
import { CorsairEvent } from '../types/events.js'
import type { OperationsLoadedEvent } from '../types/events.js'
import { Project, SyntaxKind } from 'ts-morph'

/**
 * Operations Handler
 *
 * Base class for managing Corsair operations (queries and mutations).
 * Parses operation files, extracts definitions, and emits events to update state machine.
 */
abstract class Operations {
  protected operations: Map<
    string,
    {
      name: string
      prompt: string
      dependencies?: string
      handler: string
    }
  > = new Map()

  protected filePath: string
  protected variableName: string
  protected operationType: 'queries' | 'mutations'

  constructor(
    filePath: string,
    variableName: string,
    operationType: 'queries' | 'mutations'
  ) {
    this.filePath = filePath
    this.variableName = variableName
    this.operationType = operationType
  }

  /**
   * Parse the operations file and extract all operation definitions
   */
  public async parse(): Promise<void> {
    try {
      const project = new Project()
      const operations = new Map<
        string,
        {
          name: string
          prompt: string
          dependencies?: string
          handler: string
        }
      >()

      const dirSourceFiles = project.addSourceFilesAtPaths(
        `${this.filePath.replace(/\\/g, '/')}/**/*.ts`
      )
      const isDirectory = dirSourceFiles.length > 0

      if (isDirectory) {
        const sourceFiles = dirSourceFiles

        for (const sf of sourceFiles) {
          const varStmts = sf
            .getVariableStatements()
            .filter(vs => vs.isExported())
          for (const vs of varStmts) {
            for (const vd of vs.getDeclarations()) {
              const name = vd.getName()
              const init = vd.getInitializer()
              const initText = init?.getText() ?? ''
              const isQuery = initText.includes('.query(')
              const isMutation = initText.includes('.mutation(')
              if (
                (this.operationType === 'queries' && isQuery) ||
                (this.operationType === 'mutations' && isMutation)
              ) {
                operations.set(name, {
                  name,
                  prompt: name,
                  dependencies: undefined,
                  handler: '',
                })
              }
            }
          }
        }
      } else {
        const operationsFile = project.addSourceFileAtPath(this.filePath)
        const operationsVar = operationsFile.getVariableDeclaration(
          this.variableName
        )

        if (!operationsVar) {
          console.error(
            `Can't find the ${this.variableName} variable in ${this.filePath}`
          )
          return
        }

        const initializer = operationsVar.getInitializer()

        if (initializer?.isKind(SyntaxKind.ObjectLiteralExpression)) {
          initializer.getProperties().forEach(prop => {
            if (prop.isKind(SyntaxKind.PropertyAssignment)) {
              try {
                const operationName = prop.getName()
                const initializer = prop.getInitializer()
                let callExpr: import('ts-morph').CallExpression | undefined

                if (initializer?.isKind(SyntaxKind.Identifier)) {
                  const symbol = initializer.getSymbol()
                  const declaration = symbol?.getDeclarations()[0]

                  if (declaration?.isKind(SyntaxKind.ImportSpecifier)) {
                    const importedSymbol =
                      declaration.getSymbol()?.getAliasedSymbol() ??
                      declaration.getSymbol()
                    const sourceDeclaration =
                      importedSymbol?.getDeclarations()[0]

                    if (sourceDeclaration) {
                      callExpr = sourceDeclaration.getFirstDescendantByKind(
                        SyntaxKind.CallExpression
                      )
                    }
                  } else if (declaration) {
                    callExpr = declaration.getFirstDescendantByKind(
                      SyntaxKind.CallExpression
                    )
                  }
                } else if (
                  initializer?.isKind(SyntaxKind.PropertyAccessExpression)
                ) {
                  const symbol = initializer.getSymbol()
                  const decl =
                    symbol?.getAliasedSymbol()?.getDeclarations()?.[0] ||
                    symbol?.getDeclarations()?.[0]
                  if (decl) {
                    callExpr = decl.getFirstDescendantByKind(
                      SyntaxKind.CallExpression
                    )
                  }
                } else {
                  callExpr = prop.getFirstDescendantByKind(
                    SyntaxKind.CallExpression
                  )
                }

                const configObj = callExpr?.getArguments()[0]

                if (configObj?.isKind(SyntaxKind.ObjectLiteralExpression)) {
                  const prompt = configObj
                    .getProperty('prompt')
                    ?.getChildAtIndex(2)
                    .getText()
                  const dependencies = configObj
                    .getProperty('dependencies')
                    ?.getChildAtIndex(2)
                    .getText()

                  const handlerProp = configObj.getProperty('handler')
                  const handler =
                    handlerProp?.getChildAtIndex(2).getText() || ''

                  operations.set(operationName, {
                    name: operationName,
                    prompt: prompt?.replace(/['"`]/g, '') || '',
                    dependencies: dependencies,
                    handler: handler,
                  })
                } else {
                  operations.set(operationName, {
                    name: operationName,
                    prompt: operationName,
                    dependencies: undefined,
                    handler: '',
                  })
                }
              } catch {}
            }
          })
        }
      }

      this.operations = operations

      // Emit event to notify state machine
      eventBus.emit(CorsairEvent.OPERATIONS_LOADED, {
        type: this.operationType,
        operations: this.operations,
      } as OperationsLoadedEvent)
    } catch (error) {
      console.error(`Can't find ${this.variableName} at ${this.filePath}`)
      console.error(error)
    }
  }

  /**
   * Re-parse the operations file (called on file change)
   */
  public async update(): Promise<void> {
    await this.parse()

    // Emit update event - reuse the operations loaded event
    eventBus.emit(CorsairEvent.OPERATIONS_LOADED, {
      type: this.operationType,
      operations: this.operations,
    } as OperationsLoadedEvent)
  }
}

/**
 * Queries Handler
 * Manages query operations from corsair/queries.ts
 */
export class Queries extends Operations {
  constructor(operationsFilePath?: string) {
    super(
      operationsFilePath ?? process.cwd() + '/corsair/operations.ts',
      'queries',
      'queries'
    )
  }
}

/**
 * Mutations Handler
 * Manages mutation operations from corsair/mutations.ts
 */
export class Mutations extends Operations {
  constructor(operationsFilePath?: string) {
    super(
      operationsFilePath ?? process.cwd() + '/corsair/operations.ts',
      'mutations',
      'mutations'
    )
  }
}
