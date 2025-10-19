import type { Dialect } from "./column-builder.cjs";
export interface RunnableQuery<T, TDialect extends Dialect> {
    readonly _: {
        readonly dialect: TDialect;
        readonly result: T;
    };
}
