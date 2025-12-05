"use client";

import { ArrowLeft, Calendar, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCorsairQuery } from "@/corsair/client";
import { CommentSection } from "./comment-section";

interface PostDetailProps {
	slug: string;
}

export function PostDetail({ slug }: PostDetailProps) {
	const {
		data: post,
		isLoading,
		error,
	} = useCorsairQuery("get post by slug", { slug });

	if (isLoading) {
		return (
			<div className="max-w-4xl mx-auto">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-muted rounded w-3/4" />
					<div className="h-4 bg-muted rounded w-1/4" />
					<div className="h-64 bg-muted rounded" />
					<div className="space-y-2">
						<div className="h-4 bg-muted rounded" />
						<div className="h-4 bg-muted rounded" />
						<div className="h-4 bg-muted rounded w-5/6" />
					</div>
				</div>
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="max-w-4xl mx-auto">
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-destructive font-semibold">Post not found</p>
						<p className="text-sm text-muted-foreground mt-2 mb-4">
							The post you&apos;re looking for doesn&apos;t exist or has been
							removed.
						</p>
						<Link href="/">
							<Button>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Home
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			<Link href="/">
				<Button variant="ghost" className="mb-6">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Home
				</Button>
			</Link>

			<article className="space-y-8">
				{post.cover_image_url && (
					<div className="w-full h-[400px] overflow-hidden rounded-xl relative">
						<Image
							src={post.cover_image_url}
							alt={post.title}
							fill
							className="object-cover"
						/>
					</div>
				)}

				<div className="space-y-4">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
						{post.title}
					</h1>

					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<span className="flex items-center gap-1">
							<Calendar className="h-4 w-4" />
							{post.published_at
								? new Date(post.published_at).toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
									})
								: "Draft"}
						</span>
						<span className="flex items-center gap-1">
							<Eye className="h-4 w-4" />
							{post.view_count} views
						</span>
					</div>

					<div className="flex items-center gap-3 pt-4">
						<Avatar className="h-12 w-12">
							<AvatarImage src={post.author.avatar_url || undefined} />
							<AvatarFallback>
								{post.author.name?.charAt(0).toUpperCase() ||
									post.author.email.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-semibold">
								{post.author.name || post.author.email}
							</p>
							{post.author.bio && (
								<p className="text-sm text-muted-foreground">
									{post.author.bio}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="border-t border-border pt-8">
					<div className="prose prose-lg dark:prose-invert max-w-none">
						{post.content.split("\n\n").map((paragraph, index) => (
							<p key={index} className="mb-4 text-foreground leading-relaxed">
								{paragraph}
							</p>
						))}
					</div>
				</div>

				{post.tags && post.tags.length > 0 && (
					<div className="flex flex-wrap gap-2 pt-8 border-t border-border">
						{post.tags.map((tag) => (
							<Badge key={tag.id} variant="secondary">
								{tag.name}
							</Badge>
						))}
					</div>
				)}

				<div className="pt-8 border-t border-border">
					<CommentSection postId={post.id} />
				</div>
			</article>
		</div>
	);
}
