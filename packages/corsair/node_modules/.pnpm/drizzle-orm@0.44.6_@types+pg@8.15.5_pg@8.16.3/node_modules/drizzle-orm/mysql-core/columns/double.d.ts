import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from "./common.js";
export type MySqlDoubleBuilderInitial<TName extends string> = MySqlDoubleBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlDouble';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class MySqlDoubleBuilder<T extends ColumnBuilderBaseConfig<'number', 'MySqlDouble'>> extends MySqlColumnBuilderWithAutoIncrement<T, MySqlDoubleConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: MySqlDoubleConfig | undefined);
}
export declare class MySqlDouble<T extends ColumnBaseConfig<'number', 'MySqlDouble'>> extends MySqlColumnWithAutoIncrement<T, MySqlDoubleConfig> {
    static readonly [entityKind]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    readonly unsigned: boolean | undefined;
    getSQLType(): string;
}
export interface MySqlDoubleConfig {
    precision?: number;
    scale?: number;
    unsigned?: boolean;
}
export declare function double(): MySqlDoubleBuilderInitial<''>;
export declare function double(config?: MySqlDoubleConfig): MySqlDoubleBuilderInitial<''>;
export declare function double<TName extends string>(name: TName, config?: MySqlDoubleConfig): MySqlDoubleBuilderInitial<TName>;
