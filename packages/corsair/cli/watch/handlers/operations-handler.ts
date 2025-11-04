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
                  const sourceDeclaration = importedSymbol?.getDeclarations()[0]

                  if (sourceDeclaration) {
                    callExpr = sourceDeclaration.getFirstDescendantByKind(
                      SyntaxKind.CallExpression
                    )
                  }
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
                const handler = handlerProp?.getChildAtIndex(2).getText() || ''

                operations.set(operationName, {
                  name: operationName,
                  prompt: prompt?.replace(/['"`]/g, '') || '',
                  dependencies: dependencies,
                  handler: handler,
                })
              }
            } catch (err) {
              // Could be a spread operator, skip for now
            }
          }
        })
      }

      this.operations = operations

      // Emit event to notify state machine
      eventBus.emit(CorsairEvent.OPERATIONS_LOADED, {
        type: this.operationType,
        operations: this.operations,
      } as OperationsLoadedEvent)
    } catch (error) {
      console.error(
        `Can't find the ${this.variableName} file. Does it exist at ${this.filePath}?`
      )
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
  constructor() {
    super(process.cwd() + '/corsair/operations.ts', 'queries', 'queries')
  }
}

/**
 * Mutations Handler
 * Manages mutation operations from corsair/mutations.ts
 */
export class Mutations extends Operations {
  constructor() {
    super(process.cwd() + '/corsair/operations.ts', 'mutations', 'mutations')
  }
}
