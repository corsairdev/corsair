import type { ColumnBuilderBaseConfig } from "../../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../../column.cjs";
import { entityKind } from "../../../entity.cjs";
import { type Equal } from "../../../utils.cjs";
import { PgColumn, PgColumnBuilder } from "../common.cjs";
export type PgGeometryBuilderInitial<TName extends string> = PgGeometryBuilder<{
    name: TName;
    dataType: 'array';
    columnType: 'PgGeometry';
    data: [number, number];
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgGeometryBuilder<T extends ColumnBuilderBaseConfig<'array', 'PgGeometry'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgGeometry<T extends ColumnBaseConfig<'array', 'PgGeometry'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string): [number, number];
    mapToDriverValue(value: [number, number]): string;
}
export type PgGeometryObjectBuilderInitial<TName extends string> = PgGeometryObjectBuilder<{
    name: TName;
    dataType: 'json';
    columnType: 'PgGeometryObject';
    data: {
        x: number;
        y: number;
    };
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgGeometryObjectBuilder<T extends ColumnBuilderBaseConfig<'json', 'PgGeometryObject'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgGeometryObject<T extends ColumnBaseConfig<'json', 'PgGeometryObject'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string): {
        x: number;
        y: number;
    };
    mapToDriverValue(value: {
        x: number;
        y: number;
    }): string;
}
export interface PgGeometryConfig<T extends 'tuple' | 'xy' = 'tuple' | 'xy'> {
    mode?: T;
    type?: 'point' | (string & {});
    srid?: number;
}
export declare function geometry(): PgGeometryBuilderInitial<''>;
export declare function geometry<TMode extends PgGeometryConfig['mode'] & {}>(config?: PgGeometryConfig<TMode>): Equal<TMode, 'xy'> extends true ? PgGeometryObjectBuilderInitial<''> : PgGeometryBuilderInitial<''>;
export declare function geometry<TName extends string, TMode extends PgGeometryConfig['mode'] & {}>(name: TName, config?: PgGeometryConfig<TMode>): Equal<TMode, 'xy'> extends true ? PgGeometryObjectBuilderInitial<TName> : PgGeometryBuilderInitial<TName>;
