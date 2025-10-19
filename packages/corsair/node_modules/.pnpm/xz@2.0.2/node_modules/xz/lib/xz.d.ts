/// <reference types="node" />
import * as stream from "stream";
export declare type EngineCallback = (error?: Error, used?: number) => void;
export interface Engine {
    close(): void;
    process(input: Buffer | undefined, output: Buffer, flags: number, callback: EngineCallback): number;
}
export declare const ENCODE_FINISH: any;
export declare const MODE_ENCODE: any;
export declare const MODE_DECODE: any;
export interface XzTransformOptions extends stream.TransformOptions {
    preset?: number;
    bufferSize?: number;
}
declare class XzStream extends stream.Transform {
    engine: Engine;
    buffer: Buffer;
    constructor(mode: number, options?: XzTransformOptions);
    _transform(chunk: Buffer | string, encoding: string | undefined, callback: stream.TransformCallback): void;
    _flush(callback: stream.TransformCallback): void;
    update(input: Buffer, callback: (error?: Error, output?: Buffer) => void): void;
    updatePromise(input: Buffer): Promise<Buffer>;
    final(callback: (error?: Error, output?: Buffer) => void): void;
    finalPromise(): Promise<Buffer>;
    processLoop(input: Buffer | undefined, flags: number, segments: Buffer[], callback: stream.TransformCallback): void;
}
export declare class Compressor extends XzStream {
    constructor(options?: XzTransformOptions);
}
export declare class Decompressor extends XzStream {
    constructor(options?: XzTransformOptions);
}
export declare function compressRaw(preset?: number): Engine;
export declare function decompressRaw(): Engine;
export {};
