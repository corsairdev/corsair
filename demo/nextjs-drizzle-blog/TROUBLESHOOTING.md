# Troubleshooting Guide

## Common Issues and Solutions

### Comments - Foreign Key Constraint Error

**Error Message:**
```
TRPCClientError: insert or update on table "comments" violates foreign key constraint "comments_author_id_users_id_fk"
```

**Cause:**
This error occurs when trying to create a comment with an `authorId` that doesn't exist in the `users` table.

**Solution:**
1. Make sure your database is seeded with users:
   ```bash
   pnpm db:seed
   ```

2. Select a user from the dropdown before posting a comment

3. If you're still having issues, check that users exist in your database:
   ```sql
   SELECT id, email, name FROM users;
   ```

**How It's Fixed in the App:**
The comment form now includes a user selector that fetches all users from the database and lets you choose who to comment as. This ensures only valid user IDs are used.

### Database Connection Issues

**Error Message:**
```
Error: connect ECONNREFUSED
```

**Solution:**
1. Make sure PostgreSQL is running
2. Check your database connection string in `corsair.config.ts`
3. Verify the database exists:
   ```bash
   psql -U postgres -c "SELECT datname FROM pg_database;"
   ```

### Posts Not Loading

**Issue:**
Home page shows "No posts found" or loading state forever

**Solutions:**

1. **Seed the database:**
   ```bash
   pnpm db:seed
   ```

2. **Check database schema:**
   ```bash
   pnpm db:push
   ```

3. **Verify data exists:**
   ```sql
   SELECT COUNT(*) FROM posts WHERE published = true;
   ```

4. **Check browser console** for any errors

### Images Not Displaying

**Issue:**
Post cover images or user avatars not loading

**Solutions:**

1. **Check image URLs in database** - make sure they're valid and accessible

2. **Update Next.js config** if using custom image domains:
   ```typescript
   // next.config.ts
   images: {
     remotePatterns: [
       {
         protocol: "https",
         hostname: "your-domain.com",
       },
     ],
   }
   ```

3. **Use fallback for missing images** - the app already handles this with avatars

### Type Errors After Generating Queries

**Issue:**
TypeScript errors after running `pnpm corsair query` or `pnpm corsair mutation`

**Solutions:**

1. **Restart TypeScript server** in your IDE
   - VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

2. **Regenerate types:**
   ```bash
   pnpm corsair generate
   ```

3. **Check the generated query** in `corsair/queries/` to ensure it looks correct

### Linter Errors

**Issue:**
ESLint errors preventing build

**Solutions:**

1. **Run linter:**
   ```bash
   pnpm run lint
   ```

2. **Common fixes:**
   - Use `&apos;` instead of `'` in JSX text
   - Use Next.js `Image` component instead of `<img>`
   - Remove unused imports

3. **Auto-fix when possible:**
   ```bash
   pnpm run lint --fix
   ```

### Development Server Won't Start

**Error Message:**
```
Error: Port 3000 is already in use
```

**Solutions:**

1. **Kill the process using port 3000:**
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Use a different port:**
   ```bash
   PORT=3001 pnpm dev
   ```

### Corsair CLI Issues

**Issue:**
Corsair commands not working or timing out

**Solutions:**

1. **Check your Corsair config:**
   ```bash
   pnpm config
   ```

2. **Verify database connection** is correct in `corsair.config.ts`

3. **Make sure database is accessible** from your machine

4. **Try regenerating with more specific instructions:**
   ```bash
   pnpm corsair query -n "my-query" -i "very detailed description of what you want"
   ```

### Build Errors

**Issue:**
`pnpm build` fails

**Solutions:**

1. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   pnpm build
   ```

2. **Check for type errors:**
   ```bash
   pnpm tsc --noEmit
   ```

3. **Ensure all environment variables are set** for production

4. **Run linter first:**
   ```bash
   pnpm run lint
   ```

## Getting Help

If you're still experiencing issues:

1. **Check the console** for detailed error messages
2. **Review the logs** in your terminal
3. **Verify your setup** matches the requirements in README.md
4. **Check the GitHub issues** for similar problems
5. **Create a new issue** with:
   - Error message
   - Steps to reproduce
   - Environment details (Node version, OS, etc.)

## Environment Details

To help with debugging, gather this information:

```bash
# Node version
node --version

# pnpm version
pnpm --version

# Database version
psql --version

# Check if database is running
pg_isready

# Check environment variables
echo $DATABASE_URL
```

## Reset Database

If all else fails, you can reset the database:

```bash
# Drop all tables and recreate
pnpm db:push --force

# Reseed with fresh data
pnpm db:seed
```

**⚠️ Warning:** This will delete all existing data!

