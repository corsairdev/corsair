import { eventBus } from "../core/event-bus.js";
import { CorsairEvent } from "../types/events.js";
import type { UserCommandEvent } from "../types/events.js";

/**
 * User Input Handler
 *
 * Listens to: USER_COMMAND
 * Emits: Various events based on commands
 */
class UserInputHandler {
  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    eventBus.on(CorsairEvent.USER_COMMAND, this.handleCommand.bind(this));
  }

  private handleCommand(data: UserCommandEvent) {
    const { command, args } = data;

    switch (command) {
      case "regenerate":
        this.handleRegenerate();
        break;

      case "tweak":
        this.handleTweak();
        break;

      case "undo":
        this.handleUndo();
        break;

      case "accept":
        // Handled by state machine
        break;

      case "help":
        this.handleHelp();
        break;

      case "quit":
        this.handleQuit();
        break;

      default:
      // console.log(`Unknown command: ${command}`);
    }
  }

  private handleRegenerate() {
    // TODO: Implement regeneration logic
    // For now, just log
    console.log("Regenerate requested (not implemented yet)");
  }

  private handleTweak() {
    // TODO: Implement tweak mode
    console.log("Tweak mode requested (not implemented yet)");
  }

  private handleUndo() {
    // TODO: Implement undo
    console.log("Undo requested (not implemented yet)");
  }

  private handleHelp() {
    console.log("\nCorsair Watch - Help");
    console.log("===================\n");
    console.log("Available commands:");
    console.log("  [R] Regenerate - Generate the query again");
    console.log("  [T] Tweak - Modify the generated query");
    console.log("  [U] Undo - Revert to previous version");
    console.log("  [A] Accept - Accept the generated query");
    console.log("  [H] Help - Show this help message");
    console.log("  [Q] Quit - Exit Corsair Watch\n");
  }

  private handleQuit() {
    console.log("\nShutting down Corsair Watch...");
    process.exit(0);
  }
}

// Initialize handler
export const userInputHandler = new UserInputHandler();
