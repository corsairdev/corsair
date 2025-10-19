# xz

[![Build Status](https://travis-ci.org/robey/node-xz.png?branch=master)](https://travis-ci.org/robey/node-xz)

Xz is the node binding for the xz library, which implements (streaming) LZMA2 compression. It consists of a very thin binding around liblzma, and wrapper javascript classes to implement the nodejs "stream" transform interface. Typescript definitions are included.

LZMA2 is better than gzip & bzip2 in many cases. Read more about LZMA here: http://en.wikipedia.org/wiki/Lempel-Ziv-Markov_chain_algorithm


## Install

```sh
$ npm install
$ npm test
```


## API

The API consists of only two stream transform classes: `Compressor` and `Decompressor`.

- `new xz.Compressor(options?: XzTransformOptions)`
- `new xz.Decompressor(options?: XzTransformOptions)`

The options object is passed to node's `Transform`, and has two additional optional fields:

- `preset: number`: an abstraction of the compression difficulty level, from 1 to 9, where 1 puts in the least effort. The default is 6.
- `bufferSize: number`: minimum buffer size to use for encoding/decoding blocks of data. The default is 1KB, but it will grow to match the block size of its input as it processes data. (You shouldn't normally need to care about this.)

Both objects are stream transforms that consume and produce Buffers. Here's example code to compress the sample file included with this distribution:

```javascript
var fs = require("fs");
var xz = require("xz");

var compression = new xz.Compressor(9);
var inFile = fs.createReadStream("./testdata/minecraft.png");
var outFile = fs.createWriteStream("./testdata/minecraft.png.lzma2");

inFile.pipe(compression).pipe(outFile);
```


## Non-streaming API

If you aren't using nodejs streams, an API similar to the crypto API is available on both `Compressor` and `Decompressor`:

- `update(input: Buffer, callback: (error?: Error, output?: Buffer) => void)`
- `final(callback: (error?: Error, output?: Buffer) => void)`

A promise-based API is also available:

- `updatePromise(input: Buffer): Promise<Buffer>`
- `finalPromise(): Promise<Buffer>`

Each method feeds a `Buffer` into the lzma2 engine, which may be executed on a separate core (asynchronously). The returned `Buffer` may have a length of 0: lzma2 keeps a large internal buffer while compressing, so it's common to receive empty `Buffer`s while you compress, followed by a large final `Buffer` when you end the stream with `final`.


## License

Apache 2 (open-source) license, included in 'LICENSE.txt'.


## Authors

- @robey - Robey Pointer <robeypointer@gmail.com>
