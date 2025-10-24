// /src/core/state-machine.ts
import { eventBus, CorsairEvent } from "./event-bus";

export enum CorsairState {
  IDLE = "IDLE",
  DETECTING = "DETECTING",
  GENERATING = "GENERATING",
  AWAITING_FEEDBACK = "AWAITING_FEEDBACK",
  MODIFYING = "MODIFYING",
  ERROR = "ERROR",
  PROMPTING = "PROMPTING",
  BATCH_PROCESSING = "BATCH_PROCESSING",
}

interface StateContext {
  // What we're currently working on
  currentQuery?: {
    id: string;
    nlQuery: string;
    sourceFile: string;
    params: Record<string, string>;
  };

  // Generation state
  generationProgress?: {
    stage: string;
    percentage: number;
  };

  // History for undo
  history: HistoryEntry[];

  // Available actions based on current state
  availableActions: string[];

  // Error info if in ERROR state
  error?: {
    message: string;
    code: string;
    suggestions: string[];
  };

  // Prompt info if in PROMPTING state
  prompt?: {
    question: string;
    options: string[];
    defaultValue?: string;
  };
}

export class CorsairStateMachine {
  private state: CorsairState = CorsairState.IDLE;
  private context: StateContext = {
    history: [],
    availableActions: ["help", "status", "config", "quit"],
  };

  constructor() {
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    eventBus.on(CorsairEvent.FILE_CHANGED, this.handleFileChange.bind(this));
    eventBus.on(
      CorsairEvent.QUERY_DETECTED,
      this.handleQueryDetected.bind(this)
    );
    eventBus.on(
      CorsairEvent.GENERATION_COMPLETE,
      this.handleGenerationComplete.bind(this)
    );
    eventBus.on(CorsairEvent.USER_INPUT, this.handleUserInput.bind(this));
    // ... etc
  }

  // State transitions are explicit
  private transition(
    newState: CorsairState,
    contextUpdates?: Partial<StateContext>
  ) {
    const oldState = this.state;
    this.state = newState;
    this.context = { ...this.context, ...contextUpdates };

    // Update available actions based on new state
    this.context.availableActions = this.getAvailableActions(newState);

    // Emit state change event for UI to react
    eventBus.emit(CorsairEvent.STATE_CHANGED, {
      from: oldState,
      to: newState,
      context: this.context,
    });
  }

  private handleFileChange(data: { file: string }) {
    if (this.state !== CorsairState.IDLE) {
      // Queue or ignore based on current state
      return;
    }

    this.transition(CorsairState.DETECTING, {
      currentQuery: undefined, // Reset
    });

    // Trigger detection (another component will handle this)
    eventBus.emit(CorsairEvent.QUERY_DETECTED, { file: data.file });
  }

  private handleQueryDetected(data: { query: any }) {
    this.transition(CorsairState.GENERATING, {
      currentQuery: data.query,
      generationProgress: { stage: "Starting...", percentage: 0 },
    });
  }

  private handleGenerationComplete(data: { queryId: string; files: any }) {
    this.transition(CorsairState.AWAITING_FEEDBACK, {
      generationProgress: undefined,
    });
  }

  private handleUserInput(data: { command: string; args: any }) {
    switch (this.state) {
      case CorsairState.AWAITING_FEEDBACK:
        this.handleFeedbackInput(data);
        break;
      case CorsairState.PROMPTING:
        this.handlePromptResponse(data);
        break;
      case CorsairState.IDLE:
        this.handleIdleCommand(data);
        break;
    }
  }

  private getAvailableActions(state: CorsairState): string[] {
    const base = ["help", "quit"];

    switch (state) {
      case CorsairState.IDLE:
        return [...base, "status", "list", "config"];
      case CorsairState.AWAITING_FEEDBACK:
        return [...base, "regenerate", "tweak", "undo", "accept"];
      case CorsairState.GENERATING:
        return [...base, "cancel"];
      case CorsairState.ERROR:
        return [...base, "retry", "skip", "debug"];
      default:
        return base;
    }
  }

  // Public API to get current state (for UI)
  public getCurrentState() {
    return {
      state: this.state,
      context: { ...this.context },
    };
  }
}

export const stateMachine = new CorsairStateMachine();
