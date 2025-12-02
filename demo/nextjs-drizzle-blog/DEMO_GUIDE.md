# Blog Web-App Demo Guide

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up database (if needed)
pnpm db:push

# Seed with sample data (optional)
pnpm db:seed

# Start development server
pnpm dev
```

Visit: http://localhost:3000

## Features Demo

### 1. Home Page (`/`)

**What you'll see:**
- Hero section with gradient title
- Grid of blog post cards
- Each card shows:
  - Cover image (if available)
  - Post title and excerpt
  - Author avatar and name
  - Publication date
  - View count
- Hover effects on cards
- Responsive grid (1 column mobile, 2 tablet, 3 desktop)

**Interactions:**
- Click any post card to view full post
- Hover over cards for scale/shadow effects

### 2. Post Detail Page (`/posts/[slug]`)

**What you'll see:**
- Back to Home button
- Large cover image (if available)
- Full post title
- Publication date and view count
- Author profile with avatar and bio
- Full post content (formatted paragraphs)
- Tags section (if post has tags)
- Comments section

**Interactions:**
- Read full article content
- Scroll to comments
- Add new comments
- View existing comments with timestamps

### 3. Comments Section

**Features:**
- Total comment count
- "Add a comment" form with:
  - User selector dropdown (simulates authentication)
  - Multi-line textarea
  - Character input
  - Submit button with loading state
- Comment list showing:
  - Author avatar and name
  - Comment content
  - Timestamp
- Empty state message when no comments

**Interactions:**
- Select a user from the dropdown (simulates being logged in)
- Type comment in textarea
- Click "Post Comment" to submit
- See loading spinner while posting
- Comments refresh automatically after posting

### 4. About Page (`/about`)

**What you'll see:**
- Technology overview cards
- Feature explanations
- Tech stack details
- Architecture information

### 5. Navigation

**Header (all pages):**
- Blog logo with book icon
- Home link
- About link
- Sticky header on scroll

**Footer (home page):**
- Copyright notice
- Tech credits

## UI/UX Highlights

### Loading States
- Page-level loading with spinner
- Skeleton loading for post content
- Button loading states during mutations
- Smooth transitions

### Error Handling
- "Post not found" error page
- "Error loading posts" messages
- Form validation
- Graceful fallbacks

### Responsive Design
- Mobile: Single column layout
- Tablet: 2-column grid
- Desktop: 3-column grid
- Fluid typography
- Touch-friendly buttons

### Visual Polish
- Smooth hover animations
- Card shadows and depth
- Gradient text effects
- Loading spinners
- Rounded corners
- Proper spacing and alignment

## Data Flow Example

### Viewing Posts (Read)

1. User visits home page
2. `PostList` component calls `useCorsairQuery('get all posts')`
3. Corsair fetches data from database
4. Posts render in grid
5. React Query caches the data

### Adding Comment (Write)

1. User types comment and clicks submit
2. `useCorsairMutation('create comment')` called
3. Mutation runs with comment data
4. Database inserts comment
5. Comments list refreshes automatically
6. New comment appears

## Type Safety in Action

Every step is fully typed:

```typescript
// Database Schema (Drizzle)
posts: pgTable('posts', { ... })

// Generated Query (Corsair)
getAllPosts: procedure.query(...)

// Component Props (React)
interface PostCardProps { post: Post }

// Hook Usage (React Query)
const { data: posts } = useCorsairQuery('get all posts', {})
//     ^-- TypeScript knows exact shape!
```

## Performance Features

- **Server-Side Rendering**: Initial HTML sent from server
- **React Query Caching**: Data cached client-side
- **Code Splitting**: Routes load on demand
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Components load as needed

## Customization Ideas

### Easy Modifications

1. **Change Colors**: Edit Tailwind config or CSS variables
2. **Add Post Categories**: Use existing category data
3. **Author Pages**: Create `/authors/[id]` route
4. **Search**: Add search query and UI
5. **Pagination**: Add limit/offset to queries
6. **Like System**: Create new mutation for likes
7. **Edit Posts**: Add update mutation and form
8. **Delete Comments**: Add delete mutation

### New Features to Try

```bash
# Add search query
pnpm corsair query -n "search-posts" -i "search posts by title or content"

# Add like mutation
pnpm corsair mutation -n "like-post" -i "increment like count for a post"

# Add update mutation
pnpm corsair mutation -n "update-post" -i "update post title and content"
```

## Testing the App

### Manual Testing Checklist

- [ ] Home page loads with posts
- [ ] Post cards display correctly
- [ ] Clicking post navigates to detail page
- [ ] Post detail shows full content
- [ ] Comments section displays
- [ ] Can add new comment
- [ ] Comment appears after submission
- [ ] Back button returns to home
- [ ] About page loads
- [ ] Navigation works
- [ ] Responsive on mobile
- [ ] Images load properly
- [ ] Loading states appear
- [ ] Error states display

### Browser Testing

- Chrome ✓
- Firefox ✓
- Safari ✓
- Mobile browsers ✓

## Troubleshooting

### Posts not loading?
- Check database connection in `corsair.config.ts`
- Ensure database is seeded: `pnpm db:seed`
- Check console for errors

### Images not loading?
- Verify image URLs in database
- Check Next.js image configuration
- Ensure domains are allowed in `next.config.ts`

### Comments not posting?
- Check author ID in `comment-section.tsx`
- Verify database connection
- Check browser console for errors

## Next Steps

1. **Deploy**: Deploy to Vercel, Netlify, or your platform
2. **Add Auth**: Integrate authentication system
3. **Admin Panel**: Create admin interface for managing posts
4. **Analytics**: Add view tracking and analytics
5. **RSS Feed**: Generate RSS feed from posts
6. **SEO**: Add metadata and structured data
7. **Newsletter**: Add email subscription

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Corsair Docs](https://docs.corsair.dev)
- [Drizzle Docs](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)

---

**Enjoy your new blog! 🎉**

