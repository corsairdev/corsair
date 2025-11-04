import { eventBus } from '../core/event-bus.js'
import { CorsairEvent } from '../types/events.js'
import type { UserCommandEvent } from '../types/events.js'
import {
  writeOperationToFile,
  parseInputTypeFromLLM,
  parseHandlerFromLLM,
  type OperationToWrite,
} from '../writers/operation-writer.js'
import type { LLMResponse, NewOperationContext } from '../types/state.js'

/**
 * User Input Handler
 *
 * Listens to: USER_COMMAND
 * Emits: Various events based on commands
 */
class UserInputHandler {
  constructor() {
    this.setupListeners()
  }

  private setupListeners() {
    eventBus.on(CorsairEvent.USER_COMMAND, this.handleCommand.bind(this))
  }

  private handleCommand(data: UserCommandEvent) {
    const { command, args } = data

    switch (command) {
      case 'regenerate':
        this.handleRegenerate()
        break

      case 'tweak':
        this.handleTweak()
        break

      case 'undo':
        this.handleUndo()
        break

      case 'accept':
        break

      case 'write_operation_to_file':
        this.handleWriteOperationToFile(args)
        break

      case 'help':
        this.handleHelp()
        break

      case 'quit':
        this.handleQuit()
        break

      default:
    }
  }

  private handleRegenerate() {
    console.log('Regenerate requested (not implemented yet)')
  }

  private handleTweak() {
    console.log('Tweak mode requested (not implemented yet)')
  }

  private handleUndo() {
    console.log('Undo requested (not implemented yet)')
  }

  private handleWriteOperationToFile(args: {
    operation: NewOperationContext
    llmResponse: LLMResponse
  }) {
    console.log('\n🔧 [DEBUG] handleWriteOperationToFile called')
    console.log('Args:', JSON.stringify(args, null, 2))

    if (!args || !args.operation || !args.llmResponse) {
      console.error('❌ Missing operation or LLM response data')
      console.log('args exists:', !!args)
      console.log('args.operation exists:', !!args?.operation)
      console.log('args.llmResponse exists:', !!args?.llmResponse)
      return
    }

    const { operation, llmResponse } = args

    console.log('\n📦 Operation:', operation)
    console.log('🤖 LLM Response:', llmResponse)
    console.log('📄 Raw Response:', llmResponse.rawResponse)

    if (!llmResponse.rawResponse) {
      console.error('❌ Missing raw LLM response data')
      console.log('llmResponse structure:', Object.keys(llmResponse))
      return
    }

    try {
      console.log('\n🔄 Parsing input type...')
      const inputType = parseInputTypeFromLLM(
        llmResponse.rawResponse.input_type
      )
      console.log('✅ Input type:', inputType)

      console.log('\n🔄 Parsing handler...')
      const handler = parseHandlerFromLLM(llmResponse.rawResponse.function)
      console.log('✅ Handler:', handler)

      const operationToWrite: OperationToWrite = {
        operationName: operation.operationName,
        operationType: operation.operationType,
        prompt: operation.prompt,
        inputType: inputType,
        handler: handler,
        pseudocode: llmResponse.rawResponse.pseudocode,
        functionNameSuggestion: llmResponse.rawResponse.function_name,
        targetFilePath: operation.file,
      }

      console.log('\n📝 Writing operation to file...')
      console.log('Operation to write:', operationToWrite)

      writeOperationToFile(operationToWrite)

      console.log(
        `\n✅ Successfully added ${operation.operationType} "${
          operation.operationName
        }" to corsair/${
          operation.operationType === 'query' ? 'queries' : 'mutations'
        }.ts\n`
      )
    } catch (error) {
      console.error(
        `\n❌ Failed to write operation to file: ${
          error instanceof Error ? error.message : 'Unknown error'
        }\n`
      )
      console.error('Error stack:', error)

      eventBus.emit(CorsairEvent.ERROR_OCCURRED, {
        message: `Failed to write operation to file: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        code: 'WRITE_OPERATION_FAILED',
        suggestions: [
          'Check file permissions',
          'Ensure queries.ts or mutations.ts exists',
          'Verify the file format is correct',
        ],
      })
    }
  }

  private handleHelp() {
    console.log('\nCorsair Watch - Help')
    console.log('===================\n')
    console.log('Available commands:')
    console.log('  [R] Regenerate - Generate the query again')
    console.log('  [T] Tweak - Modify the generated query')
    console.log('  [U] Undo - Revert to previous version')
    console.log('  [A] Accept - Accept the generated query')
    console.log('  [H] Help - Show this help message')
    console.log('  [Q] Quit - Exit Corsair Watch\n')
  }

  private handleQuit() {
    console.log('\nShutting down Corsair Watch...')
    process.exit(0)
  }
}

// Initialize handler
export const userInputHandler = new UserInputHandler()
