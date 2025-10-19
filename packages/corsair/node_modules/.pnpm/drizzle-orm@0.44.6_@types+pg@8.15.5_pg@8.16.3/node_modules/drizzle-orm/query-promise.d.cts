import { entityKind } from "./entity.cjs";
export declare abstract class QueryPromise<T> implements Promise<T> {
    static readonly [entityKind]: string;
    [Symbol.toStringTag]: string;
    catch<TResult = never>(onRejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T | TResult>;
    finally(onFinally?: (() => void) | null | undefined): Promise<T>;
    then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    abstract execute(): Promise<T>;
}
