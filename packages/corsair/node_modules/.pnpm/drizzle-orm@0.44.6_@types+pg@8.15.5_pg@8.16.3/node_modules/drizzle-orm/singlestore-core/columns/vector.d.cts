import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.cjs";
export type SingleStoreVectorBuilderInitial<TName extends string> = SingleStoreVectorBuilder<{
    name: TName;
    dataType: 'array';
    columnType: 'SingleStoreVector';
    data: Array<number>;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class SingleStoreVectorBuilder<T extends ColumnBuilderBaseConfig<'array', 'SingleStoreVector'>> extends SingleStoreColumnBuilder<T, SingleStoreVectorConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: SingleStoreVectorConfig);
}
export declare class SingleStoreVector<T extends ColumnBaseConfig<'array', 'SingleStoreVector'>> extends SingleStoreColumn<T, SingleStoreVectorConfig> {
    static readonly [entityKind]: string;
    dimensions: number;
    elementType: ElementType | undefined;
    getSQLType(): string;
    mapToDriverValue(value: Array<number>): string;
    mapFromDriverValue(value: string): Array<number>;
}
type ElementType = 'I8' | 'I16' | 'I32' | 'I64' | 'F32' | 'F64';
export interface SingleStoreVectorConfig {
    dimensions: number;
    elementType?: ElementType;
}
export declare function vector(config: SingleStoreVectorConfig): SingleStoreVectorBuilderInitial<''>;
export declare function vector<TName extends string>(name: TName, config: SingleStoreVectorConfig): SingleStoreVectorBuilderInitial<TName>;
export {};
