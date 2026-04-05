import type { KyselyPlugin, PluginTransformQueryArgs, PluginTransformResultArgs, QueryResult, RootOperationNode, UnknownRow } from 'kysely';
export declare class SqliteDatePlugin implements KyselyPlugin {
    transformQuery(args: PluginTransformQueryArgs): RootOperationNode;
    transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>>;
}
//# sourceMappingURL=sqlite-date-plugin.d.ts.map