import { eventBus } from "../core/event-bus.js";
import { stateMachine } from "../core/state-machine.js";
import { CorsairEvent } from "../types/events.js";
import type { FileChangedEvent } from "../types/events.js";
import * as path from "path";
import { Project, SyntaxKind } from "ts-morph";
import { operationChangeHandler } from "./operation-change-handler.js";

/**
 * File Change Handler
 *
 * Listens to: FILE_CHANGED
 * Emits: QUERY_DETECTED
 */
class FileChangeHandler {
  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    eventBus.on(CorsairEvent.FILE_CHANGED, this.handleFileChange.bind(this));
  }

  private refreshSourceFile(data: { project: Project; file: string }) {
    const { project, file } = data;
    const sourceFile = project.getSourceFile(file);

    if (!sourceFile) {
      return;
    }

    sourceFile.refreshFromFileSystemSync();
  }

  private getAllCorsairInstancesInFile(data: {
    project: Project;
    file: string;
  }) {
    const { project, file } = data;

    const sourceFile = project.getSourceFile(file);

    if (!sourceFile) {
      return [];
    }

    // All the Corsair functions we want to detect
    const corsairFunctions = [
      "corsairQuery",
      "corsairMutation",
      "useCorsairQuery",
      "useCorsairMutation",
    ];

    // Find all call expressions in the file
    const callExpressions = sourceFile.getDescendantsOfKind(
      SyntaxKind.CallExpression
    );

    // Filter to only Corsair-related calls
    const corsairCalls = callExpressions.filter((call) => {
      const text = call.getExpression().getText();
      return corsairFunctions.includes(text);
    });

    const calls: {
      name: string;
      prompt: string;
      line: number;
    }[] = [];

    // Log details about each call
    corsairCalls.forEach((call) => {
      calls.push({
        name: call.getExpression().getText(),
        prompt: call.getArguments()[0].getText(),
        line: call.getStartLineNumber(),
      });
    });

    return calls;
  }

  private handleFileChange(data: FileChangedEvent) {
    const { file: path, project } = data;

    if (!project) {
      return;
    }

    const callsBeforeUpdate = this.getAllCorsairInstancesInFile({
      project,
      file: path,
    });

    this.refreshSourceFile({ project, file: path });

    const callsAfterUpdate = this.getAllCorsairInstancesInFile({
      project,
      file: path,
    });

    // Only process changes if there are Corsair operations in either state
    if (callsBeforeUpdate.length === 0 && callsAfterUpdate.length === 0) {
      return;
    }

    // Detect and emit operation changes
    operationChangeHandler.detectChanges({
      file: path,
      before: callsBeforeUpdate,
      after: callsAfterUpdate,
    });
  }
}

// Initialize handler
export const fileChangeHandler = new FileChangeHandler();
