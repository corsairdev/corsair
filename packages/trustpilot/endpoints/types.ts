import { z } from 'zod';

const id = z.string().min(1);
const optionalText = z.string().optional();
const stars = z.array(z.number().int().min(1).max(5)).optional();

const schemas = {
	'businessUnits.find': z.object({ name: z.string().min(1) }).strict(),
	'businessUnits.get': z.object({ businessUnitId: id }).strict(),
	'businessUnits.search': z
		.object({
			query: z.string().min(1),
			country: optionalText,
			page: z.number().int().positive().optional(),
			perpage: z.number().int().positive().optional(),
		})
		.strict(),
	'businessUnits.profileInfo': z.object({ businessUnitId: id }).strict(),
	'businessUnits.webLinks': z
		.object({ businessUnitId: id, locale: z.string().min(1) })
		.strict(),
	'businessUnits.logo': z
		.object({ businessUnitId: id, locationId: optionalText })
		.strict(),
	'businessUnits.promotionBoxImage': z.object({ businessUnitId: id }).strict(),
	'businessUnits.headerImage': z.object({ businessUnitId: id }).strict(),
	'businessUnits.listCategories': z
		.object({ businessUnitId: id, country: optionalText, locale: optionalText })
		.strict(),
	'businessUnits.publicAll': z
		.object({
			country: z.array(z.string()).optional(),
			perPage: z.number().int().positive().optional(),
			cursor: optionalText,
		})
		.strict(),
	'businessUnits.customerGuarantee': z.object({ businessUnitId: id }).strict(),
	'businessUnits.profilePromotion': z.object({ businessUnitId: id }).strict(),
	'businessUnits.publicPromotionBox': z.object({ businessUnitId: id }).strict(),
	'businessUnits.reviews': z
		.object({
			businessUnitId: id,
			page: z.number().int().positive().optional(),
			perPage: z.number().int().positive().optional(),
			stars,
			language: z.array(z.string()).optional(),
			internalLocationId: optionalText,
			orderBy: z
				.array(
					z.enum([
						'createdat.asc',
						'createdat.desc',
						'stars.asc',
						'stars.desc',
					]),
				)
				.optional(),
			tagGroup: optionalText,
			tagValue: optionalText,
			responded: z.boolean().optional(),
			includeReportedReviews: z.boolean().optional(),
		})
		.strict(),
	'businessUnits.allReviews': z
		.object({ businessUnitId: id, pageToken: optionalText })
		.strict(),
	'businessUnits.privateReviews': z
		.object({
			businessUnitId: id,
			stars,
			language: z.array(z.string()).optional(),
			page: z.number().int().positive().optional(),
			internalLocationId: optionalText,
			externalLocationIds: optionalText,
			noLocation: z.boolean().optional(),
			perPage: z.number().int().positive().optional(),
			orderBy: z
				.array(
					z.enum([
						'createdat.asc',
						'createdat.desc',
						'stars.asc',
						'stars.desc',
					]),
				)
				.optional(),
			tagGroup: optionalText,
			tagValue: optionalText,
			ignoreTagValueCase: z.boolean().optional(),
			responded: z.boolean().optional(),
			referenceId: optionalText,
			referralEmail: z.string().email().optional(),
			reported: z.boolean().optional(),
			startDateTime: optionalText,
			endDateTime: optionalText,
			source: optionalText,
			username: optionalText,
			findReviewer: z.enum(['contacted', 'notContacted']).optional(),
		})
		.strict()
		.refine(
			(value) =>
				!(value.noLocation && value.internalLocationId) &&
				!(
					value.externalLocationIds &&
					(value.internalLocationId || value.noLocation)
				),
			{
				message:
					'Location filters cannot be combined as documented by Trustpilot',
			},
		),
	'reviews.get': z.object({ reviewId: id }).strict(),
	'reviews.getPrivate': z.object({ reviewId: id }).strict(),
	'reviews.latest': z
		.object({
			count: z.number().int().positive(),
			language: z.array(z.string()).min(1),
			filterUsersWithoutImages: z.boolean().optional(),
			locale: optionalText,
		})
		.strict(),
	'reviews.getTags': z.object({ reviewId: id }).strict(),
	'reviews.webLinks': z
		.object({ reviewId: id, locale: z.string().min(1) })
		.strict(),
	'reviews.likes': z.object({ reviewId: id }).strict(),
	'consumers.reviews': z
		.object({
			consumerId: id,
			stars,
			language: z.array(z.string()).optional(),
			internalLocationId: optionalText,
			businessUnitId: optionalText,
			page: z.number().int().positive().optional(),
			perPage: z.number().int().positive().optional(),
			orderBy: z
				.array(
					z.enum([
						'createdat.asc',
						'createdat.desc',
						'stars.asc',
						'stars.desc',
					]),
				)
				.optional(),
			includeReportedReviews: z.boolean().optional(),
		})
		.strict(),
	'consumerProfiles.get': z.object({ consumerId: id }).strict(),
	'consumerProfiles.getWithReviews': z.object({ consumerId: id }).strict(),
	'consumerProfiles.webLinks': z
		.object({ consumerId: id, locale: optionalText })
		.strict(),
	'consumerProfiles.bulk': z
		.object({ consumerIds: z.array(id).min(1) })
		.strict(),
	'consumerProfiles.createDisplayName': z
		.object({ displayName: z.string() })
		.strict(),
	'consumerProfiles.validateDisplayName': z
		.object({ displayName: z.string() })
		.strict(),
	'productReviews.summary': z
		.object({
			businessUnitId: id,
			sku: z.array(z.string()).optional(),
			customerProductId: optionalText,
		})
		.strict()
		.refine(
			(value) =>
				Boolean(value.sku?.length) !== Boolean(value.customerProductId),
			{
				message: 'Provide either sku or customerProductId',
			},
		),
	'productReviews.list': z
		.object({
			businessUnitId: id,
			page: z.number().int().positive().optional(),
			perPage: z.number().int().positive().optional(),
			productUrl: z.array(z.string().url()).optional(),
			sku: z.array(z.string()).optional(),
			customerProductId: optionalText,
			language: optionalText,
			stars,
			locale: optionalText,
			attributeIds: z.array(z.string()).optional(),
		})
		.strict()
		.refine(
			(value) =>
				Boolean(value.customerProductId) !==
					Boolean(value.sku?.length || value.productUrl?.length) &&
				(!value.customerProductId || (!value.sku && !value.productUrl)),
			{
				message: 'Provide customerProductId alone or productUrl and/or sku',
			},
		),
	'productReviews.privateList': z
		.object({
			businessUnitId: id,
			page: z.number().int().positive().optional(),
			perPage: z.number().int().positive().optional(),
			sku: z.array(z.string()).optional(),
			customerProductId: optionalText,
			language: optionalText,
			state: z.array(z.string()).optional(),
			locale: optionalText,
		})
		.strict()
		.refine((value) => !(value.sku?.length && value.customerProductId), {
			message: 'sku and customerProductId are mutually exclusive',
		}),
	'productReviews.privateGet': z
		.object({ reviewId: id, locale: optionalText })
		.strict(),
	'productReviews.summaries': z
		.object({
			businessUnitId: id,
			page: z.number().int().positive().optional(),
			perPage: z.number().int().positive().optional(),
		})
		.strict(),
	'productReviews.batchSummaries': z
		.object({ businessUnitId: id, skus: z.array(z.string()).min(1) })
		.strict(),
	'productReviews.invitationLink': z
		.object({
			businessUnitId: id,
			consumer: z
				.object({ email: z.string().email(), name: z.string() })
				.strict(),
			referenceId: optionalText,
			locale: optionalText,
			redirectUri: z.string().url().optional(),
			products: z
				.array(
					z
						.object({
							productUrl: z.string().url(),
							imageUrl: z.string().url().optional(),
							name: z.string(),
							sku: optionalText,
							gtin: optionalText,
							mpn: optionalText,
							brand: optionalText,
						})
						.strict(),
				)
				.optional(),
			productIds: z.array(id).optional(),
		})
		.strict()
		.refine(
			(value) =>
				Boolean(value.products?.length) !== Boolean(value.productIds?.length),
			{ message: 'Provide products or productIds, but not both' },
		),
	'productReviews.createComment': z
		.object({
			conversationId: id,
			content: z.string().min(1),
			integrationId: id,
		})
		.strict(),
	'productReviews.getConversation': z.object({ conversationId: id }).strict(),
	'productReviews.getComment': z
		.object({ conversationId: id, commentId: id })
		.strict(),
	'productReviews.updateComment': z
		.object({
			conversationId: id,
			commentId: id,
			content: z.string().min(1),
			integrationId: id,
		})
		.strict(),
	'productReviews.publicConversation': z
		.object({ conversationId: id })
		.strict(),
	'productReviews.createConversation': z.object({ reviewId: id }).strict(),
	'productReviews.attributeSummaries': z
		.object({
			businessUnitId: id,
			skus: z.array(z.string()).min(1),
			locale: optionalText,
		})
		.strict(),
	'productReviews.importedSummary': z
		.object({ businessUnitId: id, sku: z.array(z.string()).min(1) })
		.strict(),
	'productReviews.importedReviews': z
		.object({
			businessUnitId: id,
			page: z.number().int().positive().optional(),
			perPage: z.number().int().positive().optional(),
			sku: z.array(z.string()).min(1),
			stars,
			language: optionalText,
		})
		.strict(),
	'invitations.templates': z.object({ businessUnitId: id }).strict(),
	'invitations.link': z
		.object({
			businessUnitId: id,
			locationId: optionalText,
			referenceId: optionalText,
			email: z.string().email(),
			name: z.string(),
			locale: z.string().min(1),
			tags: z.array(z.string()).optional(),
			redirectUri: z.string().url().optional(),
		})
		.strict(),
	'dataSolutions.searchBusinessUnits': z
		.object({
			query: z.string().min(1),
			countryCode: optionalText,
			perPage: z.number().int().min(1).max(100).optional(),
			nextToken: optionalText,
		})
		.strict(),
	'dataSolutions.findBusinessUnits': z
		.object({
			domain: optionalText,
			category: optionalText,
			countryCode: optionalText,
			perPage: z.number().int().min(1).max(100).optional(),
			nextToken: optionalText,
		})
		.strict(),
	'dataSolutions.businessUnitDetails': z
		.object({ businessUnitId: id })
		.strict(),
	'dataSolutions.latestReviews': z
		.object({
			businessUnitId: id,
			limit: z.number().int().min(1).max(5).optional(),
		})
		.strict(),
	'dataSolutions.serviceReviews': z
		.object({
			businessUnitId: id,
			startDate: optionalText,
			endDate: optionalText,
			nextToken: optionalText,
		})
		.strict(),
	'dataSolutions.categories': z
		.object({ countryCode: optionalText, parentId: optionalText })
		.strict(),
} as const;

// Output strings are plain z.string(): Trustpilot passes through consumer-typed emails and merchant
// product URLs as given, and a format check here would fail a whole page over one record.
const link = z
	.object({
		href: z.string().nullable(),
		method: z.string().nullable(),
		rel: z.string().nullable(),
	})
	.passthrough();
const consumer = z
	.object({
		id: z.string().nullable().optional(),
		displayName: z.string().nullable().optional(),
		displayLocation: z.string().nullable().optional(),
		numberOfReviews: z.number().nullable().optional(),
		links: z.array(link).optional(),
	})
	.passthrough();
const review = z
	.object({
		id: z.string().nullable().optional(),
		stars: z.number().nullable().optional(),
		title: z.string().nullable().optional(),
		text: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		createdAt: z.string().nullable().optional(),
		updatedAt: z.string().nullable().optional(),
		experiencedAt: z.string().nullable().optional(),
		isVerified: z.boolean().optional(),
		numberOfLikes: z.number().optional(),
		consumer: consumer.optional(),
		companyReply: z
			.object({
				text: z.string().nullable(),
				createdAt: z.string().nullable(),
				updatedAt: z.string().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		links: z.array(link).optional(),
	})
	.passthrough();
const privateReview = review
	.extend({
		referenceId: z.string().nullable().optional(),
		referralEmail: z.string().nullable().optional(),
		reportData: z
			.object({
				source: z.string().nullable().optional(),
				publicComment: z.string().nullable().optional(),
				createdAt: z.string().nullable().optional(),
				reasons: z.array(z.string()).optional(),
				reason: z.string().nullable().optional(),
				reviewVisibility: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		findReviewer: z
			.object({
				isEligible: z.boolean().optional(),
				requests: z
					.array(
						z
							.object({
								id: z.string().nullable().optional(),
								created: z.string().nullable().optional(),
								status: z.string().nullable().optional(),
								businessUserMessage: z.string().nullable().optional(),
								consumerResponse: z
									.object({
										submittedAt: z.string().nullable().optional(),
										name: z.string().nullable().optional(),
										email: z.string().nullable().optional(),
										address: z.string().nullable().optional(),
										phoneNumber: z.string().nullable().optional(),
										referenceId: z.string().nullable().optional(),
										message: z.string().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
const numberOfReviews = z
	.object({
		total: z.number(),
		usedForTrustScoreCalculation: z.number().optional(),
		oneStar: z.number().optional(),
		twoStars: z.number().optional(),
		threeStars: z.number().optional(),
		fourStars: z.number().optional(),
		fiveStars: z.number().optional(),
	})
	.passthrough();
const businessUnit = z
	.object({
		id: z.string().nullable().optional(),
		displayName: z.string().nullable().optional(),
		websiteUrl: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		numberOfReviews: numberOfReviews.nullable().optional(),
		score: z
			.object({
				trustScore: z.number().nullable().optional(),
				stars: z.number().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		links: z.array(link).optional(),
	})
	.passthrough();
const profile = z
	.object({
		id: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		about: z.string().nullable().optional(),
		displayName: z.string().nullable().optional(),
		locale: z.string().nullable().optional(),
		gender: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		createdAt: z.string().nullable().optional(),
		hasImage: z.boolean().optional(),
		birthYear: z.number().nullable().optional(),
	})
	.passthrough();
const reviewList = z
	.object({
		reviews: z.array(review),
		nextPageToken: z.string().nullable().optional(),
		links: z.array(link).optional(),
	})
	.passthrough();
const productReview = z
	.object({
		id: z.string().nullable().optional(),
		createdAt: z.string().nullable().optional(),
		updatedAt: z.string().nullable().optional(),
		stars: z.number().nullable().optional(),
		content: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		consumer: consumer.optional(),
		attributeRatings: z
			.array(
				z
					.object({
						attributeId: z.string(),
						attributeName: z.string(),
						rating: z.number(),
					})
					.passthrough(),
			)
			.optional(),
		links: z.array(link).optional(),
	})
	.passthrough();
const privateProductReview = productReview
	.extend({
		businessUnitId: z.string().nullable().optional(),
		product: z
			.object({
				id: z.string().nullable().optional(),
				productUrl: z.string().nullable().optional(),
				productImages: z
					.array(
						z.object({ type: z.string(), url: z.string() }).passthrough(),
					)
					.optional(),
				name: z.string().nullable().optional(),
				sku: z.string().nullable().optional(),
				gtin: z.string().nullable().optional(),
				mpn: z.string().nullable().optional(),
				brand: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		consumer: z
			.object({
				id: z.string().nullable().optional(),
				email: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		referenceId: z.string().nullable().optional(),
		locale: z.string().nullable().optional(),
		redirectUri: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		hasModerationHistory: z.boolean().optional(),
		conversationId: z.string().nullable().optional(),
		total: z.number().optional(),
	})
	.passthrough();
const productSummary = z
	.object({
		sku: z.string().nullable().optional(),
		starsAverage: z.number().nullable().optional(),
		numberOfReviews: numberOfReviews.optional(),
	})
	.passthrough();

// Response objects preserve provider-added response fields, while the documented contract fields above remain runtime-validated.
const outputSchemas = {
	'businessUnits.find': businessUnit,
	'businessUnits.get': businessUnit,
	'businessUnits.search': z
		.object({
			businessUnits: z.array(businessUnit),
			links: z.array(link).optional(),
		})
		.passthrough(),
	'businessUnits.profileInfo': z
		.object({
			links: z.array(link).optional(),
			isSubscriber: z.boolean().optional(),
			email: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
			companyName: z.string().nullable().optional(),
			isClaimed: z.boolean().optional(),
		})
		.passthrough(),
	'businessUnits.webLinks': z
		.object({
			links: z.array(link).optional(),
			locale: z.string().nullable(),
			profileUrl: z.string().nullable(),
			evaluateUrl: z.string().nullable(),
			evaluateEmbedUrl: z.string().nullable(),
		})
		.passthrough(),
	'businessUnits.logo': z
		.object({ links: z.array(link).optional(), logoUrl: z.string().nullable() })
		.passthrough(),
	'businessUnits.promotionBoxImage': z
		.object({ promotionBoxUrl: z.string().nullable() })
		.passthrough(),
	'businessUnits.headerImage': z
		.object({ headerUrl: z.string().nullable() })
		.passthrough(),
	'businessUnits.listCategories': z
		.object({
			categories: z.array(
				z
					.object({
						categoryId: z.string(),
						displayName: z.string(),
						name: z.string(),
						isPrimary: z.boolean().optional(),
						source: z.string().optional(),
						relevance: z.number().optional(),
					})
					.passthrough(),
			),
			predictedTopCategory: z
				.object({
					categoryId: z.string(),
					displayName: z.string(),
					name: z.string(),
					isPrimary: z.boolean().optional(),
					source: z.string().optional(),
					relevance: z.number().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'businessUnits.publicAll': z
		.object({
			businessUnits: z.array(
				z
					.object({
						id: z.string(),
						displayName: z.string(),
						name: z
							.object({
								identifying: z.string(),
								referring: z.array(z.string()),
							})
							.passthrough(),
						country: z.string().nullable().optional(),
						links: z.array(link).optional(),
					})
					.passthrough(),
			),
			cursor: z.string().nullable(),
			links: z.array(link).optional(),
		})
		.passthrough(),
	'businessUnits.customerGuarantee': z
		.object({
			links: z.array(link).optional(),
			header: z.string(),
			teaser: z.string(),
			body: z.string(),
			display: z.boolean(),
			image: z
				.object({
					image184x0: z
						.object({ url: z.string(), width: z.string() })
						.passthrough(),
				})
				.passthrough(),
		})
		.passthrough(),
	'businessUnits.profilePromotion': z
		.object({
			links: z.array(link).optional(),
			title: z.string(),
			contactInfoTitle: z.string(),
			description: z
				.object({ header: z.string(), text: z.string() })
				.passthrough(),
			sellingPoints: z.array(
				z.object({ header: z.string(), text: z.string() }).passthrough(),
			),
			image: z.object({ url: z.string(), width: z.string() }).passthrough(),
		})
		.passthrough(),
	'businessUnits.publicPromotionBox': z
		.object({
			header: z.string(),
			message: z.string(),
			textColor: z.string(),
			backgroundColor: z.string(),
			buttonText: z.string(),
			buttonColor: z.string(),
			buttonTextColor: z.string(),
			buttonLink: z.string(),
			imageUrl: z.string(),
			isPublished: z.boolean(),
		})
		.passthrough(),
	'businessUnits.reviews': reviewList,
	'businessUnits.allReviews': z
		.object({
			reviews: z.array(review),
			nextPageToken: z.string().nullable().optional(),
		})
		.passthrough(),
	'businessUnits.privateReviews': z
		.object({
			reviews: z.array(privateReview),
			links: z.array(link).optional(),
		})
		.passthrough(),
	'reviews.get': review,
	'reviews.getPrivate': privateReview,
	'reviews.latest': z.object({ reviews: z.array(review) }).passthrough(),
	'reviews.getTags': z
		.object({
			tags: z.array(
				z.object({ group: z.string(), value: z.string() }).passthrough(),
			),
		})
		.passthrough(),
	'reviews.webLinks': z
		.object({
			locale: z.string().nullable(),
			reviewUrl: z.string().nullable(),
			links: link.nullable().optional(),
		})
		.passthrough(),
	'reviews.likes': z
		.object({
			likes: z.array(
				z
					.object({
						consumer: z
							.object({
								id: z.string().nullable(),
								displayName: z.string().nullable(),
							})
							.passthrough(),
					})
					.passthrough(),
			),
		})
		.passthrough(),
	'consumers.reviews': reviewList,
	'consumerProfiles.get': profile,
	'consumerProfiles.getWithReviews': profile
		.extend({
			numberOfReviews: z.number().optional(),
			links: z.array(link).optional(),
		})
		.passthrough(),
	'consumerProfiles.webLinks': z
		.object({
			locale: z.string().nullable().optional(),
			profileUrl: z.string().nullable().optional(),
			links: z.array(link).optional(),
		})
		.passthrough(),
	'consumerProfiles.bulk': z
		.object({
			consumers: z.record(z.string(), profile),
			notFoundConsumerIds: z.array(z.string().nullable()),
		})
		.passthrough(),
	'consumerProfiles.createDisplayName': z.string().nullable(),
	'consumerProfiles.validateDisplayName': z.string().nullable(),
	'productReviews.summary': productSummary,
	'productReviews.list': z
		.object({
			productReviews: z.array(productReview),
			links: z.array(link).optional(),
		})
		.passthrough(),
	'productReviews.privateList': z
		.object({
			productReviews: z.array(privateProductReview),
			total: z.number().optional(),
			links: z.array(link).optional(),
		})
		.passthrough(),
	'productReviews.privateGet': privateProductReview,
	'productReviews.summaries': z
		.object({
			summaries: z.array(productSummary),
			links: z.array(link).optional(),
		})
		.passthrough(),
	'productReviews.batchSummaries': z
		.object({ summaries: z.array(productSummary) })
		.passthrough(),
	'productReviews.invitationLink': z
		.object({ reviewLinkId: z.string(), reviewUrl: z.string() })
		.passthrough(),
	'productReviews.createComment': z
		.object({
			commentId: z.string(),
			createdAt: z.string(),
			author: z.object({ id: z.string(), type: z.string() }).passthrough(),
			content: z.string(),
		})
		.passthrough(),
	'productReviews.getConversation': z
		.object({
			id: z.string(),
			businessUnitId: z.string(),
			consumerId: z.string(),
			source: z.string(),
			sourceId: z.string(),
			state: z.string(),
			comments: z.array(
				z
					.object({
						commentId: z.string(),
						createdAt: z.string(),
						author: z
							.object({ id: z.string(), type: z.string() })
							.passthrough(),
						content: z.string(),
					})
					.passthrough(),
			),
		})
		.passthrough(),
	'productReviews.getComment': z
		.object({
			commentId: z.string(),
			createdAt: z.string(),
			author: z.object({ id: z.string(), type: z.string() }).passthrough(),
			content: z.string(),
		})
		.passthrough(),
	'productReviews.updateComment': z
		.object({
			commentId: z.string(),
			createdAt: z.string(),
			author: z.object({ id: z.string(), type: z.string() }).passthrough(),
			content: z.string(),
		})
		.passthrough(),
	'productReviews.publicConversation': z
		.object({
			id: z.string(),
			businessUnitId: z.string(),
			consumerId: z.string(),
			comments: z.array(
				z
					.object({
						commentId: z.string(),
						createdAt: z.string(),
						author: z
							.object({ id: z.string(), type: z.string() })
							.passthrough(),
						content: z.string(),
					})
					.passthrough(),
			),
		})
		.passthrough(),
	'productReviews.createConversation': z
		.object({ conversationId: z.string() })
		.passthrough(),
	'productReviews.attributeSummaries': z
		.object({
			summaries: z.array(
				z
					.object({
						sku: z.string().nullable(),
						attributes: z.array(
							z
								.object({
									id: z.string(),
									name: z.string(),
									type: z.string(),
									options: z.array(z.string().nullable()).optional(),
									totalOccurrences: z.number(),
									occurrences: z
										.object({
											one: z.number(),
											two: z.number(),
											three: z.number(),
											four: z.number(),
											five: z.number(),
										})
										.passthrough(),
									average: z.number(),
								})
								.passthrough(),
						),
					})
					.passthrough(),
			),
		})
		.passthrough(),
	'productReviews.importedSummary': z
		.object({
			numberOfReviews,
			starsAverage: z.number(),
			links: z.array(link).optional(),
		})
		.passthrough(),
	'productReviews.importedReviews': z
		.object({
			productReviews: z.array(
				z
					.object({
						createdAt: z.string().nullable(),
						stars: z.number(),
						content: z.string().nullable(),
						consumer: z.object({ name: z.string().nullable() }).passthrough(),
						source: z.object({ name: z.string().nullable() }).passthrough(),
						language: z.string().nullable(),
					})
					.passthrough(),
			),
			links: z.array(link).optional(),
		})
		.passthrough(),
	'invitations.templates': z
		.object({
			templates: z.array(
				z
					.object({
						id: z.string(),
						name: z.string(),
						isDefaultTemplate: z.boolean(),
						locale: z.string(),
						language: z.string(),
						type: z.string(),
					})
					.passthrough(),
			),
		})
		.passthrough(),
	'invitations.link': z
		.object({ id: z.string(), url: z.string() })
		.passthrough(),
	'dataSolutions.searchBusinessUnits': z
		.object({
			businessUnits: z.array(
				z
					.object({
						id: z.string(),
						name: z
							.object({
								display: z.string().optional(),
								identifying: z.string().optional(),
								referring: z.array(z.string()).optional(),
							})
							.passthrough(),
						address: z
							.object({ countryCode: z.string().optional() })
							.passthrough()
							.optional(),
						score: z
							.object({
								trustScore: z.number().optional(),
								stars: z.number().optional(),
							})
							.passthrough()
							.optional(),
						numberOfReviews: z.number().optional(),
					})
					.passthrough(),
			),
			nextToken: z.string().nullable().optional(),
		})
		.passthrough(),
	'dataSolutions.findBusinessUnits': z
		.object({
			businessUnits: z.array(
				z
					.object({
						id: z.string(),
						name: z
							.object({
								display: z.string().optional(),
								identifying: z.string().optional(),
							})
							.passthrough(),
						address: z
							.object({ countryCode: z.string().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough(),
			),
			nextToken: z.string().nullable().optional(),
		})
		.passthrough(),
	'dataSolutions.businessUnitDetails': z
		.object({
			id: z.string(),
			name: z
				.object({
					display: z.string().optional(),
					identifying: z.string().optional(),
					referring: z.array(z.string()).optional(),
				})
				.passthrough(),
			score: z
				.object({
					stars: z.number().optional(),
					trustScore: z.number().optional(),
				})
				.passthrough()
				.optional(),
			numberOfReviews: z.union([z.number(), numberOfReviews]).optional(),
		})
		.passthrough(),
	'dataSolutions.latestReviews': z
		.object({ reviews: z.array(review) })
		.passthrough(),
	'dataSolutions.serviceReviews': z
		.object({
			reviews: z.array(review),
			nextToken: z.string().nullable().optional(),
		})
		.passthrough(),
	'dataSolutions.categories': z
		.object({
			totalNumberOfCategories: z.number(),
			categories: z.array(
				z
					.object({
						categoryId: z.string(),
						parentId: z.string().nullable().optional(),
						childrenCategories: z.array(z.string()).optional(),
						numberOfBusinessUnits: z.number().optional(),
					})
					.passthrough(),
			),
		})
		.passthrough(),
} as const;

export type TrustpilotOperation = keyof typeof schemas;
export type TrustpilotEndpointInputs = {
	[K in TrustpilotOperation]: z.infer<(typeof schemas)[K]>;
};
export type TrustpilotEndpointOutputs = {
	[K in TrustpilotOperation]: z.infer<(typeof outputSchemas)[K]>;
};
export const TrustpilotEndpointInputSchemas = schemas;
export const TrustpilotEndpointOutputSchemas = outputSchemas;
