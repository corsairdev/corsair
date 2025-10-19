import { entityKind } from "./entity.js";
export declare class DrizzleError extends Error {
    static readonly [entityKind]: string;
    constructor({ message, cause }: {
        message?: string;
        cause?: unknown;
    });
}
export declare class DrizzleQueryError extends Error {
    query: string;
    params: any[];
    cause?: Error | undefined;
    constructor(query: string, params: any[], cause?: Error | undefined);
}
export declare class TransactionRollbackError extends DrizzleError {
    static readonly [entityKind]: string;
    constructor();
}
