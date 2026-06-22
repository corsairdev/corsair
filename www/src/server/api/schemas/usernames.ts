import { z } from 'zod';

export const githubUsernameSchema = z
	.string()
	.trim()
	.min(1, 'GitHub username is required')
	.max(39, 'GitHub username must be at most 39 characters')
	.regex(
		/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/,
		'Invalid GitHub username',
	)
	.transform((value) => value.toLowerCase());

export const discordUsernameSchema = z
	.string()
	.trim()
	.transform((value) => value.replace(/^@/, '').toLowerCase())
	.pipe(
		z
			.string()
			.min(2, 'Discord username must be at least 2 characters')
			.max(32, 'Discord username must be at most 32 characters')
			.regex(
				/^[a-z0-9._-]+$/,
				'Discord username can only contain letters, numbers, periods, underscores, and dashes',
			)
			.refine((value) => !value.includes('..'), {
				message: 'Discord username cannot contain consecutive periods',
			}),
	);
