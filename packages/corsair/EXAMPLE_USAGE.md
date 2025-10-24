# tRPC-Style Type Inference Examples

The updated Corsair core now supports tRPC-style type inference and validation!

## Example 1: With `response_type` (Explicit Validation)

When you provide a `response_type`, the handler's return type must match the schema, and runtime validation is enforced:

```typescript
const query = createQuery<DatabaseContext>();

const getArtist = query({
  prompt: "get artist by id",
  input_type: z.object({ id: z.string() }),
  response_type: z.object({
    id: z.string(),
    name: z.string(),
  }),
  handler: async (input, ctx) => {
    // ✅ TypeScript enforces this return type matches the schema
    const artist = await ctx.db.getArtist(input.id);

    // ❌ TypeScript error if you try to return wrong shape:
    // return { id: artist.id, age: 25 }; // Error: 'age' is not in schema

    return { id: artist.id, name: artist.name };
    // Runtime validation will also check this matches the schema
  }
});
```

## Example 2: Without `response_type` (Type Inference)

When you omit `response_type`, the return type is inferred from the handler:

```typescript
const query = createQuery<DatabaseContext>();

const getArtistWithAlbums = query({
  prompt: "get artist with albums",
  input_type: z.object({ id: z.string() }),
  // No response_type specified!
  handler: async (input, ctx) => {
    const artist = await ctx.db.getArtist(input.id);
    const albums = await ctx.db.getAlbumsByArtist(input.id);

    // ✅ Return type is automatically inferred as:
    // { artist: Artist; albums: Album[]; customField: string }
    return {
      artist,
      albums,
      customField: "whatever you want!",
    };
    // No runtime validation happens
  }
});
```

## Benefits

### With `response_type`:
- **Compile-time type safety**: TypeScript will error if handler doesn't match schema
- **Runtime validation**: Actual data is validated against schema at runtime
- **Explicit contract**: Clear API contract for consumers

### Without `response_type`:
- **Flexibility**: Return any shape you want
- **Type inference**: Still get full TypeScript types
- **No runtime overhead**: No validation cost
- **Prototyping**: Great for rapid development

## How it works

The implementation uses:
1. **Discriminated union types** to distinguish between the two modes
2. **Conditional runtime validation** in the handler wrapper
3. **Type inference utilities** that extract types from either the schema or handler

This gives you the best of both worlds - strict validation when you need it, and flexible inference when you don't!
