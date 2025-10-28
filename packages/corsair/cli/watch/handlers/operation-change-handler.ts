import { eventBus } from "../core/event-bus.js";
import { CorsairEvent } from "../types/events.js";
import type {
  OperationAddedEvent,
  OperationRemovedEvent,
  OperationUpdatedEvent,
} from "../types/events.js";
import * as path from "path";

interface CorsairOperation {
  name: string;
  prompt: string;
  line: number;
}

/**
 * Operation Change Handler
 *
 * Compares before/after states of Corsair operations in a file
 * and emits appropriate events for added, removed, or updated operations
 */
class OperationChangeHandler {
  /**
   * Analyzes changes between before and after operation states
   */
  public detectChanges(data: {
    file: string;
    before: CorsairOperation[];
    after: CorsairOperation[];
  }) {
    const { file, before, after } = data;
    const fileName = path.basename(file);

    // Detect added operations
    for (const afterOp of after) {
      const beforeOp = before.find(
        (op) => op.name === afterOp.name && op.line === afterOp.line
      );

      if (!beforeOp) {
        this.emitOperationAdded({
          operation: afterOp,
          file,
          fileName,
        });
      } else if (beforeOp.prompt !== afterOp.prompt) {
        // Detect updated operations (same function name and line but different prompt)
        this.emitOperationUpdated({
          operation: afterOp,
          oldPrompt: beforeOp.prompt,
          file,
          fileName,
        });
      }
    }

    // Detect removed operations
    for (const beforeOp of before) {
      const afterOp = after.find(
        (op) => op.name === beforeOp.name && op.line === beforeOp.line
      );

      if (!afterOp) {
        this.emitOperationRemoved({
          operation: beforeOp,
          file,
          fileName,
        });
      }
    }
  }

  /**
   * Determines operation type from function name
   */
  private getOperationType(functionName: string): "query" | "mutation" {
    if (functionName === "corsairQuery" || functionName === "useCorsairQuery") {
      return "query";
    }
    return "mutation";
  }

  /**
   * Extracts a clean operation name from the prompt
   * Falls back to a generic name if extraction fails
   */
  private extractOperationName(
    prompt: string,
    functionName: string,
    lineNumber: number
  ): string {
    // Remove quotes and clean the prompt
    const cleanPrompt = prompt.replace(/['"]/g, "").trim();

    // If we have a clean prompt, use it directly with truncation
    if (cleanPrompt.length > 0) {
      // Truncate if over 100 characters and add ellipsis
      if (cleanPrompt.length > 100) {
        return cleanPrompt.substring(0, 97) + "...";
      }
      return cleanPrompt;
    }

    // Fallback to a generic name
    const type = this.getOperationType(functionName);
    return `${type}At${lineNumber}`;
  }

  /**
   * Emits OPERATION_ADDED event
   */
  private emitOperationAdded(data: {
    operation: CorsairOperation;
    file: string;
    fileName: string;
  }) {
    const { operation, file, fileName } = data;
    const operationType = this.getOperationType(operation.name);
    const operationName = this.extractOperationName(
      operation.prompt,
      operation.name,
      operation.line
    );

    const event: OperationAddedEvent = {
      operationType,
      operationName,
      functionName: operation.name,
      prompt: operation.prompt,
      file,
      lineNumber: operation.line,
    };

    eventBus.emit(CorsairEvent.OPERATION_ADDED, event);
  }

  /**
   * Emits OPERATION_REMOVED event
   */
  private emitOperationRemoved(data: {
    operation: CorsairOperation;
    file: string;
    fileName: string;
  }) {
    const { operation, file, fileName } = data;
    const operationType = this.getOperationType(operation.name);
    const operationName = this.extractOperationName(
      operation.prompt,
      operation.name,
      operation.line
    );

    const event: OperationRemovedEvent = {
      operationType,
      operationName,
      functionName: operation.name,
      prompt: operation.prompt,
      file,
    };

    eventBus.emit(CorsairEvent.OPERATION_REMOVED, event);
  }

  /**
   * Emits OPERATION_UPDATED event
   */
  private emitOperationUpdated(data: {
    operation: CorsairOperation;
    oldPrompt: string;
    file: string;
    fileName: string;
  }) {
    const { operation, oldPrompt, file, fileName } = data;
    const operationType = this.getOperationType(operation.name);
    const operationName = this.extractOperationName(
      operation.prompt,
      operation.name,
      operation.line
    );

    const event: OperationUpdatedEvent = {
      operationType,
      operationName,
      functionName: operation.name,
      oldPrompt,
      newPrompt: operation.prompt,
      file,
      lineNumber: operation.line,
    };

    eventBus.emit(CorsairEvent.OPERATION_UPDATED, event);
  }
}

// Export singleton instance
export const operationChangeHandler = new OperationChangeHandler();
