import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function testCanny() {
	console.log('Testing Canny plugin...');

	// 1. List boards
	const boardsResponse = await corsair.canny.api.boards.list({});
	console.log('Listed boards:', boardsResponse.boards?.length ?? 0);

	const boardID = boardsResponse.boards?.[0]?.id ?? 'board_placeholder_id';
	const authorID = 'user_placeholder_id';

	// 2. Create a post
	const postResponse = await corsair.canny.api.posts.create({
		authorID,
		boardID,
		title: 'New Feature Request',
		details: 'Please add support for custom themes and dark mode.',
	});
	console.log('Created post ID:', postResponse.id);

	const postID = postResponse.id ?? 'post_placeholder_id';

	// 3. List posts
	const postsResponse = await corsair.canny.api.posts.list({
		boardID,
		limit: 5,
	});
	console.log('Listed posts:', postsResponse.posts?.length ?? 0);

	// 4. Create a comment
	const commentResponse = await corsair.canny.api.comments.create({
		authorID,
		postID,
		value: 'I would also love this feature!',
	});
	console.log('Created comment ID:', commentResponse.id);

	// 5. Create a vote
	const voteResponse = await corsair.canny.api.votes.create({
		postID,
		voterID: authorID,
	});
	console.log('Created vote result:', voteResponse);

	// 6. Change a post's status
	const statusResponse = await corsair.canny.api.posts.changeStatus({
		changerID: authorID,
		postID,
		status: 'in progress',
		commentValue: 'Starting work on this feature now!',
	});
	console.log('Updated post status:', statusResponse.status);
}

const main = async () => {
	await testCanny();
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
