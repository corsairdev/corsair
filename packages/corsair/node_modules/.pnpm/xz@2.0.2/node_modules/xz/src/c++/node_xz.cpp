#include "engine.h"

Napi::Object init(Napi::Env env, Napi::Object exports) {
  return Engine::Init(env, exports);
}

NODE_API_MODULE(node_xz, init)
