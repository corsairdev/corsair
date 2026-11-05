import { z } from 'zod';

// Response schemas follow the cloro OpenAPI description:
// https://cloro.dev/docs/api-reference/openapi.json
// z.unknown() appears only where that description leaves a field untyped: raw
// provider event streams, free-form maps, and product variants.

const TitleUrlSchema = z.object({
	title: z.string().optional(),
	url: z.string().optional(),
});

const ProductLookupKeySchema = z.object({
	data: z.string().optional(),
});

const ProductLookupDataSchema = z.object({
	request_query: z.string().optional(),
	all_ids: z.record(z.string(), z.unknown()).optional(),
	metadata_sources: z.array(z.string()).optional(),
});

const AnalyticsMetaSchema = z.object({
	product_event_uuid: z.string().optional(),
});

const SourceSchema = z.object({
	position: z.number().optional(),
	url: z.string().optional(),
	label: z.string().optional(),
	description: z.string().optional(),
});

const CitationPillSchema = z.object({
	label: z.string(),
	citationPillId: z.number(),
	url: z.string(),
	domain: z.string(),
	description: z.string().optional(),
	position: z.number(),
});

const PriceSchema = z.object({
	value: z.number().optional(),
	currency: z.string().optional(),
	raw: z.string().optional(),
});

const MoneySchema = z.object({
	amount: z.number().optional(),
	currency: z.string().optional(),
	currencySymbol: z.string().optional(),
});

const GoogleSourceSchema = z.object({
	position: z.number().optional(),
	url: z.string().optional(),
	label: z.string().optional(),
	description: z.string().optional(),
	redirectLink: z.string().optional(),
});

const NamedLinkSchema = z.object({
	name: z.string().optional(),
	link: z.string().optional(),
	redirectLink: z.string().optional(),
});

const PlatformLinkSchema = z.object({
	platform: z.string().optional(),
	link: z.string().optional(),
	redirectLink: z.string().optional(),
});

const PriceDetailsSchema = z.object({
	display_price: z.string().nullable().optional(),
	base: z.string().optional(),
	shipping: z.string().nullable().optional(),
	tax: z.string().nullable().optional(),
	total: z.string().optional(),
});

const OfferTagSchema = z.object({
	text: z.string().optional(),
	tooltip: z.string().optional(),
});

const ShoppingOfferSchema = z.object({
	merchant_name: z.string().optional(),
	merchant_subtitle: z.string().nullable().optional(),
	marketplace_seller: z.string().nullable().optional(),
	seller_name: z.string().optional(),
	brand: z.string().nullable().optional(),
	product_name: z.string().optional(),
	url: z.string().optional(),
	price: z.string().optional(),
	details: z.string().optional(),
	original_price: z.string().nullable().optional(),
	available: z.boolean().optional(),
	checkoutable: z.boolean().optional(),
	is_digital: z.boolean().nullable().optional(),
	checkout_payload: z.string().nullable().optional(),
	checkout_image_urls: z.array(z.string()).nullable().optional(),
	shop_id: z.string().nullable().optional(),
	provider: z.string().optional(),
	price_details: PriceDetailsSchema.optional(),
	tag: OfferTagSchema.nullable().optional(),
});

const RatingGroupedCitationSchema = z.object({
	title: z.string().optional(),
	url: z.string().optional(),
	supporting_websites: z.array(TitleUrlSchema).optional(),
});

const ShowcaseImageSchema = z.object({
	url: z.string(),
	width: z.number().optional(),
	height: z.number().optional(),
});

const ShowcaseBackgroundSchema = z.object({
	type: z.string().optional(),
	primary: z.string().optional(),
	secondary: z.string().optional(),
});

const ShowcaseMetadataSchema = z.object({
	image: ShowcaseImageSchema.optional(),
	background: ShowcaseBackgroundSchema.optional(),
	slots: z.record(z.string(), z.unknown()).optional(),
	debug: z.record(z.string(), z.unknown()).optional(),
});

const ShoppingProductSchema = z.object({
	title: z.string().optional(),
	position: z.number().optional(),
	url: z.string().optional(),
	description: z.string().optional(),
	price: z.string().optional(),
	featured_tag: z.string().optional(),
	rating: z.number().optional(),
	num_reviews: z.number().optional(),
	image_urls: z.array(z.string()).optional(),
	id: z.string().optional(),
	variants: z.unknown().optional(),
	offers: z.array(ShoppingOfferSchema).optional(),
	rating_grouped_citation: RatingGroupedCitationSchema.optional(),
	provider: z.string().optional(),
	providers: z.array(z.string()).optional(),
	product_lookup_key: ProductLookupKeySchema.optional(),
	product_lookup_data: ProductLookupDataSchema.optional(),
	showcase_metadata: ShowcaseMetadataSchema.optional(),
	show_price_disclosure: z.boolean().optional(),
	analytics_meta: AnalyticsMetaSchema.optional(),
	metadata_sources: z.array(z.string()).optional(),
	product_event_uuid: z.string().optional(),
	generatedProductQuery: z.string().optional(),
});

const InlineProductSchema = z.object({
	product: ShoppingProductSchema.optional(),
	render_as: z.enum(['inline', 'hero', 'block']).optional(),
});

const ChatgptAnswerSchema = z.object({
	text: z.string().optional(),
	sources: z
		.array(
			z.object({
				position: z.number().optional(),
				url: z.string().optional(),
				label: z.string().optional(),
				description: z.string().optional(),
				footnote: z.boolean().optional(),
				datePublished: z.string().optional(),
			}),
		)
		.optional(),
	html: z.string().optional(),
	markdown: z.string().optional(),
	rawResponse: z
		.array(
			z.object({
				type: z.string().optional(),
				token: z.string().optional(),
				conversation_id: z.string().optional(),
				message: z
					.object({
						id: z.string().optional(),
						role: z.string().optional(),
						model: z.string().optional(),
					})
					.optional(),
				delta: z
					.object({
						content: z
							.array(
								z.object({
									type: z.string().optional(),
									text_delta: z.string().optional(),
								}),
							)
							.optional(),
					})
					.optional(),
				reason: z.string().optional(),
			}),
		)
		.optional(),
	searchQueries: z.array(z.string()).optional(),
	mapSearchQueries: z.array(z.string()).optional(),
	model: z.string().nullable().optional(),
	shoppingCards: z
		.array(
			z.object({
				tags: z.array(z.string()).optional(),
				products: z
					.array(
						z.object({
							title: z.string().optional(),
							position: z.number().optional(),
							url: z.string().optional(),
							price: z.string().optional(),
							featured_tag: z.string().optional(),
							merchant: z.string().optional(),
							image_urls: z.array(z.string()).optional(),
							rating: z.number().optional(),
							num_reviews: z.number().optional(),
							id: z.string().optional(),
							offers: z
								.array(
									z.object({
										merchant_name: z.string().optional(),
										marketplace_seller: z.string().nullable().optional(),
										seller_name: z.string().optional(),
										brand: z.string().nullable().optional(),
										product_name: z.string().optional(),
										url: z.string().optional(),
										price: z.string().optional(),
										details: z.string().optional(),
										available: z.boolean().optional(),
										checkoutable: z.boolean().optional(),
										price_details: z
											.object({
												base: z.string().optional(),
												total: z.string().optional(),
											})
											.optional(),
										tag: z
											.object({
												text: z.string().optional(),
											})
											.optional(),
									}),
								)
								.optional(),
							rating_grouped_citation: z
								.object({
									title: z.string().optional(),
									url: z.string().optional(),
									supporting_websites: z.array(TitleUrlSchema).optional(),
								})
								.optional(),
						}),
					)
					.optional(),
			}),
		)
		.optional(),
	inlineProducts: z.array(InlineProductSchema).optional(),
	entities: z
		.array(
			z.object({
				type: z.string(),
				name: z.string(),
				product: z
					.object({
						title: z.string().optional(),
						position: z.number().optional(),
						url: z.string().optional(),
						description: z.string().optional(),
						price: z.string().optional(),
						featured_tag: z.string().optional(),
						rating: z.number().optional(),
						num_reviews: z.number().optional(),
						image_urls: z.array(z.string()).optional(),
						id: z.string().optional(),
						variants: z.unknown().optional(),
						offers: z.array(ShoppingOfferSchema).optional(),
						rating_grouped_citation: RatingGroupedCitationSchema.optional(),
						provider: z.string().optional(),
						providers: z.array(z.string()).optional(),
						product_lookup_key: ProductLookupKeySchema.optional(),
						product_lookup_data: ProductLookupDataSchema.optional(),
						showcase_metadata: ShowcaseMetadataSchema.optional(),
						show_price_disclosure: z.boolean().optional(),
						analytics_meta: AnalyticsMetaSchema.optional(),
						metadata_sources: z.array(z.string()).optional(),
						product_event_uuid: z.string().optional(),
						generatedProductQuery: z.string().optional(),
					})
					.optional(),
			}),
		)
		.optional(),
	map: z
		.array(
			z.object({
				id: z.string().optional(),
				provider: z.string().optional(),
				name: z.string().optional(),
				position: z.number().optional(),
				address: z.string().optional(),
				latitude: z.number().optional(),
				longitude: z.number().optional(),
				categories: z.array(z.string()).optional(),
				rating: z.number().optional(),
				reviewCount: z.number().optional(),
				description: z.string().optional(),
				phone: z.string().optional(),
				websiteUrl: z.string().optional(),
			}),
		)
		.optional(),
	citationPills: z
		.array(
			z.object({
				url: z.string(),
				label: z.string(),
				description: z.string().optional(),
				domain: z.string(),
				datePublished: z.string().optional(),
				citationPillId: z.number(),
				type: z.enum(['searchResult', 'groupedWebpage']),
				position: z.number(),
			}),
		)
		.optional(),
	ads: z
		.array(
			z.object({
				brand: z.object({
					name: z.string(),
					url: z.string(),
					favicon: z.string().optional(),
				}),
				cards: z.array(
					z.object({
						title: z.string(),
						body: z.string(),
						url: z.string(),
						image: z.string().optional(),
					}),
				),
				visibility: z.string(),
				adsResponseIndex: z.number(),
				rendered: z.boolean(),
			}),
		)
		.optional(),
	followUpForm: z
		.object({
			questions: z.array(
				z.object({
					label: z.string(),
					type: z.enum([
						'radio',
						'checkbox',
						'select',
						'text',
						'textarea',
						'date',
					]),
					name: z.string().optional(),
					placeholder: z.string().optional(),
					options: z.array(
						z.object({
							label: z.string(),
							value: z.union([z.string(), z.boolean()]),
							selected: z.boolean(),
						}),
					),
				}),
			),
			submitLabel: z.string().optional(),
			followUpPrompt: z.string().optional(),
		})
		.nullable()
		.optional(),
});

const MediaItemSchema = z.object({
	title: z.string().optional(),
	url: z.string().optional(),
	thumbnail: z.string().optional(),
	medium: z.string().optional(),
	source: z.string().optional(),
	image_width: z.number().optional(),
	image_height: z.number().optional(),
	thumbnail_width: z.number().optional(),
	thumbnail_height: z.number().optional(),
});

const HotelItemSchema = z.object({
	name: z.string().optional(),
	url: z.string().optional(),
	rating: z.number().optional(),
	num_reviews: z.number().optional(),
	address: z.array(z.string()).optional(),
	phone: z.string().optional(),
	description: z.string().optional(),
	image_url: z.string().optional(),
	images: z.array(z.string()).optional(),
	lat: z.number().optional(),
	lng: z.number().optional(),
	price_level: z.string().optional(),
	categories: z.array(z.string()).optional(),
});

const PlaceItemSchema = z.object({
	name: z.string().optional(),
	url: z.string().optional(),
	rating: z.number().optional(),
	address: z.array(z.string()).optional(),
	lat: z.number().optional(),
	lng: z.number().optional(),
	categories: z.array(z.string()).optional(),
	map_url: z.string().optional(),
	images: z.array(z.string()).optional(),
});

const GooglePlaceSchema = z.object({
	title: z.string(),
	index: z.number(),
	thumbnail: z.string().optional(),
	rating: z.number().optional(),
	reviews: z.number().optional(),
	type: z.string().optional(),
	address: z.string().optional(),
	status: z.string().optional(),
	placeId: z.string().optional(),
	phone: z.string().optional(),
	website: z.string().optional(),
	link: z.string().optional(),
	priceLevel: z.string().optional(),
});

const GoogleMapPlaceSchema = z.object({
	title: z.string(),
	index: z.number(),
	thumbnail: z.string().optional(),
	rating: z.number().optional(),
	reviews: z.number().optional(),
	type: z.string().optional(),
	address: z.string().optional(),
	status: z.string().optional(),
	placeId: z.string(),
	phone: z.string().optional(),
	website: z.string().optional(),
	link: z.string(),
	gpsCoordinates: z.object({
		latitude: z.number().optional(),
		longitude: z.number().optional(),
	}),
});

const ProductResultSchema = z.object({
	title: z.string(),
	stores: z
		.array(
			z.object({
				name: z.string(),
				link: z.string().optional(),
				redirectLink: z.string().optional(),
				price: z
					.object({
						value: z.number(),
						currency: z.string(),
						raw: z.string().optional(),
					})
					.optional(),
				installments: z.string().optional(),
				description: z.string().optional(),
				buyingOptions: z.array(z.string()).optional(),
				logo: z.string().optional(),
				shipping: z.string().optional(),
				condition: z.string().optional(),
				rating: z.number().optional(),
				reviews: z.string().optional(),
			}),
		)
		.optional(),
	aboutTheProduct: z
		.object({
			description: z.string().optional(),
			features: z.array(z.string()).optional(),
		})
		.optional(),
	specifications: z.record(z.string(), z.unknown()).optional(),
	images: z
		.array(
			z.object({
				mainUrl: z.string(),
				thumbnailUrl: z.string().optional(),
				title: z.string().optional(),
			}),
		)
		.optional(),
	rating: z.number().optional(),
	reviews: z.string().optional(),
	variants: z.array(z.record(z.string(), z.unknown())).optional(),
	userReviews: z.array(z.record(z.string(), z.unknown())).optional(),
	relatedProducts: z.array(z.record(z.string(), z.unknown())).optional(),
	productDocid: z.string().optional(),
});

// An array, one entry per prompt, when the request sends a multi-turn prompt array.
const ChatgptMonitorResultSchema = z.union([
	ChatgptAnswerSchema,
	z.array(ChatgptAnswerSchema),
]);

const PerplexityMonitorResultSchema = z.object({
	text: z.string().optional(),
	html: z.string().optional(),
	sources: z.array(SourceSchema).optional(),
	citationPills: z.array(CitationPillSchema).optional(),
	markdown: z.string().optional(),
	related_queries: z.array(z.string()).optional(),
	videos: z.array(MediaItemSchema).optional(),
	images: z.array(MediaItemSchema).optional(),
	hotels: z.array(HotelItemSchema).optional(),
	places: z.array(PlaceItemSchema).optional(),
	shopping_cards: z
		.array(
			z.object({
				tags: z.array(z.string()).optional(),
				products: z
					.array(
						z.object({
							title: z.string().optional(),
							id: z.string().optional(),
							url: z.string().optional(),
							price: z.string().optional(),
							merchant: z.string().optional(),
							available: z.boolean().optional(),
							imageUrls: z.array(z.string()).optional(),
							numReviews: z.number().optional(),
							offers: z
								.array(
									z.object({
										url: z.string().optional(),
										price: z.string().optional(),
										merchant_name: z.string().optional(),
										product_name: z.string().optional(),
										available: z.boolean().optional(),
										price_details: z
											.object({
												display_price: z.string().optional(),
											})
											.optional(),
										original_price: z.string().nullable().optional(),
									}),
								)
								.optional(),
							position: z.number().optional(),
							rating: z.number().optional(),
							original_price: z.string().nullable().optional(),
							description: z.string().optional(),
							variants: z.array(z.record(z.string(), z.unknown())).optional(),
						}),
					)
					.optional(),
			}),
		)
		.optional(),
	search_model_queries: z.array(z.string()).optional(),
	rawResponse: z.array(z.unknown()).optional(),
});

const GeminiMonitorResultSchema = z.object({
	text: z.string().optional(),
	markdown: z.string().optional(),
	html: z.string().optional(),
	sources: z
		.array(
			z.object({
				position: z.number().optional(),
				label: z.string().optional(),
				url: z.string().optional(),
				description: z.string().optional(),
			}),
		)
		.optional(),
	citationPills: z.array(CitationPillSchema).optional(),
	places: z
		.array(
			z.object({
				index: z.number(),
				title: z.string(),
				link: z.string(),
				thumbnail: z.string().optional(),
				rating: z.number().optional(),
				reviews: z.number().optional(),
				type: z.string().optional(),
				description: z.string().optional(),
				price: z.string().optional(),
			}),
		)
		.optional(),
	shoppingCards: z
		.array(
			z.object({
				position: z.number(),
				title: z.string(),
				productLink: z.string(),
				productId: z.string(),
				price: PriceSchema.optional(),
				oldPrice: PriceSchema.optional(),
				store: z.string().optional(),
				storeLink: z.string().optional(),
				storeCount: z.number().optional(),
				shipping: z.string().optional(),
				deliveryTime: z.string().optional(),
				rating: z.number().optional(),
				reviews: z.number().optional(),
				brand: z.string().optional(),
				description: z.string().optional(),
				thumbnail: z.string().optional(),
				images: z.array(z.string()).optional(),
				catalogId: z.string().optional(),
				gpcId: z.string().optional(),
			}),
		)
		.optional(),
	rawResponse: z.array(z.unknown()).optional(),
});

const CopilotMonitorResultSchema = z.object({
	text: z.string().optional(),
	html: z.string().optional(),
	sources: z.array(SourceSchema).optional(),
	citationPills: z.array(CitationPillSchema).optional(),
	shoppingCards: z
		.array(
			z.object({
				type: z.string().optional(),
				layout: z.string().optional(),
				products: z
					.array(
						z.object({
							product: z
								.object({
									id: z.string().optional(),
									groupId: z.string().optional(),
									brandGroupId: z.string().optional(),
								})
								.optional(),
							position: z.number().optional(),
							offerId: z.string().optional(),
							url: z.string().optional(),
							name: z.string().optional(),
							description: z.string().optional(),
							images: z.array(TitleUrlSchema).optional(),
							specifications: z
								.array(
									z.object({
										displayName: z.string().optional(),
										values: z.array(z.string()).optional(),
									}),
								)
								.optional(),
							tags: z.array(z.string()).optional(),
							price: MoneySchema.optional(),
							discountPrice: MoneySchema.nullable().optional(),
							seller: z.string().optional(),
							sellerLogoUrl: z.string().optional(),
							brandName: z.string().optional(),
							rating: z
								.object({
									value: z.number().optional(),
									count: z.number().optional(),
									maxRating: z.number().nullable().optional(),
								})
								.optional(),
							canTrackPrice: z.boolean().optional(),
						}),
					)
					.optional(),
			}),
		)
		.optional(),
	map: z
		.array(
			z.object({
				name: z.string().optional(),
				position: z.number().optional(),
				placeId: z.string().optional(),
				location: z
					.object({
						address: z.string().optional(),
						latitude: z.number().optional(),
						longitude: z.number().optional(),
					})
					.optional(),
				phoneNumber: z.string().optional(),
				url: z.string().optional(),
				reviews: z
					.array(
						z.object({
							count: z.number().optional(),
							rating: z.number().optional(),
							providerName: z.string().optional(),
							providerIconUrl: z.string().optional(),
							url: z.string().optional(),
						}),
					)
					.optional(),
				photos: z
					.array(
						z.object({
							url: z.string().optional(),
							altText: z.string().optional(),
							providerName: z.string().optional(),
							providerUrl: z.string().optional(),
						}),
					)
					.optional(),
				openState: z.string().optional(),
				category: z.string().optional(),
				price: z.unknown().optional(),
				layerLabel: z.string().optional(),
			}),
		)
		.optional(),
	searchQueries: z.array(z.string()).optional(),
	markdown: z.string().optional(),
	rawResponse: z.array(z.unknown()).optional(),
});

const GoogleAiModeMonitorResultSchema = z.object({
	text: z.string().optional(),
	html: z.string().optional(),
	sources: z.array(GoogleSourceSchema).optional(),
	citationPills: z
		.array(
			z.object({
				label: z.string(),
				citationPillId: z.number(),
				url: z.string(),
				domain: z.string(),
				description: z.string().optional(),
				position: z.number().optional(),
				redirectLink: z.string().optional(),
			}),
		)
		.optional(),
	markdown: z.string().optional(),
	places: z.array(GooglePlaceSchema).optional(),
	shoppingCards: z
		.array(
			z.object({
				title: z.string().optional(),
				price: PriceSchema.optional(),
				store: z.string().optional(),
				rating: z.number().optional(),
				reviews: z.string().optional(),
				thumbnail: z.string().optional(),
				productLink: z.string().optional(),
				productResultToken: z.string().optional(),
				productDocid: z.string().optional(),
				oldPrice: PriceSchema.optional(),
				snippet: z.string().optional(),
				snippetLinks: z
					.array(
						z.object({
							text: z.string().optional(),
							link: z.string().optional(),
							redirectLink: z.string().optional(),
						}),
					)
					.optional(),
				position: z.number().optional(),
			}),
		)
		.optional(),
	ads: z
		.object({
			title: z.string().optional(),
			ads: z
				.array(
					z.object({
						title: z.string().optional(),
						url: z.string().optional(),
						position: z.number().optional(),
						price: PriceSchema.optional(),
						store: z.string().optional(),
						rating: z.number().optional(),
						reviews: z.string().optional(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
	inlineProducts: z
		.array(
			z.object({
				title: z.string().optional(),
				position: z.number().optional(),
				price: PriceSchema.optional(),
				oldPrice: PriceSchema.optional(),
				store: z.string().optional(),
				thumbnail: z.string().optional(),
				productLink: z.string().optional(),
				productResultToken: z.string().optional(),
				productDocid: z.string().optional(),
			}),
		)
		.optional(),
	videos: z
		.array(
			z.object({
				title: z.string(),
				link: z.string(),
				platform: z.string().optional(),
				channel: z.string().optional(),
				duration: z.string().optional(),
				thumbnail: z.string().optional(),
				redirectLink: z.string().optional(),
			}),
		)
		.optional(),
	map: z.array(GoogleMapPlaceSchema).optional(),
});

const GoogleSearchMonitorResultSchema = z.object({
	organicResults: z
		.array(
			z.object({
				position: z.number().optional(),
				title: z.string().optional(),
				link: z.string().optional(),
				displayedLink: z.string().optional(),
				snippet: z.string().optional(),
				date: z.string().optional(),
				page: z.number().optional(),
				sitelinks: z
					.object({
						inline: z
							.array(
								z.object({
									title: z.string().optional(),
									link: z.string().optional(),
									redirectLink: z.string().optional(),
								}),
							)
							.optional(),
					})
					.optional(),
				redirectLink: z.string().optional(),
			}),
		)
		.optional(),
	peopleAlsoAsk: z
		.array(
			z.object({
				question: z.string().optional(),
				type: z.enum(['AIOVERVIEW', 'LINK', 'UNKNOWN']).optional(),
				snippet: z.string().optional(),
				title: z.string().optional(),
				link: z.string().optional(),
				markdown: z.string().optional(),
				sources: z
					.array(
						z.object({
							label: z.string().optional(),
							url: z.string().optional(),
							description: z.string().optional(),
							position: z.number().optional(),
							redirectLink: z.string().optional(),
						}),
					)
					.optional(),
				redirectLink: z.string().optional(),
			}),
		)
		.optional(),
	peopleAreSaying: z
		.array(
			z.object({
				position: z.number(),
				title: z.string(),
				link: z.string(),
				date: z.string(),
				redirectLink: z.string().optional(),
			}),
		)
		.optional(),
	localResults: z
		.array(
			z.object({
				position: z.number(),
				title: z.string(),
				placeId: z.string().optional(),
				rating: z.number().optional(),
				reviews: z.string().optional(),
				price: z.string().optional(),
				type: z.string().optional(),
				yearsInBusiness: z.string().optional(),
				address: z.string().optional(),
				phone: z.string().optional(),
				hours: z.string().optional(),
				description: z.string().optional(),
				links: z
					.object({
						website: z.string().optional(),
						directions: z.string().optional(),
						redirectLink: z.string().optional(),
					})
					.optional(),
			}),
		)
		.optional(),
	localResultsMoreLink: z.string().optional(),
	relatedSearches: z
		.array(
			z.object({
				query: z.string().optional(),
				link: z.string().optional(),
			}),
		)
		.optional(),
	ads: z
		.array(
			z.object({
				position: z.number().optional(),
				blockPosition: z.enum(['top', 'bottom', 'middle', 'rhs']).optional(),
				type: z.enum(['RESULT', 'SHOPPING_CARD']).optional(),
				title: z.string().optional(),
				url: z.string().optional(),
				page: z.number().optional(),
				displayedUrl: z.string().optional(),
				domain: z.string().optional(),
				description: z.string().optional(),
				category: z.string().optional(),
				price: PriceSchema.optional(),
				oldPrice: PriceSchema.optional(),
				store: z.string().optional(),
				imageUrl: z.string().optional(),
				sitelinks: z
					.array(
						z.object({
							url: z.string().optional(),
							title: z.string().optional(),
							description: z.string().optional(),
						}),
					)
					.optional(),
			}),
		)
		.optional(),
	aioverview: z
		.object({
			sources: z.array(GoogleSourceSchema).optional(),
			citationPills: z
				.array(
					z.object({
						label: z.string(),
						citationPillId: z.number(),
						url: z.string(),
						domain: z.string(),
						description: z.string().optional(),
						position: z.number(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
			relatedLinks: z
				.array(
					z.object({
						label: z.string(),
						citationPillId: z.number(),
						url: z.string(),
						domain: z.string(),
						description: z.string().optional(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
			text: z.string().optional(),
			markdown: z.string().optional(),
			videos: z
				.array(
					z.object({
						url: z.string().optional(),
						title: z.string().optional(),
						thumbnail: z.string().optional(),
						source: z.string().optional(),
						platform: z.string().optional(),
						date: z.string().optional(),
						duration: z.string().optional(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
			places: z.array(GooglePlaceSchema).optional(),
			map: z.array(GoogleMapPlaceSchema).optional(),
			ads: z
				.array(
					z.object({
						position: z.number(),
						title: z.string(),
						url: z.string(),
						type: z.enum(['TEXT', 'SHOPPING']),
						domain: z.string().optional(),
						description: z.string().optional(),
						price: PriceSchema.optional(),
						old_price: PriceSchema.optional(),
						store: z.string().optional(),
						image: z.string().optional(),
					}),
				)
				.optional(),
		})
		.nullable()
		.optional(),
	shoppingCards: z
		.array(
			z.object({
				title: z.string(),
				position: z.number(),
				productResultToken: z.string().optional(),
				promoLabel: z.string().optional(),
				category: z.string().optional(),
				price: PriceSchema.optional(),
				oldPrice: PriceSchema.optional(),
				store: z.string().optional(),
				rating: z.number().optional(),
				reviews: z.string().optional(),
				thumbnail: z.string().optional(),
			}),
		)
		.optional(),
	knowledgeGraph: z
		.object({
			title: z.string().optional(),
			type: z.string().optional(),
			kgmid: z.string().optional(),
			description: z.string().optional(),
			imageUrl: z.string().optional(),
			website: z.string().optional(),
			menu: z.string().optional(),
			trailer: z.string().optional(),
			source: NamedLinkSchema.optional(),
			attributes: z
				.array(
					z.object({
						key: z.string().optional(),
						value: z.string().optional(),
					}),
				)
				.optional(),
			profiles: z.array(NamedLinkSchema).optional(),
			peopleAlsoSearchFor: z.array(NamedLinkSchema).optional(),
			thingsToKnow: z
				.array(
					z.object({
						label: z.string().optional(),
						subtitle: z.string().optional(),
					}),
				)
				.optional(),
			ratings: z
				.array(
					z.object({
						platform: z.string().optional(),
						rating: z.string().optional(),
						link: z.string().optional(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
			streamingOptions: z.array(PlatformLinkSchema).optional(),
			webRatings: z
				.array(
					z.object({
						platform: z.string().optional(),
						rating: z.string().optional(),
						link: z.string().optional(),
						votes: z.string().optional(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
			statsCard: z
				.object({
					context: z.string().optional(),
					stats: z
						.array(
							z.object({
								label: z.string().optional(),
								value: z.string().optional(),
							}),
						)
						.optional(),
				})
				.optional(),
			socialPosts: z
				.array(
					z.object({
						platform: z.string().optional(),
						text: z.string().optional(),
						link: z.string().optional(),
						date: z.string().optional(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
			notableAlumni: z.array(NamedLinkSchema).optional(),
			contact: z
				.array(
					z.object({
						label: z.string().optional(),
						url: z.string().optional(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
			weather: z
				.object({
					temperature: z.string().optional(),
					condition: z.string().optional(),
				})
				.optional(),
			rating: z
				.object({
					rating: z.string().optional(),
					count: z.string().optional(),
				})
				.optional(),
			admission: z
				.array(
					z.object({
						provider: z.string().optional(),
						price: z.string().optional(),
						link: z.string().optional(),
						badge: z.string().optional(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
			artworks: z
				.array(
					z.object({
						title: z.string().optional(),
						link: z.string().optional(),
						author: z.string().optional(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
			has3dModel: z.boolean().optional(),
			hotelOptions: z
				.array(
					z.object({
						provider: z.string().optional(),
						price: z.string().optional(),
						link: z.string().optional(),
						note: z.string().optional(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
			trendingProducts: z
				.array(
					z.object({
						title: z.string().optional(),
						price: z.string().optional(),
						link: z.string().optional(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
			merchantVideos: z
				.array(
					z.object({
						title: z.string().optional(),
						link: z.string().optional(),
						platform: z.string().optional(),
						duration: z.string().optional(),
						redirectLink: z.string().optional(),
					}),
				)
				.optional(),
			listenOn: z.array(PlatformLinkSchema).optional(),
			redirectLink: z.string().optional(),
		})
		.optional(),
	productResults: z.array(ProductResultSchema).optional(),
	html: z.array(z.string()).optional(),
});

const GoogleNewsMonitorResultSchema = z.object({
	newsResults: z
		.array(
			z.object({
				position: z.number().optional(),
				title: z.string().optional(),
				link: z.string().optional(),
				snippet: z.string().optional(),
				source: z.string().optional(),
				date: z.string().optional(),
				page: z.number().optional(),
				thumbnail: z.string().optional(),
				redirectLink: z.string().optional(),
			}),
		)
		.optional(),
	html: z.array(z.string()).optional(),
});

const CountryCode = z
	.string()
	.regex(/^[A-Za-z]{2}$/, 'Expected an ISO 3166-1 alpha-2 code')
	.describe('ISO 3166-1 alpha-2 country code; see utility.countries');

const UsStateCode = z
	.string()
	.regex(/^[A-Z]{2}$/, 'Expected a USPS state code')
	.describe(
		'US state for state-level targeting (+2 credits); see utility.states',
	);

const Prompt = z.string().min(1).max(10000);

const AssistantPromptInput = z.object({
	prompt: Prompt,
	country: CountryCode,
	state: UsStateCode.optional(),
});

const ResponseFormats = {
	html: z.boolean().optional(),
	markdown: z.boolean().optional(),
};

const RawEvents = {
	...ResponseFormats,
	rawResponse: z.boolean().optional(),
};

const GoogleTargeting = z.object({
	country: CountryCode.optional(),
	gl: CountryCode.optional(),
	hl: z.string().min(1).optional(),
});

const GoogleLocation = {
	location: z.string().min(1).optional(),
	uule: z.string().min(1).optional(),
};

const Pages = z.number().int().min(1).max(10).optional();

function requireGeography<T extends { country?: string; gl?: string }>(
	input: T,
): boolean {
	return input.country !== undefined || input.gl !== undefined;
}

const geographyMessage = { message: 'Provide country or gl' };

const exclusiveLocation = (input: { location?: string; uule?: string }) =>
	!(input.location && input.uule);

const locationMessage = { message: 'location and uule are mutually exclusive' };

const ChatgptInputSchema = AssistantPromptInput.extend({
	prompt: z.union([Prompt, z.array(Prompt).min(1).max(5)]),
	include: z
		.object({
			...RawEvents,
			searchQueries: z.boolean().optional(),
			ads: z.boolean().optional(),
			shopping: z.boolean().optional(),
		})
		.optional(),
	legacy: z.boolean().optional(),
	disableWebSearch: z.boolean().optional(),
});

const PerplexityInputSchema = AssistantPromptInput.extend({
	include: z.object(RawEvents).optional(),
});

const GeminiInputSchema = AssistantPromptInput.extend({
	include: z.object(RawEvents).optional(),
});

const CopilotInputSchema = AssistantPromptInput.extend({
	include: z.object(RawEvents).optional(),
});

const GoogleAiModeInputSchema = GoogleTargeting.extend({
	prompt: Prompt,
	...GoogleLocation,
	device: z.enum(['desktop', 'mobile']).optional(),
	include: z.object(ResponseFormats).optional(),
})
	.refine(requireGeography, geographyMessage)
	.refine(exclusiveLocation, locationMessage);

const GoogleSearchInputSchema = GoogleTargeting.extend({
	query: Prompt.optional(),
	url: z.url().optional(),
	...GoogleLocation,
	device: z.enum(['desktop', 'mobile', 'ios', 'android']).optional(),
	pages: Pages,
	include: z
		.object({
			html: z.boolean().optional(),
			aioverview: z.object({ markdown: z.boolean().optional() }).optional(),
			paaAioverview: z.boolean().optional(),
		})
		.optional(),
})
	.refine(
		(input) =>
			input.url !== undefined
				? input.query === undefined && input.pages === undefined
				: input.query !== undefined && requireGeography(input),
		{
			message:
				'Provide query with country or gl, or a Google search url on its own',
		},
	)
	.refine(exclusiveLocation, locationMessage);

const GoogleNewsInputSchema = GoogleTargeting.extend({
	query: Prompt,
	device: z.enum(['desktop', 'mobile', 'ios', 'android']).optional(),
	pages: Pages,
	include: z.object({ html: z.boolean().optional() }).optional(),
}).refine(requireGeography, geographyMessage);

const MonitorModel = z.enum([
	'aimode',
	'aioverview',
	'chatgpt',
	'copilot',
	'gemini',
	'google',
	'perplexity',
]);

const CountriesInputSchema = z.object({ model: MonitorModel.optional() });

const StatesInputSchema = z.object({ country: z.string().regex(/^[A-Z]{2}$/) });

const CreditsInputSchema = z.object({});

function monitorResponse<T extends z.ZodType>(result: T) {
	return z.object({ success: z.literal(true), result });
}

const ChatgptResponseSchema = monitorResponse(ChatgptMonitorResultSchema);
const PerplexityResponseSchema = monitorResponse(PerplexityMonitorResultSchema);
const GeminiResponseSchema = monitorResponse(GeminiMonitorResultSchema);
const CopilotResponseSchema = monitorResponse(CopilotMonitorResultSchema);
const GoogleAiModeResponseSchema = monitorResponse(
	GoogleAiModeMonitorResultSchema,
);
const GoogleSearchResponseSchema = monitorResponse(
	GoogleSearchMonitorResultSchema,
);
const GoogleNewsResponseSchema = monitorResponse(GoogleNewsMonitorResultSchema);

const CountriesResponseSchema = z.array(z.string());

const StatesResponseSchema = z.array(
	z.object({ code: z.string(), name: z.string() }),
);

const CreditsResponseSchema = z.object({
	remaining: z.number(),
	perCycle: z.number().nullable(),
	cycleResetsAt: z.string().nullable(),
});

export type ChatgptInput = z.infer<typeof ChatgptInputSchema>;
export type ChatgptResponse = z.infer<typeof ChatgptResponseSchema>;
export type PerplexityInput = z.infer<typeof PerplexityInputSchema>;
export type PerplexityResponse = z.infer<typeof PerplexityResponseSchema>;
export type GeminiInput = z.infer<typeof GeminiInputSchema>;
export type GeminiResponse = z.infer<typeof GeminiResponseSchema>;
export type CopilotInput = z.infer<typeof CopilotInputSchema>;
export type CopilotResponse = z.infer<typeof CopilotResponseSchema>;
export type GoogleAiModeInput = z.infer<typeof GoogleAiModeInputSchema>;
export type GoogleAiModeResponse = z.infer<typeof GoogleAiModeResponseSchema>;
export type GoogleSearchInput = z.infer<typeof GoogleSearchInputSchema>;
export type GoogleSearchResponse = z.infer<typeof GoogleSearchResponseSchema>;
export type GoogleNewsInput = z.infer<typeof GoogleNewsInputSchema>;
export type GoogleNewsResponse = z.infer<typeof GoogleNewsResponseSchema>;
export type CountriesInput = z.infer<typeof CountriesInputSchema>;
export type CountriesResponse = z.infer<typeof CountriesResponseSchema>;
export type StatesInput = z.infer<typeof StatesInputSchema>;
export type StatesResponse = z.infer<typeof StatesResponseSchema>;
export type CreditsInput = z.infer<typeof CreditsInputSchema>;
export type CreditsResponse = z.infer<typeof CreditsResponseSchema>;

export type CloroEndpointInputs = {
	monitorChatgpt: ChatgptInput;
	monitorPerplexity: PerplexityInput;
	monitorGemini: GeminiInput;
	monitorCopilot: CopilotInput;
	monitorGoogleAiMode: GoogleAiModeInput;
	monitorGoogleSearch: GoogleSearchInput;
	monitorGoogleNews: GoogleNewsInput;
	utilityCountries: CountriesInput;
	utilityStates: StatesInput;
	utilityCredits: CreditsInput;
};

export type CloroEndpointOutputs = {
	monitorChatgpt: ChatgptResponse;
	monitorPerplexity: PerplexityResponse;
	monitorGemini: GeminiResponse;
	monitorCopilot: CopilotResponse;
	monitorGoogleAiMode: GoogleAiModeResponse;
	monitorGoogleSearch: GoogleSearchResponse;
	monitorGoogleNews: GoogleNewsResponse;
	utilityCountries: CountriesResponse;
	utilityStates: StatesResponse;
	utilityCredits: CreditsResponse;
};

export const CloroEndpointInputSchemas = {
	monitorChatgpt: ChatgptInputSchema,
	monitorPerplexity: PerplexityInputSchema,
	monitorGemini: GeminiInputSchema,
	monitorCopilot: CopilotInputSchema,
	monitorGoogleAiMode: GoogleAiModeInputSchema,
	monitorGoogleSearch: GoogleSearchInputSchema,
	monitorGoogleNews: GoogleNewsInputSchema,
	utilityCountries: CountriesInputSchema,
	utilityStates: StatesInputSchema,
	utilityCredits: CreditsInputSchema,
} as const;

export const CloroEndpointOutputSchemas = {
	monitorChatgpt: ChatgptResponseSchema,
	monitorPerplexity: PerplexityResponseSchema,
	monitorGemini: GeminiResponseSchema,
	monitorCopilot: CopilotResponseSchema,
	monitorGoogleAiMode: GoogleAiModeResponseSchema,
	monitorGoogleSearch: GoogleSearchResponseSchema,
	monitorGoogleNews: GoogleNewsResponseSchema,
	utilityCountries: CountriesResponseSchema,
	utilityStates: StatesResponseSchema,
	utilityCredits: CreditsResponseSchema,
} as const;
