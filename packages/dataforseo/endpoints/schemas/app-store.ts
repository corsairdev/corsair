import { z } from 'zod';
import {
	Bool,
	hasLanguage,
	Location,
	languageMessage,
	Num,
	PriceInfo,
	RatingInfo,
	Strings,
	Tag,
	Text,
} from './shared';

// App Store data is task-based: post a task, then fetch it by id once ready.

const AppResultBase = {
	se_domain: Text,
	location_code: Num,
	language_code: Text,
	check_url: Text,
	datetime: Text,
	se_results_count: Num,
	items_count: Num,
};

const AppItemBase = {
	type: Text,
	rank_group: Num,
	rank_absolute: Num,
	position: Text,
};

const AppListing = {
	app_id: Text,
	title: Text,
	url: Text,
	icon: Text,
	reviews_count: Num,
	rating: RatingInfo,
	price: PriceInfo,
	is_free: Bool,
};

export const AppSearchResult = z.object({
	keyword: Text,
	...AppResultBase,
	items: z.array(z.object({ ...AppItemBase, ...AppListing })).nullish(),
});

const RelatedApps = z
	.array(z.object({ app_id: Text, title: Text, url: Text }))
	.nullish();

export const AppInfoResult = z.object({
	app_id: Text,
	...AppResultBase,
	items: z
		.array(
			z.object({
				...AppItemBase,
				...AppListing,
				subtitle: Text,
				description: Text,
				main_category: Text,
				categories: Strings,
				languages: Strings,
				advisories: Strings,
				developer: Text,
				developer_id: Text,
				developer_url: Text,
				version: Text,
				minimum_os_version: Text,
				size: Text,
				released_date: Text,
				last_update_date: Text,
				update_notes: Text,
				images: Strings,
				similar_apps: RelatedApps,
				more_apps_by_developer: RelatedApps,
			}),
		)
		.nullish(),
});

export const AppReviewsResult = z.object({
	app_id: Text,
	type: Text,
	title: Text,
	rating: RatingInfo,
	reviews_count: Num,
	...AppResultBase,
	items: z
		.array(
			z.object({
				...AppItemBase,
				id: Text,
				version: Text,
				rating: RatingInfo,
				timestamp: Text,
				title: Text,
				review_text: Text,
				user_profile: z
					.object({ profile_name: Text, profile_image_url: Text })
					.nullish(),
			}),
		)
		.nullish(),
});

/** The task_post result is the posted task itself; its `id` fetches the result. */
export const TaskPostResult = z.object({});

// Inputs

const TaskOptions = {
	...Location,
	priority: z.union([z.literal(1), z.literal(2)]).optional(),
	postback_url: z.url().optional(),
	postback_data: z.literal('advanced').optional(),
	pingback_url: z.url().optional(),
	...Tag,
};

const appLocation = (input: {
	location_name?: string;
	location_code?: number;
}) => input.location_name !== undefined || input.location_code !== undefined;

const appLocationMessage = {
	message: 'Provide location_name or location_code',
};

const postbackMessage = {
	message: 'postback_url needs postback_data: "advanced"',
};

const postback = (input: { postback_url?: string; postback_data?: string }) =>
	!input.postback_url || input.postback_data !== undefined;

export const AppSearchTaskInput = z
	.object({
		keyword: z.string().min(1).max(700),
		depth: z.number().int().min(1).max(700).optional(),
		...TaskOptions,
	})
	.refine(appLocation, appLocationMessage)
	.refine(hasLanguage, languageMessage)
	.refine(postback, postbackMessage);

export const AppInfoTaskInput = z
	.object({ app_id: z.string().min(1), ...TaskOptions })
	.refine(appLocation, appLocationMessage)
	.refine(hasLanguage, languageMessage)
	.refine(postback, postbackMessage);

export const AppReviewsTaskInput = z
	.object({
		app_id: z.string().min(1),
		depth: z.number().int().min(1).max(500).optional(),
		sort_by: z.enum(['most_recent', 'most_helpful']).optional(),
		...TaskOptions,
	})
	.refine(appLocation, appLocationMessage)
	.refine(hasLanguage, languageMessage)
	.refine(postback, postbackMessage);

export const TaskIdInput = z.object({ id: z.string().min(1) });
