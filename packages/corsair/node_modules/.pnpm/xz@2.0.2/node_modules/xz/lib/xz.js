"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream = require("stream");
const node_xz = require("../build/Release/node_xz.node");
const DEFAULT_PRESET = 6;
const MIN_BUFSIZE = 1024;
const MAX_BUFSIZE = 64 * 1024;
exports.ENCODE_FINISH = node_xz.ENCODE_FINISH;
exports.MODE_ENCODE = node_xz.MODE_ENCODE;
exports.MODE_DECODE = node_xz.MODE_DECODE;
class XzStream extends stream.Transform {
    constructor(mode, options) {
        super(options);
        this.engine = new node_xz.Engine(mode, options ? options.preset : DEFAULT_PRESET);
        this.buffer = Buffer.alloc(options && options.bufferSize ? options.bufferSize : MIN_BUFSIZE);
    }
    _transform(chunk, encoding, callback) {
        const input = chunk instanceof Buffer ? chunk : Buffer.from(chunk, encoding);
        this.update(input, callback);
    }
    _flush(callback) {
        this.final(callback);
    }
    // mimic the crypto API for people who don't care for nodejs streams
    update(input, callback) {
        const bufSize = Math.max(Math.min(input.length * 1.1, MAX_BUFSIZE), MIN_BUFSIZE);
        if (bufSize > this.buffer.length)
            this.buffer = Buffer.alloc(bufSize);
        this.processLoop(input, 0, [], callback);
    }
    // mimic the crypto API for people who don't care for nodejs streams
    updatePromise(input) {
        return new Promise((resolve, reject) => {
            this.update(input, (error, output) => {
                if (error || !output)
                    return reject(error);
                resolve(output);
            });
        });
    }
    // mimic the crypto API for people who don't care for nodejs streams
    final(callback) {
        this.processLoop(undefined, exports.ENCODE_FINISH, [], callback);
    }
    // mimic the crypto API for people who don't care for nodejs streams
    finalPromise() {
        return new Promise((resolve, reject) => {
            this.final((error, output) => {
                if (error || !output)
                    return reject(error);
                resolve(output);
            });
        });
    }
    processLoop(input, flags, segments, callback) {
        // slightly too clever: we use the same buffer each time, as long as it's
        // big enough: the `concat` at the end will create a new one. if we need
        // to go back for a 2nd+ time, we replace it, since the array of `slice`
        // are just views.
        this.engine.process(input, this.buffer, flags, (error, used) => {
            if (error || used === undefined)
                return callback(error || new Error("Unknown error"));
            let size = Math.abs(used);
            segments.push(this.buffer.slice(0, size));
            if (used < 0) {
                this.buffer = Buffer.alloc(this.buffer.length);
                this.processLoop(undefined, flags, segments, callback);
            }
            else {
                callback(undefined, Buffer.concat(segments));
            }
        });
    }
}
class Compressor extends XzStream {
    constructor(options) {
        super(exports.MODE_ENCODE, options);
    }
}
exports.Compressor = Compressor;
class Decompressor extends XzStream {
    constructor(options) {
        super(exports.MODE_DECODE, options);
    }
}
exports.Decompressor = Decompressor;
function compressRaw(preset = DEFAULT_PRESET) {
    return new node_xz.Engine(exports.MODE_ENCODE, preset);
}
exports.compressRaw = compressRaw;
function decompressRaw() {
    return new node_xz.Engine(exports.MODE_DECODE, 0);
}
exports.decompressRaw = decompressRaw;
//# sourceMappingURL=xz.js.map