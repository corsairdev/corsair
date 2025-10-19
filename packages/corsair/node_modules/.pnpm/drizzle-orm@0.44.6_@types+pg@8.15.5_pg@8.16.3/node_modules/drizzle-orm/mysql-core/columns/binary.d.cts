import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { MySqlColumn, MySqlColumnBuilder } from "./common.cjs";
export type MySqlBinaryBuilderInitial<TName extends string> = MySqlBinaryBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlBinary';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class MySqlBinaryBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlBinary'>> extends MySqlColumnBuilder<T, MySqlBinaryConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], length: number | undefined);
}
export declare class MySqlBinary<T extends ColumnBaseConfig<'string', 'MySqlBinary'>> extends MySqlColumn<T, MySqlBinaryConfig> {
    static readonly [entityKind]: string;
    length: number | undefined;
    mapFromDriverValue(value: string | Buffer | Uint8Array): string;
    getSQLType(): string;
}
export interface MySqlBinaryConfig {
    length?: number;
}
export declare function binary(): MySqlBinaryBuilderInitial<''>;
export declare function binary(config?: MySqlBinaryConfig): MySqlBinaryBuilderInitial<''>;
export declare function binary<TName extends string>(name: TName, config?: MySqlBinaryConfig): MySqlBinaryBuilderInitial<TName>;
