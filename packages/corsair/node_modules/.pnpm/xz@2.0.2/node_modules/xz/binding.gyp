{
  "includes": [ "deps/common-xz.gypi" ],
  "targets": [
    {
      "target_name": "node_xz",
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")",
        "deps/xz.gyp:xz"
      ],
      "sources": [
        "src/c++/node_xz.cpp",
        "src/c++/engine.h",
        "src/c++/engine.cpp"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ],
      "compile_flags": [
        "-fPIC"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "<(SHARED_INTERMEDIATE_DIR)/xz-<@(xz_version)/src/liblzma/api"
      ],
      "libraries": [
        "<(SHARED_INTERMEDIATE_DIR)/xz-<@(xz_version)/src/liblzma/.libs/liblzma.a"
      ]
    }
  ]
}
