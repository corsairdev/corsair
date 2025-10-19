import type { Field } from '@aws-sdk/client-rds-data';
import { TypeHint } from '@aws-sdk/client-rds-data';
import type { QueryTypingsValue } from "../../sql/sql.cjs";
export declare function getValueFromDataApi(field: Field): string | number | boolean | string[] | number[] | Uint8Array | boolean[] | import("@aws-sdk/client-rds-data").ArrayValue[] | null;
export declare function typingsToAwsTypeHint(typings?: QueryTypingsValue): TypeHint | undefined;
export declare function toValueParam(value: any, typings?: QueryTypingsValue): {
    value: Field;
    typeHint?: TypeHint;
};
