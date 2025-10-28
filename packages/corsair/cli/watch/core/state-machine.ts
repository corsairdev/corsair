import { eventBus } from "./event-bus.js";
import { CorsairEvent } from "../types/events.js";
import type {
  QueryDetectedEvent,
  GenerationProgressEvent,
  GenerationCompleteEvent,
  GenerationFailedEvent,
  ErrorOccurredEvent,
  OperationsLoadedEvent,
  OperationAddedEvent,
  OperationRemovedEvent,
  OperationUpdatedEvent,
  NewQueryAddedEvent,
  NewMutationAddedEvent,
  LLMAnalysisStartedEvent,
  LLMAnalysisCompleteEvent,
  LLMAnalysisFailedEvent,
  SchemaLoadedEvent,
  SchemaUpdatedEvent,
} from "../types/events.js";
import { CorsairState } from "../types/state.js";
import type {
  ApplicationState,
  StateContext,
  OperationDefinition,
  SchemaDefinition,
} from "../types/state.js";

class StateMachine {
  private state: ApplicationState = {
    state: CorsairState.IDLE,
    context: {
      history: [],
      availableActions: ["help", "quit"],
      watchedPaths: ["src/**/*.{ts,tsx}"],
      queries: new Map(),
      mutations: new Map(),
    },
  };


  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Operations loaded
    eventBus.on(
      CorsairEvent.OPERATIONS_LOADED,
      (data: OperationsLoadedEvent) => {
        if (data.type === "queries") {
          this.updateContext({ queries: data.operations });
        } else if (data.type === "mutations") {
          this.updateContext({ mutations: data.operations });
        }
        this.addHistoryEntry(
          `${data.type} loaded`,
          undefined,
          `Loaded ${data.operations.size} ${data.type}`
        );
      }
    );

    // Operation added
    eventBus.on(CorsairEvent.OPERATION_ADDED, (data: OperationAddedEvent) => {
      const fileName = this.getShortFilePath(data.file);
      const typeLabel = data.operationType === "query" ? "query" : "mutation";
      this.addHistoryEntry(
        `Added ${typeLabel}`,
        undefined,
        `${data.operationName} in ${fileName}`
      );
    });

    // Operation removed
    eventBus.on(
      CorsairEvent.OPERATION_REMOVED,
      (data: OperationRemovedEvent) => {
        const fileName = this.getShortFilePath(data.file);
        const typeLabel = data.operationType === "query" ? "query" : "mutation";
        this.addHistoryEntry(
          `Removed ${typeLabel}`,
          undefined,
          `${data.operationName} from ${fileName}`
        );
      }
    );

    // Operation updated
    eventBus.on(
      CorsairEvent.OPERATION_UPDATED,
      (data: OperationUpdatedEvent) => {
        const fileName = this.getShortFilePath(data.file);
        const typeLabel = data.operationType === "query" ? "query" : "mutation";
        this.addHistoryEntry(
          `Updated ${typeLabel}`,
          undefined,
          `${data.operationName} in ${fileName}`
        );
      }
    );

    // New query added (not in registry)
    eventBus.on(CorsairEvent.NEW_QUERY_ADDED, (data: NewQueryAddedEvent) => {
      const fileName = this.getShortFilePath(data.file);
      this.addHistoryEntry(
        "New query detected",
        undefined,
        `${data.operationName} in ${fileName}`
      );

      // Transition to configuration state
      this.transition(CorsairState.CONFIGURING_NEW_OPERATION, {
        newOperation: {
          operationType: "query",
          operationName: data.operationName,
          functionName: data.functionName,
          prompt: data.prompt,
          file: data.file,
          lineNumber: data.lineNumber,
        },
        availableActions: [
          "submit_operation_config",
          "cancel_operation_config",
        ],
      });
    });

    // New mutation added (not in registry)
    eventBus.on(
      CorsairEvent.NEW_MUTATION_ADDED,
      (data: NewMutationAddedEvent) => {
        const fileName = this.getShortFilePath(data.file);
        this.addHistoryEntry(
          "New mutation detected",
          undefined,
          `${data.operationName} in ${fileName}`
        );

        // Transition to configuration state
        this.transition(CorsairState.CONFIGURING_NEW_OPERATION, {
          newOperation: {
            operationType: "mutation",
            operationName: data.operationName,
            functionName: data.functionName,
            prompt: data.prompt,
            file: data.file,
            lineNumber: data.lineNumber,
          },
          availableActions: [
            "submit_operation_config",
            "cancel_operation_config",
          ],
        });
      }
    );

    // Query detection
    eventBus.on(CorsairEvent.QUERY_DETECTED, (data: QueryDetectedEvent) => {
      this.transition(CorsairState.DETECTING, {
        currentQuery: {
          id: data.id,
          nlQuery: data.nlQuery,
          sourceFile: data.sourceFile,
          params: data.params,
          lineNumber: data.lineNumber,
          timestamp: Date.now(),
        },
      });
      this.addHistoryEntry("Query detected", data.id, data.nlQuery);
    });

    // Generation started
    eventBus.on(CorsairEvent.GENERATION_STARTED, (data) => {
      this.transition(CorsairState.GENERATING, {
        generationProgress: {
          stage: "Initializing",
          percentage: 0,
        },
      });
      this.addHistoryEntry("Generation started", data.queryId);
    });

    // Generation progress
    eventBus.on(
      CorsairEvent.GENERATION_PROGRESS,
      (data: GenerationProgressEvent) => {
        if (this.state.state === CorsairState.GENERATING) {
          this.updateContext({
            generationProgress: {
              stage: data.stage,
              percentage: data.percentage,
              message: data.message,
            },
          });
        }
      }
    );

    // Generation complete
    eventBus.on(
      CorsairEvent.GENERATION_COMPLETE,
      (data: GenerationCompleteEvent) => {
        this.transition(CorsairState.AWAITING_FEEDBACK, {
          generatedFiles: data.generatedFiles,
          availableActions: [
            "regenerate",
            "tweak",
            "undo",
            "accept",
            "help",
            "quit",
          ],
          generationProgress: undefined,
        });
        this.addHistoryEntry(
          "Generation complete",
          data.queryId,
          `Generated ${data.generatedFiles.length} files`
        );
      }
    );

    // Generation failed
    eventBus.on(
      CorsairEvent.GENERATION_FAILED,
      (data: GenerationFailedEvent) => {
        this.transition(CorsairState.ERROR, {
          error: {
            message: data.error,
            code: data.code,
            suggestions: [
              "Check the query syntax",
              "Verify schema definitions",
              "Try again",
            ],
          },
          availableActions: ["retry", "help", "quit"],
        });
        this.addHistoryEntry("Generation failed", data.queryId, data.error);
      }
    );

    // Error occurred
    eventBus.on(CorsairEvent.ERROR_OCCURRED, (data: ErrorOccurredEvent) => {
      this.transition(CorsairState.ERROR, {
        error: {
          message: data.message,
          code: data.code,
          suggestions: data.suggestions,
          stack: data.stack,
        },
        availableActions: ["help", "quit"],
      });
      this.addHistoryEntry("Error occurred", undefined, data.message);
    });

    // LLM Analysis started
    eventBus.on(
      CorsairEvent.LLM_ANALYSIS_STARTED,
      (data: LLMAnalysisStartedEvent) => {
        this.addHistoryEntry(
          "LLM analysis started",
          undefined,
          `Analyzing ${data.operationName} (${data.operationType})`
        );
      }
    );

    // LLM Analysis complete
    eventBus.on(
      CorsairEvent.LLM_ANALYSIS_COMPLETE,
      (data: LLMAnalysisCompleteEvent) => {
        this.addHistoryEntry(
          "LLM analysis completed",
          undefined,
          `Analysis for ${data.operationName} completed with ${
            data.response.analysis.confidence * 100
          }% confidence`
        );

        // Transition to feedback state with LLM response
        this.transition(CorsairState.AWAITING_FEEDBACK, {
          llmResponse: data.response,
          newOperation: data.operation,
          availableActions: ["accept", "regenerate", "modify", "cancel"],
        });
      }
    );

    // LLM Analysis failed
    eventBus.on(
      CorsairEvent.LLM_ANALYSIS_FAILED,
      (data: LLMAnalysisFailedEvent) => {
        this.addHistoryEntry(
          "LLM analysis failed",
          undefined,
          `Failed to analyze ${data.operationName}: ${data.error}`
        );

        this.transition(CorsairState.ERROR, {
          error: {
            message: `LLM analysis failed: ${data.error}`,
            suggestions: [
              "Check your API key configuration",
              "Verify network connectivity",
              "Try a different provider",
              "Retry the operation",
            ],
          },
          availableActions: ["retry", "cancel", "help"],
        });
      }
    );

    // Schema loaded
    eventBus.on(CorsairEvent.SCHEMA_LOADED, (data: SchemaLoadedEvent) => {
      this.updateContext({ schema: data.schema });
      this.addHistoryEntry(
        "Schema loaded",
        undefined,
        `Loaded ${data.schema.tables.length} tables`
      );
    });

    // Schema updated
    eventBus.on(CorsairEvent.SCHEMA_UPDATED, (data: SchemaUpdatedEvent) => {
      this.updateContext({ schema: data.newSchema });

      const changeDetails = data.changes.length > 0
        ? data.changes.join(', ')
        : 'Schema modified';

      this.addHistoryEntry(
        "Schema updated",
        undefined,
        changeDetails
      );
    });

    // User commands
    eventBus.on(CorsairEvent.USER_COMMAND, (data) => {
      if (
        data.command === "accept" &&
        this.state.state === CorsairState.AWAITING_FEEDBACK
      ) {
        this.transition(CorsairState.IDLE, {
          currentQuery: undefined,
          generatedFiles: undefined,
          availableActions: ["help", "quit"],
        });
        this.addHistoryEntry("Query accepted");
      }

      if (data.command === "queries") {
        this.transition(CorsairState.VIEWING_QUERIES, {
          operationsView: {
            type: "queries",
            currentPage: 0,
            searchQuery: "",
            isSearching: false,
          },
        });
        this.addHistoryEntry("Queries requested");
      }

      if (data.command === "mutations") {
        this.transition(CorsairState.VIEWING_MUTATIONS, {
          operationsView: {
            type: "mutations",
            currentPage: 0,
            searchQuery: "",
            isSearching: false,
          },
        });
        this.addHistoryEntry("Mutations requested");
      }

      if (data.command === "go_back") {
        this.handleGoBack();
      }

      if (data.command === "navigate_page") {
        this.handleNavigatePage(data.args?.direction);
      }

      if (data.command === "select_operation") {
        this.handleSelectOperation(data.args?.operationName);
      }

      if (data.command === "toggle_search") {
        this.handleToggleSearch();
      }

      if (data.command === "update_search") {
        this.handleUpdateSearch(data.args?.query);
      }

      if (data.command === "submit_operation_config") {
        this.handleSubmitOperationConfig(data.args?.configurationRules);
      }

      if (data.command === "cancel_operation_config") {
        this.handleCancelOperationConfig();
      }

      // LLM feedback commands
      if (
        data.command === "modify" &&
        this.state.state === CorsairState.AWAITING_FEEDBACK &&
        this.state.context.llmResponse
      ) {
        this.handleModifyLLMResponse();
      }

      if (
        data.command === "cancel" &&
        this.state.state === CorsairState.AWAITING_FEEDBACK &&
        this.state.context.llmResponse
      ) {
        this.handleCancelLLMResponse();
      }

      if (
        data.command === "regenerate" &&
        this.state.state === CorsairState.AWAITING_FEEDBACK &&
        this.state.context.llmResponse
      ) {
        this.handleRegenerateLLMResponse();
      }

      if (
        data.command === "accept" &&
        this.state.state === CorsairState.AWAITING_FEEDBACK &&
        this.state.context.llmResponse
      ) {
        this.handleAcceptLLMResponse();
      }
    });
  }

  private transition(
    newState: CorsairState,
    contextUpdates: Partial<StateContext> = {}
  ) {
    const oldState = this.state.state;

    this.state = {
      state: newState,
      context: {
        ...this.state.context,
        ...contextUpdates,
      },
    };

    if (oldState !== newState) {
      eventBus.emit(CorsairEvent.STATE_CHANGED, this.state);
    }
  }

  private updateContext(contextUpdates: Partial<StateContext>) {
    this.state.context = {
      ...this.state.context,
      ...contextUpdates,
    };
    eventBus.emit(CorsairEvent.STATE_CHANGED, this.state);
  }

  private addHistoryEntry(action: string, queryId?: string, details?: string) {
    this.state.context.history.push({
      timestamp: Date.now(),
      action,
      queryId,
      details,
    });
    // Keep last 50 entries
    if (this.state.context.history.length > 50) {
      this.state.context.history = this.state.context.history.slice(-50);
    }
    // Emit state change so UI updates
    eventBus.emit(CorsairEvent.STATE_CHANGED, this.state);
  }

  /**
   * Get a shortened file path for display purposes
   * Converts absolute paths to relative paths from project root
   */
  private getShortFilePath(filePath: string): string {
    const cwd = process.cwd();
    if (filePath.startsWith(cwd)) {
      return filePath.substring(cwd.length + 1);
    }
    return filePath;
  }

  public getCurrentState(): ApplicationState {
    return { ...this.state };
  }

  public reset() {
    this.transition(CorsairState.IDLE, {
      currentQuery: undefined,
      generationProgress: undefined,
      error: undefined,
      generatedFiles: undefined,
      availableActions: ["help", "quit"],
    });
  }

  // Query retrieval methods
  public getAllQueries(): OperationDefinition[] {
    return Array.from(this.state.context.queries?.values() || []);
  }

  public getQuery(name: string): OperationDefinition | undefined {
    return this.state.context.queries?.get(name);
  }

  public getQueryDependencies(name: string): string | undefined {
    return this.state.context.queries?.get(name)?.dependencies;
  }

  public getQueryHandler(name: string): string | undefined {
    return this.state.context.queries?.get(name)?.handler;
  }

  public queryExists(name: string): boolean {
    return this.state.context.queries?.has(name) || false;
  }

  // Mutation retrieval methods
  public getAllMutations(): OperationDefinition[] {
    return Array.from(this.state.context.mutations?.values() || []);
  }

  public getMutation(name: string): OperationDefinition | undefined {
    return this.state.context.mutations?.get(name);
  }

  public getMutationDependencies(name: string): string | undefined {
    return this.state.context.mutations?.get(name)?.dependencies;
  }

  public getMutationHandler(name: string): string | undefined {
    return this.state.context.mutations?.get(name)?.handler;
  }

  public mutationExists(name: string): boolean {
    return this.state.context.mutations?.has(name) || false;
  }

  // Schema retrieval methods
  public getSchema(): SchemaDefinition | undefined {
    return this.state.context.schema;
  }

  public getTable(tableName: string) {
    return this.state.context.schema?.tables.find(table => table.name === tableName);
  }

  public getAllTables() {
    return this.state.context.schema?.tables || [];
  }

  public hasSchema(): boolean {
    return !!this.state.context.schema;
  }

  // Operations navigation handlers
  private handleGoBack() {
    if (this.state.state === CorsairState.VIEWING_OPERATION_DETAIL) {
      // Go back to operations list
      const type = this.state.context.operationsView?.type;
      if (type === "queries") {
        this.transition(CorsairState.VIEWING_QUERIES, {
          operationsView: {
            ...this.state.context.operationsView!,
            selectedOperation: undefined,
          },
        });
      } else if (type === "mutations") {
        this.transition(CorsairState.VIEWING_MUTATIONS, {
          operationsView: {
            ...this.state.context.operationsView!,
            selectedOperation: undefined,
          },
        });
      }
      this.addHistoryEntry("Returned to operations list");
    } else if (
      this.state.state === CorsairState.VIEWING_QUERIES ||
      this.state.state === CorsairState.VIEWING_MUTATIONS
    ) {
      // Go back to idle
      this.transition(CorsairState.IDLE, {
        operationsView: undefined,
      });
      this.addHistoryEntry("Exited operations view");
    }
  }

  private handleNavigatePage(direction: "next" | "prev") {
    const operationsView = this.state.context.operationsView;
    if (!operationsView) return;

    const newPage =
      direction === "next"
        ? operationsView.currentPage + 1
        : operationsView.currentPage - 1;

    this.updateContext({
      operationsView: {
        ...operationsView,
        currentPage: newPage,
      },
    });
  }

  private handleSelectOperation(operationName: string) {
    const operationsView = this.state.context.operationsView;
    if (!operationsView) return;

    this.transition(CorsairState.VIEWING_OPERATION_DETAIL, {
      operationsView: {
        ...operationsView,
        selectedOperation: operationName,
      },
    });
    this.addHistoryEntry("Viewing operation", undefined, operationName);
  }

  private handleToggleSearch() {
    const operationsView = this.state.context.operationsView;
    if (!operationsView) return;

    this.updateContext({
      operationsView: {
        ...operationsView,
        isSearching: !operationsView.isSearching,
        // Clear search when toggling off
        searchQuery: operationsView.isSearching
          ? ""
          : operationsView.searchQuery,
        currentPage: 0, // Reset to first page when toggling
      },
    });
  }

  private handleUpdateSearch(query: string) {
    const operationsView = this.state.context.operationsView;
    if (!operationsView) return;

    this.updateContext({
      operationsView: {
        ...operationsView,
        searchQuery: query,
        currentPage: 0, // Reset to first page on search
      },
    });
  }

  private handleSubmitOperationConfig(configurationRules?: string) {
    if (this.state.state !== CorsairState.CONFIGURING_NEW_OPERATION) return;

    const newOperation = this.state.context.newOperation;
    if (!newOperation) return;

    // Update the new operation with configuration rules
    const updatedOperation = {
      ...newOperation,
      configurationRules: configurationRules || "",
    };

    this.updateContext({
      newOperation: updatedOperation,
    });

    this.addHistoryEntry(
      "Operation configuration submitted",
      undefined,
      `${newOperation.operationName} ready for LLM processing`
    );

    // Transition to LLM processing state
    this.transition(CorsairState.LLM_PROCESSING, {
      availableActions: [],
    });

    // Emit a specific event for user-submitted configuration
    eventBus.emit(CorsairEvent.LLM_ANALYSIS_STARTED, {
      operationName: updatedOperation.operationName,
      operationType: updatedOperation.operationType,
    });
  }

  private handleCancelOperationConfig() {
    if (this.state.state !== CorsairState.CONFIGURING_NEW_OPERATION) return;

    const newOperation = this.state.context.newOperation;
    if (newOperation) {
      this.addHistoryEntry(
        "Operation configuration cancelled",
        undefined,
        `${newOperation.operationName} configuration discarded`
      );
    }

    this.transition(CorsairState.IDLE, {
      newOperation: undefined,
      availableActions: ["help", "quit"],
    });
  }

  // LLM feedback command handlers
  private handleModifyLLMResponse() {
    // For now, go back to configuration to allow user to modify
    const newOperation = this.state.context.newOperation;
    if (newOperation) {
      this.transition(CorsairState.CONFIGURING_NEW_OPERATION, {
        newOperation,
        llmResponse: undefined,
        availableActions: [
          "submit_operation_config",
          "cancel_operation_config",
        ],
      });
      this.addHistoryEntry(
        "LLM suggestions modification requested",
        undefined,
        `Modifying configuration for ${newOperation.operationName}`
      );
    }
  }

  private handleCancelLLMResponse() {
    const newOperation = this.state.context.newOperation;
    if (newOperation) {
      this.addHistoryEntry(
        "LLM suggestions cancelled",
        undefined,
        `Cancelled ${newOperation.operationName} configuration`
      );
    }

    this.transition(CorsairState.IDLE, {
      newOperation: undefined,
      llmResponse: undefined,
      availableActions: ["help", "quit"],
    });
  }

  private handleRegenerateLLMResponse() {
    const newOperation = this.state.context.newOperation;
    if (newOperation) {
      this.addHistoryEntry(
        "LLM analysis regeneration requested",
        undefined,
        `Regenerating analysis for ${newOperation.operationName}`
      );

      // Go back to LLM processing state
      this.transition(CorsairState.LLM_PROCESSING, {
        llmResponse: undefined,
        availableActions: [],
      });

      // Emit LLM analysis started event for regeneration
      eventBus.emit(CorsairEvent.LLM_ANALYSIS_STARTED, {
        operationName: newOperation.operationName,
        operationType: newOperation.operationType,
      });
    }
  }

  private handleAcceptLLMResponse() {
    const newOperation = this.state.context.newOperation;
    const llmResponse = this.state.context.llmResponse;

    if (newOperation && llmResponse) {
      this.addHistoryEntry(
        "LLM suggestions accepted",
        undefined,
        `Accepted configuration for ${newOperation.operationName}`
      );

      // Here you could save the configuration or trigger generation
      // For now, just return to idle
      this.transition(CorsairState.IDLE, {
        newOperation: undefined,
        llmResponse: undefined,
        availableActions: ["help", "quit"],
      });
    }
  }

}

export const stateMachine = new StateMachine();
