import type { Query } from "./index.cjs";
export interface PreparedQuery {
    getQuery(): Query;
    mapResult(response: unknown, isFromBatch?: boolean): unknown;
}
