# Quick Start Guide

Get up and running with the GitHub API test suite in 3 simple steps!

## 1. Install Dependencies

```bash
cd /Users/mukul/personal/corsair-1/demo/node-backend/test-server
npm install
```

## 2. Configure Your GitHub Token

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your GitHub token
# Get a token from: https://github.com/settings/tokens
```

Edit `.env`:
```env
GITHUB_TOKEN=your_actual_github_token_here
```

## 3. Run Tests

```bash
# Run all tests
npm test

# Or run specific test suites
npm test -- meta.test     # API metadata (no token needed)
npm test -- users.test    # Users API
npm test -- repos.test    # Repositories API
```

## Expected Output

When running tests, you should see:

```
GitHub API Test Configuration:
  Base URL: https://api.github.com
  Token: ***configured***
  Timeout: 30000ms

 PASS  tests/meta.test.ts
  MetaService - GitHub API Meta Information
    ✓ should fetch GitHub API meta information (234ms)
    ✓ should fetch GitHub API root information (187ms)
    ...
```

## What's Included

- ✅ **Complete TypeScript client** - Generated from GitHub's OpenAPI spec
- ✅ **40+ Service classes** - ActionsService, UsersService, ReposService, etc.
- ✅ **1000+ Type definitions** - Full TypeScript type safety
- ✅ **Integration tests** - Real API call examples
- ✅ **Jest configuration** - Ready to run
- ✅ **Helper utilities** - Rate limiting, authentication, etc.

## Next Steps

1. **Explore the tests**: Check out `tests/` directory for examples
2. **Add your own tests**: Follow patterns in existing test files
3. **Read the docs**: See `README.md` for detailed information
4. **Test different APIs**: Try ActionsService, GistsService, etc.

## Need Help?

- See `README.md` for full documentation
- Check GitHub API docs: https://docs.github.com/en/rest
- Verify token permissions if tests fail

Happy testing! 🚀

