type VoteEntityInput = {
	id?: string;
	postID?: string;
	voterID?: string;
	post?: { id?: string };
	voter?: { id?: string };
};

export function buildVoteEntityId(input: VoteEntityInput): string {
	const postID = input.postID ?? input.post?.id;
	const voterID = input.voterID ?? input.voter?.id;

	if (postID && voterID) {
		return `${postID}_${voterID}`;
	}

	if (input.id) {
		return input.id;
	}

	throw new Error('Unable to build vote entity id');
}
