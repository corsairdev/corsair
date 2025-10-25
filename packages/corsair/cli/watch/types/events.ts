import { Project } from "ts-morph";

export enum CorsairEvent {
  // File System Events
  FILE_CHANGED = "file:changed",
  FILE_CREATED = "file:created",

  // Detection Events
  QUERY_DETECTED = "query:detected",
  SCHEMA_CHANGED = "schema:changed",

  // Operations Events
  OPERATIONS_LOADED = "operations:loaded",
  OPERATION_ADDED = "operation:added",
  OPERATION_REMOVED = "operation:removed",
  OPERATION_UPDATED = "operation:updated",

  // Generation Events
  GENERATION_STARTED = "generation:started",
  GENERATION_PROGRESS = "generation:progress",
  GENERATION_COMPLETE = "generation:complete",
  GENERATION_FAILED = "generation:failed",

  // User Input Events
  USER_INPUT = "user:input",
  USER_COMMAND = "user:command",

  // State Events
  STATE_CHANGED = "state:changed",

  // Error Events
  ERROR_OCCURRED = "error:occurred",
}

export interface FileChangedEvent {
  file: string;
  timestamp: number;
  project?: Project;
}

export interface QueryDetectedEvent {
  id: string;
  nlQuery: string;
  sourceFile: string;
  params: Record<string, string>;
  lineNumber: number;
}

export interface GenerationProgressEvent {
  queryId: string;
  stage: string;
  percentage: number;
  message?: string;
}

export interface GenerationCompleteEvent {
  queryId: string;
  outputPath: string;
  generatedFiles: string[];
}

export interface GenerationFailedEvent {
  queryId: string;
  error: string;
  code?: string;
}

export type UserCommands =
  | "regenerate"
  | "tweak"
  | "undo"
  | "accept"
  | "help"
  | "quit"
  | "queries"
  | "mutations"
  | "navigate_page"
  | "select_operation"
  | "toggle_search"
  | "update_search"
  | "go_back";

export interface UserCommandEvent {
  command: UserCommands;
  args?: any;
}

export interface ErrorOccurredEvent {
  message: string;
  code?: string;
  suggestions?: string[];
  stack?: string;
}

export interface SchemaChangedEvent {
  schemaPath: string;
  affectedQueries: string[];
}

export interface OperationsLoadedEvent {
  type: "queries" | "mutations";
  operations: Map<string, {
    name: string;
    prompt: string;
    dependencies?: string;
    handler: string;
  }>;
}

export interface OperationAddedEvent {
  operationType: "query" | "mutation";
  operationName: string;
  functionName: string;
  prompt: string;
  file: string;
  lineNumber: number;
}

export interface OperationRemovedEvent {
  operationType: "query" | "mutation";
  operationName: string;
  functionName: string;
  prompt: string;
  file: string;
}

export interface OperationUpdatedEvent {
  operationType: "query" | "mutation";
  operationName: string;
  functionName: string;
  oldPrompt: string;
  newPrompt: string;
  file: string;
  lineNumber: number;
}

export type EventDataMap = {
  [CorsairEvent.FILE_CHANGED]: FileChangedEvent;
  [CorsairEvent.FILE_CREATED]: FileChangedEvent;
  [CorsairEvent.QUERY_DETECTED]: QueryDetectedEvent;
  [CorsairEvent.SCHEMA_CHANGED]: SchemaChangedEvent;
  [CorsairEvent.OPERATIONS_LOADED]: OperationsLoadedEvent;
  [CorsairEvent.OPERATION_ADDED]: OperationAddedEvent;
  [CorsairEvent.OPERATION_REMOVED]: OperationRemovedEvent;
  [CorsairEvent.OPERATION_UPDATED]: OperationUpdatedEvent;
  [CorsairEvent.GENERATION_STARTED]: { queryId: string };
  [CorsairEvent.GENERATION_PROGRESS]: GenerationProgressEvent;
  [CorsairEvent.GENERATION_COMPLETE]: GenerationCompleteEvent;
  [CorsairEvent.GENERATION_FAILED]: GenerationFailedEvent;
  [CorsairEvent.USER_INPUT]: { input: string; key: any };
  [CorsairEvent.USER_COMMAND]: UserCommandEvent;
  [CorsairEvent.STATE_CHANGED]: any;
  [CorsairEvent.ERROR_OCCURRED]: ErrorOccurredEvent;
};
