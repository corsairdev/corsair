import { entityKind } from "./entity.cjs";
export interface Logger {
    logQuery(query: string, params: unknown[]): void;
}
export interface LogWriter {
    write(message: string): void;
}
export declare class ConsoleLogWriter implements LogWriter {
    static readonly [entityKind]: string;
    write(message: string): void;
}
export declare class DefaultLogger implements Logger {
    static readonly [entityKind]: string;
    readonly writer: LogWriter;
    constructor(config?: {
        writer: LogWriter;
    });
    logQuery(query: string, params: unknown[]): void;
}
export declare class NoopLogger implements Logger {
    static readonly [entityKind]: string;
    logQuery(): void;
}
