"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("should");
require("source-map-support/register");
const fs = require("fs");
const stream = require("stream");
const xz = require("../xz");
function bufferSource(b) {
    if (typeof b == "string")
        b = Buffer.from(b);
    let s = new stream.Readable();
    s._read = (size) => {
        s.push(b);
        s.push(null);
    };
    return s;
}
class BufferSink extends stream.Writable {
    constructor() {
        super(...arguments);
        this.buffers = [];
    }
    _write(chunk, encoding, callback) {
        this.buffers.push(chunk);
        callback(undefined);
    }
    ;
    getBuffer() {
        return Buffer.concat(this.buffers);
    }
}
describe("Compressor/Decompressor", () => {
    it("can compress", (done) => {
        let c = new xz.Compressor();
        let out = new BufferSink();
        bufferSource("hello!").pipe(c).pipe(out);
        out.on("finish", () => {
            out.getBuffer().length.should.eql(56);
            done();
        });
    });
    it("can round-trip", (done) => {
        let data = "Hello, I'm Dr. Thaddeus Venture.";
        let c = new xz.Compressor();
        let d = new xz.Decompressor();
        let out = new BufferSink();
        bufferSource(data).pipe(c).pipe(d).pipe(out);
        out.on("finish", () => {
            out.getBuffer().toString().should.eql(data);
            done();
        });
    });
    it("can compress a big file", (done) => {
        let c = new xz.Compressor({ preset: 9 });
        let out = new BufferSink();
        fs.createReadStream("./testdata/minecraft.png").pipe(c).pipe(out);
        out.on("finish", () => {
            out.getBuffer().length.should.lessThan(fs.statSync("./testdata/minecraft.png").size);
            done();
        });
    });
});
//# sourceMappingURL=test_compressor.js.map