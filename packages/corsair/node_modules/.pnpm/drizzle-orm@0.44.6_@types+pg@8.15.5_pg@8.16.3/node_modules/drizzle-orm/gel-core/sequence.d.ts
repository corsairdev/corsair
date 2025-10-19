import { entityKind } from "../entity.js";
export type GelSequenceOptions = {
    increment?: number | string;
    minValue?: number | string;
    maxValue?: number | string;
    startWith?: number | string;
    cache?: number | string;
    cycle?: boolean;
};
export declare class GelSequence {
    readonly seqName: string | undefined;
    readonly seqOptions: GelSequenceOptions | undefined;
    readonly schema: string | undefined;
    static readonly [entityKind]: string;
    constructor(seqName: string | undefined, seqOptions: GelSequenceOptions | undefined, schema: string | undefined);
}
export declare function gelSequence(name: string, options?: GelSequenceOptions): GelSequence;
export declare function isGelSequence(obj: unknown): obj is GelSequence;
