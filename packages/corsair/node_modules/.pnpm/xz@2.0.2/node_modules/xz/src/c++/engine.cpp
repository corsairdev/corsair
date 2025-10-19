#include "engine.h"

#define MODE_ENCODE 0
#define MODE_DECODE 1
#define ENCODE_FINISH 1

Napi::FunctionReference Engine::constructor;

static lzma_stream blank_stream = LZMA_STREAM_INIT;

static const char *lzma_perror(lzma_ret err) {
  switch (err) {
    case LZMA_MEM_ERROR: return "Memory allocation failed";
    case LZMA_MEMLIMIT_ERROR: return "Memory usage limit reached";
    case LZMA_FORMAT_ERROR: return "File format not recognized";
    case LZMA_OPTIONS_ERROR: return "Compression options not supported";
    case LZMA_DATA_ERROR: return "Data is corrupt";
    case LZMA_BUF_ERROR: return "No progress is possible (internal error)";
    case LZMA_UNSUPPORTED_CHECK: return "Check type not supported";
    case LZMA_PROG_ERROR: return "Invalid arguments";
    default: return "?";
  }
}


// ----- Engine

Napi::Object Engine::Init(Napi::Env env, Napi::Object exports) {
  Napi::HandleScope scope(env);

  Napi::Function func = DefineClass(env, "Engine", {
    InstanceMethod("close", &Engine::Close),
    InstanceMethod("process", &Engine::Process),
  });

  constructor = Napi::Persistent(func);
  constructor.SuppressDestruct();

  exports.Set("Engine", func);
  exports.Set("MODE_ENCODE", Napi::Number::New(env, MODE_ENCODE));
  exports.Set("MODE_DECODE", Napi::Number::New(env, MODE_DECODE));
  exports.Set("ENCODE_FINISH", Napi::Number::New(env, ENCODE_FINISH));
  return exports;
}

// new Engine(MODE_DECODE or MODE_ENCODE, [ preset ]);
// "preset" is the compression level (0 - 9)
Engine::Engine(const Napi::CallbackInfo& info) :
  Napi::ObjectWrap<Engine>(info), stream(blank_stream), active(false), closed(true) {
  Napi::Env env = info.Env();
  Napi::HandleScope scope(env);

  if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Requires 2 arguments: <mode> <preset>").ThrowAsJavaScriptException();
    return;
  }

  int mode = info[0].As<Napi::Number>().Int32Value();
  int preset = info[1].As<Napi::Number>().Int32Value();

  lzma_ret ret;
  if (mode == MODE_DECODE) {
    ret = lzma_stream_decoder(&stream, UINT64_MAX, 0);
  } else {
    ret = lzma_easy_encoder(&stream, preset, LZMA_CHECK_NONE);
  }
  if (ret != LZMA_OK) {
    Napi::Error::New(env, lzma_perror(ret)).ThrowAsJavaScriptException();
    return;
  }

  closed = false;
}

Engine::~Engine() {
  if (active) lzma_end(&stream);
}

Napi::Value Engine::Close(const Napi::CallbackInfo& info) {
  if (closed) {
    Napi::Error::New(info.Env(), "Engine has already been closed").ThrowAsJavaScriptException();
    return Napi::Value();
  }
  if (active) {
    Napi::Error::New(info.Env(), "Engine is in use").ThrowAsJavaScriptException();
    return Napi::Value();
  }

  lzma_end(&stream);
  inBufferHandle.Reset();
  closed = true;
  return info.Env().Undefined();
}

Napi::Value Engine::Process(const Napi::CallbackInfo& info) {
  Napi::HandleScope scope(info.Env());

  if (closed) {
    Napi::Error::New(info.Env(), "Engine has already been closed").ThrowAsJavaScriptException();
    return Napi::Value();
  }
  if (active) {
    Napi::Error::New(info.Env(), "Engine is in use").ThrowAsJavaScriptException();
    return Napi::Value();
  }

  if (
    info.Length() < 4 ||
    !info[1].IsBuffer() ||
    !(info[0].IsBuffer() || info[0].IsUndefined()) ||
    !info[2].IsNumber() ||
    !info[3].IsFunction()
  ) {
    Napi::Error::New(
      info.Env(),
      "Requires 4 arguments: <buffer|undefined> <buffer> <flags> <callback>"
    ).ThrowAsJavaScriptException();
    inBufferHandle.Reset();
    return Napi::Value();
  }

  if (info[0].IsBuffer()) {
    Napi::Buffer<uint8_t> buffer = info[0].As<Napi::Buffer<uint8_t>>();
    stream.next_in = (const uint8_t *) buffer.Data();
    stream.avail_in = buffer.Length();
    // keep a copy:
    inBufferHandle.Reset(buffer, 1);
  } else if (inBufferHandle.IsEmpty()) {
    stream.next_in = nullptr;
    stream.avail_in = 0;
  }

  Napi::Buffer<uint8_t> buffer = info[1].As<Napi::Buffer<uint8_t>>();
  int flags = info[2].As<Napi::Number>().Int32Value();
  Napi::Function callback = info[3].As<Napi::Function>();

  lzma_action action = (flags & ENCODE_FINISH) ? LZMA_FINISH : LZMA_RUN;
  stream.next_out = buffer.Data();
  stream.avail_out = buffer.Length();
  outBufferHandle.Reset(buffer, 1);

  // deleted via magic! inside AsyncWorker
  AsyncEngine *e = new AsyncEngine(callback, this, action);
  e->Queue();
  active = true;
  return info.Env().Undefined();
}


// ----- AsyncEngine

// happens on a worker thread
void AsyncEngine::Execute(void) {
  size_t len = engine->stream.avail_out;
  ret = lzma_code(&engine->stream, action);
  if (ret != LZMA_OK && ret != LZMA_STREAM_END) {
    SetError(lzma_perror(ret));
    return;
  }

  used = len - engine->stream.avail_out;
}

// back in the js thread
void AsyncEngine::OnOK(void) {
  Napi::HandleScope scope(Env());
  bool finished = engine->stream.avail_in == 0 && (ret == LZMA_STREAM_END || action != LZMA_FINISH);
  if (finished) engine->inBufferHandle.Reset();
  engine->outBufferHandle.Reset();
  engine->active = false;
  // 0 is ok here. if it used 0 bytes, it's definitely finished for this block.
  Callback().Call({ Env().Undefined(), Napi::Number::New(Env(), finished ? (double)used : -(double)used) });
}
