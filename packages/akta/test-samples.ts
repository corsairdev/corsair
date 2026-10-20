// Company enrichment example from https://docs.akta.pro/api-reference/company-data,
// trimmed to one item per list. The docs example has no trust_signal, so that
// section and the last competitive_moat entry come from a live Stripe response.
export const enrichmentAllSections = {
	data: {
		uuid: '00000l1',
		firmographic: {
			name: 'Canva',
			legal_name: 'Canva',
			website: 'http://www.canva.com',
			company_type: {
				code: 'private',
				label: 'Private',
			},
			founded_year: 2013,
			company_description:
				'Canva is an online visual communication and design platform founded in 2013 a...',
			company_description_short:
				'Canva is a cloud-based visual communication platform serving individuals, SMB...',
			operating_status: {
				code: 'operating',
				label: 'Operating',
			},
			ownership_category: {
				code: 'venture_growth_investor_backed',
				label: 'Venture Growth Investor Backed',
			},
			headcount_range: '1001-5000',
		},
		business_model: {
			gtm_motion: [
				{
					description:
						'Freemium model with free tier for individual users that converts to paid Pro ...',
					source: ['http://canva.com/'],
					type: {
						code: 'product_led_growth',
						label: 'Product Led Growth',
					},
				},
			],
			revenue_model: [
				{
					description:
						'Premium subscription tier providing access to AI features, advanced design to...',
					source: [
						'https://www.stackcapitalgroup.com/stack-capital-invests-8-million-usd-into-canva',
					],
					title: 'Canva Pro Subscription',
					type: {
						code: 'subscription_recurring',
						label: 'Subscription Recurring',
					},
				},
			],
			marketing_channels: [
				{
					description:
						'Educational content teaching design skills, tutorials, and best practices to ...',
					source: ['http://canva.com/'],
					stage: {
						code: 'top_of_funnel',
						label: 'Top of Funnel',
					},
					title: 'Design School and Learn Blog',
					type: {
						code: 'content_marketing_blog',
						label: 'Content Marketing/ Blog',
					},
				},
			],
			distribution_channels: [
				{
					description:
						'Primary self-serve distribution through browser-based platform with free tier...',
					scope: 'Global',
					source: ['http://canva.com/'],
					target_buyer: {
						code: 'smb_individual_consumer',
						label: 'SMB/Individual/Consumer',
					},
					title: 'Web Platform (canva.com)',
					type: {
						code: 'self_serve_plg',
						label: 'Self-serve/ PLG',
					},
				},
			],
			cost_components: ['Personnel'],
			pricing_details: [
				{
					billing_cadence: {
						code: 'others',
						label: 'Others',
					},
					description:
						'Free tier with basic design tools, limited storage, and limited AI feature ac...',
					model: {
						code: 'freemium',
						label: 'Freemium',
					},
					notes:
						'Core design tools, basic templates, limited AI uses. 5GB cloud storage.',
					source: ['http://canva.com/'],
				},
			],
			gtm_type: {
				code: 'b2b_and_b2c',
				label: 'B2B and B2C',
			},
			offering_type: {
				code: 'software',
				label: 'Software',
			},
		},
		company_assessment: {
			market_position:
				'Canva is a Sydney-headquartered, private online visual communication and desi...',
			strengths: [
				{
					details:
						"Canva AI 2.0's Conversational Design, Agentic Orchestration, and Living Memor...",
					headline: 'Canva AI 2.0 becomes the visual layer for agentic work',
					source: ['http://canva.com/'],
				},
			],
			weakness: [
				{
					details:
						'Adobe Express is bundled into Creative Cloud (already at deep enterprise pene...',
					headline: "Adobe + Microsoft bundling squeezes Canva's moat",
					source: [
						'https://www.zdnet.com/article/adobe-express-vs-canva-compared-2026/',
					],
				},
			],
			competitive_moat: [
				{
					details:
						'Canva reaches 265 million monthly active users across 190+ countries and is n...',
					type: {
						code: 'distribution_advantage',
						label: 'Distribution Advantage',
					},
				},
				{
					type: {
						code: 'talent_moat',
						label: 'Talent Moat',
					},
				},
			],
			key_risks: [
				{
					details:
						'Brendan Humphreys, CTO for 12 years, stepped down effective June 19, 2026 \u2014 m...',
					headline: 'Long-tenured CTO departure at the worst possible time',
					source: [
						'https://www.financialexpress.com/life/technology-canva-cto-brendan-humphreys-...',
					],
				},
			],
			key_highlights: [
				{
					details:
						'Canva reports 265M+ monthly active users (May 2026 source) across 190+ countr...',
					headline:
						'Massive global user base of 265M+ MAU with deep enterprise penetration',
					source: [
						'https://www.famouscampaigns.com/2026/05/the-famous-qa-with-kristine-segrist/',
					],
				},
			],
			customer_concentration: {
				details:
					"Canva's revenue is distributed across approximately 31 million paying subscri...",
				classification: {
					code: 'Low',
					label: 'Low',
				},
			},
			peers: [
				{
					description:
						'Adobe Creative Cloud and Adobe Express are the closest direct competitor to C...',
					name: 'Adobe',
					type: {
						code: 'broad_incumbent',
						label: 'Broad Incumbent',
					},
				},
			],
		},
		trust_signal: {
			compliance: [
				{
					class: {
						code: 'payment_financial',
						label: 'Payment Financial',
					},
					description:
						'Stripe is PCI compliant and holds regulatory licenses globally. Pricing page ...',
					name: {
						code: 'pci_dss',
						label: 'Pci Dss',
					},
					source: ['https://stripe.com/pricing'],
				},
			],
			awards: [
				{
					body: 'Business Model Analyst (citing funding rounds, secondary share sales, and ana...',
					description:
						'Stripe valued at $159B in 2026 ranking of top 10 most valuable private compan...',
					source: [
						'https://businessmodelanalyst.com/top-10-highest-valued-unicorns-in-2026/',
					],
					title: 'Most Valuable Unicorns 2026 ranking - #7',
					type: {
						code: 'best_in_class_list',
						label: 'Best-in-class list',
					},
				},
			],
		},
		company_hierarchy: {
			subsidiaries: [
				{
					acquired_on: {
						month: 2,
						year: 2022,
					},
					business_focus: 'Data visualization platform',
					name: 'Flourish',
					relationship_type: {
						code: 'wholly_owned',
						label: 'Wholly Owned',
					},
					type: {
						code: 'acquired_brand_retained',
						label: 'Acquired Brand Retained',
					},
				},
			],
		},
		digital_presence: {
			social_media_profiles: [
				{
					platform: 'x',
					url: 'https://x.com/canva',
				},
			],
		},
		financial_estimate: {
			revenue_estimate: {
				code: '1b_5b',
				label: '$1B-$5B',
			},
			valuation_estimate: {
				code: 'over_25b',
				label: '$25B+',
			},
		},
		location: {
			hq: {
				city: 'Sydney',
				country: 'AUS',
				region: 'Oceania',
			},
			market_served: {
				is_global: true,
			},
			offices: [
				{
					city: 'Sydney',
					country: 'AUS',
					description:
						"Canva's global headquarters located in Sydney, Australia. The company was fou...",
					source: [
						'https://tech-insider.org/au/australian-tech-startups-2026/',
					],
					type: {
						code: 'headquarters',
						label: 'Headquarters',
					},
				},
			],
		},
		management_profile: {
			number_of_profiles: 10,
			profiles: [
				{
					designation: 'Co-founder & CEO',
					designation_category: {
						code: 'chief_executive_officer',
						label: 'Chief Executive Officer',
					},
					name: 'Melanie Perkins',
					overview:
						'Co-founder and Chief Executive Officer of Canva, leading the company from inc...',
					profile_commentary:
						'Perkins is listed as co-founder & CEO. Founded Canva in 2013 in Sydney, Austr...',
					source: [
						'https://www.investing.com/news/stock-market-news/robinhood-ventures-invests-2...',
					],
					start_date: '2013',
				},
			],
		},
		product_offering: {
			brand: [
				{
					description:
						'Professional photo editing, vector design, and page layout software suite acq...',
					name: 'Affinity',
					source: [
						'https://www.openpr.com/news/4513572/worldwide-insights-the-fast-paced-evoluti...',
					],
				},
			],
			core_offering:
				'Canva operates a cloud-based visual communication platform that enables indiv...',
			differentiator:
				'All-in-one visual communication platform combining design, documents, spreads...',
			functional_benefit:
				'Enables non-designers to create professional-quality visual content (social m...',
			problem_solved:
				'Organizations and individuals lack the design skills, time, or resources to c...',
			quantifiable_outcome: [
				'89% of marketers report gaining at least 4 hours weekly through AI automations',
			],
			product_overview:
				'Canva is a visual communication and design platform offering a comprehensive ...',
			product_and_service: [
				{
					category: 'Visual Design Platform',
					description:
						"Canva's core design platform providing AI-powered visual content creation inc...",
					name: 'Canva Visual Suite',
					source: ['http://canva.com/'],
					url: 'https://www.canva.com/visual-suite/',
				},
			],
		},
		strategic_signal: {
			scale_indicator: [
				{
					description:
						'Monthly active users as of 2026. Multiple sources confirm this figure.',
					source: [
						'https://www.famouscampaigns.com/2026/05/the-famous-qa-with-kristine-segrist/',
					],
					type: {
						code: 'user_engagement',
						label: 'User Engagement',
					},
					value: '265 million',
				},
			],
			partnership: [
				{
					announced_on: {
						day: 25,
						month: 3,
						year: 2026,
					},
					description:
						'Canva acquired Doohly for $30 million to expand into digital out-of-home (DOO...',
					name: 'Doohly',
					source: [
						'https://www.smartcompany.com.au/startupsmart/canva-snaps-up-doohly-acquisitio...',
					],
					strategic_tier: 'Core',
					type: {
						code: 'strategic_codevelopment',
						label: 'Strategic or Co-development Partner',
					},
				},
			],
			recent_move: [
				{
					date: {
						month: 5,
						year: 2026,
					},
					description:
						'Launched Canva AI 2.0 at Canva Create in Los Angeles, introducing Conversatio...',
					source: ['http://canva.com/'],
					type: {
						code: 'product_launch',
						label: 'Product Launch',
					},
				},
			],
			leadership_change: [
				{
					description:
						'Brendan Humphreys stepped down as chief technology officer of Canva after 12 ...',
					source: [
						'https://www.financialexpress.com/life/technology-canva-cto-brendan-humphreys-...',
					],
					title: 'CTO Leadership Transition',
					type: {
						code: 'leadership_change',
						label: 'Leadership Change',
					},
				},
			],
			expansion_highlight: [
				{
					description:
						"Andhra Pradesh statewide education deployment (June 2026) is Canva's first In...",
					type: {
						code: 'new_geography',
						label: 'New Geography',
					},
				},
			],
		},
		customer_profile: {
			segment: [
				{
					description:
						'Casual users seeking easy design tools for personal projects, social media, a...',
					is_primary: true,
					pain_point_addressed:
						'Lack of design skills, need for quick professional-looking results, limited b...',
					source: ['http://canva.com/'],
					title: 'Individual Consumers',
					type: {
						code: 'size_tier',
						label: 'Size Tier',
					},
					use_case:
						'Social media graphics, presentations, personal projects, documents',
				},
			],
			icp: [
				{
					buyer_persona:
						'Self-directed individual user with no formal purchasing committee',
					buying_structure: {
						code: 'single_decision_maker',
						label: 'Single Decision-Maker',
					},
					description:
						'Self-serve individual users adopting the Free tier for personal projects, soc...',
					evidence_proof_points: ['265 million monthly active users'],
					firmographic_size: {
						code: 'smb',
						label: 'SMB',
					},
					geography:
						'Global, including Australia, USA, UK, India, New Zealand, South Korea, Philip...',
					industry_vertical: 'Cross-vertical individual creators',
					pain_points: ['Lack of design skills or formal training'],
					primary_use_case:
						'Social media graphics, presentations, personal projects, documents',
					profile: 'Individual Consumers / Prosumers',
					purchase_trigger: {
						code: 'early_adopter_innovation',
						label: 'Early-Adopter/Innovation',
					},
					sales_cycle_length: {
						code: 'transactional',
						label: 'Transactional (<30 days)',
					},
					sales_motion: {
						code: 'product_led_plg',
						label: 'Product-Led (PLG)',
					},
					target_buyer: 'Individual consumers, freelancers, creators, students',
				},
			],
			select_customer: [
				{
					industry: 'Consumer Goods',
					name: 'Danone',
					source: ['https://www.canva.com/sheets/'],
					type: {
						code: 'enterprise',
						label: 'Enterprise',
					},
					use_case:
						'Visual content creation and brand management using Canva Sheets',
				},
			],
		},
		industry: {
			keyword: ['visual design platform'],
			industry: [
				{
					code: 'HDABAAAD',
					is_primary: true,
					label: 'Managed Application Platforms (App PaaS & Runtime Services)',
				},
			],
			naics: [
				{
					code: '5132',
					label: 'Software Publishers',
				},
			],
			sic: [
				{
					code: '7370',
					label: 'SERVICES-COMPUTER PROGRAMMING, DATA PROCESSING, ETC.',
				},
			],
			product_category: 'Visual Design Software',
		},
		technology: {
			is_technology_focussed: true,
			api_detail: {
				description:
					'Canva offers a developer platform and API for building integrations and appli...',
				docs_url: 'https://www.canva.com/developers/',
				has_api: true,
				has_mcp: true,
			},
			integration: [
				{
					description:
						'Data Connectors allow Canva Sheets to connect to Google Analytics for importi...',
					source: ['https://www.canva.com/sheets/'],
					title: 'Google Analytics',
					type: {
						code: 'bi_analytics',
						label: 'Bi Analytics',
					},
				},
			],
			ai_capability: [
				{
					description:
						'Magic Write AI-powered writing assistant generates, summarizes, expands, and ...',
					source: ['http://canva.com/'],
					type: {
						code: 'text',
						label: 'Text',
					},
				},
			],
			ai_maturity: {
				label: 'Unknown',
			},
			app_detail: {
				has_app: true,
				app_url: [
					{
						platform: 'playstore',
						url: 'https://canva.me/download-android/',
					},
				],
			},
			feature: [
				{
					description:
						'Conversational AI design platform with Conversational Design, Agentic Orchest...',
					differentiator: {
						code: 'novel_method_architecture',
						label: 'Novel Method Architecture',
					},
					source: ['http://canva.com/'],
					title: 'Canva AI 2.0',
				},
			],
			core_technology:
				'Cloud-based visual design platform with AI-powered creation tools, supporting...',
		},
		funding_detail: {
			funding_overview: {
				funding_stage: {
					code: 'private_equity',
					label: 'Private Equity',
				},
				last_funding_date: {
					day: 24,
					month: 6,
					year: 2026,
				},
				total_funding_usd: 2533450682,
			},
			funding_rounds: [
				{
					amount_usd: 25000000,
					date: {
						day: 24,
						month: 6,
						year: 2026,
					},
					id: 15535407,
					investors: [
						{
							lead_investor: true,
							name: 'Robinhood Ventures',
							type: {
								code: 'private',
								label: 'Private',
							},
							uuid: '003t2hb',
						},
					],
					round: {
						code: 'private_equity_round',
						label: 'Private equity round',
					},
					total_investors: 1,
				},
			],
			investors: [
				{
					date_of_entry: {
						day: 24,
						month: 6,
						year: 2026,
					},
					name: 'Robinhood Ventures',
					rounds_participated: [
						{
							code: 'private_equity_round',
							label: 'Private equity round',
						},
					],
					type: {
						code: 'private',
						label: 'Private',
					},
					uuid: '003t2hb',
				},
			],
		},
		mna_and_investment: {
			mna: [
				{
					acquiree: {
						name: 'Ortto',
						uuid: '0000uvx',
						website: 'https://ortto.com/',
					},
					acquisition_type: {
						code: 'acquisition',
						label: 'Acquisition',
					},
					announced_date: {
						day: 8,
						month: 4,
						year: 2026,
					},
					id: 2561504,
					status: 'pending',
				},
			],
			investment: [
				{
					announced_date: {
						day: 1,
						month: 12,
						year: 2025,
					},
					funding_round_id: 745415,
					id: 2082429,
					investee: {
						name: 'Black Forest Labs',
						uuid: '00000hy',
						website: 'https://blackforestlabs.ai',
					},
					lead_investor: false,
					news: [
						{
							publisher: 'bfl',
							title:
								'Black Forest Labs announced a $300 million Series B funding round at a $3.25 ...',
							url: 'https://bfl.ai/blog/our-300m-series-b',
						},
					],
					round: {
						code: 'series_b',
						label: 'Series B',
					},
				},
			],
		},
	},
	credits_consumed: 24.5,
};
