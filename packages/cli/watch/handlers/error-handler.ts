import { eventBus } from '../core/event-bus.js';
import type {
	ErrorOccurredEvent,
	GenerationFailedEvent,
} from '../types/events.js';
import { CorsairEvent } from '../types/events.js';

/**
 * Error Handler
 *
 * Listens to: ERROR_OCCURRED, GENERATION_FAILED
 * Logs errors and updates state machine
 */
class ErrorHandler {
	constructor() {
		this.setupListeners();
	}

	private setupListeners() {
		eventBus.on(CorsairEvent.ERROR_OCCURRED, this.handleError.bind(this));
		eventBus.on(
			CorsairEvent.GENERATION_FAILED,
			this.handleGenerationFailed.bind(this),
		);
	}

	private handleError(data: ErrorOccurredEvent) {
		console.error('\n[ERROR]', data.message);

		if (data.code) {
			console.error('Code:', data.code);
		}

		if (data.suggestions && data.suggestions.length > 0) {
			console.error('\nSuggestions:');
			data.suggestions.forEach((suggestion) => {
				console.error(`  - ${suggestion}`);
			});
		}

		if (data.stack && process.env.DEBUG === 'true') {
			console.error('\nStack trace:');
			console.error(data.stack);
		}
	}

	private handleGenerationFailed(data: GenerationFailedEvent) {
		console.error(`\n[GENERATION FAILED] Query: ${data.queryId}`);
		console.error('Error:', data.error);

		if (data.code) {
			console.error('Code:', data.code);
		}
	}
}

// Initialize handler
export const errorHandler = new ErrorHandler();
