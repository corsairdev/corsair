"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var cache_exports = {};
__export(cache_exports, {
  UpstashCache: () => UpstashCache,
  upstashCache: () => upstashCache
});
module.exports = __toCommonJS(cache_exports);
var import_redis = require("@upstash/redis");
var import_core = require("../core/index.cjs");
var import_entity = require("../../entity.cjs");
var import__ = require("../../index.cjs");
const getByTagScript = `
local tagsMapKey = KEYS[1] -- tags map key
local tag        = ARGV[1] -- tag

local compositeTableName = redis.call('HGET', tagsMapKey, tag)
if not compositeTableName then
  return nil
end

local value = redis.call('HGET', compositeTableName, tag)
return value
`;
const onMutateScript = `
local tagsMapKey = KEYS[1] -- tags map key
local tables     = {}      -- initialize tables array
local tags       = ARGV    -- tags array

for i = 2, #KEYS do
  tables[#tables + 1] = KEYS[i] -- add all keys except the first one to tables
end

if #tags > 0 then
  for _, tag in ipairs(tags) do
    if tag ~= nil and tag ~= '' then
      local compositeTableName = redis.call('HGET', tagsMapKey, tag)
      if compositeTableName then
        redis.call('HDEL', compositeTableName, tag)
      end
    end
  end
  redis.call('HDEL', tagsMapKey, unpack(tags))
end

local keysToDelete = {}

if #tables > 0 then
  local compositeTableNames = redis.call('SUNION', unpack(tables))
  for _, compositeTableName in ipairs(compositeTableNames) do
    keysToDelete[#keysToDelete + 1] = compositeTableName
  end
  for _, table in ipairs(tables) do
    keysToDelete[#keysToDelete + 1] = table
  end
  redis.call('DEL', unpack(keysToDelete))
end
`;
class UpstashCache extends import_core.Cache {
  constructor(redis, config, useGlobally) {
    super();
    this.redis = redis;
    this.useGlobally = useGlobally;
    this.internalConfig = this.toInternalConfig(config);
    this.luaScripts = {
      getByTagScript: this.redis.createScript(getByTagScript, { readonly: true }),
      onMutateScript: this.redis.createScript(onMutateScript)
    };
  }
  static [import_entity.entityKind] = "UpstashCache";
  /**
   * Prefix for sets which denote the composite table names for each unique table
   *
   * Example: In the composite table set of "table1", you may find
   * `${compositeTablePrefix}table1,table2` and `${compositeTablePrefix}table1,table3`
   */
  static compositeTableSetPrefix = "__CTS__";
  /**
   * Prefix for hashes which map hash or tags to cache values
   */
  static compositeTablePrefix = "__CT__";
  /**
   * Key which holds the mapping of tags to composite table names
   *
   * Using this tagsMapKey, you can find the composite table name for a given tag
   * and get the cache value for that tag:
   *
   * ```ts
   * const compositeTable = redis.hget(tagsMapKey, 'tag1')
   * console.log(compositeTable) // `${compositeTablePrefix}table1,table2`
   *
   * const cachevalue = redis.hget(compositeTable, 'tag1')
   */
  static tagsMapKey = "__tagsMap__";
  /**
   * Queries whose auto invalidation is false aren't stored in their respective
   * composite table hashes because those hashes are deleted when a mutation
   * occurs on related tables.
   *
   * Instead, they are stored in a separate hash with the prefix
   * `__nonAutoInvalidate__` to prevent them from being deleted when a mutation
   */
  static nonAutoInvalidateTablePrefix = "__nonAutoInvalidate__";
  luaScripts;
  internalConfig;
  strategy() {
    return this.useGlobally ? "all" : "explicit";
  }
  toInternalConfig(config) {
    return config ? {
      seconds: config.ex,
      hexOptions: config.hexOptions
    } : {
      seconds: 1
    };
  }
  async get(key, tables, isTag = false, isAutoInvalidate) {
    if (!isAutoInvalidate) {
      const result2 = await this.redis.hget(UpstashCache.nonAutoInvalidateTablePrefix, key);
      return result2 === null ? void 0 : result2;
    }
    if (isTag) {
      const result2 = await this.luaScripts.getByTagScript.exec([UpstashCache.tagsMapKey], [key]);
      return result2 === null ? void 0 : result2;
    }
    const compositeKey = this.getCompositeKey(tables);
    const result = (await this.redis.hget(compositeKey, key)) ?? void 0;
    return result === null ? void 0 : result;
  }
  async put(key, response, tables, isTag = false, config) {
    const isAutoInvalidate = tables.length !== 0;
    const pipeline = this.redis.pipeline();
    const ttlSeconds = config && config.ex ? config.ex : this.internalConfig.seconds;
    const hexOptions = config && config.hexOptions ? config.hexOptions : this.internalConfig?.hexOptions;
    if (!isAutoInvalidate) {
      if (isTag) {
        pipeline.hset(UpstashCache.tagsMapKey, { [key]: UpstashCache.nonAutoInvalidateTablePrefix });
        pipeline.hexpire(UpstashCache.tagsMapKey, key, ttlSeconds, hexOptions);
      }
      pipeline.hset(UpstashCache.nonAutoInvalidateTablePrefix, { [key]: response });
      pipeline.hexpire(UpstashCache.nonAutoInvalidateTablePrefix, key, ttlSeconds, hexOptions);
      await pipeline.exec();
      return;
    }
    const compositeKey = this.getCompositeKey(tables);
    pipeline.hset(compositeKey, { [key]: response });
    pipeline.hexpire(compositeKey, key, ttlSeconds, hexOptions);
    if (isTag) {
      pipeline.hset(UpstashCache.tagsMapKey, { [key]: compositeKey });
      pipeline.hexpire(UpstashCache.tagsMapKey, key, ttlSeconds, hexOptions);
    }
    for (const table of tables) {
      pipeline.sadd(this.addTablePrefix(table), compositeKey);
    }
    await pipeline.exec();
  }
  async onMutate(params) {
    const tags = Array.isArray(params.tags) ? params.tags : params.tags ? [params.tags] : [];
    const tables = Array.isArray(params.tables) ? params.tables : params.tables ? [params.tables] : [];
    const tableNames = tables.map((table) => (0, import_entity.is)(table, import__.Table) ? table[import__.OriginalName] : table);
    const compositeTableSets = tableNames.map((table) => this.addTablePrefix(table));
    await this.luaScripts.onMutateScript.exec([UpstashCache.tagsMapKey, ...compositeTableSets], tags);
  }
  addTablePrefix = (table) => `${UpstashCache.compositeTableSetPrefix}${table}`;
  getCompositeKey = (tables) => `${UpstashCache.compositeTablePrefix}${tables.sort().join(",")}`;
}
function upstashCache({ url, token, config, global = false }) {
  const redis = new import_redis.Redis({
    url,
    token
  });
  return new UpstashCache(redis, config, global);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpstashCache,
  upstashCache
});
//# sourceMappingURL=cache.cjs.map