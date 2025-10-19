import type { Query } from "./index.js";
export interface PreparedQuery {
    getQuery(): Query;
    mapResult(response: unknown, isFromBatch?: boolean): unknown;
}
