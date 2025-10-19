- api/
  data operations
  this is the postgrest connection and it will handle generating the code based on a prompt

- db/
  schema operations
  development only
  it tracks the schema.ts file and makes schema changes accordingly

- client/
  client functions
  useCorsair('...')
  strongly typed queries and mutations will live here
