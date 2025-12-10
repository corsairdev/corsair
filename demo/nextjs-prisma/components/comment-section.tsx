'use client';

import { Loader2, Send, User } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCorsairMutation, useCorsairQuery } from '@/corsair/client';

interface CommentSectionProps {
	postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
	const [newComment, setNewComment] = useState('');
	const [selectedUserId, setSelectedUserId] = useState<string>('');

	const {
		data: comments,
		isLoading,
		refetch,
	} = useCorsairQuery('get comments by post', { postId });
	const { data: users, isLoading: usersLoading } = useCorsairQuery(
		'get all users',
		{},
	);
	const createComment = useCorsairMutation('create comment');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim() || !selectedUserId) return;

		try {
			await createComment.mutateAsync({
				content: newComment,
				postId: postId,
				authorId: selectedUserId,
			});
			setNewComment('');
			refetch();
		} catch (error) {
			console.error('Failed to create comment:', error);
		}
	};

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold">Comments ({comments?.length || 0})</h2>

			<Card>
				<CardHeader>
					<CardTitle>Add a comment</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-2 flex items-center gap-2">
								<User className="h-4 w-4" />
								Comment as
							</label>
							<Select value={selectedUserId} onValueChange={setSelectedUserId}>
								<SelectTrigger
									className="w-full"
									disabled={usersLoading || createComment.isPending}
								>
									<SelectValue
										placeholder={
											usersLoading ? 'Loading users...' : 'Select a user'
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{users?.map((user) => (
										<SelectItem key={user.id} value={user.id}>
											<div className="flex items-center gap-2">
												<span>{user.name || user.email}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className="text-xs text-muted-foreground mt-1">
								In a real app, this would use your logged-in user
							</p>
						</div>
						<Textarea
							placeholder="Share your thoughts..."
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							rows={4}
							disabled={createComment.isPending || !selectedUserId}
						/>
						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={
									createComment.isPending ||
									!newComment.trim() ||
									!selectedUserId
								}
							>
								{createComment.isPending ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Posting...
									</>
								) : (
									<>
										<Send className="h-4 w-4 mr-2" />
										Post Comment
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{isLoading ? (
				<div className="flex justify-center py-8">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			) : comments && comments.length > 0 ? (
				<div className="space-y-4">
					{comments.map((comment) => (
						<Card key={comment.id}>
							<CardContent className="pt-6">
								<div className="flex gap-4">
									<Avatar className="h-10 w-10">
										<AvatarImage src={comment.author.avatar_url || undefined} />
										<AvatarFallback>
											{comment.author.name?.charAt(0).toUpperCase() ||
												comment.author.email.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 space-y-2">
										<div className="flex items-center gap-2">
											<p className="font-semibold">
												{comment.author.name || comment.author.email}
											</p>
											<span className="text-xs text-muted-foreground">
												{new Date(comment.created_at).toLocaleDateString(
													'en-US',
													{
														month: 'short',
														day: 'numeric',
														year: 'numeric',
													},
												)}
											</span>
										</div>
										<p className="text-foreground">{comment.content}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-muted-foreground">
							No comments yet. Be the first to comment!
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
