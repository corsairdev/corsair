import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
export type MySqlVarBinaryBuilderInitial<TName extends string> = MySqlVarBinaryBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlVarBinary';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class MySqlVarBinaryBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlVarBinary'>> extends MySqlColumnBuilder<T, MySqlVarbinaryOptions> {
    static readonly [entityKind]: string;
}
export declare class MySqlVarBinary<T extends ColumnBaseConfig<'string', 'MySqlVarBinary'>> extends MySqlColumn<T, MySqlVarbinaryOptions> {
    static readonly [entityKind]: string;
    length: number | undefined;
    mapFromDriverValue(value: string | Buffer | Uint8Array): string;
    getSQLType(): string;
}
export interface MySqlVarbinaryOptions {
    length: number;
}
export declare function varbinary(config: MySqlVarbinaryOptions): MySqlVarBinaryBuilderInitial<''>;
export declare function varbinary<TName extends string>(name: TName, config: MySqlVarbinaryOptions): MySqlVarBinaryBuilderInitial<TName>;
