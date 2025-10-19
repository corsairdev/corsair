import { entityKind } from "./entity.cjs";
import { View } from "./sql/sql.cjs";
import { Subquery } from "./subquery.cjs";
export declare class SelectionProxyHandler<T extends Subquery | Record<string, unknown> | View> implements ProxyHandler<Subquery | Record<string, unknown> | View> {
    static readonly [entityKind]: string;
    private config;
    constructor(config: SelectionProxyHandler<T>['config']);
    get(subquery: T, prop: string | symbol): any;
}
