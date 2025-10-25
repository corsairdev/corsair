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
} from "../types/events.js";
import { CorsairState } from "../types/state.js";
import type { ApplicationState, StateContext, OperationDefinition } from "../types/state.js";

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
    eventBus.on(CorsairEvent.OPERATIONS_LOADED, (data: OperationsLoadedEvent) => {
      if (data.type === "queries") {
        this.updateContext({ queries: data.operations });
      } else if (data.type === "mutations") {
        this.updateContext({ mutations: data.operations });
      }
      this.addHistoryEntry(`${data.type} loaded`, undefined, `Loaded ${data.operations.size} ${data.type}`);
    });

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
    eventBus.on(CorsairEvent.OPERATION_REMOVED, (data: OperationRemovedEvent) => {
      const fileName = this.getShortFilePath(data.file);
      const typeLabel = data.operationType === "query" ? "query" : "mutation";
      this.addHistoryEntry(
        `Removed ${typeLabel}`,
        undefined,
        `${data.operationName} from ${fileName}`
      );
    });

    // Operation updated
    eventBus.on(CorsairEvent.OPERATION_UPDATED, (data: OperationUpdatedEvent) => {
      const fileName = this.getShortFilePath(data.file);
      const typeLabel = data.operationType === "query" ? "query" : "mutation";
      this.addHistoryEntry(
        `Updated ${typeLabel}`,
        undefined,
        `${data.operationName} in ${fileName}`
      );
    });

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
        searchQuery: operationsView.isSearching ? "" : operationsView.searchQuery,
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
}

export const stateMachine = new StateMachine();
