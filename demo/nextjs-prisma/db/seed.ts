import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

interface User {
	email: string;
	name: string;
	avatar_url?: string;
	bio?: string;
}

interface Post {
	title: string;
	slug: string;
	content: string;
	excerpt?: string;
	cover_image_url?: string;
	published: boolean;
	author_email: string;
	categories: string[];
	tags: string[];
	published_at?: string;
}

interface Category {
	name: string;
	slug: string;
	description?: string;
}

interface Tag {
	name: string;
	slug: string;
}

interface Comment {
	content: string;
	post_slug: string;
	author_email: string;
	parent_id?: string;
}

async function seedDatabase() {
	try {
		console.log('Starting database seeding...');

		const usersData: User[] = JSON.parse(
			fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8'),
		);

		const categoriesData: Category[] = JSON.parse(
			fs.readFileSync(path.join(__dirname, '../data/categories.json'), 'utf-8'),
		);

		const tagsData: Tag[] = JSON.parse(
			fs.readFileSync(path.join(__dirname, '../data/tags.json'), 'utf-8'),
		);

		const postsData: Post[] = JSON.parse(
			fs.readFileSync(path.join(__dirname, '../data/posts.json'), 'utf-8'),
		);

		const commentsData: Comment[] = JSON.parse(
			fs.readFileSync(path.join(__dirname, '../data/comments.json'), 'utf-8'),
		);

		console.log(
			`Found ${usersData.length} users, ${categoriesData.length} categories, ${tagsData.length} tags, ${postsData.length} posts, ${commentsData.length} comments`,
		);

		console.log('Seeding users...');
		const userIdMap = new Map<string, string>();
		for (const userData of usersData) {
			const user = await prisma.user.upsert({
				where: { email: userData.email },
				update: {},
				create: {
					email: userData.email,
					name: userData.name,
					avatarUrl: userData.avatar_url,
					bio: userData.bio,
				},
			});
			userIdMap.set(userData.email, user.id);
		}

		console.log('Seeding categories...');
		const categoryIdMap = new Map<string, string>();
		for (const categoryData of categoriesData) {
			const category = await prisma.category.upsert({
				where: { slug: categoryData.slug },
				update: {},
				create: {
					name: categoryData.name,
					slug: categoryData.slug,
					description: categoryData.description,
				},
			});
			categoryIdMap.set(categoryData.slug, category.id);
		}

		console.log('Seeding tags...');
		const tagIdMap = new Map<string, string>();
		for (const tagData of tagsData) {
			const tag = await prisma.tag.upsert({
				where: { slug: tagData.slug },
				update: {},
				create: {
					name: tagData.name,
					slug: tagData.slug,
				},
			});
			tagIdMap.set(tagData.slug, tag.id);
		}

		console.log('Seeding posts...');
		const postIdMap = new Map<string, string>();
		for (const postData of postsData) {
			const authorId = userIdMap.get(postData.author_email);
			if (!authorId) {
				console.warn(`Author not found for post: ${postData.title}`);
				continue;
			}

			const post = await prisma.post.upsert({
				where: { slug: postData.slug },
				update: {},
				create: {
					title: postData.title,
					slug: postData.slug,
					content: postData.content,
					excerpt: postData.excerpt,
					coverImageUrl: postData.cover_image_url,
					published: postData.published,
					authorId: authorId,
					publishedAt: postData.published_at
						? new Date(postData.published_at)
						: null,
				},
			});

			postIdMap.set(postData.slug, post.id);

			for (const categorySlug of postData.categories) {
				const categoryId = categoryIdMap.get(categorySlug);
				if (categoryId) {
					await prisma.postCategory
						.upsert({
							where: {
								postId_categoryId: {
									postId: post.id,
									categoryId: categoryId,
								},
							},
							update: {},
							create: {
								postId: post.id,
								categoryId: categoryId,
							},
						})
						.catch(() => {});
				}
			}

			for (const tagSlug of postData.tags) {
				const tagId = tagIdMap.get(tagSlug);
				if (tagId) {
					await prisma.postTag
						.upsert({
							where: {
								postId_tagId: {
									postId: post.id,
									tagId: tagId,
								},
							},
							update: {},
							create: {
								postId: post.id,
								tagId: tagId,
							},
						})
						.catch(() => {});
				}
			}
		}

		console.log('Seeding comments...');
		for (const commentData of commentsData) {
			const postId = postIdMap.get(commentData.post_slug);
			const authorId = userIdMap.get(commentData.author_email);

			if (!postId || !authorId) {
				console.warn(`Post or author not found for comment`);
				continue;
			}

			await prisma.comment
				.create({
					data: {
						content: commentData.content,
						postId: postId,
						authorId: authorId,
						parentId: commentData.parent_id,
					},
				})
				.catch(() => {});
		}

		console.log('Database seeding completed successfully!');
	} catch (error) {
		console.error('Error seeding database:', error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

// seedDatabase();
