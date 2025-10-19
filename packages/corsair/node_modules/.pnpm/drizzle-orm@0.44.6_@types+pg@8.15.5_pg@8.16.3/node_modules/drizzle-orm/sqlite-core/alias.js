import { TableAliasProxyHandler } from "../alias.js";
function alias(table, alias2) {
  return new Proxy(table, new TableAliasProxyHandler(alias2, false));
}
export {
  alias
};
//# sourceMappingURL=alias.js.map