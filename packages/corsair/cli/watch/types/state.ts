export enum CorsairState {
  IDLE = "IDLE",
  DETECTING = "DETECTING",
  GENERATING = "GENERATING",
  AWAITING_FEEDBACK = "AWAITING_FEEDBACK",
  MODIFYING = "MODIFYING",
  ERROR = "ERROR",
  PROMPTING = "PROMPTING",
  VIEWING_QUERIES = "VIEWING_QUERIES",
  VIEWING_MUTATIONS = "VIEWING_MUTATIONS",
  VIEWING_OPERATION_DETAIL = "VIEWING_OPERATION_DETAIL",
}

export interface Query {
  id: string;
  nlQuery: string;
  sourceFile: string;
  params: Record<string, string>;
  lineNumber: number;
  timestamp: number;
}

export interface GenerationProgress {
  stage: string;
  percentage: number;
  message?: string;
}

export interface HistoryEntry {
  timestamp: number;
  action: string;
  queryId?: string;
  details?: string;
}

export interface ErrorInfo {
  message: string;
  code?: string;
  suggestions?: string[];
  stack?: string;
}

export interface PromptInfo {
  question: string;
  options: string[];
  type: "select" | "input";
}

export interface StateContext {
  currentQuery?: Query;
  generationProgress?: GenerationProgress;
  history: HistoryEntry[];
  availableActions: string[];
  error?: ErrorInfo;
  prompt?: PromptInfo;
  generatedFiles?: string[];
  watchedPaths?: string[];
  queries?: Map<string, OperationDefinition>;
  mutations?: Map<string, OperationDefinition>;
  operationsView?: OperationsViewContext;
}

export interface OperationsViewContext {
  type: "queries" | "mutations";
  currentPage: number;
  searchQuery: string;
  isSearching: boolean;
  selectedOperation?: string;
}

export interface ApplicationState {
  state: CorsairState;
  context: StateContext;
}

export interface GeneratedQuery {
  queryCode: string;
  types: string;
  functionName: string;
}

export interface OperationDefinition {
  name: string;
  prompt: string;
  dependencies?: string;
  handler: string;
}

export interface SchemaDefinition {
  tables: TableDefinition[];
  relations: RelationDefinition[];
}

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
}

export interface ColumnDefinition {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export interface RelationDefinition {
  from: string;
  to: string;
  type: "one-to-one" | "one-to-many" | "many-to-many";
  foreignKey?: string;
}
