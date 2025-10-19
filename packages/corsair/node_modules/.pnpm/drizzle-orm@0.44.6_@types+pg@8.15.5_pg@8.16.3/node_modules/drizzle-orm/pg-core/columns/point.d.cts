import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import { type Equal } from "../../utils.cjs";
import { PgColumn, PgColumnBuilder } from "./common.cjs";
export type PgPointTupleBuilderInitial<TName extends string> = PgPointTupleBuilder<{
    name: TName;
    dataType: 'array';
    columnType: 'PgPointTuple';
    data: [number, number];
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class PgPointTupleBuilder<T extends ColumnBuilderBaseConfig<'array', 'PgPointTuple'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: string);
}
export declare class PgPointTuple<T extends ColumnBaseConfig<'array', 'PgPointTuple'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string | {
        x: number;
        y: number;
    }): [number, number];
    mapToDriverValue(value: [number, number]): string;
}
export type PgPointObjectBuilderInitial<TName extends string> = PgPointObjectBuilder<{
    name: TName;
    dataType: 'json';
    columnType: 'PgPointObject';
    data: {
        x: number;
        y: number;
    };
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgPointObjectBuilder<T extends ColumnBuilderBaseConfig<'json', 'PgPointObject'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: string);
}
export declare class PgPointObject<T extends ColumnBaseConfig<'json', 'PgPointObject'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string | {
        x: number;
        y: number;
    }): {
        x: number;
        y: number;
    };
    mapToDriverValue(value: {
        x: number;
        y: number;
    }): string;
}
export interface PgPointConfig<T extends 'tuple' | 'xy' = 'tuple' | 'xy'> {
    mode?: T;
}
export declare function point(): PgPointTupleBuilderInitial<''>;
export declare function point<TMode extends PgPointConfig['mode'] & {}>(config?: PgPointConfig<TMode>): Equal<TMode, 'xy'> extends true ? PgPointObjectBuilderInitial<''> : PgPointTupleBuilderInitial<''>;
export declare function point<TName extends string, TMode extends PgPointConfig['mode'] & {}>(name: TName, config?: PgPointConfig<TMode>): Equal<TMode, 'xy'> extends true ? PgPointObjectBuilderInitial<TName> : PgPointTupleBuilderInitial<TName>;
