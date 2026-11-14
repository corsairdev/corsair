export type StackExchangeScope =
	| 'none'
	| 'user'
	| 'read_inbox'
	| 'write_access'
	| 'private_info';

export type StackExchangeRoute = {
	readonly path: string;
	readonly method: 'GET' | 'POST';
	readonly methods: readonly ('GET' | 'POST')[];
	readonly site: boolean;
	readonly scope: StackExchangeScope;
	readonly riskLevel: 'read' | 'destructive';
	readonly docs: string;
};

const SITE_READ = {
	answers: ['answers', 'none'],
	'answers-by-ids': ['answers/{ids}', 'none'],
	'comments-on-answers': ['answers/{ids}/comments', 'none'],
	'questions-by-answer-ids': ['answers/{ids}/questions', 'none'],
	badges: ['badges', 'none'],
	'badges-by-ids': ['badges/{ids}', 'none'],
	'badges-by-name': ['badges/name', 'none'],
	'badge-recipients': ['badges/recipients', 'none'],
	'badge-recipients-by-ids': ['badges/{ids}/recipients', 'none'],
	'badges-by-tag': ['badges/tags', 'none'],
	collectives: ['collectives', 'none'],
	'collectives-by-slug': ['collectives/{slugs}', 'none'],
	'questions-by-collective': ['collectives/{slugs}/questions', 'none'],
	'answers-by-collective': ['collectives/{slugs}/answers', 'none'],
	'tags-by-collective': ['collectives/{slugs}/tags', 'none'],
	'users-by-collective': ['collectives/{slugs}/users', 'none'],
	comments: ['comments', 'none'],
	'comments-by-ids': ['comments/{ids}', 'none'],
	events: ['events', 'user'],
	info: ['info', 'none'],
	posts: ['posts', 'none'],
	'posts-by-ids': ['posts/{ids}', 'none'],
	'comments-on-posts': ['posts/{ids}/comments', 'none'],
	'revisions-by-ids': ['posts/{ids}/revisions', 'none'],
	'posts-on-suggested-edits': ['posts/{ids}/suggested-edits', 'none'],
	privileges: ['privileges', 'none'],
	questions: ['questions', 'none'],
	'questions-by-ids': ['questions/{ids}', 'none'],
	'answers-on-questions': ['questions/{ids}/answers', 'none'],
	'comments-on-questions': ['questions/{ids}/comments', 'none'],
	'question-close-options': ['questions/{id}/close/options', 'user'],
	'answer-flag-options': ['answers/{id}/flags/options', 'user'],
	'comment-flag-options': ['comments/{id}/flags/options', 'user'],
	'question-flag-options': ['questions/{id}/flags/options', 'user'],
	'linked-questions': ['questions/{ids}/linked', 'none'],
	'related-questions': ['questions/{ids}/related', 'none'],
	'questions-timeline': ['questions/{ids}/timeline', 'none'],
	'featured-questions': ['questions/featured', 'none'],
	'no-answer-questions': ['questions/no-answers', 'none'],
	'unanswered-questions': ['questions/unanswered', 'none'],
	'unanswered-questions-my-tags': ['questions/unanswered/my-tags', 'user'],
	revisions: ['revisions/{ids}', 'none'],
	search: ['search', 'none'],
	'advanced-search': ['search/advanced', 'none'],
	similar: ['similar', 'none'],
	'excerpt-search': ['search/excerpts', 'none'],
	'suggested-edits': ['suggested-edits', 'none'],
	'suggested-edits-by-ids': ['suggested-edits/{ids}', 'none'],
	tags: ['tags', 'none'],
	'tags-by-name': ['tags/{tags}/info', 'none'],
	'moderator-only-tags': ['tags/moderator-only', 'none'],
	'required-tags': ['tags/required', 'none'],
	'tag-synonyms': ['tags/synonyms', 'none'],
	'faqs-by-tags': ['tags/{tags}/faq', 'none'],
	'related-tags': ['tags/{tags}/related', 'none'],
	'synonyms-by-tags': ['tags/{tags}/synonyms', 'none'],
	'top-answerers-on-tags': ['tags/{tag}/top-answerers/{period}', 'none'],
	'top-askers-on-tags': ['tags/{tag}/top-askers/{period}', 'none'],
	'wikis-by-tags': ['tags/{tags}/wikis', 'none'],
	users: ['users', 'none'],
	'users-by-ids': ['users/{ids}', 'none'],
	me: ['me', 'user'],
	'answers-on-users': ['users/{ids}/answers', 'none'],
	'me-answers': ['me/answers', 'user'],
	'badges-on-users': ['users/{ids}/badges', 'none'],
	'me-badges': ['me/badges', 'user'],
	'comments-on-users': ['users/{ids}/comments', 'none'],
	'me-comments': ['me/comments', 'user'],
	'comments-by-users-to-user': ['users/{ids}/comments/{toid}', 'none'],
	'me-comments-to': ['me/comments/{toid}', 'user'],
	'favorites-on-users': ['users/{ids}/favorites', 'none'],
	'me-favorites': ['me/favorites', 'user'],
	'mentions-on-users': ['users/{ids}/mentioned', 'none'],
	'me-mentioned': ['me/mentioned', 'user'],
	'users-network-activity': ['users/{id}/network-activity', 'user'],
	'me-network-activity': ['me/network-activity', 'user'],
	'user-notifications': ['users/{id}/notifications', 'read_inbox'],
	'user-unread-notifications': [
		'users/{id}/notifications/unread',
		'read_inbox',
	],
	'me-notifications': ['me/notifications', 'read_inbox'],
	'me-unread-notifications': ['me/notifications/unread', 'read_inbox'],
	'posts-on-users': ['users/{ids}/posts', 'none'],
	'me-posts': ['me/posts', 'user'],
	'privileges-on-users': ['users/{id}/privileges', 'none'],
	'me-privileges': ['me/privileges', 'user'],
	'questions-on-users': ['users/{ids}/questions', 'none'],
	'me-questions': ['me/questions', 'user'],
	'featured-questions-on-users': ['users/{ids}/questions/featured', 'none'],
	'me-featured-questions': ['me/questions/featured', 'user'],
	'no-answer-questions-on-users': ['users/{ids}/questions/no-answers', 'none'],
	'me-no-answer-questions': ['me/questions/no-answers', 'user'],
	'unaccepted-questions-on-users': ['users/{ids}/questions/unaccepted', 'none'],
	'me-unaccepted-questions': ['me/questions/unaccepted', 'user'],
	'unanswered-questions-on-users': ['users/{ids}/questions/unanswered', 'none'],
	'me-unanswered-questions': ['me/questions/unanswered', 'user'],
	'reputation-on-users': ['users/{ids}/reputation', 'none'],
	'me-reputation': ['me/reputation', 'user'],
	'reputation-history': ['users/{ids}/reputation-history', 'none'],
	'me-reputation-history': ['me/reputation-history', 'user'],
	'full-reputation-history': [
		'users/{id}/reputation-history/full',
		'private_info',
	],
	'me-full-reputation-history': ['me/reputation-history/full', 'private_info'],
	'suggested-edits-on-users': ['users/{ids}/suggested-edits', 'none'],
	'me-suggested-edits': ['me/suggested-edits', 'user'],
	'tags-on-users': ['users/{ids}/tags', 'none'],
	'me-tags': ['me/tags', 'user'],
	'top-user-answers-in-tags': ['users/{id}/tags/{tags}/top-answers', 'none'],
	'me-tags-top-answers': ['me/tags/{tags}/top-answers', 'user'],
	'top-user-questions-in-tags': [
		'users/{id}/tags/{tags}/top-questions',
		'none',
	],
	'me-tags-top-questions': ['me/tags/{tags}/top-questions', 'user'],
	'tag-prefs-on-user': ['users/{id}/tag-preferences', 'user'],
	'me-tag-preferences': ['me/tag-preferences', 'user'],
	'timeline-on-users': ['users/{ids}/timeline', 'none'],
	'me-timeline': ['me/timeline', 'user'],
	'top-answer-tags-on-users': ['users/{id}/top-answer-tags', 'none'],
	'me-top-answer-tags': ['me/top-answer-tags', 'user'],
	'top-question-tags-on-users': ['users/{id}/top-question-tags', 'none'],
	'me-top-question-tags': ['me/top-question-tags', 'user'],
	'top-tags-on-users': ['users/{id}/top-tags', 'none'],
	'me-top-tags': ['me/top-tags', 'user'],
	moderators: ['users/moderators', 'none'],
	'elected-moderators': ['users/moderators/elected', 'none'],
	'user-inbox': ['users/{id}/inbox', 'read_inbox'],
	'user-unread-inbox': ['users/{id}/inbox/unread', 'read_inbox'],
	'me-inbox': ['me/inbox', 'read_inbox'],
	'me-unread-inbox': ['me/inbox/unread', 'read_inbox'],
} as const;

const SITE_WRITE = {
	'accept-answer': ['answers/{id}/accept', 'write_access'],
	'undo-accept-answer': ['answers/{id}/accept/undo', 'write_access'],
	'delete-answer': ['answers/{id}/delete', 'write_access'],
	'downvote-answer': ['answers/{id}/downvote', 'write_access'],
	'undo-downvote-answer': ['answers/{id}/downvote/undo', 'write_access'],
	'edit-answer': ['answers/{id}/edit', 'write_access'],
	'create-answer-flag': ['answers/{id}/flags/add', 'write_access'],
	'upvote-answer': ['answers/{id}/upvote', 'write_access'],
	'undo-upvote-answer': ['answers/{id}/upvote/undo', 'write_access'],
	'recommend-answer': ['answers/{id}/recommend', 'write_access'],
	'undo-recommend-answer': ['answers/{id}/recommend/undo', 'write_access'],
	'create-answer-suggested-edit': [
		'answers/{id}/suggested-edit/add',
		'write_access',
	],
	'delete-comment': ['comments/{id}/delete', 'write_access'],
	'edit-comment': ['comments/{id}/edit', 'write_access'],
	'create-comment-flag': ['comments/{id}/flags/add', 'write_access'],
	'upvote-comment': ['comments/{id}/upvote', 'write_access'],
	'undo-upvote-comment': ['comments/{id}/upvote/undo', 'write_access'],
	'create-comment': ['posts/{id}/comments/add', 'write_access'],
	'render-comment': ['posts/{id}/comments/render', 'write_access'],
	'create-answer': ['questions/{id}/answers/add', 'write_access'],
	'render-answer': ['questions/{id}/answers/render', 'write_access'],
	'delete-question': ['questions/{id}/delete', 'write_access'],
	'downvote-question': ['questions/{id}/downvote', 'write_access'],
	'undo-downvote-question': ['questions/{id}/downvote/undo', 'write_access'],
	'edit-question': ['questions/{id}/edit', 'write_access'],
	'favorite-question': ['questions/{id}/favorite', 'write_access'],
	'undo-favorite-question': ['questions/{id}/favorite/undo', 'write_access'],
	'create-question-flag': ['questions/{id}/flags/add', 'write_access'],
	'create-question-suggested-edit': [
		'questions/{id}/suggested-edit/add',
		'write_access',
	],
	'upvote-question': ['questions/{id}/upvote', 'write_access'],
	'undo-upvote-question': ['questions/{id}/upvote/undo', 'write_access'],
	'create-question': ['questions/add', 'write_access'],
	'render-question': ['questions/render', 'write_access'],
	'edit-tag-prefs-on-user': ['users/{id}/tag-preferences/edit', 'write_access'],
	'edit-me-tag-preferences': ['me/tag-preferences/edit', 'write_access'],
} as const;

const NETWORK_READ = {
	'achievements-on-user': ['users/{id}/achievements', 'user'],
	errors: ['errors', 'none'],
	'simulate-error': ['errors/{id}', 'none'],
	'read-filter': ['filters/{filters}', 'none'],
	inbox: ['inbox', 'read_inbox'],
	'inbox-unread': ['inbox/unread', 'read_inbox'],
	notifications: ['notifications', 'read_inbox'],
	'unread-notifications': ['notifications/unread', 'read_inbox'],
	sites: ['sites', 'none'],
	'associated-users': ['users/{ids}/associated', 'none'],
	'merge-history': ['users/{ids}/merges', 'none'],
	'me-achievements': ['me/achievements', 'user'],
	'me-associated-users': ['me/associated', 'user'],
	'me-merge-history': ['me/merges', 'user'],
	'create-filter': ['filters/create', 'none'],
} as const;

type RouteTuple = readonly [path: string, scope: StackExchangeScope];

function makeRouteList<const T extends Record<string, RouteTuple>>(
	entries: T,
	site: boolean,
	method: 'GET' | 'POST',
) {
	return Object.entries(entries).map(([id, [path, scope]]) => {
		const riskLevel: StackExchangeRoute['riskLevel'] =
			method === 'POST' ? 'destructive' : 'read';
		const methods: readonly ('GET' | 'POST')[] =
			id === 'create-filter' ? ['GET', 'POST'] : [method];
		return {
			id,
			path,
			method,
			methods,
			site,
			scope,
			riskLevel,
			docs: `https://api.stackexchange.com/docs/${id}`,
		};
	});
}

export const SITE_READ_ROUTES = makeRouteList(SITE_READ, true, 'GET');
export const SITE_WRITE_ROUTES = makeRouteList(SITE_WRITE, true, 'POST');
export const NETWORK_READ_ROUTES = makeRouteList(NETWORK_READ, false, 'GET');

export const ROUTE_GROUPS = {
	siteRead: SITE_READ_ROUTES,
	siteWrite: SITE_WRITE_ROUTES,
	networkRead: NETWORK_READ_ROUTES,
} as const;

export type RouteGroup = keyof typeof ROUTE_GROUPS;

export function getRoute(
	group: RouteGroup,
	id: string,
): StackExchangeRoute & { id: string } {
	const route = ROUTE_GROUPS[group].find((candidate) => candidate.id === id);
	if (!route) throw new Error(`Unknown Stack Exchange ${group} route`);
	return route;
}

export function routeIds(group: RouteGroup): string[] {
	return ROUTE_GROUPS[group].map((route) => route.id);
}
