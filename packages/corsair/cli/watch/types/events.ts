import { Project } from 'ts-morph'
import type { SchemaDefinition } from './state.js'
import type { queryGenerator } from '../handlers/query-generator.js'
import type { z } from 'zod'

export enum CorsairEvent {
  // File System Events
  FILE_CHANGED = 'file:changed',
  FILE_CREATED = 'file:created',

  // Detection Events
  QUERY_DETECTED = 'query:detected',
  SCHEMA_CHANGED = 'schema:changed',
  SCHEMA_LOADED = 'schema:loaded',
  SCHEMA_UPDATED = 'schema:updated',

  // Operations Events
  OPERATIONS_LOADED = 'operations:loaded',
  OPERATION_ADDED = 'operation:added',
  OPERATION_REMOVED = 'operation:removed',
  OPERATION_UPDATED = 'operation:updated',
  NEW_QUERY_ADDED = 'new:query:added',
  NEW_MUTATION_ADDED = 'new:mutation:added',

  // Generation Events
  GENERATION_STARTED = 'generation:started',
  GENERATION_PROGRESS = 'generation:progress',
  GENERATION_COMPLETE = 'generation:complete',
  GENERATION_FAILED = 'generation:failed',

  // User Input Events
  USER_INPUT = 'user:input',
  USER_COMMAND = 'user:command',

  // State Events
  STATE_CHANGED = 'state:changed',

  // Error Events
  ERROR_OCCURRED = 'error:occurred',

  // LLM Events
  LLM_ANALYSIS_STARTED = 'llm:analysis:started',
  LLM_ANALYSIS_COMPLETE = 'llm:analysis:complete',
  LLM_ANALYSIS_FAILED = 'llm:analysis:failed',
}

export interface FileChangedEvent {
  file: string
  timestamp: number
  project?: Project
}

export interface QueryDetectedEvent {
  id: string
  nlQuery: string
  sourceFile: string
  params: Record<string, string>
  lineNumber: number
}

export interface GenerationProgressEvent {
  queryId: string
  stage: string
  percentage: number
  message?: string
}

export interface GenerationCompleteEvent {
  queryId: string
  outputPath: string
  generatedFiles: string[]
}

export interface GenerationFailedEvent {
  queryId: string
  error: string
  code?: string
}

export type UserCommands =
  | 'regenerate'
  | 'tweak'
  | 'undo'
  | 'accept'
  | 'help'
  | 'quit'
  | 'queries'
  | 'mutations'
  | 'navigate_page'
  | 'select_operation'
  | 'toggle_search'
  | 'update_search'
  | 'go_back'
  | 'submit_operation_config'
  | 'cancel_operation_config'
  | 'modify'
  | 'cancel'
  | 'write_operation_to_file'
  | 'defer_operation_config'
  | 'resume_unfinished'
  | 'update'
  | 'update_operation'

export interface UserCommandEvent {
  command: UserCommands
  args?: any
}

export interface ErrorOccurredEvent {
  message: string
  code?: string
  suggestions?: string[]
  stack?: string
}

export interface SchemaChangedEvent {
  schemaPath: string
  affectedQueries: string[]
}

export interface OperationsLoadedEvent {
  type: 'queries' | 'mutations'
  operations: Map<
    string,
    {
      name: string
      prompt: string
      dependencies?: string
      handler: string
    }
  >
}

export interface OperationAddedEvent {
  operationType: 'query' | 'mutation'
  operationName: string
  functionName: string
  prompt: string
  file: string
  lineNumber: number
}

export interface OperationRemovedEvent {
  operationType: 'query' | 'mutation'
  operationName: string
  functionName: string
  prompt: string
  file: string
}

export interface OperationUpdatedEvent {
  operationType: 'query' | 'mutation'
  operationName: string
  functionName: string
  oldPrompt: string
  newPrompt: string
  file: string
  lineNumber: number
}

export interface NewQueryAddedEvent {
  operationName: string
  functionName: string
  prompt: string
  file: string
  lineNumber: number
  configurationRules?: string
}

export interface NewMutationAddedEvent {
  operationName: string
  functionName: string
  prompt: string
  file: string
  lineNumber: number
  configurationRules?: string
}

export interface LLMAnalysisStartedEvent {
  operationName: string
  operationType: 'query' | 'mutation'
}

export interface LLMAnalysisCompleteEvent {
  operationName: string
  operationType: 'query' | 'mutation'
  response: z.infer<typeof queryGenerator.llmResponseSchema>
  operation: {
    operationType: 'query' | 'mutation'
    operationName: string
    functionName: string
    prompt: string
    file: string
    lineNumber: number
    configurationRules?: string
  }
}

export interface LLMAnalysisFailedEvent {
  operationName: string
  operationType: 'query' | 'mutation'
  error: string
}

export interface SchemaLoadedEvent {
  schema: SchemaDefinition
}

export interface SchemaUpdatedEvent {
  oldSchema: SchemaDefinition
  newSchema: SchemaDefinition
  schemaPath: string
  changes: string[]
}

export type EventDataMap = {
  [CorsairEvent.FILE_CHANGED]: FileChangedEvent
  [CorsairEvent.FILE_CREATED]: FileChangedEvent
  [CorsairEvent.QUERY_DETECTED]: QueryDetectedEvent
  [CorsairEvent.SCHEMA_CHANGED]: SchemaChangedEvent
  [CorsairEvent.OPERATIONS_LOADED]: OperationsLoadedEvent
  [CorsairEvent.OPERATION_ADDED]: OperationAddedEvent
  [CorsairEvent.OPERATION_REMOVED]: OperationRemovedEvent
  [CorsairEvent.OPERATION_UPDATED]: OperationUpdatedEvent
  [CorsairEvent.NEW_QUERY_ADDED]: NewQueryAddedEvent
  [CorsairEvent.NEW_MUTATION_ADDED]: NewMutationAddedEvent
  [CorsairEvent.GENERATION_STARTED]: { queryId: string }
  [CorsairEvent.GENERATION_PROGRESS]: GenerationProgressEvent
  [CorsairEvent.GENERATION_COMPLETE]: GenerationCompleteEvent
  [CorsairEvent.GENERATION_FAILED]: GenerationFailedEvent
  [CorsairEvent.USER_INPUT]: { input: string; key: any }
  [CorsairEvent.USER_COMMAND]: UserCommandEvent
  [CorsairEvent.STATE_CHANGED]: any
  [CorsairEvent.ERROR_OCCURRED]: ErrorOccurredEvent
  [CorsairEvent.LLM_ANALYSIS_STARTED]: LLMAnalysisStartedEvent
  [CorsairEvent.LLM_ANALYSIS_COMPLETE]: LLMAnalysisCompleteEvent
  [CorsairEvent.LLM_ANALYSIS_FAILED]: LLMAnalysisFailedEvent
  [CorsairEvent.SCHEMA_LOADED]: SchemaLoadedEvent
  [CorsairEvent.SCHEMA_UPDATED]: SchemaUpdatedEvent
}
