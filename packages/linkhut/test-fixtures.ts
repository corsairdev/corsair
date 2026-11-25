/**
 * Response bodies in the shapes the linkhut API documents at
 * https://docs.linkhut.org. No success body has been captured live (every
 * documented route answers 401 without a token), so these follow the docs'
 * examples and the post object's documented field list exactly.
 */

/** The docs' example post, field for field. */
export const post = {
	description: "sourcehut - the hacker's forge",
	extended: 'sourcehut is the place for software collaboration',
	hash: 'f76bae21f8ea04facdb544655745c924',
	href: 'https://sourcehut.org/',
	meta: '8f4f71216f404ce3442bae67564d88cd',
	shared: 'yes',
	tags: 'git oss open-source software collaboration development',
	time: '2020-12-24T16:11:14Z',
	toread: 'no',
};

/** A private unread bookmark: `shared` and `toread` are strings, not booleans. */
export const privatePost = {
	...post,
	description: 'A private note',
	hash: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
	href: 'https://example.com/private',
	meta: null,
	shared: 'no',
	tags: 'diary',
	time: '2021-01-03T08:00:00Z',
	toread: 'yes',
};

export const postsOfOneDay = { posts: [post, privatePost] };

export const updateTime = { update_time: '2020-12-29T21:16:29Z' };

export const dates = { dates: { '2020-12-23': 2, '2020-12-22': 1 } };

export const suggest = [
	{ popular: ['software', 'oss'] },
	{ recommended: ['development', 'git'] },
];

export const tagCounts = { collaboration: 5, development: 4 };

export const done = { result_code: 'done' };

/** The failure the docs show: a body, not an error status. */
export const failure = { result_code: 'something went wrong' };

/** Every route answers this at HTTP 401 when the token is missing or wrong. */
export const unauthenticated = { errors: [{ message: 'Unauthenticated' }] };

/** Unknown paths answer HTTP 200 with the app shell, never a JSON 404. */
export const htmlShell =
	'<!DOCTYPE html><html><head><title>linkhut</title></head><body>bookmarks</body></html>';
