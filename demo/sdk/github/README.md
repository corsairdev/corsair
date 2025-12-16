# GitHub API Test Server

Integration test suite for the GitHub API TypeScript client generated from OpenAPI specifications.

## Overview

This project contains integration tests that make real API calls to GitHub's REST API. The tests verify that the generated TypeScript client correctly interacts with the GitHub API endpoints.

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **GitHub Personal Access Token**: Required for authenticated API requests

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure it with your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your GitHub personal access token:

```env
GITHUB_TOKEN=your_github_token_here
```

#### How to Get a GitHub Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "API Test Token")
4. Select scopes based on what you want to test:
   - For read-only public data: No scopes needed
   - For accessing your private data: Select `repo`, `user`, etc.
5. Click "Generate token"
6. Copy the token and paste it in your `.env` file

**Important**: Keep your token secure and never commit it to version control!

### 3. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with verbose output
npm run test:verbose
```

## Project Structure

```
test-server/
├── core/              # API client core functionality
│   ├── ApiError.ts
│   ├── CancelablePromise.ts
│   ├── OpenAPI.ts
│   └── request.ts
├── models/            # TypeScript type definitions (1000+ files)
├── services/          # Service classes for API endpoints
│   ├── ActionsService.ts
│   ├── UsersService.ts
│   ├── ReposService.ts
│   └── ... (40+ services)
├── tests/             # Test files
│   ├── setup.ts       # Test configuration and utilities
│   ├── meta.test.ts   # Tests for Meta/API info endpoints
│   ├── users.test.ts  # Tests for Users API
│   └── repos.test.ts  # Tests for Repositories API
├── .env.example       # Example environment variables
├── .gitignore         # Git ignore rules
├── jest.config.js     # Jest configuration
├── package.json       # Project dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── README.md          # This file
```

## Test Suites

### MetaService Tests (`tests/meta.test.ts`)

Tests GitHub API metadata endpoints that don't require authentication:

- **API Meta Information**: Get GitHub API configuration and limits
- **API Root**: Get available API endpoint URLs
- **Octocat**: Get ASCII art of GitHub's mascot
- **Zen**: Get random GitHub zen quotes

**Run specific suite:**
```bash
npm test -- meta.test
```

### UsersService Tests (`tests/users.test.ts`)

Tests GitHub Users API endpoints:

- **Get Authenticated User**: Fetch current user's profile (requires token)
- **Get User by Username**: Fetch any public user's profile
- **List Users**: Paginate through GitHub users
- **Error Handling**: Test handling of non-existent users

**Run specific suite:**
```bash
npm test -- users.test
```

### ReposService Tests (`tests/repos.test.ts`)

Tests GitHub Repositories API endpoints:

- **Get Repository**: Fetch public repository details
- **List User Repositories**: Get repositories for a user
- **List Authenticated User Repos**: Get your repositories (requires token)
- **List Commits**: Fetch commit history
- **List Branches**: Get repository branches

**Run specific suite:**
```bash
npm test -- repos.test
```

## Writing New Tests

### 1. Create a New Test File

Create a new file in the `tests/` directory:

```typescript
// tests/gists.test.ts
import { GistsService } from '../services/GistsService';
import { requireToken, handleRateLimit } from './setup';

describe('GistsService - GitHub Gists API', () => {
  describe('list', () => {
    it('should list public gists', async () => {
      try {
        const gists = await GistsService.gistsList({
          perPage: 5,
        });
        
        expect(Array.isArray(gists)).toBe(true);
        expect(gists.length).toBeGreaterThan(0);
        
        console.log('Fetched gists:', gists.length);
      } catch (error) {
        await handleRateLimit(error);
      }
    });
  });
});
```

### 2. Use Helper Functions

The test setup provides several helper functions:

- **`requireToken()`**: Skip tests that require authentication if no token is set
- **`handleRateLimit(error)`**: Handle rate limit errors gracefully
- **`getTestUsername()`**: Get test username from environment
- **`getTestRepo()`**: Get test repository name from environment
- **`isTokenConfigured()`**: Check if GitHub token is configured

### 3. Test Structure Best Practices

- Use descriptive test names
- Group related tests with `describe()` blocks
- Log useful information with `console.log()` for debugging
- Always handle rate limit errors
- Test both success and error cases
- Verify response structure and data types

## Configuration

### Environment Variables

All environment variables are optional except for `GITHUB_TOKEN` (required for authenticated requests):

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_TOKEN` | Personal access token for authentication | - |
| `GITHUB_BASE_URL` | GitHub API base URL | `https://api.github.com` |
| `TEST_TIMEOUT` | Test timeout in milliseconds | `30000` |
| `TEST_GITHUB_USERNAME` | Username for test cases | `octocat` |
| `TEST_GITHUB_REPO` | Repository name for test cases | `Hello-World` |

### Jest Configuration

The Jest configuration in `jest.config.js` includes:

- **TypeScript support**: Using `ts-jest` preset
- **Test timeout**: 30 seconds (configurable via environment)
- **Test pattern**: `**/*.test.ts` files in `tests/` directory
- **Setup file**: Runs `tests/setup.ts` before all tests
- **Coverage**: Configured to cover `services/` and `core/` directories

### TypeScript Configuration

The TypeScript configuration in `tsconfig.json` includes:

- **Target**: ES2020 for modern Node.js
- **Strict mode**: Enabled for type safety
- **Module system**: CommonJS for Node.js compatibility
- **Source maps**: Enabled for debugging

## API Rate Limits

GitHub API has rate limits that you should be aware of:

- **Unauthenticated requests**: 60 requests per hour
- **Authenticated requests**: 5,000 requests per hour
- **Search API**: 30 requests per minute

If you hit rate limits:

1. Tests will log the rate limit error
2. Wait for the rate limit to reset (time shown in error)
3. Use authenticated requests (set `GITHUB_TOKEN`) for higher limits
4. Run specific test suites instead of all tests

Check rate limit status:

```bash
# Using curl with your token
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/rate_limit
```

## Troubleshooting

### Tests Fail with "GITHUB_TOKEN not configured"

Some tests require authentication. Make sure you:

1. Created a `.env` file (copy from `.env.example`)
2. Added your GitHub personal access token
3. Token has appropriate scopes for the endpoints you're testing

### Tests Timeout

If tests timeout frequently:

1. Check your internet connection
2. Increase timeout in `.env`: `TEST_TIMEOUT=60000`
3. Check GitHub API status: https://www.githubstatus.com/

### Rate Limit Errors

If you see rate limit errors:

1. Make sure `GITHUB_TOKEN` is set (authenticated requests have higher limits)
2. Wait for rate limit to reset (time shown in error message)
3. Run fewer tests at once: `npm test -- repos.test`

### TypeScript Errors

If you see TypeScript compilation errors:

1. Check that dependencies are installed: `npm install`
2. Verify TypeScript version: `npm list typescript`
3. Run type check: `npm run type-check`

## Generated Code

The API client code in `core/`, `models/`, and `services/` directories is generated from GitHub's OpenAPI specification using `openapi-typescript-codegen`. 

**Do not manually edit these files** - they will be overwritten if the code is regenerated.

If you need to modify the client behavior:

1. Edit the generator configuration
2. Regenerate the code
3. Copy to this test project

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Add descriptive test names
3. Include console logging for debugging
4. Test both success and error cases
5. Handle rate limits properly
6. Update this README if adding new test suites

## Resources

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [GitHub API Rate Limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)

## License

MIT

