#pragma once

#include <napi.h>
#include "lzma.h"

typedef Napi::Buffer<uint8_t> NapiByteBuffer;

/**
 * This low-level wrapper is unpleasant, and isn't meant to be used directly.
 * It just provides access to the raw stream engine in xz.
 */
class Engine : public Napi::ObjectWrap<Engine> {
public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);

  explicit Engine(const Napi::CallbackInfo& info);
  virtual ~Engine();

  lzma_stream stream;
  bool active;  // true while the engine is running an AsyncWorker

  // keep a handle to the input buffer if we expect to be called again
  // with the same input because the original output buffer wasn't big enough.
  Napi::Reference<NapiByteBuffer> inBufferHandle;

  // keep a handle to the output buffer across the thread call, to make sure
  // it isn't GC'd.
  Napi::Reference<NapiByteBuffer> outBufferHandle;

private:
  // close()
  Napi::Value Close(const Napi::CallbackInfo& info);

  // process(input: Buffer | undefined, output: Buffer, callback: (used: number) => void)
  //   - returns a positive number (how much output was used) if the complete
  //     input was processed
  //   - returns a negative number (how much output was used, negative) if
  //     you need to call again with an undefined input and a new buffer to
  //     get more of the output
  Napi::Value Process(const Napi::CallbackInfo& info);

  static Napi::FunctionReference constructor;

  bool closed;
};


class AsyncEngine : public Napi::AsyncWorker {
public:
  // c++ is ridiculous.
  AsyncEngine(Napi::Function& callback, Engine *engine, lzma_action action) :
    AsyncWorker(callback), engine(engine), action(action), used(0) {
    // pass
  }

  virtual ~AsyncEngine() {
    // pass
  }

  virtual void Execute(void);
  virtual void OnOK(void);

private:
  Engine *engine;
  lzma_action action;
  size_t used;
  lzma_ret ret;
};
