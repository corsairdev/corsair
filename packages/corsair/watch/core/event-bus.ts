import EventEmitter from "events";
import type { CorsairEvent, EventDataMap } from "../types/events.js";

class CorsairEventBus extends EventEmitter {
	private logEvents = process.env.DEBUG === "true";

	emit<E extends CorsairEvent>(event: E, data: EventDataMap[E]): boolean {
		if (this.logEvents) {
			console.log(`[EVENT] ${event}`, JSON.stringify(data, null, 2));
		}
		return super.emit(event, data);
	}

	on<E extends CorsairEvent>(
		event: E,
		handler: (data: EventDataMap[E]) => void,
	): this {
		return super.on(event, handler);
	}

	once<E extends CorsairEvent>(
		event: E,
		handler: (data: EventDataMap[E]) => void,
	): this {
		return super.once(event, handler);
	}

	off<E extends CorsairEvent>(
		event: E,
		handler: (data: EventDataMap[E]) => void,
	): this {
		return super.off(event, handler);
	}
}

export const eventBus = new CorsairEventBus();
