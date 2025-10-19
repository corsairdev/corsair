{
  'includes': [ 'common-xz.gypi' ],
  'target_defaults': {
    'cflags': [
      '-std=c99'
    ],
  },

  'targets': [
    {
      'target_name': 'action_before_build',
      'type': 'none',
      'hard_dependency': 1,
      'actions': [
        {
          'action_name': 'unpack_xz_dep',
          'inputs': [
            './xz-<@(xz_version).tar.gz'
          ],
          'outputs': [
            '<(SHARED_INTERMEDIATE_DIR)/xz-<@(xz_version)/configure'
          ],
          'action': [ 'python', './extract.py', './xz-<@(xz_version).tar.gz', '<(SHARED_INTERMEDIATE_DIR)' ]
        }
      ],
    },
    {
      'target_name': 'xz',
      'type': 'none',
      'hard_dependency': 1,
      'dependencies': [
        'action_before_build'
      ],
      'actions': [
        {
          'action_name': 'configure_and_make',
          'inputs': [
            '<(SHARED_INTERMEDIATE_DIR)/xz-<@(xz_version)/configure'
          ],
          'outputs': [
            '<(SHARED_INTERMEDIATE_DIR)/xz-<@(xz_version)/src/liblzma/.libs/liblzma.a'
          ],
          'action': [ 'eval', 'cd <(SHARED_INTERMEDIATE_DIR)/xz-<@(xz_version) && env CFLAGS="-fPIC" ./configure && make' ]
        }
      ],
      'export_dependent_settings': [
        'action_before_build',
      ]
    }
  ]
}
