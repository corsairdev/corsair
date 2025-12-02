import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as fs from 'fs'
import * as path from 'path'
import {
  users,
  posts,
  categories,
  tags,
  post_categories,
  post_tags,
  comments,
} from './schema'

dotenv.config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool)

interface User {
  email: string
  name: string
  avatar_url?: string
  bio?: string
}

interface Post {
  title: string
  slug: string
  content: string
  excerpt?: string
  cover_image_url?: string
  published: boolean
  author_email: string
  categories: string[]
  tags: string[]
  published_at?: string
}

interface Category {
  name: string
  slug: string
  description?: string
}

interface Tag {
  name: string
  slug: string
}

interface Comment {
  content: string
  post_slug: string
  author_email: string
  parent_id?: string
}

async function seedDatabase() {
  try {
    console.log('Starting database seeding...')

    const usersData: User[] = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8')
    )

    const categoriesData: Category[] = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/categories.json'), 'utf-8')
    )

    const tagsData: Tag[] = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/tags.json'), 'utf-8')
    )

    const postsData: Post[] = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/posts.json'), 'utf-8')
    )

    const commentsData: Comment[] = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/comments.json'), 'utf-8')
    )

    console.log(
      `Found ${usersData.length} users, ${categoriesData.length} categories, ${tagsData.length} tags, ${postsData.length} posts, ${commentsData.length} comments`
    )

    console.log('Seeding users...')
    const userIdMap = new Map<string, string>()
    for (const userData of usersData) {
      const [user] = await db
        .insert(users)
        .values(userData)
        .returning({ id: users.id })
        .onConflictDoNothing()
      if (user) {
        userIdMap.set(userData.email, user.id)
      }
    }

    console.log('Seeding categories...')
    const categoryIdMap = new Map<string, string>()
    for (const categoryData of categoriesData) {
      const [category] = await db
        .insert(categories)
        .values(categoryData)
        .returning({ id: categories.id })
        .onConflictDoNothing()
      if (category) {
        categoryIdMap.set(categoryData.slug, category.id)
      }
    }

    console.log('Seeding tags...')
    const tagIdMap = new Map<string, string>()
    for (const tagData of tagsData) {
      const [tag] = await db
        .insert(tags)
        .values(tagData)
        .returning({ id: tags.id })
        .onConflictDoNothing()
      if (tag) {
        tagIdMap.set(tagData.slug, tag.id)
      }
    }

    console.log('Seeding posts...')
    const postIdMap = new Map<string, string>()
    for (const postData of postsData) {
      const authorId = userIdMap.get(postData.author_email)
      if (!authorId) {
        console.warn(`Author not found for post: ${postData.title}`)
        continue
      }

      const [post] = await db
        .insert(posts)
        .values({
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          excerpt: postData.excerpt,
          cover_image_url: postData.cover_image_url,
          published: postData.published,
          author_id: authorId,
          published_at: postData.published_at
            ? new Date(postData.published_at)
            : null,
        })
        .returning({ id: posts.id })
        .onConflictDoNothing()

      if (post) {
        postIdMap.set(postData.slug, post.id)

        for (const categorySlug of postData.categories) {
          const categoryId = categoryIdMap.get(categorySlug)
          if (categoryId) {
            await db
              .insert(post_categories)
              .values({
                post_id: post.id,
                category_id: categoryId,
              })
              .onConflictDoNothing()
          }
        }

        for (const tagSlug of postData.tags) {
          const tagId = tagIdMap.get(tagSlug)
          if (tagId) {
            await db
              .insert(post_tags)
              .values({
                post_id: post.id,
                tag_id: tagId,
              })
              .onConflictDoNothing()
          }
        }
      }
    }

    console.log('Seeding comments...')
    for (const commentData of commentsData) {
      const postId = postIdMap.get(commentData.post_slug)
      const authorId = userIdMap.get(commentData.author_email)

      if (!postId || !authorId) {
        console.warn(`Post or author not found for comment`)
        continue
      }

      await db
        .insert(comments)
        .values({
          content: commentData.content,
          post_id: postId,
          author_id: authorId,
          parent_id: commentData.parent_id,
        })
        .onConflictDoNothing()
    }

    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seedDatabase()
