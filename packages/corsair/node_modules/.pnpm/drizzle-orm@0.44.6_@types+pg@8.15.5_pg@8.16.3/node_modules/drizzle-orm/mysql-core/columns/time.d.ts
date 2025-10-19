import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
export type MySqlTimeBuilderInitial<TName extends string> = MySqlTimeBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlTime';
    data: string;
    driverParam: string | number;
    enumValues: undefined;
}>;
export declare class MySqlTimeBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlTime'>> extends MySqlColumnBuilder<T, TimeConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: TimeConfig | undefined);
}
export declare class MySqlTime<T extends ColumnBaseConfig<'string', 'MySqlTime'>> extends MySqlColumn<T, TimeConfig> {
    static readonly [entityKind]: string;
    readonly fsp: number | undefined;
    getSQLType(): string;
}
export type TimeConfig = {
    fsp?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};
export declare function time(): MySqlTimeBuilderInitial<''>;
export declare function time(config?: TimeConfig): MySqlTimeBuilderInitial<''>;
export declare function time<TName extends string>(name: TName, config?: TimeConfig): MySqlTimeBuilderInitial<TName>;
