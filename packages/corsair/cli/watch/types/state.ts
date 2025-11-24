export enum CorsairState {
  IDLE = 'IDLE',
  DETECTING = 'DETECTING',
  GENERATING = 'GENERATING',
  AWAITING_FEEDBACK = 'AWAITING_FEEDBACK',
  MODIFYING = 'MODIFYING',
  ERROR = 'ERROR',
  PROMPTING = 'PROMPTING',
  VIEWING_QUERIES = 'VIEWING_QUERIES',
  VIEWING_MUTATIONS = 'VIEWING_MUTATIONS',
  VIEWING_OPERATION_DETAIL = 'VIEWING_OPERATION_DETAIL',
  CONFIGURING_NEW_OPERATION = 'CONFIGURING_NEW_OPERATION',
  LLM_PROCESSING = 'LLM_PROCESSING',
}

export interface Query {
  id: string
  nlQuery: string
  sourceFile: string
  params: Record<string, string>
  lineNumber: number
  timestamp: number
}

export interface GenerationProgress {
  stage: string
  percentage: number
  message?: string
}

export interface HistoryEntry {
  timestamp: number
  action: string
  queryId?: string
  details?: string
}

export interface ErrorInfo {
  message: string
  code?: string
  suggestions?: string[]
  stack?: string
}

export interface PromptInfo {
  question: string
  options: string[]
  type: 'select' | 'input'
}

export interface LLMResponse {
  suggestions: string[]
  recommendations: {
    dependencies?: string | null
    handler?: string | null
    optimizations: string[]
  }
  analysis: {
    complexity: 'low' | 'medium' | 'high'
    confidence: number
    reasoning: string
  }
  rawResponse?: {
    input_type: string
    output_type: string
    function: string
    notes: string
    pseudocode?: string
    function_name?: string
  }
}

export interface StateContext {
  currentQuery?: Query
  generationProgress?: GenerationProgress
  history: HistoryEntry[]
  availableActions: string[]
  error?: ErrorInfo
  prompt?: PromptInfo
  generatedFiles?: string[]
  watchedPaths?: string[]
  queries?: Map<string, OperationDefinition>
  mutations?: Map<string, OperationDefinition>
  schema?: SchemaDefinition
  operationsView?: OperationsViewContext
  newOperation?: NewOperationContext
  llmResponse?: LLMResponse
  unfinishedOperations?: UnfinishedOperation[]
}

export interface OperationsViewContext {
  type: 'queries' | 'mutations'
  currentPage: number
  searchQuery: string
  isSearching: boolean
  selectedOperation?: string
}

export interface NewOperationContext {
  operationType: 'query' | 'mutation'
  operationName: string
  functionName: string
  prompt: string
  file: string
  lineNumber: number
  configurationRules?: string
  isUpdate?: boolean
}

export interface UnfinishedOperation {
  id: string
  operation: NewOperationContext
  createdAt: number
}

export interface ApplicationState {
  state: CorsairState
  context: StateContext
}

export interface GeneratedQuery {
  queryCode: string
  types: string
  functionName: string
}

export interface OperationDefinition {
  name: string
  prompt: string
  dependencies?: string
  handler: string
}

export interface SchemaDefinition {
  tables?: TableDefinition[]
}

export interface TableDefinition {
  name: string
  columns: ColumnDefinition[]
}

export interface ColumnDefinition {
  name: string
  type: string
  references?: {
    table: string
    column: string
  }
}
