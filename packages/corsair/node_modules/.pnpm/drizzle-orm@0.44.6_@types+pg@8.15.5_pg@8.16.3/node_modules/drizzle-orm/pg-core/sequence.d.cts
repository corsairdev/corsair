import { entityKind } from "../entity.cjs";
export type PgSequenceOptions = {
    increment?: number | string;
    minValue?: number | string;
    maxValue?: number | string;
    startWith?: number | string;
    cache?: number | string;
    cycle?: boolean;
};
export declare class PgSequence {
    readonly seqName: string | undefined;
    readonly seqOptions: PgSequenceOptions | undefined;
    readonly schema: string | undefined;
    static readonly [entityKind]: string;
    constructor(seqName: string | undefined, seqOptions: PgSequenceOptions | undefined, schema: string | undefined);
}
export declare function pgSequence(name: string, options?: PgSequenceOptions): PgSequence;
export declare function isPgSequence(obj: unknown): obj is PgSequence;
