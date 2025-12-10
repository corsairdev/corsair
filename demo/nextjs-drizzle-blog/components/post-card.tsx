'use client';

import { Calendar, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface PostCardProps {
	post: {
		id: string;
		title: string;
		slug: string;
		excerpt: string | null;
		cover_image_url: string | null;
		view_count: number;
		published_at: Date | null;
		author: {
			id: string;
			name: string;
			email: string;
			avatar_url: string | null;
		};
	};
}

export function PostCard({ post }: PostCardProps) {
	return (
		<Link href={`/posts/${post.slug}`}>
			<Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
				{post.cover_image_url && (
					<div className="w-full h-48 overflow-hidden rounded-t-xl relative">
						<Image
							src={post.cover_image_url}
							alt={post.title}
							fill
							className="object-cover"
						/>
					</div>
				)}
				<CardHeader>
					<h2 className="text-2xl font-bold line-clamp-2">{post.title}</h2>
					{post.excerpt && (
						<p className="text-muted-foreground line-clamp-3 mt-2">
							{post.excerpt}
						</p>
					)}
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10">
							<AvatarImage src={post.author.avatar_url || undefined} />
							<AvatarFallback>
								{post.author.name?.charAt(0).toUpperCase() ||
									post.author.email.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<p className="font-medium truncate">
								{post.author.name || post.author.email}
							</p>
							<div className="flex items-center gap-3 text-xs text-muted-foreground">
								<span className="flex items-center gap-1">
									<Calendar className="h-3 w-3" />
									{post.published_at
										? new Date(post.published_at).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												year: 'numeric',
											})
										: 'Draft'}
								</span>
								<span className="flex items-center gap-1">
									<Eye className="h-3 w-3" />
									{post.view_count}
								</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
