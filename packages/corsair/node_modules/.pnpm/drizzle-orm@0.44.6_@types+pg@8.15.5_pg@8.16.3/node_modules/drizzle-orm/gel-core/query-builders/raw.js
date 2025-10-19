import { entityKind } from "../../entity.js";
import { QueryPromise } from "../../query-promise.js";
class GelRaw extends QueryPromise {
  constructor(execute, sql, query, mapBatchResult) {
    super();
    this.execute = execute;
    this.sql = sql;
    this.query = query;
    this.mapBatchResult = mapBatchResult;
  }
  static [entityKind] = "GelRaw";
  /** @internal */
  getSQL() {
    return this.sql;
  }
  getQuery() {
    return this.query;
  }
  mapResult(result, isFromBatch) {
    return isFromBatch ? this.mapBatchResult(result) : result;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return false;
  }
}
export {
  GelRaw
};
//# sourceMappingURL=raw.js.map