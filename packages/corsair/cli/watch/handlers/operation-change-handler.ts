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

    // Create maps for easier comparison
    const beforeMap = new Map<string, CorsairOperation>();
    const afterMap = new Map<string, CorsairOperation>();

    before.forEach((op) => {
      const key = this.createOperationKey(op);
      beforeMap.set(key, op);
    });

    after.forEach((op) => {
      const key = this.createOperationKey(op);
      afterMap.set(key, op);
    });

    // Detect added operations
    for (const [key, operation] of afterMap) {
      if (!beforeMap.has(key)) {
        this.emitOperationAdded({
          operation,
          file,
          fileName,
        });
      }
    }

    // Detect removed operations
    for (const [key, operation] of beforeMap) {
      if (!afterMap.has(key)) {
        this.emitOperationRemoved({
          operation,
          file,
          fileName,
        });
      }
    }

    // Detect updated operations (same function name but different prompt)
    for (const [key, afterOp] of afterMap) {
      const beforeOp = beforeMap.get(key);
      if (beforeOp && beforeOp.prompt !== afterOp.prompt) {
        this.emitOperationUpdated({
          operation: afterOp,
          oldPrompt: beforeOp.prompt,
          file,
          fileName,
        });
      }
    }
  }

  /**
   * Creates a unique key for an operation based on its function name
   */
  private createOperationKey(operation: CorsairOperation): string {
    return operation.name;
  }

  /**
   * Determines operation type from function name
   */
  private getOperationType(
    functionName: string
  ): "query" | "mutation" {
    if (
      functionName === "corsairQuery" ||
      functionName === "useCorsairQuery"
    ) {
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

    // Try to extract a meaningful name from the prompt
    // For example: "get all users" -> "getAllUsers"
    if (cleanPrompt.length > 0 && cleanPrompt.length < 100) {
      // Use first few words as the name
      const words = cleanPrompt.split(" ").slice(0, 4);
      const camelCase = words
        .map((word, index) => {
          const cleaned = word.replace(/[^a-zA-Z0-9]/g, "");
          if (index === 0) return cleaned.toLowerCase();
          return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
        })
        .join("");

      if (camelCase.length > 0) {
        return camelCase;
      }
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
