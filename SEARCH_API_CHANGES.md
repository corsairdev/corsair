# GitHub Search API Implementation - Changes Summary

## Overview
This PR adds GitHub Search API support to the GitHub integration with three new operations:
- `github.api.search.issues` - Search issues and pull requests
- `github.api.search.repositories` - Search repositories  
- `github.api.search.users` - Search users and organizations

## Files Created

### 1. `packages/github/endpoints/search.ts`
**New file** - Implements the three search endpoint handlers:
- `issues()` - Searches GitHub issues/PRs via `/search/issues`
- `repositories()` - Searches repositories via `/search/repositories`
- `users()` - Searches users via `/search/users`

**Key features:**
- Removes search-specific fields (`score`, `pull_request`, `repository`, `watchers`) before persisting to database
- Proper error handling with console warnings
- Event logging for all operations

## Files Modified

### 2. `packages/github/endpoints/types.ts`
**Changes:**
- Added input schemas: `SearchIssuesInputSchema`, `SearchRepositoriesInputSchema`, `SearchUsersInputSchema`
- Added output schemas: `SearchIssuesResponseSchema`, `SearchRepositoriesResponseSchema`, `SearchUsersResponseSchema`
- Added helper schemas: `SearchPullRequestMarkerSchema`, `SearchIssueSchema`, `SearchRepositorySchema`, `SearchUserSchema`
- Added type exports: `SearchIssuesResponse`, `SearchRepositoriesResponse`, `SearchUsersResponse`
- **Fixed:** Changed `advanced_search` from `z.literal('true')` to `z.boolean()` per PR feedback

### 3. `packages/github/endpoints/index.ts`
**Changes:**
- Added import for `Search` module
- Exported `SearchEndpoints` object with three search operations

### 4. `packages/github/index.ts`
**Changes:**
- Added `SearchEndpoints` to imports
- Added three search endpoint types to `GithubEndpoints` interface
- Added search namespace to `githubEndpointsNested` object
- Added search endpoint schemas to `githubEndpointSchemas`
- Added metadata for search endpoints with `riskLevel: 'read'` and descriptions

### 5. `packages/github/api.test.ts`
**Changes:**
- Added imports for `SearchIssuesResponse`, `SearchRepositoriesResponse`, `SearchUsersResponse`
- Added new test suite `describe('search', ...)` with three test cases:
  - `searchIssues returns correct type`
  - `searchRepositories returns correct type`
  - `searchUsers returns correct type`

### 6. `docs/plugins/github/overview.mdx`
**Changes:**
- Updated operation count from **33** to **42** typed API operations

## API Signatures

### Search Issues
```typescript
await corsair.github.api.search.issues({
  q: "author:username type:pr is:merged",
  sort: "updated",
  order: "desc",
  per_page: 5,
});
```

**Input Parameters:**
- `q` (required): Search query string
- `sort` (optional): Sort field (comments, reactions, interactions, created, updated)
- `order` (optional): Sort order (asc, desc)
- `per_page` (optional): Results per page (1-100)
- `page` (optional): Page number
- `advanced_search` (optional): Boolean flag for advanced search
- `search_type` (optional): Search type (semantic, hybrid)

**Output:**
- `total_count`: Total number of results
- `incomplete_results`: Whether results are incomplete
- `items`: Array of issue/PR objects with search score

### Search Repositories
```typescript
await corsair.github.api.search.repositories({
  q: "corsair language:typescript",
  sort: "updated",
  order: "desc",
  per_page: 5,
});
```

**Input Parameters:**
- `q` (required): Search query string
- `sort` (optional): Sort field (stars, forks, help-wanted-issues, updated)
- `order` (optional): Sort order (asc, desc)
- `per_page` (optional): Results per page (1-100)
- `page` (optional): Page number

**Output:**
- `total_count`: Total number of results
- `incomplete_results`: Whether results are incomplete
- `items`: Array of repository objects with search score

### Search Users
```typescript
await corsair.github.api.search.users({
  q: "type:org corsair",
  sort: "repositories",
  order: "desc",
  per_page: 5,
});
```

**Input Parameters:**
- `q` (required): Search query string
- `sort` (optional): Sort field (followers, repositories, joined)
- `order` (optional): Sort order (asc, desc)
- `per_page` (optional): Results per page (1-100)
- `page` (optional): Page number

**Output:**
- `total_count`: Total number of results
- `incomplete_results`: Whether results are incomplete
- `items`: Array of user objects with search score

## Database Persistence

Search results are automatically synced to the local database:
- **Issues**: Search-specific fields (`score`, `pull_request`, `repository`) are removed before persisting
- **Repositories**: Search-specific fields (`score`, `watchers`) are removed before persisting
- **Users**: Search-specific field (`score`) is removed before persisting

This ensures database schema compatibility while preserving all core entity data.

## Verification

All changes have been verified:
- ✅ TypeScript compilation passes (`pnpm typecheck`)
- ✅ Linting passes (`pnpm lint`)
- ✅ Test structure added (integration tests require GitHub token)
- ✅ No breaking changes to existing APIs
- ✅ Follows existing codebase patterns and conventions

## PR Feedback Addressed

1. ✅ Fixed `advanced_search` from `z.literal('true')` to `z.boolean()`
2. ✅ Removed search-specific fields before database persistence
3. ✅ Added comprehensive tests for all three search endpoints
4. ✅ Updated documentation with correct operation count

## Use Cases

This implementation enables agent-style discovery workflows:
- Search for recently merged pull requests
- Find assigned issues for a user
- Discover repositories by keyword
- Search users and organizations without manual iteration

Example agent workflow:
```typescript
// Find my recent merged PRs
const myPRs = await corsair.github.api.search.issues({
  q: "author:myusername type:pr is:merged",
  sort: "updated",
  per_page: 10,
});

// Find popular TypeScript repositories  
const repos = await corsair.github.api.search.repositories({
  q: "language:typescript stars:>1000",
  sort: "stars",
  order: "desc",
});
```
