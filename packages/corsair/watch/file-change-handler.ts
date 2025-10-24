// /src/handlers/file-change-handler.ts
import { eventBus, CorsairEvent } from "../core/event-bus";
import { parseFileForQueries } from "../parsers/query-parser";

export class FileChangeHandler {
  constructor() {
    eventBus.on(CorsairEvent.FILE_CHANGED, this.handle.bind(this));
  }

  private async handle(data: { file: string }) {
    // Parse file to detect queries
    const queries = await parseFileForQueries(data.file);

    if (queries.length > 0) {
      // Found queries, emit detection event
      queries.forEach((query) => {
        eventBus.emit(CorsairEvent.QUERY_DETECTED, {
          query,
          sourceFile: data.file,
        });
      });
    } else {
      // No queries found, back to idle
      eventBus.emit(CorsairEvent.STATE_CHANGED, {
        to: "IDLE",
        reason: "No queries detected",
      });
    }
  }
}
