// /src/core/event-bus.ts
import EventEmitter from "events";

export enum CorsairEvent {
  // File System Events
  FILE_CHANGED = "file:changed",
  FILE_CREATED = "file:created",
  FILE_DELETED = "file:deleted",

  // Detection Events
  QUERY_DETECTED = "query:detected",
  SCHEMA_CHANGED = "schema:changed",
  MANUAL_EDIT_DETECTED = "manual:edit",

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

class CorsairEventBus extends EventEmitter {
  // Type-safe event emission
  emit<T>(event: CorsairEvent, data: T): boolean {
    return super.emit(event, data);
  }

  // Type-safe event listening
  on<T>(event: CorsairEvent, handler: (data: T) => void): this {
    return super.on(event, handler);
  }
}

export const eventBus = new CorsairEventBus();
