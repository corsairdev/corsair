import { z } from 'zod';

const ArchiveMacrosAsUserSchema = z
	.object({
		ids: z.array(z.number().int()).min(1).max(30),
	})
	.strict();
const ArchiveMacroAsUserStatusEnumSchema = z.enum([
	'archived',
	'not_found',
	'already_archived',
	'macro_used',
]);
const MacroUsageErrorDataSchema = z
	.object({
		rules: z.array(z.string()),
	})
	.strict();
const MacroUsageErrorSchema = z
	.object({
		data: MacroUsageErrorDataSchema,
		msg: z.string(),
	})
	.strict();
const ArchiveMacroAsUserResultSchema = z
	.object({
		id: z.number().int(),
		status: ArchiveMacroAsUserStatusEnumSchema,
		error: MacroUsageErrorSchema.optional(),
	})
	.strict();
const ArchiveMacrosAsUserResultSchema = z
	.object({
		data: z.array(ArchiveMacroAsUserResultSchema),
	})
	.strict();
const UnarchiveMacrosAsUserSchema = z
	.object({
		ids: z.array(z.number().int()).min(1).max(30),
	})
	.strict();
const UnarchiveMacroAsUserStatusEnumSchema = z.enum([
	'unarchived',
	'not_found',
	'already_not_archived',
]);
const UnArchiveMacroAsUserResultSchema = z
	.object({
		id: z.number().int(),
		status: UnarchiveMacroAsUserStatusEnumSchema,
	})
	.strict();
const UnarchiveMacrosAsUserResultSchema = z
	.object({
		data: z.array(UnArchiveMacroAsUserResultSchema),
	})
	.strict();
const AccountSettingSatisfactionSurveysTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				send_survey_for_chat: z.boolean().optional(),
				send_survey_for_email: z.boolean().optional(),
				send_survey_for_contact_form: z.boolean().optional(),
				send_survey_for_help_center: z.boolean().optional(),
				survey_email_html: z.string().optional(),
				survey_email_text: z.string().optional(),
				survey_interval: z.number().int().optional(),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingAutoMergeTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				tickets: z
					.object({
						enabled: z.boolean(),
						merging_window_days: z.number().int().min(1).max(180),
					})
					.strict(),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingAutoSplitTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				email: z
					.object({
						enabled: z.boolean(),
						split_after_days: z.number().int().min(1).max(30).optional(),
					})
					.strict(),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingBusinessHoursTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				business_hours: z
					.array(
						z
							.object({
								days: z.string().optional(),
								from_time: z.string().optional(),
								to_time: z.string().optional(),
							})
							.strict(),
					)
					.optional(),
				timezone: z
					.enum([
						'Africa/Abidjan',
						'Africa/Accra',
						'Africa/Addis_Ababa',
						'Africa/Algiers',
						'Africa/Asmara',
						'Africa/Asmera',
						'Africa/Bamako',
						'Africa/Bangui',
						'Africa/Banjul',
						'Africa/Bissau',
						'Africa/Blantyre',
						'Africa/Brazzaville',
						'Africa/Bujumbura',
						'Africa/Cairo',
						'Africa/Casablanca',
						'Africa/Ceuta',
						'Africa/Conakry',
						'Africa/Dakar',
						'Africa/Dar_es_Salaam',
						'Africa/Djibouti',
						'Africa/Douala',
						'Africa/El_Aaiun',
						'Africa/Freetown',
						'Africa/Gaborone',
						'Africa/Harare',
						'Africa/Johannesburg',
						'Africa/Juba',
						'Africa/Kampala',
						'Africa/Khartoum',
						'Africa/Kigali',
						'Africa/Kinshasa',
						'Africa/Lagos',
						'Africa/Libreville',
						'Africa/Lome',
						'Africa/Luanda',
						'Africa/Lubumbashi',
						'Africa/Lusaka',
						'Africa/Malabo',
						'Africa/Maputo',
						'Africa/Maseru',
						'Africa/Mbabane',
						'Africa/Mogadishu',
						'Africa/Monrovia',
						'Africa/Nairobi',
						'Africa/Ndjamena',
						'Africa/Niamey',
						'Africa/Nouakchott',
						'Africa/Ouagadougou',
						'Africa/Porto-Novo',
						'Africa/Sao_Tome',
						'Africa/Timbuktu',
						'Africa/Tripoli',
						'Africa/Tunis',
						'Africa/Windhoek',
						'America/Adak',
						'America/Anchorage',
						'America/Anguilla',
						'America/Antigua',
						'America/Araguaina',
						'America/Argentina/Buenos_Aires',
						'America/Argentina/Catamarca',
						'America/Argentina/ComodRivadavia',
						'America/Argentina/Cordoba',
						'America/Argentina/Jujuy',
						'America/Argentina/La_Rioja',
						'America/Argentina/Mendoza',
						'America/Argentina/Rio_Gallegos',
						'America/Argentina/Salta',
						'America/Argentina/San_Juan',
						'America/Argentina/San_Luis',
						'America/Argentina/Tucuman',
						'America/Argentina/Ushuaia',
						'America/Aruba',
						'America/Asuncion',
						'America/Atikokan',
						'America/Atka',
						'America/Bahia',
						'America/Bahia_Banderas',
						'America/Barbados',
						'America/Belem',
						'America/Belize',
						'America/Blanc-Sablon',
						'America/Boa_Vista',
						'America/Bogota',
						'America/Boise',
						'America/Buenos_Aires',
						'America/Cambridge_Bay',
						'America/Campo_Grande',
						'America/Cancun',
						'America/Caracas',
						'America/Catamarca',
						'America/Cayenne',
						'America/Cayman',
						'America/Chicago',
						'America/Chihuahua',
						'America/Ciudad_Juarez',
						'America/Coral_Harbour',
						'America/Cordoba',
						'America/Costa_Rica',
						'America/Coyhaique',
						'America/Creston',
						'America/Cuiaba',
						'America/Curacao',
						'America/Danmarkshavn',
						'America/Dawson',
						'America/Dawson_Creek',
						'America/Denver',
						'America/Detroit',
						'America/Dominica',
						'America/Edmonton',
						'America/Eirunepe',
						'America/El_Salvador',
						'America/Ensenada',
						'America/Fort_Nelson',
						'America/Fort_Wayne',
						'America/Fortaleza',
						'America/Glace_Bay',
						'America/Godthab',
						'America/Goose_Bay',
						'America/Grand_Turk',
						'America/Grenada',
						'America/Guadeloupe',
						'America/Guatemala',
						'America/Guayaquil',
						'America/Guyana',
						'America/Halifax',
						'America/Havana',
						'America/Hermosillo',
						'America/Indiana/Indianapolis',
						'America/Indiana/Knox',
						'America/Indiana/Marengo',
						'America/Indiana/Petersburg',
						'America/Indiana/Tell_City',
						'America/Indiana/Vevay',
						'America/Indiana/Vincennes',
						'America/Indiana/Winamac',
						'America/Indianapolis',
						'America/Inuvik',
						'America/Iqaluit',
						'America/Jamaica',
						'America/Jujuy',
						'America/Juneau',
						'America/Kentucky/Louisville',
						'America/Kentucky/Monticello',
						'America/Knox_IN',
						'America/Kralendijk',
						'America/La_Paz',
						'America/Lima',
						'America/Los_Angeles',
						'America/Louisville',
						'America/Lower_Princes',
						'America/Maceio',
						'America/Managua',
						'America/Manaus',
						'America/Marigot',
						'America/Martinique',
						'America/Matamoros',
						'America/Mazatlan',
						'America/Mendoza',
						'America/Menominee',
						'America/Merida',
						'America/Metlakatla',
						'America/Mexico_City',
						'America/Miquelon',
						'America/Moncton',
						'America/Monterrey',
						'America/Montevideo',
						'America/Montreal',
						'America/Montserrat',
						'America/Nassau',
						'America/New_York',
						'America/Nipigon',
						'America/Nome',
						'America/Noronha',
						'America/North_Dakota/Beulah',
						'America/North_Dakota/Center',
						'America/North_Dakota/New_Salem',
						'America/Nuuk',
						'America/Ojinaga',
						'America/Panama',
						'America/Pangnirtung',
						'America/Paramaribo',
						'America/Phoenix',
						'America/Port-au-Prince',
						'America/Port_of_Spain',
						'America/Porto_Acre',
						'America/Porto_Velho',
						'America/Puerto_Rico',
						'America/Punta_Arenas',
						'America/Rainy_River',
						'America/Rankin_Inlet',
						'America/Recife',
						'America/Regina',
						'America/Resolute',
						'America/Rio_Branco',
						'America/Rosario',
						'America/Santa_Isabel',
						'America/Santarem',
						'America/Santiago',
						'America/Santo_Domingo',
						'America/Sao_Paulo',
						'America/Scoresbysund',
						'America/Shiprock',
						'America/Sitka',
						'America/St_Barthelemy',
						'America/St_Johns',
						'America/St_Kitts',
						'America/St_Lucia',
						'America/St_Thomas',
						'America/St_Vincent',
						'America/Swift_Current',
						'America/Tegucigalpa',
						'America/Thule',
						'America/Thunder_Bay',
						'America/Tijuana',
						'America/Toronto',
						'America/Tortola',
						'America/Vancouver',
						'America/Virgin',
						'America/Whitehorse',
						'America/Winnipeg',
						'America/Yakutat',
						'America/Yellowknife',
						'Antarctica/Casey',
						'Antarctica/Davis',
						'Antarctica/DumontDUrville',
						'Antarctica/Macquarie',
						'Antarctica/Mawson',
						'Antarctica/McMurdo',
						'Antarctica/Palmer',
						'Antarctica/Rothera',
						'Antarctica/South_Pole',
						'Antarctica/Syowa',
						'Antarctica/Troll',
						'Antarctica/Vostok',
						'Arctic/Longyearbyen',
						'Asia/Aden',
						'Asia/Almaty',
						'Asia/Amman',
						'Asia/Anadyr',
						'Asia/Aqtau',
						'Asia/Aqtobe',
						'Asia/Ashgabat',
						'Asia/Ashkhabad',
						'Asia/Atyrau',
						'Asia/Baghdad',
						'Asia/Bahrain',
						'Asia/Baku',
						'Asia/Bangkok',
						'Asia/Barnaul',
						'Asia/Beirut',
						'Asia/Bishkek',
						'Asia/Brunei',
						'Asia/Calcutta',
						'Asia/Chita',
						'Asia/Choibalsan',
						'Asia/Chongqing',
						'Asia/Chungking',
						'Asia/Colombo',
						'Asia/Dacca',
						'Asia/Damascus',
						'Asia/Dhaka',
						'Asia/Dili',
						'Asia/Dubai',
						'Asia/Dushanbe',
						'Asia/Famagusta',
						'Asia/Gaza',
						'Asia/Harbin',
						'Asia/Hebron',
						'Asia/Ho_Chi_Minh',
						'Asia/Hong_Kong',
						'Asia/Hovd',
						'Asia/Irkutsk',
						'Asia/Istanbul',
						'Asia/Jakarta',
						'Asia/Jayapura',
						'Asia/Jerusalem',
						'Asia/Kabul',
						'Asia/Kamchatka',
						'Asia/Karachi',
						'Asia/Kashgar',
						'Asia/Kathmandu',
						'Asia/Katmandu',
						'Asia/Khandyga',
						'Asia/Kolkata',
						'Asia/Krasnoyarsk',
						'Asia/Kuala_Lumpur',
						'Asia/Kuching',
						'Asia/Kuwait',
						'Asia/Macao',
						'Asia/Macau',
						'Asia/Magadan',
						'Asia/Makassar',
						'Asia/Manila',
						'Asia/Muscat',
						'Asia/Nicosia',
						'Asia/Novokuznetsk',
						'Asia/Novosibirsk',
						'Asia/Omsk',
						'Asia/Oral',
						'Asia/Phnom_Penh',
						'Asia/Pontianak',
						'Asia/Pyongyang',
						'Asia/Qatar',
						'Asia/Qostanay',
						'Asia/Qyzylorda',
						'Asia/Rangoon',
						'Asia/Riyadh',
						'Asia/Saigon',
						'Asia/Sakhalin',
						'Asia/Samarkand',
						'Asia/Seoul',
						'Asia/Shanghai',
						'Asia/Singapore',
						'Asia/Srednekolymsk',
						'Asia/Taipei',
						'Asia/Tashkent',
						'Asia/Tbilisi',
						'Asia/Tehran',
						'Asia/Tel_Aviv',
						'Asia/Thimbu',
						'Asia/Thimphu',
						'Asia/Tokyo',
						'Asia/Tomsk',
						'Asia/Ujung_Pandang',
						'Asia/Ulaanbaatar',
						'Asia/Ulan_Bator',
						'Asia/Urumqi',
						'Asia/Ust-Nera',
						'Asia/Vientiane',
						'Asia/Vladivostok',
						'Asia/Yakutsk',
						'Asia/Yangon',
						'Asia/Yekaterinburg',
						'Asia/Yerevan',
						'Atlantic/Azores',
						'Atlantic/Bermuda',
						'Atlantic/Canary',
						'Atlantic/Cape_Verde',
						'Atlantic/Faeroe',
						'Atlantic/Faroe',
						'Atlantic/Jan_Mayen',
						'Atlantic/Madeira',
						'Atlantic/Reykjavik',
						'Atlantic/South_Georgia',
						'Atlantic/St_Helena',
						'Atlantic/Stanley',
						'Australia/ACT',
						'Australia/Adelaide',
						'Australia/Brisbane',
						'Australia/Broken_Hill',
						'Australia/Canberra',
						'Australia/Currie',
						'Australia/Darwin',
						'Australia/Eucla',
						'Australia/Hobart',
						'Australia/LHI',
						'Australia/Lindeman',
						'Australia/Lord_Howe',
						'Australia/Melbourne',
						'Australia/NSW',
						'Australia/North',
						'Australia/Perth',
						'Australia/Queensland',
						'Australia/South',
						'Australia/Sydney',
						'Australia/Tasmania',
						'Australia/Victoria',
						'Australia/West',
						'Australia/Yancowinna',
						'Brazil/Acre',
						'Brazil/DeNoronha',
						'Brazil/East',
						'Brazil/West',
						'CET',
						'CST6CDT',
						'Canada/Atlantic',
						'Canada/Central',
						'Canada/Eastern',
						'Canada/Mountain',
						'Canada/Newfoundland',
						'Canada/Pacific',
						'Canada/Saskatchewan',
						'Canada/Yukon',
						'Chile/Continental',
						'Chile/EasterIsland',
						'Cuba',
						'EET',
						'EST',
						'EST5EDT',
						'Egypt',
						'Eire',
						'Etc/GMT',
						'Etc/GMT+0',
						'Etc/GMT+1',
						'Etc/GMT+10',
						'Etc/GMT+11',
						'Etc/GMT+12',
						'Etc/GMT+2',
						'Etc/GMT+3',
						'Etc/GMT+4',
						'Etc/GMT+5',
						'Etc/GMT+6',
						'Etc/GMT+7',
						'Etc/GMT+8',
						'Etc/GMT+9',
						'Etc/GMT-0',
						'Etc/GMT-1',
						'Etc/GMT-10',
						'Etc/GMT-11',
						'Etc/GMT-12',
						'Etc/GMT-13',
						'Etc/GMT-14',
						'Etc/GMT-2',
						'Etc/GMT-3',
						'Etc/GMT-4',
						'Etc/GMT-5',
						'Etc/GMT-6',
						'Etc/GMT-7',
						'Etc/GMT-8',
						'Etc/GMT-9',
						'Etc/GMT0',
						'Etc/Greenwich',
						'Etc/UCT',
						'Etc/UTC',
						'Etc/Universal',
						'Etc/Zulu',
						'Europe/Amsterdam',
						'Europe/Andorra',
						'Europe/Astrakhan',
						'Europe/Athens',
						'Europe/Belfast',
						'Europe/Belgrade',
						'Europe/Berlin',
						'Europe/Bratislava',
						'Europe/Brussels',
						'Europe/Bucharest',
						'Europe/Budapest',
						'Europe/Busingen',
						'Europe/Chisinau',
						'Europe/Copenhagen',
						'Europe/Dublin',
						'Europe/Gibraltar',
						'Europe/Guernsey',
						'Europe/Helsinki',
						'Europe/Isle_of_Man',
						'Europe/Istanbul',
						'Europe/Jersey',
						'Europe/Kaliningrad',
						'Europe/Kiev',
						'Europe/Kirov',
						'Europe/Kyiv',
						'Europe/Lisbon',
						'Europe/Ljubljana',
						'Europe/London',
						'Europe/Luxembourg',
						'Europe/Madrid',
						'Europe/Malta',
						'Europe/Mariehamn',
						'Europe/Minsk',
						'Europe/Monaco',
						'Europe/Moscow',
						'Europe/Nicosia',
						'Europe/Oslo',
						'Europe/Paris',
						'Europe/Podgorica',
						'Europe/Prague',
						'Europe/Riga',
						'Europe/Rome',
						'Europe/Samara',
						'Europe/San_Marino',
						'Europe/Sarajevo',
						'Europe/Saratov',
						'Europe/Simferopol',
						'Europe/Skopje',
						'Europe/Sofia',
						'Europe/Stockholm',
						'Europe/Tallinn',
						'Europe/Tirane',
						'Europe/Tiraspol',
						'Europe/Ulyanovsk',
						'Europe/Uzhgorod',
						'Europe/Vaduz',
						'Europe/Vatican',
						'Europe/Vienna',
						'Europe/Vilnius',
						'Europe/Volgograd',
						'Europe/Warsaw',
						'Europe/Zagreb',
						'Europe/Zaporozhye',
						'Europe/Zurich',
						'GB',
						'GB-Eire',
						'GMT',
						'GMT+0',
						'GMT-0',
						'GMT0',
						'Greenwich',
						'HST',
						'Hongkong',
						'Iceland',
						'Indian/Antananarivo',
						'Indian/Chagos',
						'Indian/Christmas',
						'Indian/Cocos',
						'Indian/Comoro',
						'Indian/Kerguelen',
						'Indian/Mahe',
						'Indian/Maldives',
						'Indian/Mauritius',
						'Indian/Mayotte',
						'Indian/Reunion',
						'Iran',
						'Israel',
						'Jamaica',
						'Japan',
						'Kwajalein',
						'Libya',
						'MET',
						'MST',
						'MST7MDT',
						'Mexico/BajaNorte',
						'Mexico/BajaSur',
						'Mexico/General',
						'NZ',
						'NZ-CHAT',
						'Navajo',
						'PRC',
						'PST8PDT',
						'Pacific/Apia',
						'Pacific/Auckland',
						'Pacific/Bougainville',
						'Pacific/Chatham',
						'Pacific/Chuuk',
						'Pacific/Easter',
						'Pacific/Efate',
						'Pacific/Enderbury',
						'Pacific/Fakaofo',
						'Pacific/Fiji',
						'Pacific/Funafuti',
						'Pacific/Galapagos',
						'Pacific/Gambier',
						'Pacific/Guadalcanal',
						'Pacific/Guam',
						'Pacific/Honolulu',
						'Pacific/Johnston',
						'Pacific/Kanton',
						'Pacific/Kiritimati',
						'Pacific/Kosrae',
						'Pacific/Kwajalein',
						'Pacific/Majuro',
						'Pacific/Marquesas',
						'Pacific/Midway',
						'Pacific/Nauru',
						'Pacific/Niue',
						'Pacific/Norfolk',
						'Pacific/Noumea',
						'Pacific/Pago_Pago',
						'Pacific/Palau',
						'Pacific/Pitcairn',
						'Pacific/Pohnpei',
						'Pacific/Ponape',
						'Pacific/Port_Moresby',
						'Pacific/Rarotonga',
						'Pacific/Saipan',
						'Pacific/Samoa',
						'Pacific/Tahiti',
						'Pacific/Tarawa',
						'Pacific/Tongatapu',
						'Pacific/Truk',
						'Pacific/Wake',
						'Pacific/Wallis',
						'Pacific/Yap',
						'Poland',
						'Portugal',
						'ROC',
						'ROK',
						'Singapore',
						'Turkey',
						'UCT',
						'US/Alaska',
						'US/Aleutian',
						'US/Arizona',
						'US/Central',
						'US/East-Indiana',
						'US/Eastern',
						'US/Hawaii',
						'US/Indiana-Starke',
						'US/Michigan',
						'US/Mountain',
						'US/Pacific',
						'US/Samoa',
						'UTC',
						'Universal',
						'W-SU',
						'WET',
						'Zulu',
					])
					.optional(),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingTicketAssignmentTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				assignment_channels: z
					.array(
						z.enum([
							'google-business-messages',
							'tiktok-shop',
							'aircall',
							'api',
							'chat',
							'contact_form',
							'email',
							'facebook',
							'facebook-mention',
							'facebook-messenger',
							'facebook-recommendations',
							'help-center',
							'instagram-ad-comment',
							'instagram-comment',
							'instagram-mention',
							'instagram-direct-message',
							'internal-note',
							'phone',
							'sms',
							'twitter',
							'twitter-direct-message',
							'yotpo-review',
							'whatsapp',
							'custom-chat',
						]),
					)
					.optional(),
				auto_assign_to_teams: z.boolean().optional(),
				unassign_on_reply: z.boolean().optional(),
				unassign_on_user_unavailability: z.array(z.enum(['chat'])).optional(),
				can_exceed_max_agent_capacity: z.boolean().optional(),
				auto_assign_ticket_to_responding_agent: z.boolean().optional(),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingViewsOrderingTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				views: z.record(z.string(), z.json()),
				view_sections: z.record(z.string(), z.json()),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingAccessTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				signup_mode: z.enum(['invite', 'allowed-domains']),
				allowed_domains: z.array(z.string()).optional(),
				google_sso_enabled: z.boolean().optional(),
				office365_sso_enabled: z.boolean().optional(),
				two_fa_enforced_datetime: z.string().nullable().optional(),
				skip_2fa_after_sso_datetime: z.string().nullable().optional(),
				sso_enforced_datetime: z.string().nullable().optional(),
				custom_sso_providers: z
					.record(
						z.string(),
						z
							.object({
								name: z.string().min(1),
								client_id: z.string().min(1),
								client_secret: z.string().min(1),
								server_metadata_url: z.string(),
							})
							.strict(),
					)
					.optional(),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingViewsVisibilityTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				hidden_views: z.array(z.number().int().min(1)),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingAgentsTableConfigTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				active_view: z.string().max(64),
				views: z
					.array(
						z
							.object({
								id: z.string().max(64),
								name: z.string().min(0).max(256),
								metrics: z
									.array(
										z
											.object({
												id: z.string().max(64),
												visibility: z.boolean().nullable(),
											})
											.strict(),
									)
									.max(64),
								rows: z.record(z.string(), z.json()).optional(),
							})
							.strict(),
					)
					.max(8),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingAgentsAvailabilityTableConfigTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				active_view: z.string().max(64),
				views: z
					.array(
						z
							.object({
								id: z.string().max(64),
								name: z.string().min(0).max(256),
								metrics: z
									.array(
										z
											.object({
												id: z.string().max(64),
												visibility: z.boolean().nullable(),
											})
											.strict(),
									)
									.max(64),
								rows: z.record(z.string(), z.json()).optional(),
							})
							.strict(),
					)
					.max(8),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingChannelsTableConfigTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				active_view: z.string().max(64),
				views: z
					.array(
						z
							.object({
								id: z.string().max(64),
								name: z.string().min(0).max(256),
								metrics: z
									.array(
										z
											.object({
												id: z.string().max(64),
												visibility: z.boolean().nullable(),
											})
											.strict(),
									)
									.max(64),
								rows: z.record(z.string(), z.json()).optional(),
							})
							.strict(),
					)
					.max(8),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingProductInsightsTableConfigTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				active_view: z.string().max(64),
				views: z
					.array(
						z
							.object({
								id: z.string().max(64),
								name: z.string().min(0).max(256),
								metrics: z
									.array(
										z
											.object({
												id: z.string().max(64),
												visibility: z.boolean().nullable(),
											})
											.strict(),
									)
									.max(64),
								rows: z.record(z.string(), z.json()).optional(),
							})
							.strict(),
					)
					.max(8),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingInTicketSuggestionTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				is_demo_hidden: z.boolean().nullable(),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingAgentCostsTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				agent_cost_type: z.enum(['yearly', 'hourly']),
				agent_cost_per_ticket: z.number().min(0),
				agent_ticket_per_hour: z.number().min(0).nullable().optional(),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingLimitsTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				max_integrations: z.number().int().min(0).optional(),
				max_active_rules: z.number().int().min(0).optional(),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const AccountSettingDefaultIntegrationTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z.record(z.string(), z.json()),
		type: z.string(),
	})
	.strict();
const AccountSettingBillingProductHardLimitsTypedSchema = z
	.object({
		id: z.number().int().optional(),
		data: z
			.object({
				gaia: z.number().int().min(0).nullable(),
			})
			.strict(),
		type: z.string(),
	})
	.strict();
const BooleanDropdownInputSettingsSchema = z
	.object({
		input_type: z.literal('dropdown'),
		choices: z.array(z.boolean()).optional(),
		default: z.boolean().optional(),
	})
	.strict();
const BooleanDataTypeDefinitionSchema = z
	.object({
		data_type: z.literal('boolean'),
		input_settings: z.union([BooleanDropdownInputSettingsSchema]),
	})
	.strict();
const DropdownInputSettingsSettingsSchema = z
	.object({
		input_type: z.literal('dropdown'),
		choices: z.array(z.string()).max(2000),
		default: z.string().optional(),
	})
	.strict();
const ManagedCustomerFieldTypeSchema = z.literal('customer_type');
const NumberInputSettingsSchema = z
	.object({
		input_type: z.literal('input_number'),
		placeholder: z.string().min(0).max(1024).optional(),
		min: z.union([z.number(), z.string()]).optional(),
		max: z.union([z.number(), z.string()]).optional(),
	})
	.strict();
const NumberDataTypeDefinitionSchema = z
	.object({
		data_type: z.literal('number'),
		input_settings: z.union([NumberInputSettingsSchema]),
	})
	.strict();
const ObjectTypeSchema = z.enum(['Ticket', 'Customer']);
const TextInputSettingsSchema = z
	.object({
		input_type: z.literal('input'),
		placeholder: z.string().min(0).max(1024).optional(),
	})
	.strict();
const TextDataTypeDefinitionSchema = z
	.object({
		data_type: z.literal('text'),
		input_settings: z.union([
			TextInputSettingsSchema,
			DropdownInputSettingsSettingsSchema,
		]),
	})
	.strict();
const ManagedTicketFieldTypeSchema = z.enum([
	'contact_reason',
	'product',
	'resolution',
	'ai_intent',
	'ai_outcome',
	'ai_sales',
	'ai_discount',
	'ai_journey',
	'managed_sentiment',
	'call_status',
]);
const RequirementTypeSchema = z.enum(['visible', 'required', 'conditional']);
const CreateCustomFieldSchema = z
	.object({
		external_id: z.string().optional(),
		object_type: ObjectTypeSchema,
		label: z.string().min(1).max(255),
		description: z.string().min(0).max(1024).optional(),
		priority: z.number().int().min(0).max(5000).optional(),
		required: z.boolean().optional(),
		requirement_type: RequirementTypeSchema.optional(),
		managed_type: z
			.union([ManagedTicketFieldTypeSchema, ManagedCustomerFieldTypeSchema])
			.optional(),
		definition: z.union([
			TextDataTypeDefinitionSchema,
			NumberDataTypeDefinitionSchema,
			BooleanDataTypeDefinitionSchema,
		]),
		deactivated_datetime: z.string().optional(),
	})
	.strict();
const CustomFieldSchema = z
	.object({
		id: z.number().int(),
		external_id: z.string().optional(),
		object_type: ObjectTypeSchema,
		label: z.string().min(0).max(255),
		description: z.string().min(0).max(1024).optional(),
		priority: z.number().int().min(0),
		required: z.boolean(),
		requirement_type: RequirementTypeSchema,
		managed_type: z
			.union([ManagedTicketFieldTypeSchema, ManagedCustomerFieldTypeSchema])
			.optional(),
		definition: z.union([
			TextDataTypeDefinitionSchema,
			NumberDataTypeDefinitionSchema,
			BooleanDataTypeDefinitionSchema,
		]),
		created_datetime: z.string(),
		updated_datetime: z.string(),
		deactivated_datetime: z.string().optional(),
	})
	.strict();
const CustomerSchema = z
	.object({
		id: z.number().int().optional(),
		channels: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
					})
					.strict(),
			)
			.optional(),
		created_datetime: z.string().nullable().optional(),
		email: z.string().email().nullable().optional(),
		external_id: z.string().nullable().optional(),
		firstname: z.string().optional(),
		integrations: z.record(z.string(), z.json()).optional(),
		language: z
			.enum([
				'aa',
				'ab',
				'af',
				'ak',
				'sq',
				'am',
				'ar',
				'an',
				'hy',
				'as',
				'av',
				'ae',
				'ay',
				'az',
				'ba',
				'bm',
				'eu',
				'be',
				'bn',
				'bh',
				'bi',
				'bs',
				'br',
				'bg',
				'my',
				'ca',
				'ch',
				'ce',
				'zh',
				'cu',
				'cv',
				'kw',
				'co',
				'cr',
				'cs',
				'da',
				'dv',
				'nl',
				'dz',
				'en',
				'eo',
				'et',
				'ee',
				'fo',
				'fj',
				'fi',
				'fr',
				'fy',
				'ff',
				'ka',
				'de',
				'gd',
				'ga',
				'gl',
				'gv',
				'el',
				'gn',
				'gu',
				'ht',
				'ha',
				'he',
				'hz',
				'hi',
				'ho',
				'hr',
				'hu',
				'ig',
				'is',
				'io',
				'ii',
				'iu',
				'ie',
				'ia',
				'id',
				'ik',
				'it',
				'jv',
				'ja',
				'kl',
				'kn',
				'ks',
				'kr',
				'kk',
				'km',
				'ki',
				'rw',
				'ky',
				'kv',
				'kg',
				'ko',
				'kj',
				'ku',
				'lo',
				'la',
				'lv',
				'li',
				'ln',
				'lt',
				'lb',
				'lu',
				'lg',
				'mk',
				'mh',
				'ml',
				'mi',
				'mr',
				'ms',
				'mg',
				'mt',
				'mn',
				'na',
				'nv',
				'nr',
				'nd',
				'ng',
				'ne',
				'nn',
				'nb',
				'no',
				'ny',
				'oc',
				'oj',
				'or',
				'om',
				'os',
				'pa',
				'fa',
				'pi',
				'pl',
				'pt',
				'ps',
				'qu',
				'rc',
				'rm',
				'ro',
				'rn',
				'ru',
				'sg',
				'sa',
				'si',
				'sk',
				'sl',
				'se',
				'sm',
				'sn',
				'sd',
				'so',
				'st',
				'es',
				'sc',
				'sr',
				'ss',
				'su',
				'sw',
				'sv',
				'ty',
				'ta',
				'tt',
				'te',
				'tg',
				'tl',
				'th',
				'bo',
				'ti',
				'to',
				'tn',
				'ts',
				'tk',
				'tr',
				'tw',
				'ug',
				'uk',
				'ur',
				'uz',
				've',
				'vi',
				'vo',
				'cy',
				'wa',
				'wo',
				'xh',
				'yi',
				'yo',
				'za',
				'zu',
			])
			.optional(),
		lastname: z.string().optional(),
		name: z.string().nullable().optional(),
		note: z.string().nullable().optional(),
		timezone: z
			.enum([
				'Africa/Abidjan',
				'Africa/Accra',
				'Africa/Addis_Ababa',
				'Africa/Algiers',
				'Africa/Asmara',
				'Africa/Asmera',
				'Africa/Bamako',
				'Africa/Bangui',
				'Africa/Banjul',
				'Africa/Bissau',
				'Africa/Blantyre',
				'Africa/Brazzaville',
				'Africa/Bujumbura',
				'Africa/Cairo',
				'Africa/Casablanca',
				'Africa/Ceuta',
				'Africa/Conakry',
				'Africa/Dakar',
				'Africa/Dar_es_Salaam',
				'Africa/Djibouti',
				'Africa/Douala',
				'Africa/El_Aaiun',
				'Africa/Freetown',
				'Africa/Gaborone',
				'Africa/Harare',
				'Africa/Johannesburg',
				'Africa/Juba',
				'Africa/Kampala',
				'Africa/Khartoum',
				'Africa/Kigali',
				'Africa/Kinshasa',
				'Africa/Lagos',
				'Africa/Libreville',
				'Africa/Lome',
				'Africa/Luanda',
				'Africa/Lubumbashi',
				'Africa/Lusaka',
				'Africa/Malabo',
				'Africa/Maputo',
				'Africa/Maseru',
				'Africa/Mbabane',
				'Africa/Mogadishu',
				'Africa/Monrovia',
				'Africa/Nairobi',
				'Africa/Ndjamena',
				'Africa/Niamey',
				'Africa/Nouakchott',
				'Africa/Ouagadougou',
				'Africa/Porto-Novo',
				'Africa/Sao_Tome',
				'Africa/Timbuktu',
				'Africa/Tripoli',
				'Africa/Tunis',
				'Africa/Windhoek',
				'America/Adak',
				'America/Anchorage',
				'America/Anguilla',
				'America/Antigua',
				'America/Araguaina',
				'America/Argentina/Buenos_Aires',
				'America/Argentina/Catamarca',
				'America/Argentina/ComodRivadavia',
				'America/Argentina/Cordoba',
				'America/Argentina/Jujuy',
				'America/Argentina/La_Rioja',
				'America/Argentina/Mendoza',
				'America/Argentina/Rio_Gallegos',
				'America/Argentina/Salta',
				'America/Argentina/San_Juan',
				'America/Argentina/San_Luis',
				'America/Argentina/Tucuman',
				'America/Argentina/Ushuaia',
				'America/Aruba',
				'America/Asuncion',
				'America/Atikokan',
				'America/Atka',
				'America/Bahia',
				'America/Bahia_Banderas',
				'America/Barbados',
				'America/Belem',
				'America/Belize',
				'America/Blanc-Sablon',
				'America/Boa_Vista',
				'America/Bogota',
				'America/Boise',
				'America/Buenos_Aires',
				'America/Cambridge_Bay',
				'America/Campo_Grande',
				'America/Cancun',
				'America/Caracas',
				'America/Catamarca',
				'America/Cayenne',
				'America/Cayman',
				'America/Chicago',
				'America/Chihuahua',
				'America/Ciudad_Juarez',
				'America/Coral_Harbour',
				'America/Cordoba',
				'America/Costa_Rica',
				'America/Coyhaique',
				'America/Creston',
				'America/Cuiaba',
				'America/Curacao',
				'America/Danmarkshavn',
				'America/Dawson',
				'America/Dawson_Creek',
				'America/Denver',
				'America/Detroit',
				'America/Dominica',
				'America/Edmonton',
				'America/Eirunepe',
				'America/El_Salvador',
				'America/Ensenada',
				'America/Fort_Nelson',
				'America/Fort_Wayne',
				'America/Fortaleza',
				'America/Glace_Bay',
				'America/Godthab',
				'America/Goose_Bay',
				'America/Grand_Turk',
				'America/Grenada',
				'America/Guadeloupe',
				'America/Guatemala',
				'America/Guayaquil',
				'America/Guyana',
				'America/Halifax',
				'America/Havana',
				'America/Hermosillo',
				'America/Indiana/Indianapolis',
				'America/Indiana/Knox',
				'America/Indiana/Marengo',
				'America/Indiana/Petersburg',
				'America/Indiana/Tell_City',
				'America/Indiana/Vevay',
				'America/Indiana/Vincennes',
				'America/Indiana/Winamac',
				'America/Indianapolis',
				'America/Inuvik',
				'America/Iqaluit',
				'America/Jamaica',
				'America/Jujuy',
				'America/Juneau',
				'America/Kentucky/Louisville',
				'America/Kentucky/Monticello',
				'America/Knox_IN',
				'America/Kralendijk',
				'America/La_Paz',
				'America/Lima',
				'America/Los_Angeles',
				'America/Louisville',
				'America/Lower_Princes',
				'America/Maceio',
				'America/Managua',
				'America/Manaus',
				'America/Marigot',
				'America/Martinique',
				'America/Matamoros',
				'America/Mazatlan',
				'America/Mendoza',
				'America/Menominee',
				'America/Merida',
				'America/Metlakatla',
				'America/Mexico_City',
				'America/Miquelon',
				'America/Moncton',
				'America/Monterrey',
				'America/Montevideo',
				'America/Montreal',
				'America/Montserrat',
				'America/Nassau',
				'America/New_York',
				'America/Nipigon',
				'America/Nome',
				'America/Noronha',
				'America/North_Dakota/Beulah',
				'America/North_Dakota/Center',
				'America/North_Dakota/New_Salem',
				'America/Nuuk',
				'America/Ojinaga',
				'America/Panama',
				'America/Pangnirtung',
				'America/Paramaribo',
				'America/Phoenix',
				'America/Port-au-Prince',
				'America/Port_of_Spain',
				'America/Porto_Acre',
				'America/Porto_Velho',
				'America/Puerto_Rico',
				'America/Punta_Arenas',
				'America/Rainy_River',
				'America/Rankin_Inlet',
				'America/Recife',
				'America/Regina',
				'America/Resolute',
				'America/Rio_Branco',
				'America/Rosario',
				'America/Santa_Isabel',
				'America/Santarem',
				'America/Santiago',
				'America/Santo_Domingo',
				'America/Sao_Paulo',
				'America/Scoresbysund',
				'America/Shiprock',
				'America/Sitka',
				'America/St_Barthelemy',
				'America/St_Johns',
				'America/St_Kitts',
				'America/St_Lucia',
				'America/St_Thomas',
				'America/St_Vincent',
				'America/Swift_Current',
				'America/Tegucigalpa',
				'America/Thule',
				'America/Thunder_Bay',
				'America/Tijuana',
				'America/Toronto',
				'America/Tortola',
				'America/Vancouver',
				'America/Virgin',
				'America/Whitehorse',
				'America/Winnipeg',
				'America/Yakutat',
				'America/Yellowknife',
				'Antarctica/Casey',
				'Antarctica/Davis',
				'Antarctica/DumontDUrville',
				'Antarctica/Macquarie',
				'Antarctica/Mawson',
				'Antarctica/McMurdo',
				'Antarctica/Palmer',
				'Antarctica/Rothera',
				'Antarctica/South_Pole',
				'Antarctica/Syowa',
				'Antarctica/Troll',
				'Antarctica/Vostok',
				'Arctic/Longyearbyen',
				'Asia/Aden',
				'Asia/Almaty',
				'Asia/Amman',
				'Asia/Anadyr',
				'Asia/Aqtau',
				'Asia/Aqtobe',
				'Asia/Ashgabat',
				'Asia/Ashkhabad',
				'Asia/Atyrau',
				'Asia/Baghdad',
				'Asia/Bahrain',
				'Asia/Baku',
				'Asia/Bangkok',
				'Asia/Barnaul',
				'Asia/Beirut',
				'Asia/Bishkek',
				'Asia/Brunei',
				'Asia/Calcutta',
				'Asia/Chita',
				'Asia/Choibalsan',
				'Asia/Chongqing',
				'Asia/Chungking',
				'Asia/Colombo',
				'Asia/Dacca',
				'Asia/Damascus',
				'Asia/Dhaka',
				'Asia/Dili',
				'Asia/Dubai',
				'Asia/Dushanbe',
				'Asia/Famagusta',
				'Asia/Gaza',
				'Asia/Harbin',
				'Asia/Hebron',
				'Asia/Ho_Chi_Minh',
				'Asia/Hong_Kong',
				'Asia/Hovd',
				'Asia/Irkutsk',
				'Asia/Istanbul',
				'Asia/Jakarta',
				'Asia/Jayapura',
				'Asia/Jerusalem',
				'Asia/Kabul',
				'Asia/Kamchatka',
				'Asia/Karachi',
				'Asia/Kashgar',
				'Asia/Kathmandu',
				'Asia/Katmandu',
				'Asia/Khandyga',
				'Asia/Kolkata',
				'Asia/Krasnoyarsk',
				'Asia/Kuala_Lumpur',
				'Asia/Kuching',
				'Asia/Kuwait',
				'Asia/Macao',
				'Asia/Macau',
				'Asia/Magadan',
				'Asia/Makassar',
				'Asia/Manila',
				'Asia/Muscat',
				'Asia/Nicosia',
				'Asia/Novokuznetsk',
				'Asia/Novosibirsk',
				'Asia/Omsk',
				'Asia/Oral',
				'Asia/Phnom_Penh',
				'Asia/Pontianak',
				'Asia/Pyongyang',
				'Asia/Qatar',
				'Asia/Qostanay',
				'Asia/Qyzylorda',
				'Asia/Rangoon',
				'Asia/Riyadh',
				'Asia/Saigon',
				'Asia/Sakhalin',
				'Asia/Samarkand',
				'Asia/Seoul',
				'Asia/Shanghai',
				'Asia/Singapore',
				'Asia/Srednekolymsk',
				'Asia/Taipei',
				'Asia/Tashkent',
				'Asia/Tbilisi',
				'Asia/Tehran',
				'Asia/Tel_Aviv',
				'Asia/Thimbu',
				'Asia/Thimphu',
				'Asia/Tokyo',
				'Asia/Tomsk',
				'Asia/Ujung_Pandang',
				'Asia/Ulaanbaatar',
				'Asia/Ulan_Bator',
				'Asia/Urumqi',
				'Asia/Ust-Nera',
				'Asia/Vientiane',
				'Asia/Vladivostok',
				'Asia/Yakutsk',
				'Asia/Yangon',
				'Asia/Yekaterinburg',
				'Asia/Yerevan',
				'Atlantic/Azores',
				'Atlantic/Bermuda',
				'Atlantic/Canary',
				'Atlantic/Cape_Verde',
				'Atlantic/Faeroe',
				'Atlantic/Faroe',
				'Atlantic/Jan_Mayen',
				'Atlantic/Madeira',
				'Atlantic/Reykjavik',
				'Atlantic/South_Georgia',
				'Atlantic/St_Helena',
				'Atlantic/Stanley',
				'Australia/ACT',
				'Australia/Adelaide',
				'Australia/Brisbane',
				'Australia/Broken_Hill',
				'Australia/Canberra',
				'Australia/Currie',
				'Australia/Darwin',
				'Australia/Eucla',
				'Australia/Hobart',
				'Australia/LHI',
				'Australia/Lindeman',
				'Australia/Lord_Howe',
				'Australia/Melbourne',
				'Australia/NSW',
				'Australia/North',
				'Australia/Perth',
				'Australia/Queensland',
				'Australia/South',
				'Australia/Sydney',
				'Australia/Tasmania',
				'Australia/Victoria',
				'Australia/West',
				'Australia/Yancowinna',
				'Brazil/Acre',
				'Brazil/DeNoronha',
				'Brazil/East',
				'Brazil/West',
				'CET',
				'CST6CDT',
				'Canada/Atlantic',
				'Canada/Central',
				'Canada/Eastern',
				'Canada/Mountain',
				'Canada/Newfoundland',
				'Canada/Pacific',
				'Canada/Saskatchewan',
				'Canada/Yukon',
				'Chile/Continental',
				'Chile/EasterIsland',
				'Cuba',
				'EET',
				'EST',
				'EST5EDT',
				'Egypt',
				'Eire',
				'Etc/GMT',
				'Etc/GMT+0',
				'Etc/GMT+1',
				'Etc/GMT+10',
				'Etc/GMT+11',
				'Etc/GMT+12',
				'Etc/GMT+2',
				'Etc/GMT+3',
				'Etc/GMT+4',
				'Etc/GMT+5',
				'Etc/GMT+6',
				'Etc/GMT+7',
				'Etc/GMT+8',
				'Etc/GMT+9',
				'Etc/GMT-0',
				'Etc/GMT-1',
				'Etc/GMT-10',
				'Etc/GMT-11',
				'Etc/GMT-12',
				'Etc/GMT-13',
				'Etc/GMT-14',
				'Etc/GMT-2',
				'Etc/GMT-3',
				'Etc/GMT-4',
				'Etc/GMT-5',
				'Etc/GMT-6',
				'Etc/GMT-7',
				'Etc/GMT-8',
				'Etc/GMT-9',
				'Etc/GMT0',
				'Etc/Greenwich',
				'Etc/UCT',
				'Etc/UTC',
				'Etc/Universal',
				'Etc/Zulu',
				'Europe/Amsterdam',
				'Europe/Andorra',
				'Europe/Astrakhan',
				'Europe/Athens',
				'Europe/Belfast',
				'Europe/Belgrade',
				'Europe/Berlin',
				'Europe/Bratislava',
				'Europe/Brussels',
				'Europe/Bucharest',
				'Europe/Budapest',
				'Europe/Busingen',
				'Europe/Chisinau',
				'Europe/Copenhagen',
				'Europe/Dublin',
				'Europe/Gibraltar',
				'Europe/Guernsey',
				'Europe/Helsinki',
				'Europe/Isle_of_Man',
				'Europe/Istanbul',
				'Europe/Jersey',
				'Europe/Kaliningrad',
				'Europe/Kiev',
				'Europe/Kirov',
				'Europe/Kyiv',
				'Europe/Lisbon',
				'Europe/Ljubljana',
				'Europe/London',
				'Europe/Luxembourg',
				'Europe/Madrid',
				'Europe/Malta',
				'Europe/Mariehamn',
				'Europe/Minsk',
				'Europe/Monaco',
				'Europe/Moscow',
				'Europe/Nicosia',
				'Europe/Oslo',
				'Europe/Paris',
				'Europe/Podgorica',
				'Europe/Prague',
				'Europe/Riga',
				'Europe/Rome',
				'Europe/Samara',
				'Europe/San_Marino',
				'Europe/Sarajevo',
				'Europe/Saratov',
				'Europe/Simferopol',
				'Europe/Skopje',
				'Europe/Sofia',
				'Europe/Stockholm',
				'Europe/Tallinn',
				'Europe/Tirane',
				'Europe/Tiraspol',
				'Europe/Ulyanovsk',
				'Europe/Uzhgorod',
				'Europe/Vaduz',
				'Europe/Vatican',
				'Europe/Vienna',
				'Europe/Vilnius',
				'Europe/Volgograd',
				'Europe/Warsaw',
				'Europe/Zagreb',
				'Europe/Zaporozhye',
				'Europe/Zurich',
				'GB',
				'GB-Eire',
				'GMT',
				'GMT+0',
				'GMT-0',
				'GMT0',
				'Greenwich',
				'HST',
				'Hongkong',
				'Iceland',
				'Indian/Antananarivo',
				'Indian/Chagos',
				'Indian/Christmas',
				'Indian/Cocos',
				'Indian/Comoro',
				'Indian/Kerguelen',
				'Indian/Mahe',
				'Indian/Maldives',
				'Indian/Mauritius',
				'Indian/Mayotte',
				'Indian/Reunion',
				'Iran',
				'Israel',
				'Jamaica',
				'Japan',
				'Kwajalein',
				'Libya',
				'MET',
				'MST',
				'MST7MDT',
				'Mexico/BajaNorte',
				'Mexico/BajaSur',
				'Mexico/General',
				'NZ',
				'NZ-CHAT',
				'Navajo',
				'PRC',
				'PST8PDT',
				'Pacific/Apia',
				'Pacific/Auckland',
				'Pacific/Bougainville',
				'Pacific/Chatham',
				'Pacific/Chuuk',
				'Pacific/Easter',
				'Pacific/Efate',
				'Pacific/Enderbury',
				'Pacific/Fakaofo',
				'Pacific/Fiji',
				'Pacific/Funafuti',
				'Pacific/Galapagos',
				'Pacific/Gambier',
				'Pacific/Guadalcanal',
				'Pacific/Guam',
				'Pacific/Honolulu',
				'Pacific/Johnston',
				'Pacific/Kanton',
				'Pacific/Kiritimati',
				'Pacific/Kosrae',
				'Pacific/Kwajalein',
				'Pacific/Majuro',
				'Pacific/Marquesas',
				'Pacific/Midway',
				'Pacific/Nauru',
				'Pacific/Niue',
				'Pacific/Norfolk',
				'Pacific/Noumea',
				'Pacific/Pago_Pago',
				'Pacific/Palau',
				'Pacific/Pitcairn',
				'Pacific/Pohnpei',
				'Pacific/Ponape',
				'Pacific/Port_Moresby',
				'Pacific/Rarotonga',
				'Pacific/Saipan',
				'Pacific/Samoa',
				'Pacific/Tahiti',
				'Pacific/Tarawa',
				'Pacific/Tongatapu',
				'Pacific/Truk',
				'Pacific/Wake',
				'Pacific/Wallis',
				'Pacific/Yap',
				'Poland',
				'Portugal',
				'ROC',
				'ROK',
				'Singapore',
				'Turkey',
				'UCT',
				'US/Alaska',
				'US/Aleutian',
				'US/Arizona',
				'US/Central',
				'US/East-Indiana',
				'US/Eastern',
				'US/Hawaii',
				'US/Indiana-Starke',
				'US/Michigan',
				'US/Mountain',
				'US/Pacific',
				'US/Samoa',
				'UTC',
				'Universal',
				'W-SU',
				'WET',
				'Zulu',
			])
			.optional(),
		updated_datetime: z.string().nullable().optional(),
	})
	.strict();
const IntegrationSchema = z
	.object({
		id: z.number().int().optional(),
		created_datetime: z.string().nullable().optional(),
		deactivated_datetime: z.string().nullable().optional(),
		description: z.string().nullable().nullable().optional(),
		http: z
			.object({
				form: z.null().optional(),
				method: z
					.enum(['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'])
					.optional(),
				request_content_type: z
					.enum(['application/json', 'application/x-www-form-urlencoded'])
					.optional(),
				response_content_type: z.enum(['application/json']).optional(),
				triggers: z
					.object({
						'ticket-created': z.boolean().optional(),
						'ticket-updated': z.boolean().optional(),
						'ticket-message-created': z.boolean().optional(),
						'ticket-self-unsnoozed': z.boolean().optional(),
						'ticket-message-failed': z.boolean().optional(),
						'ticket-assignment-updated': z.boolean().optional(),
						'ticket-status-updated': z.boolean().optional(),
						'ticket-handed-over': z.boolean().optional(),
					})
					.strict()
					.optional(),
				url: z.string(),
				oauth2: z.null().optional(),
			})
			.strict()
			.optional(),
		name: z.string(),
		type: z.enum(['http']).optional(),
		updated_datetime: z.string().nullable().optional(),
		user: z
			.object({
				id: z.number().int().optional(),
			})
			.strict()
			.optional(),
		uri: z.string().optional(),
		application_id: z.string().nullable().optional(),
		managed: z.boolean().optional(),
		business_hours_id: z.number().int().nullable().optional(),
	})
	.strict();
const JobSchema = z
	.object({
		id: z.number().int().optional(),
		cancel_requested_datetime: z.string().nullable().optional(),
		cancelled_datetime: z.string().nullable().optional(),
		created_datetime: z.string().nullable().optional(),
		ended_datetime: z.string().nullable().optional(),
		failed_datetime: z.string().nullable().optional(),
		info: z.record(z.string(), z.json()).optional(),
		locked_datetime: z.string().nullable().optional(),
		meta: z.record(z.string(), z.json()).nullable().optional(),
		params: z
			.object({
				apply_and_close: z.boolean().optional(),
				end_datetime: z.string().nullable().optional(),
				macro_id: z.number().int().optional(),
				start_datetime: z.string().nullable().optional(),
				ticket_ids: z.array(z.number().int()).optional(),
				url: z.string().optional(),
				updates: z.record(z.string(), z.json()).optional(),
				view: z.record(z.string(), z.json()).optional(),
				view_id: z.number().int().optional(),
				context: z.record(z.string(), z.json()).optional(),
			})
			.strict()
			.optional(),
		scheduled_datetime: z.string().nullable().optional(),
		started_datetime: z.string().nullable().optional(),
		status: z
			.enum([
				'cancel_requested',
				'canceled',
				'done',
				'errored',
				'fatal_errored',
				'pending',
				'running',
				'scheduled',
			])
			.optional(),
		type: z
			.enum([
				'applyMacro',
				'deleteTicket',
				'exportTicket',
				'importMacro',
				'exportMacro',
				'updateTicket',
				'exportTicketDrilldown',
				'exportConvertCampaignSalesDrilldown',
			])
			.optional(),
		user_id: z.number().int().optional(),
		uri: z.string().optional(),
	})
	.strict();
const MacroActionSchema = z
	.object({
		arguments: z.record(z.string(), z.json()),
		description: z.string().nullable().nullable().optional(),
		name: z.string(),
		title: z.string(),
		type: z.enum(['system', 'user']).optional(),
	})
	.strict();
const MacroSchema = z
	.object({
		id: z.number().int().optional(),
		external_id: z.string().nullable().optional(),
		name: z.string().optional(),
		intent: z
			.enum([
				'discount/request',
				'exchange/request',
				'exchange/status',
				'feedback',
				'order/damaged',
				'order/cancel',
				'order/change',
				'order/wrong',
				'other/no_reply',
				'other/question',
				'other/thanks',
				'product/recommendation',
				'product/question',
				'refund/request',
				'refund/status',
				'return/request',
				'return/status',
				'shipping/change',
				'shipping/delivery-issue',
				'shipping/policy',
				'shipping/status',
				'stock/request',
				'subscription/cancel',
				'subscription/change',
			])
			.optional(),
		language: z.string().nullable().optional(),
		usage: z.number().int().optional(),
		actions: z.array(MacroActionSchema).optional(),
		created_datetime: z.string().nullable().optional(),
		updated_datetime: z.string().nullable().optional(),
		archived_datetime: z.string().nullable().optional(),
		uri: z.string().optional(),
	})
	.strict();
const MetricFeedbackDisagreementTypeSchema = z.enum([
	'definition_unclear',
	'formula_seems_wrong',
	'edge_case_missing',
	'other',
]);
const MetricFeedbackRequestSchema = z
	.object({
		disagreement_type: MetricFeedbackDisagreementTypeSchema,
		metric_category: z.string().max(100),
		comment: z.string().max(5000).optional(),
	})
	.strict();
const MetricFeedbackResponseSchema = z
	.object({
		id: z.string(),
	})
	.strict();
const RuleSchema = z
	.object({
		id: z.number().int().optional(),
		code: z.string().optional(),
		code_ast: z.record(z.string(), z.json()).optional(),
		created_datetime: z.string().optional(),
		deactivated_datetime: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		event_types: z
			.enum([
				'ticket-created',
				'ticket-updated',
				'ticket-message-created',
				'ticket-assigned',
				'ticket-self-unsnoozed',
				'satisfaction-survey-responded',
			])
			.optional(),
		name: z.string().optional(),
		priority: z.number().int().optional(),
		updated_datetime: z.string().optional(),
		uri: z.string().optional(),
	})
	.strict();
const SatisfactionSurveySchema = z
	.object({
		id: z.number().int().optional(),
		body_text: z.string().max(1000).nullable().optional(),
		created_datetime: z.string().nullable().optional(),
		customer_id: z.number().int().optional(),
		meta: z.record(z.string(), z.json()).nullable().optional(),
		score: z.number().int().min(1).max(5).nullable().optional(),
		scored_datetime: z.string().nullable().optional(),
		sent_datetime: z.string().nullable().optional(),
		should_send_datetime: z.string().nullable().optional(),
		ticket_id: z.number().int().optional(),
		uri: z.string().optional(),
	})
	.strict();
const TagDecorationSchema = z
	.object({
		color: z.string().optional(),
	})
	.strict();
const TagSchema = z
	.object({
		id: z.number().int(),
		decoration: TagDecorationSchema,
		description: z.string(),
		name: z.string(),
		usage: z.number().int(),
		uri: z.string(),
		created_datetime: z.string(),
		deleted_datetime: z.string(),
	})
	.strict();
const TeamSchema = z
	.object({
		id: z.number().int().optional(),
		uri: z.string().optional(),
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		default_email_integration_id: z.number().int().min(1).nullable().optional(),
		decoration: z.record(z.string(), z.json()).nullable().optional(),
		members: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						name: z.string().nullable().optional(),
						email: z.string().email().max(320).nullable().optional(),
						meta: z.null().optional(),
					})
					.strict(),
			)
			.optional(),
		created_datetime: z.string().nullable().optional(),
	})
	.strict();
const LegacyChannelSlugSchema = z.enum([
	'aircall',
	'api',
	'chat',
	'contact_form',
	'email',
	'facebook',
	'facebook-mention',
	'facebook-messenger',
	'facebook-recommendations',
	'help-center',
	'instagram-ad-comment',
	'instagram-comment',
	'instagram-direct-message',
	'instagram-mention',
	'internal-note',
	'phone',
	'sms',
	'twitter',
	'twitter-direct-message',
	'whatsapp',
	'yotpo-review',
]);
const TicketViaSchema = z.enum([
	'aircall',
	'api',
	'chat',
	'contact_form',
	'email',
	'facebook',
	'facebook-mention',
	'facebook-messenger',
	'facebook-recommendations',
	'form',
	'gorgias_chat',
	'help-center',
	'helpdesk',
	'instagram',
	'instagram-ad-comment',
	'instagram-comment',
	'instagram-direct-message',
	'instagram-mention',
	'internal-note',
	'offline_capture',
	'phone',
	'rule',
	'self_service',
	'shopify',
	'sms',
	'twilio',
	'twitter',
	'twitter-direct-message',
	'whatsapp',
	'yotpo',
	'yotpo-review',
	'zendesk',
]);
const TicketMessageSourceTypeSchema = z.enum([
	'aircall',
	'api',
	'app',
	'custom-chat',
	'chat',
	'chat-contact-form',
	'chat-offline-capture',
	'contact-form',
	'email',
	'facebook',
	'facebook-comment',
	'facebook-mention-comment',
	'facebook-mention-post',
	'facebook-message',
	'facebook-messenger',
	'facebook-post',
	'facebook-review',
	'facebook-review-comment',
	'form',
	'google-business-messages',
	'help-center',
	'help-center-contact-form',
	'helpdesk',
	'instagram',
	'instagram-ad-comment',
	'instagram-ad-media',
	'instagram-comment',
	'instagram-direct-message',
	'instagram-media',
	'instagram-mention-comment',
	'instagram-mention-media',
	'internal-note',
	'ottspott-call',
	'phone',
	'rule',
	'self_service',
	'shopify',
	'sms',
	'system-message',
	'tiktok-shop',
	'twilio',
	'twitter-direct-message',
	'twitter-mention-tweet',
	'twitter-quoted-tweet',
	'twitter-tweet',
	'whatsapp-message',
	'yotpo-review',
	'yotpo-review-private-comment',
	'yotpo-review-public-comment',
]);
const TicketMessageAttachmentSchema = z
	.object({
		url: z.string(),
		name: z.string().optional(),
		size: z.number().int().optional(),
		content_type: z.string(),
		public: z.boolean().optional(),
		extra: z.record(z.string(), z.json()).optional(),
	})
	.strict();
const TicketMessageAuthCustomerIdentityServiceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
	})
	.strict();
const TicketMessageAuthCustomerIdentitySchema = z
	.object({
		service: TicketMessageAuthCustomerIdentityServiceSchema,
		identifier: z.string(),
	})
	.strict();
const TicketMessageIntentSchema = z
	.object({
		name: z.string(),
		rejected: z.boolean(),
		is_user_feedback: z.boolean(),
	})
	.strict();
const TicketMessageMacroSchema = z
	.object({
		id: z.number().int().gt(0),
	})
	.strict();
const TicketMessageSourceAddressSchema = z
	.object({
		name: z.string().optional(),
		address: z.string().optional(),
	})
	.strict();
const TicketMessageSourceSchema = z
	.object({
		type: z.string(),
		to: z.array(TicketMessageSourceAddressSchema).optional(),
		cc: z.array(TicketMessageSourceAddressSchema).optional(),
		bcc: z.array(TicketMessageSourceAddressSchema).optional(),
		from: TicketMessageSourceAddressSchema.optional(),
		extra: z.record(z.string(), z.json()).optional(),
	})
	.strict();
const TicketMessageUserOrCustomerSchema = z
	.object({
		id: z.number().int(),
		email: z.string(),
		name: z.string(),
		firstname: z.string(),
		lastname: z.string(),
		meta: z.record(z.string(), z.json()),
	})
	.strict();
const TicketMessageRepliedByOrToSchema = z
	.object({
		integration_id: z.number().int(),
		message_id: z.string(),
		created_datetime: z.string(),
		body_text: z.string(),
		source: TicketMessageSourceSchema,
		customer: TicketMessageUserOrCustomerSchema,
		user: TicketMessageUserOrCustomerSchema,
	})
	.strict();
const TicketMessageSendingErrorSchema = z
	.object({
		error: z.string(),
	})
	.strict();
const TicketMessageSchema = z
	.object({
		id: z.number().int(),
		uri: z.string(),
		message_id: z.string(),
		ticket_id: z.number().int(),
		external_id: z.string(),
		public: z.boolean().optional(),
		channel: z.union([LegacyChannelSlugSchema, z.string()]),
		via: TicketViaSchema,
		source: TicketMessageSourceSchema,
		sender: TicketMessageUserOrCustomerSchema,
		auth_customer_identity: TicketMessageAuthCustomerIdentitySchema,
		integration_id: z.number().int(),
		intents: z.array(TicketMessageIntentSchema),
		rule_id: z.number().int(),
		from_agent: z.boolean(),
		receiver: TicketMessageUserOrCustomerSchema,
		subject: z.string(),
		body_text: z.string(),
		body_html: z.string(),
		body_url: z.string(),
		stripped_text: z.string(),
		stripped_html: z.string(),
		stripped_signature: z.string(),
		attachments: z.array(TicketMessageAttachmentSchema),
		macros: z.array(TicketMessageMacroSchema).optional(),
		actions: z.array(z.record(z.string(), z.json())),
		headers: z.record(z.string(), z.json()).optional(),
		imported: z.boolean(),
		meta: z.record(z.string(), z.json()),
		created_datetime: z.string(),
		processed_datetime: z.string(),
		deleted_datetime: z.string().optional(),
		sent_datetime: z.string(),
		failed_datetime: z.string(),
		opened_datetime: z.string(),
		last_sending_error: TicketMessageSendingErrorSchema,
		is_retriable: z.boolean(),
		replied_by: TicketMessageRepliedByOrToSchema.optional(),
		replied_to: TicketMessageRepliedByOrToSchema.optional(),
	})
	.strict();
const CreateMessageAttachmentSchema = z
	.object({
		url: z.string().url().min(1),
		name: z.string(),
		size: z.number().int().optional(),
		content_type: z.string(),
		public: z.boolean().optional(),
		extra: z
			.union([
				z.string(),
				z.number().int(),
				z.number(),
				z.boolean(),
				z.record(z.string(), z.json()),
				z.array(z.record(z.string(), z.json())),
			])
			.optional(),
	})
	.strict();
const CreateMessageCustomerChannelSchema = z
	.object({
		type: z.string(),
		address: z.string(),
	})
	.strict();
const CreateMessageCustomerOrUserSchema = z
	.object({
		id: z.number().int().min(0).optional(),
		email: z.string().max(320).optional(),
		name: z.string().optional(),
		external_id: z.string().optional(),
		note: z.string().optional(),
		timezone: z.string().optional(),
		language: z.string().optional(),
		meta: z.record(z.string(), z.json()).optional(),
		channels: z.array(CreateMessageCustomerChannelSchema).optional(),
	})
	.strict();
const CreateMessageLastSendingErrorSchema = z
	.object({
		error: z.string(),
	})
	.strict();
const CreateMessageMacroSchema = z
	.object({
		id: z.number().int().gt(0),
	})
	.strict();
const CreateMessageSourcePersonSchema = z
	.object({
		name: z.string().optional(),
		address: z.string().optional(),
	})
	.strict();
const CreateMessageMetaSchema = z
	.object({
		relevant_content_indexes: z.array(z.number().int()).optional(),
	})
	.strict();
const CreateMessageSourceSchema = z
	.object({
		type: TicketMessageSourceTypeSchema.optional(),
		from: CreateMessageSourcePersonSchema.optional(),
		to: z.array(CreateMessageSourcePersonSchema).optional(),
		cc: z.array(CreateMessageSourcePersonSchema).optional(),
		bcc: z.array(CreateMessageSourcePersonSchema).optional(),
		extra: z
			.union([
				z.string(),
				z.number().int(),
				z.number(),
				z.boolean(),
				z.record(z.string(), z.json()),
				z.array(z.record(z.string(), z.json())),
			])
			.optional(),
	})
	.strict();
const CreateMessageSchema = z
	.object({
		actions: z
			.array(
				z.union([
					z.string(),
					z.number().int(),
					z.number(),
					z.boolean(),
					z.record(z.string(), z.json()),
					z.array(z.record(z.string(), z.json())),
				]),
			)
			.optional(),
		attachments: z.array(CreateMessageAttachmentSchema).optional(),
		body_html: z.string().optional(),
		body_text: z.string().optional(),
		channel: z.union([LegacyChannelSlugSchema, z.string()]),
		created_datetime: z.string().optional(),
		deleted_datetime: z.string().optional(),
		external_id: z.string().max(255).optional(),
		failed_datetime: z.string().optional(),
		from_agent: z.boolean(),
		headers: z
			.record(
				z.string(),
				z.union([
					z.string(),
					z.number().int(),
					z.number(),
					z.boolean(),
					z.record(z.string(), z.json()),
					z.array(z.record(z.string(), z.json())),
				]),
			)
			.optional(),
		integration_id: z.number().int().gt(0).optional(),
		last_sending_error: CreateMessageLastSendingErrorSchema.optional(),
		macros: z.array(CreateMessageMacroSchema).optional(),
		message_id: z.string().optional(),
		meta: CreateMessageMetaSchema.optional(),
		opened_datetime: z.string().optional(),
		public: z.boolean().optional(),
		sent_datetime: z.string().optional(),
		source: CreateMessageSourceSchema.optional(),
		stripped_html: z.string().optional(),
		stripped_signature: z.string().optional(),
		stripped_text: z.string().optional(),
		subject: z.string().optional(),
		via: z
			.enum([
				'aircall',
				'api',
				'chat',
				'contact_form',
				'email',
				'facebook',
				'facebook-mention',
				'facebook-messenger',
				'facebook-recommendations',
				'form',
				'helpdesk',
				'help-center',
				'instagram',
				'instagram-ad-comment',
				'instagram-comment',
				'instagram-direct-message',
				'instagram-mention',
				'internal-note',
				'phone',
				'rule',
				'shopify',
				'sms',
				'twilio',
				'twitter',
				'twitter-direct-message',
				'whatsapp',
				'yotpo',
				'yotpo-review',
				'zendesk',
			])
			.optional(),
		imported: z.boolean().optional(),
		mention_ids: z.array(z.number().int()).optional(),
		receiver: CreateMessageCustomerOrUserSchema.optional(),
		sender: CreateMessageCustomerOrUserSchema.optional(),
	})
	.strict();
const TicketStatusSchema = z.enum(['open', 'closed']);
const CreateTicketAssigneeSchema = z
	.object({
		id: z.number().int().min(0).optional(),
	})
	.strict();
const CreateTicketCustomFieldSchema = z
	.object({
		id: z.number().int(),
		value: z.record(z.string(), z.json()),
	})
	.strict();
const CreateTicketCustomerSchema = z
	.object({
		id: z.number().int().optional(),
		email: z.string().max(320).optional(),
		name: z.string().optional(),
	})
	.strict();
const CreateTicketMessageAttachmentSchema = z
	.object({
		url: z.string().url().min(1),
		name: z.string(),
		size: z.number().int().optional(),
		content_type: z.string(),
		public: z.boolean().optional(),
		extra: z
			.union([
				z.string(),
				z.number().int(),
				z.number(),
				z.boolean(),
				z.record(z.string(), z.json()),
				z.array(z.record(z.string(), z.json())),
			])
			.optional(),
	})
	.strict();
const CreateTicketMessageCustomerChannelSchema = z
	.object({
		type: z.string(),
		address: z.string(),
	})
	.strict();
const CreateTicketMessageCustomerOrUserSchema = z
	.object({
		id: z.number().int().min(0).optional(),
		email: z.string().max(320).optional(),
		name: z.string().optional(),
		external_id: z.string().optional(),
		note: z.string().optional(),
		timezone: z.string().optional(),
		language: z.string().optional(),
		meta: z.record(z.string(), z.json()).optional(),
		channels: z.array(CreateTicketMessageCustomerChannelSchema).optional(),
	})
	.strict();
const CreateTicketMessageLastSendingErrorSchema = z
	.object({
		error: z.string(),
	})
	.strict();
const CreateTicketMessageMacroSchema = z
	.object({
		id: z.number().int().gt(0),
	})
	.strict();
const CreateTicketMessageMetaSchema = z
	.object({
		relevant_content_indexes: z.array(z.number().int()).optional(),
	})
	.strict();
const CreateTicketMessageSourcePersonSchema = z
	.object({
		name: z.string().optional(),
		address: z.string().optional(),
	})
	.strict();
const CreateTicketMessageSourceSchema = z
	.object({
		type: TicketMessageSourceTypeSchema.optional(),
		from: CreateTicketMessageSourcePersonSchema.optional(),
		to: z.array(CreateTicketMessageSourcePersonSchema).optional(),
		cc: z.array(CreateTicketMessageSourcePersonSchema).optional(),
		bcc: z.array(CreateTicketMessageSourcePersonSchema).optional(),
		extra: z
			.union([
				z.string(),
				z.number().int(),
				z.number(),
				z.boolean(),
				z.record(z.string(), z.json()),
				z.array(z.record(z.string(), z.json())),
			])
			.optional(),
	})
	.strict();
const CreateTicketMessageSchema = z
	.object({
		actions: z
			.array(
				z.union([
					z.string(),
					z.number().int(),
					z.number(),
					z.boolean(),
					z.record(z.string(), z.json()),
					z.array(z.record(z.string(), z.json())),
				]),
			)
			.optional(),
		attachments: z.array(CreateTicketMessageAttachmentSchema).optional(),
		body_html: z.string().optional(),
		body_text: z.string().optional(),
		channel: z.union([LegacyChannelSlugSchema, z.string()]),
		created_datetime: z.string().optional(),
		deleted_datetime: z.string().optional(),
		external_id: z.string().max(255).optional(),
		failed_datetime: z.string().optional(),
		from_agent: z.boolean(),
		headers: z
			.record(
				z.string(),
				z.union([
					z.string(),
					z.number().int(),
					z.number(),
					z.boolean(),
					z.record(z.string(), z.json()),
					z.array(z.record(z.string(), z.json())),
				]),
			)
			.optional(),
		integration_id: z.number().int().gt(0).optional(),
		last_sending_error: CreateTicketMessageLastSendingErrorSchema.optional(),
		macros: z.array(CreateTicketMessageMacroSchema).optional(),
		message_id: z.string().optional(),
		meta: CreateTicketMessageMetaSchema.optional(),
		opened_datetime: z.string().optional(),
		public: z.boolean().optional(),
		sent_datetime: z.string().optional(),
		source: CreateTicketMessageSourceSchema.optional(),
		stripped_html: z.string().optional(),
		stripped_signature: z.string().optional(),
		stripped_text: z.string().optional(),
		subject: z.string().optional(),
		via: z
			.enum([
				'aircall',
				'api',
				'chat',
				'contact_form',
				'email',
				'facebook',
				'facebook-mention',
				'facebook-messenger',
				'facebook-recommendations',
				'form',
				'helpdesk',
				'help-center',
				'instagram',
				'instagram-ad-comment',
				'instagram-comment',
				'instagram-direct-message',
				'instagram-mention',
				'internal-note',
				'phone',
				'rule',
				'shopify',
				'sms',
				'twilio',
				'twitter',
				'twitter-direct-message',
				'whatsapp',
				'yotpo',
				'yotpo-review',
				'zendesk',
			])
			.optional(),
		mention_ids: z.array(z.number().int()).optional(),
		receiver: CreateTicketMessageCustomerOrUserSchema.optional(),
		sender: CreateTicketMessageCustomerOrUserSchema.optional(),
	})
	.strict();
const CreateTicketTagDecorationSchema = z
	.object({
		color: z.string().optional(),
	})
	.strict();
const CreateTicketTagSchema = z
	.object({
		name: z.string().min(1).max(256),
		decoration: CreateTicketTagDecorationSchema.optional(),
	})
	.strict();
const TicketPrioritySchema = z.enum(['critical', 'high', 'normal', 'low']);
const CreateTicketSchema = z
	.object({
		assignee_team: CreateTicketAssigneeSchema.optional(),
		assignee_user: CreateTicketAssigneeSchema.optional(),
		channel: z.union([LegacyChannelSlugSchema, z.string()]).optional(),
		closed_datetime: z.string().optional(),
		created_datetime: z.string().optional(),
		custom_fields: z.array(CreateTicketCustomFieldSchema).optional(),
		customer: CreateTicketCustomerSchema.optional(),
		external_id: z.string().max(255).optional(),
		from_agent: z.boolean().optional(),
		language: z.string().optional(),
		last_message_datetime: z.string().optional(),
		last_received_message_datetime: z.string().optional(),
		messages: z.array(CreateTicketMessageSchema).min(1).max(500),
		meta: z
			.record(
				z.string(),
				z.union([
					z.string(),
					z.number().int(),
					z.number(),
					z.boolean(),
					z.record(z.string(), z.json()),
					z.array(z.record(z.string(), z.json())),
				]),
			)
			.optional(),
		opened_datetime: z.string().optional(),
		priority: TicketPrioritySchema.optional(),
		snooze_datetime: z.string().optional(),
		spam: z.boolean().optional(),
		split_from: z.number().int().optional(),
		status: TicketStatusSchema.optional(),
		subject: z.string().max(998).optional(),
		tags: z.array(CreateTicketTagSchema).optional(),
		trashed_datetime: z.string().optional(),
		updated_datetime: z.string().optional(),
		via: z
			.enum([
				'aircall',
				'api',
				'chat',
				'contact_form',
				'email',
				'facebook',
				'facebook-mention',
				'facebook-messenger',
				'facebook-recommendations',
				'form',
				'helpdesk',
				'help-center',
				'instagram',
				'instagram-ad-comment',
				'instagram-comment',
				'instagram-direct-message',
				'instagram-mention',
				'internal-note',
				'phone',
				'rule',
				'shopify',
				'sms',
				'twilio',
				'twitter',
				'twitter-direct-message',
				'whatsapp',
				'yotpo',
				'yotpo-review',
				'zendesk',
			])
			.optional(),
		imported: z.boolean().optional(),
	})
	.strict();
const CurrencySchema = z.enum([
	'AFN',
	'EUR',
	'ALL',
	'DZD',
	'USD',
	'AOA',
	'XCD',
	'ARS',
	'AMD',
	'AWG',
	'AUD',
	'AZN',
	'BSD',
	'BHD',
	'BDT',
	'BBD',
	'BYN',
	'BZD',
	'XOF',
	'BMD',
	'INR',
	'BTN',
	'BOB',
	'BOV',
	'BAM',
	'BWP',
	'NOK',
	'BRL',
	'BND',
	'BGN',
	'BIF',
	'CVE',
	'KHR',
	'XAF',
	'CAD',
	'KYD',
	'CLP',
	'CLF',
	'CNY',
	'COP',
	'COU',
	'KMF',
	'CDF',
	'NZD',
	'CRC',
	'HRK',
	'CUP',
	'CUC',
	'ANG',
	'CZK',
	'DKK',
	'DJF',
	'DOP',
	'EGP',
	'SVC',
	'ERN',
	'SZL',
	'ETB',
	'FKP',
	'FJD',
	'XPF',
	'GMD',
	'GEL',
	'GHS',
	'GIP',
	'GTQ',
	'GBP',
	'GNF',
	'GYD',
	'HTG',
	'HNL',
	'HKD',
	'HUF',
	'ISK',
	'IDR',
	'XDR',
	'IRR',
	'IQD',
	'ILS',
	'JMD',
	'JPY',
	'JOD',
	'KZT',
	'KES',
	'KPW',
	'KRW',
	'KWD',
	'KGS',
	'LAK',
	'LBP',
	'LSL',
	'ZAR',
	'LRD',
	'LYD',
	'CHF',
	'MOP',
	'MKD',
	'MGA',
	'MWK',
	'MYR',
	'MVR',
	'MRU',
	'MUR',
	'XUA',
	'MXN',
	'MXV',
	'MDL',
	'MNT',
	'MAD',
	'MZN',
	'MMK',
	'NAD',
	'NPR',
	'NIO',
	'NGN',
	'OMR',
	'PKR',
	'PAB',
	'PGK',
	'PYG',
	'PEN',
	'PHP',
	'PLN',
	'QAR',
	'RON',
	'RUB',
	'RWF',
	'SHP',
	'WST',
	'STN',
	'SAR',
	'RSD',
	'SCR',
	'SLL',
	'SLE',
	'SGD',
	'XSU',
	'SBD',
	'SOS',
	'SSP',
	'LKR',
	'SDG',
	'SRD',
	'SEK',
	'CHE',
	'CHW',
	'SYP',
	'TWD',
	'TJS',
	'TZS',
	'THB',
	'TOP',
	'TTD',
	'TND',
	'TRY',
	'TMT',
	'UGX',
	'UAH',
	'AED',
	'USN',
	'UYU',
	'UYI',
	'UYW',
	'UZS',
	'VUV',
	'VES',
	'VED',
	'VND',
	'YER',
	'ZMW',
	'ZWL',
	'XBA',
	'XBB',
	'XBC',
	'XBD',
	'XTS',
	'XXX',
	'XAU',
	'XPD',
	'XPT',
	'XAG',
]);
const InputSettingsDropdown_boolSchema = z
	.object({
		input_type: z.literal('dropdown'),
		choices: z.array(z.boolean()),
		default: z.boolean().optional(),
	})
	.strict();
const DefinitionBooleanSchema = z
	.object({
		data_type: z.literal('boolean'),
		input_settings: InputSettingsDropdown_boolSchema,
	})
	.strict();
const InputSettingsNumberSchema = z
	.object({
		input_type: z.literal('input_number'),
		placeholder: z.string().optional(),
		min: z.union([z.number(), z.string()]).optional(),
		max: z.union([z.number(), z.string()]).optional(),
	})
	.strict();
const DefinitionNumberSchema = z
	.object({
		data_type: z.literal('number'),
		input_settings: InputSettingsNumberSchema,
	})
	.strict();
const InputSettingsDropdown_strSchema = z
	.object({
		input_type: z.literal('dropdown'),
		choices: z.array(z.string()),
		default: z.string().optional(),
	})
	.strict();
const InputSettingsTextSchema = z
	.object({
		input_type: z.literal('input'),
		placeholder: z.string().optional(),
	})
	.strict();
const DefinitionTextSchema = z
	.object({
		data_type: z.literal('text'),
		input_settings: z.union([
			InputSettingsTextSchema,
			InputSettingsDropdown_strSchema,
		]),
	})
	.strict();
const DiscountTypeSchema = z.enum(['percentage', 'fixed_amount']);
const EventObjectTypeSchema = z.enum([
	'Account',
	'AccountSetting',
	'Customer',
	'CustomField',
	'CustomFieldCondition',
	'CustomUserAvailabilityStatus',
	'CustomerExternalData',
	'Integration',
	'Macro',
	'Order',
	'Role',
	'Rule',
	'SatisfactionSurvey',
	'Shopper',
	'ShopperAddress',
	'Subscription',
	'Tag',
	'Team',
	'TicketMessage',
	'Ticket',
	'User',
	'UserSetting',
	'View',
	'Widget',
]);
const OrderLineSchema = z
	.object({
		id: z.number().int(),
		title: z.string(),
		taxable: z.boolean(),
		requires_shipping: z.boolean(),
		unit_price: z.union([z.number(), z.string()]),
		discount_amount: z.union([z.number(), z.string()]),
		discount_type: DiscountTypeSchema,
		discount_reason: z.string(),
		quantity: z.number().int(),
		total_amount: z.union([z.number(), z.string()]),
		product_options: z.record(z.string(), z.json()),
		fulfilled_quantity: z.number().int(),
		created_datetime: z.string(),
		updated_datetime: z.string(),
		deleted_datetime: z.string(),
	})
	.strict();
const PaymentStatusSchema = z.enum([
	'refunded',
	'partially_refunded',
	'unpaid',
	'voided',
	'failed',
	'manual_verification_required',
	'customer_authentication_required',
	'paid',
	'declined',
	'authorized',
]);
const ShopperAddressSchema = z
	.object({
		id: z.number().int(),
		external_id: z.string(),
		shopper_external_id: z.string(),
		preferred: z.boolean(),
		line_1: z.string(),
		line_2: z.string(),
		city: z.string(),
		state: z.string(),
		country: z.string(),
		zip_code: z.string(),
		first_name: z.string(),
		last_name: z.string(),
		phone_number: z.string(),
		created_datetime: z.string(),
		updated_datetime: z.string(),
		deleted_datetime: z.string(),
	})
	.strict();
const StatusSchema = z.enum([
	'partially_fulfilled',
	'completed',
	'canceled',
	'on_hold',
	'awaiting_fulfillment',
	'awaiting_payment',
	'scheduled',
	'order_pending',
]);
const OrderSchema = z
	.object({
		id: z.number().int(),
		external_id: z.string(),
		shopper_external_id: z.string(),
		number: z.number().int(),
		name: z.string(),
		currency: CurrencySchema,
		discount_codes: z.array(z.string()),
		discount_amount: z.union([z.number(), z.string()]),
		subtotal_amount: z.union([z.number(), z.string()]),
		shipping_amount: z.union([z.number(), z.string()]),
		tax_amount: z.union([z.number(), z.string()]),
		total_amount: z.union([z.number(), z.string()]),
		external_status: z.string(),
		external_fulfillment_status: z.string(),
		external_payment_status: z.string(),
		status: StatusSchema,
		payment_status: PaymentStatusSchema,
		billing_address: ShopperAddressSchema,
		shipping_address: ShopperAddressSchema,
		line_items: z.array(OrderLineSchema),
		created_datetime: z.string(),
		updated_datetime: z.string(),
		deleted_datetime: z.string(),
	})
	.strict();
const ShopperStatusSchema = z.enum(['tax_exempt', 'veteran']);
const ShopperSchema = z
	.object({
		id: z.number().int(),
		external_id: z.string(),
		helpdesk_customer_id: z.number().int(),
		email_address: z.string().email(),
		phone_number: z.string(),
		first_name: z.string(),
		middle_name: z.string(),
		last_name: z.string(),
		birthdate: z.string(),
		status: ShopperStatusSchema,
		accepts_marketing_email: z.boolean(),
		accepts_marketing_sms: z.boolean(),
		created_datetime: z.string(),
		updated_datetime: z.string(),
		deleted_datetime: z.string(),
	})
	.strict();
const StoreTypeSchema = z.enum([
	'bigcommerce',
	'magento',
	'shopify',
	'woocommerce',
]);
const StoreSchema = z
	.object({
		id: z.number().int(),
		currencies: z.array(CurrencySchema),
		default_currency: CurrencySchema,
		display_name: z.string(),
		name: z.string(),
		type: StoreTypeSchema,
		url: z.string(),
		helpdesk_integration_id: z.number().int(),
		uuid: z.string(),
		created_datetime: z.string(),
		updated_datetime: z.string(),
		deleted_datetime: z.string(),
	})
	.strict();
const ShopperEcommerceDataSchema = z
	.object({
		store: StoreSchema,
		shopper: ShopperSchema,
		orders: z.array(OrderSchema),
		addresses: z.array(ShopperAddressSchema),
	})
	.strict();
const TicketCustomFieldSchema = z
	.object({
		id: z.number().int().gt(0),
		external_id: z.string().optional(),
		object_type: EventObjectTypeSchema,
		label: z.string(),
		description: z.string().optional(),
		priority: z.number().int(),
		required: z.boolean(),
		requirement_type: RequirementTypeSchema,
		managed_type: ManagedTicketFieldTypeSchema.optional(),
		definition: z.union([
			DefinitionNumberSchema,
			DefinitionTextSchema,
			DefinitionBooleanSchema,
		]),
		created_datetime: z.string(),
		updated_datetime: z.string().optional(),
		deactivated_datetime: z.string().optional(),
	})
	.strict();
const TicketCustomFieldValueSchema = z
	.object({
		field: TicketCustomFieldSchema.optional(),
		id: z.number().int().optional(),
		prediction: z.record(z.string(), z.json()).optional(),
		value: z.record(z.string(), z.json()),
	})
	.strict();
const TicketCustomerChannelCustomerSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
	})
	.strict();
const TicketCustomerChannelSchema = z
	.object({
		id: z.number().int(),
		type: z.string(),
		address: z.string(),
		preferred: z.boolean().optional(),
		created_datetime: z.string(),
		updated_datetime: z.string(),
		deleted_datetime: z.string(),
		user: TicketCustomerChannelCustomerSchema,
		customer: TicketCustomerChannelCustomerSchema,
	})
	.strict();
const TicketCustomerSchema = z
	.object({
		id: z.number().int(),
		email: z.string(),
		name: z.string(),
		firstname: z.string(),
		lastname: z.string(),
		meta: z.record(z.string(), z.json()),
		channels: z.array(TicketCustomerChannelSchema),
		data: z.record(z.string(), z.json()),
		customer: z.record(z.string(), z.json()),
		integrations: z.record(z.string(), z.json()),
		external_id: z.string(),
		note: z.string(),
		external_data: z
			.record(z.string(), z.record(z.string(), z.json()))
			.optional(),
		ecommerce_data: z.record(z.string(), ShopperEcommerceDataSchema).optional(),
	})
	.strict();
const TicketEventUserSchema = z
	.object({
		id: z.number().int(),
		firstname: z.string(),
		lastname: z.string(),
		name: z.string(),
		email: z.string(),
	})
	.strict();
const TicketEventSchema = z
	.object({
		id: z.number().int(),
		type: z.string(),
		user: TicketEventUserSchema,
		data: z.record(z.string(), z.json()),
		created_datetime: z.string(),
	})
	.strict();
const TicketMetaSchema = z.record(z.string(), z.json());
const TicketReplyOptionIntegrationSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		address: z.string(),
	})
	.strict();
const TicketReplyOptionSchema = z
	.object({
		answerable: z.boolean(),
		reason: z.string().optional(),
		integrations: z.array(TicketReplyOptionIntegrationSchema).optional(),
	})
	.strict();
const TicketSatisfactionSurveySchema = z
	.object({
		id: z.number().int(),
		customer_id: z.number().int(),
		ticket_id: z.number().int(),
		sent_datetime: z.string(),
		scored_datetime: z.string(),
		should_send_datetime: z.string(),
		created_datetime: z.string(),
		score: z.number().int().min(1).max(5),
		body_text: z.string().max(1000),
		meta: z.record(z.string(), z.json()),
	})
	.strict();
const TicketSummarySchema = z
	.object({
		content: z.string(),
		created_datetime: z.string(),
		updated_datetime: z.string(),
		triggered_by: z.number().int(),
	})
	.strict();
const TicketTagDecorationSchema = z
	.object({
		color: z.string().optional(),
	})
	.strict();
const TicketTagSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		decoration: TicketTagDecorationSchema,
	})
	.strict();
const TicketUserSchema = z
	.object({
		id: z.number().int(),
		email: z.string(),
		name: z.string(),
		firstname: z.string(),
		lastname: z.string(),
		meta: z.record(z.string(), z.json()),
		bio: z.string(),
	})
	.strict();
const TicketSchema = z
	.object({
		id: z.number().int(),
		uri: z.string(),
		external_id: z.string(),
		events: z.array(TicketEventSchema),
		status: TicketStatusSchema.optional(),
		channel: z.union([LegacyChannelSlugSchema, z.string()]),
		via: TicketViaSchema,
		from_agent: z.boolean(),
		spam: z.boolean(),
		imported: z.boolean(),
		customer: TicketCustomerSchema,
		assignee_user: TicketUserSchema,
		language: z.string(),
		subject: z.string(),
		summary: TicketSummarySchema.optional(),
		meta: TicketMetaSchema,
		tags: z.array(TicketTagSchema),
		custom_fields: z
			.record(z.string(), TicketCustomFieldValueSchema)
			.optional(),
		messages: z.array(TicketMessageSchema),
		created_datetime: z.string(),
		processed_datetime: z.string(),
		opened_datetime: z.string(),
		last_received_message_datetime: z.string(),
		last_message_datetime: z.string(),
		updated_datetime: z.string(),
		closed_datetime: z.string(),
		trashed_datetime: z.string(),
		snooze_datetime: z.string(),
		satisfaction_survey: TicketSatisfactionSurveySchema,
		reply_options: z.record(z.string(), TicketReplyOptionSchema),
		is_unread: z.boolean(),
	})
	.strict();
const UserSchema = z
	.object({
		id: z.number().int().optional(),
		active: z.boolean().optional(),
		bio: z.string().optional(),
		created_datetime: z.string().optional(),
		country: z.string().optional(),
		deactivated_datetime: z.string().optional(),
		email: z.string().email().optional(),
		external_id: z.string().optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		language: z.string().optional(),
		meta: z
			.object({
				sso: z.enum(['google', 'office365']).optional(),
				profile_picture_url: z.string().url().nullable().optional(),
			})
			.strict()
			.optional(),
		name: z.string().optional(),
		role: z
			.object({
				name: z
					.enum([
						'admin',
						'agent',
						'basic-agent',
						'bot',
						'internal-agent',
						'lite-agent',
						'observer-agent',
					])
					.optional(),
			})
			.strict()
			.optional(),
		timezone: z.string().optional(),
		updated_datetime: z.string().optional(),
		client_id: z.string().optional(),
	})
	.strict();
const ViewDecorationSchema = z
	.object({
		emoji: z.string().optional(),
	})
	.strict();
const ViewFieldSchema = z.enum([
	'id',
	'details',
	'tags',
	'customer',
	'last_message',
	'name',
	'email',
	'created',
	'updated',
	'assignee',
	'assignee_team',
	'channel',
	'closed',
	'language',
	'last_received_message',
	'integrations',
	'snooze',
	'status',
	'subject',
	'priority',
]);
const ViewTypeSchema = z.enum(['ticket-list', 'customer-list']);
const ViewVisibilitySchema = z.enum(['public', 'shared', 'private']);
const ViewCreateSchema = z
	.object({
		decoration: ViewDecorationSchema.optional(),
		fields: z.array(ViewFieldSchema).optional(),
		filters: z.string().optional(),
		name: z.string().optional(),
		order_by: z.string().optional(),
		order_dir: z.enum(['asc', 'desc']).optional(),
		shared_with_teams: z.array(z.number().int()).max(100).optional(),
		shared_with_users: z.array(z.number().int()).max(100).optional(),
		slug: z.string(),
		type: ViewTypeSchema.optional(),
		visibility: ViewVisibilitySchema.optional(),
	})
	.strict();
const ViewSharedWithTeamSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		decoration: z.record(z.string(), z.json()).optional(),
	})
	.strict();
const ViewSharedWithUserSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		meta: z.record(z.string(), z.json()).optional(),
	})
	.strict();
const ViewSchema = z
	.object({
		id: z.number().int(),
		category: z.string().optional(),
		created_datetime: z.string().optional(),
		deactivated_datetime: z.string().optional(),
		decoration: ViewDecorationSchema.optional(),
		fields: z.array(ViewFieldSchema).optional(),
		filters: z.string().optional(),
		name: z.string().optional(),
		order_by: z.string().optional(),
		order_dir: z.enum(['asc', 'desc']).optional(),
		search: z.string().optional(),
		shared_with_teams: z.array(ViewSharedWithTeamSchema).max(100).optional(),
		shared_with_users: z.array(ViewSharedWithUserSchema).max(100).optional(),
		slug: z.string().optional(),
		type: ViewTypeSchema.optional(),
		uri: z.string(),
		visibility: ViewVisibilitySchema.optional(),
	})
	.strict();
const WidgetSchema = z
	.object({
		id: z.number().int().optional(),
		context: z.enum(['ticket', 'customer', 'user']).optional(),
		created_datetime: z.string().optional(),
		deactivated_datetime: z.string().nullable().optional(),
		integration_id: z.number().int().min(0).nullable().optional(),
		app_id: z.string().nullable().optional(),
		order: z.number().int().min(0).optional(),
		template: z.record(z.string(), z.json()).optional(),
		type: z
			.enum([
				'bigcommerce',
				'custom',
				'customer_external_data',
				'http',
				'magento2',
				'recharge',
				'shopify',
				'smile',
				'standalone',
				'yotpo',
				'klaviyo',
				'stripe',
				'woocommerce',
			])
			.optional(),
		updated_datetime: z.string().optional(),
		uri: z.string().optional(),
	})
	.strict();
const AccountSchema = z
	.object({
		created_datetime: z.string().optional(),
		deactivated_datetime: z.string().nullable().optional(),
		domain: z.string().optional(),
		settings: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						data: z.record(z.string(), z.json()).optional(),
						type: z.string(),
					})
					.strict(),
			)
			.optional(),
		status: z.record(z.string(), z.json()).optional(),
	})
	.strict();
const EventSchema = z
	.object({
		id: z.number().int().optional(),
		context: z.string().nullable().optional(),
		created_datetime: z.string().optional(),
		data: z.record(z.string(), z.json()).optional(),
		object_id: z.number().int().optional(),
		object_type: z
			.enum([
				'Account',
				'AccountSetting',
				'Customer',
				'CustomField',
				'CustomFieldCondition',
				'CustomUserAvailabilityStatus',
				'CustomerExternalData',
				'Integration',
				'Macro',
				'Order',
				'Role',
				'Rule',
				'SatisfactionSurvey',
				'Shopper',
				'ShopperAddress',
				'Subscription',
				'Tag',
				'Team',
				'TicketMessage',
				'Ticket',
				'User',
				'UserSetting',
				'View',
				'Widget',
			])
			.optional(),
		type: z.string().optional(),
		user_id: z.number().int().optional(),
		uri: z.string().optional(),
	})
	.strict();
const IntegrationDetailSchema = z
	.object({
		id: z.number().int().optional(),
		created_datetime: z.string().nullable().optional(),
		deactivated_datetime: z.string().nullable().optional(),
		description: z.string().nullable().nullable().optional(),
		http: z
			.object({
				form: z.null().optional(),
				method: z
					.enum(['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'])
					.optional(),
				request_content_type: z
					.enum(['application/json', 'application/x-www-form-urlencoded'])
					.optional(),
				response_content_type: z.enum(['application/json']).optional(),
				triggers: z
					.object({
						'ticket-created': z.boolean().optional(),
						'ticket-updated': z.boolean().optional(),
						'ticket-message-created': z.boolean().optional(),
						'ticket-self-unsnoozed': z.boolean().optional(),
						'ticket-message-failed': z.boolean().optional(),
						'ticket-assignment-updated': z.boolean().optional(),
						'ticket-status-updated': z.boolean().optional(),
						'ticket-handed-over': z.boolean().optional(),
					})
					.strict()
					.optional(),
				url: z.string(),
				oauth2: z.null().optional(),
			})
			.strict()
			.optional(),
		name: z.string(),
		type: z.enum(['http']).optional(),
		updated_datetime: z.string().nullable().optional(),
		user: z
			.object({
				id: z.number().int().optional(),
			})
			.strict()
			.optional(),
		uri: z.string().optional(),
		application_id: z.string().nullable().optional(),
		managed: z.boolean().optional(),
		business_hours_id: z.number().int().nullable().optional(),
		product_review_provider_integrations: z.array(IntegrationSchema).optional(),
		shopify_integration: IntegrationSchema.optional(),
	})
	.strict();
const StatisticSchema = z
	.object({
		data: z.record(z.string(), z.json()).optional(),
		meta: z
			.object({
				end_datetime: z.string(),
				previous_end_datetime: z.string().optional(),
				previous_start_datetime: z.string().optional(),
				start_datetime: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();
const MetricCardApiFilterSchema = z
	.object({
		member: z.string(),
		values: z.array(z.string()),
	})
	.strict();
const MetricCardApiMappingSchema = z
	.object({
		scope: z.string(),
		measures: z.array(z.string()).optional(),
		dimensions: z.array(z.string()).optional(),
		filters: z.array(MetricCardApiFilterSchema).optional(),
	})
	.strict();
const MetricCardPublicSchema = z
	.object({
		definition: z.string(),
		formula: z.string(),
		computation_logic: z.array(z.string()),
	})
	.strict();
const MetricCardRefSchema = z
	.object({
		slug: z.string(),
		url: z.string(),
	})
	.strict();
const MetricCardSlugEnumSchema = z.enum([
	'abandoned-calls',
	'accuracy',
	'achievement-rate',
	'agents-offline',
	'agents-online',
	'ai-agent-automation-rate',
	'ai-agent-average-csat',
	'ai-agent-closed-tickets',
	'all-used-tags-all',
	'all-used-tags-all-created',
	'all-used-values',
	'all-used-values-created',
	'article-views',
	'assigned-open-tickets',
	'automated-interactions',
	'available-time',
	'average-csat',
	'average-discount-amount',
	'average-first-response-time',
	'average-human-response-time-after-ai-handoff',
	'average-order-value',
	'average-resolution-time',
	'average-survey-score',
	'average-talk-time',
	'average-ticket-handle-time',
	'average-wait-time',
	'brand-voice',
	'buy-through-rate',
	'call-wrap-up-time',
	'callback-requests',
	'calls-in-queue',
	'calls-with-achieved-slas',
	'calls-with-breached-slas',
	'cancelled-calls',
	'click-through-rate',
	'closed-tickets',
	'closed-tickets-per-hour',
	'comment-highlights',
	'communication-skills',
	'contribution-to-total-sales',
	'conversion-rate',
	'cost-saved',
	'coverage-rate',
	'created-tickets',
	'decrease-in-frt',
	'decrease-in-resolution-time',
	'discount-codes-applied',
	'discount-usage',
	'discounts-offered',
	'efficiency',
	'first-response-time',
	'handover-interactions',
	'human-response-time-after-ai-handoff',
	'inbound-answered',
	'inbound-answered-per-agent',
	'inbound-calls',
	'inbound-declined',
	'inbound-transferred',
	'internal-compliance',
	'language-proficiency',
	'live-messages-sent',
	'live-online-status',
	'live-open-tickets',
	'live-tickets-closed',
	'live-tickets-created',
	'live-tickets-replied',
	'macro-share-of-total',
	'macro-total-tickets',
	'macro-trend',
	'median-purchase-time',
	'median-response-time',
	'messages-per-ticket',
	'messages-received',
	'messages-sent',
	'messages-sent-per-hour',
	'messages-sent-per-macro',
	'missed-calls',
	'no-result-searches',
	'no-search-results-search-count',
	'on-a-call-time',
	'one-touch-tickets',
	'online-time',
	'open-tickets',
	'orders-influenced',
	'outbound-calls',
	'overall-automation-rate',
	'percent-abandoned-calls',
	'percent-callback-requests',
	'percent-cancelled-calls',
	'percent-missed-calls',
	'percent-one-touch-tickets',
	'percent-sla-achievement-rate',
	'percent-zero-touch-tickets',
	'percentage-of-closed-tickets',
	'percentage-of-created-tickets',
	'performance-per-article-views',
	'product-recommendations',
	'resolution-completeness',
	'resolution-time',
	'response-rate',
	'revenue-influenced',
	'revenue-per-interaction',
	'reviewed-tickets',
	'satisfaction-score',
	'search-results',
	'search-terms-with-results-articles-clicked',
	'search-terms-with-results-click-through-rate',
	'search-terms-with-results-search-count',
	'searches',
	'success-rate',
	'surveys-answered',
	'surveys-sent',
	'ticket-attribute-intents',
	'ticket-attribute-share-of-total',
	'ticket-attribute-tickets',
	'ticket-attribute-trend',
	'ticket-handle-time-per-agent',
	'tickets-replied',
	'tickets-replied-per-hour',
	'tickets-with-achieved-slas',
	'tickets-with-breached-slas',
	'time-saved-by-agent',
	'top-performer-frt',
	'top-performers-closed-tickets',
	'top-performers-csat',
	'top-performers-resolution-time',
	'top-used-tags-all',
	'top-used-tags-all-created',
	'top-used-tags-all-created-trend',
	'top-used-tags-all-trend',
	'top-used-values',
	'top-used-values-created',
	'top-used-values-created-trend',
	'top-used-values-trend',
	'total-calls',
	'total-sales',
	'total-time',
	'unanswered-calls',
	'unassigned-open-tickets',
	'unavailable-time',
	'wait-time-per-call',
	'zero-touch-tickets',
]);
const MetricCardStatusEnumSchema = z.enum(['published', 'deprecated']);
const MetricCardSchema = z
	.object({
		slug: MetricCardSlugEnumSchema,
		category: z.string(),
		title: z.string(),
		status: MetricCardStatusEnumSchema,
		definition_revised_at: z.string(),
		public: MetricCardPublicSchema,
		api: MetricCardApiMappingSchema.optional(),
		aliases: z.array(z.string()),
		related: z.array(MetricCardRefSchema),
		replaces: z.array(MetricCardRefSchema),
		used_in_reports: z.array(z.string()),
		used_in_reports_links: z.array(z.string()).optional(),
	})
	.strict();
const ReportingStatsOperatorsEnumSchema = z.enum([
	'one-of',
	'not-one-of',
	'all-of',
	'afterDate',
	'beforeDate',
	'set',
	'inDateRange',
	'contains',
]);
const AIAgentAutomatedInteractionsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'aiAgentRole',
			'engagementType',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const CubeTimeDimensionGranularitiesEnumSchema = z.enum([
	'day',
	'week',
	'month',
	'hour',
]);
const AIAgentAutomatedInteractionsTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const CubeOrderDirectionsEnumSchema = z.enum(['asc', 'desc']);
const AIAgentAutomatedInteractionsQuerySchema = z
	.object({
		scope: z.literal('ai-agent-automated-interactions'),
		measures: z.array(z.literal('automatedInteractionsCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'aiAgentRole',
					'engagementType',
					'channel',
					'storeIntegrationId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
					'ticketId',
				]),
			)
			.optional(),
		filters: z.array(AIAgentAutomatedInteractionsFilterItemSchema),
		time_dimensions: z
			.array(AIAgentAutomatedInteractionsTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AIAgentDecreaseInFirstResponseTimeFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'aiAgentRole',
			'engagementType',
			'storeIntegrationId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AIAgentDecreaseInFirstResponseTimeTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AIAgentDecreaseInFirstResponseTimeQuerySchema = z
	.object({
		scope: z.literal('ai-agent-decrease-in-first-response-time'),
		measures: z
			.array(
				z.enum([
					'averageDecreaseInFirstResponseTime',
					'medianDecreaseInFirstResponseTime',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'aiAgentRole',
					'engagementType',
					'storeIntegrationId',
					'ticketId',
					'firstResponseTime',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(AIAgentDecreaseInFirstResponseTimeFilterItemSchema),
		time_dimensions: z
			.array(AIAgentDecreaseInFirstResponseTimeTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AIAgentDecreaseInResolutionTimeFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'aiAgentRole',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AIAgentDecreaseInResolutionTimeTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AIAgentDecreaseInResolutionTimeQuerySchema = z
	.object({
		scope: z.literal('ai-agent-decrease-in-resolution-time'),
		measures: z
			.array(
				z.enum([
					'averageDecreaseInResolutionTime',
					'medianDecreaseInResolutionTime',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'aiAgentRole',
					'storeIntegrationId',
					'ticketId',
					'resolutionTime',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(AIAgentDecreaseInResolutionTimeFilterItemSchema),
		time_dimensions: z
			.array(AIAgentDecreaseInResolutionTimeTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AiAgentCoverageRateFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'aiAgentRole',
			'storeIntegrationId',
			'engagementType',
			'aiIntentCustomFieldL1',
			'aiIntentCustomFieldL2',
			'aiIntentCustomFieldL3',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AiAgentCoverageRateTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AiAgentCoverageRateQuerySchema = z
	.object({
		scope: z.literal('ai-agent-coverage-rate'),
		measures: z.array(z.literal('coverageRate')).optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'ticketId',
					'aiAgentRole',
					'storeIntegrationId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(AiAgentCoverageRateFilterItemSchema),
		time_dimensions: z
			.array(AiAgentCoverageRateTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AiAgentCsatFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'aiAgentRole',
			'storeIntegrationId',
			'engagementType',
			'resourceSourceId',
			'resourceSourceSetId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AiAgentCsatTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AiAgentCsatQuerySchema = z
	.object({
		scope: z.literal('ai-agent-csat'),
		measures: z.array(z.enum(['averageCSAT', 'medianCSAT'])).optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'ticketId',
					'aiAgentRole',
					'storeIntegrationId',
					'engagementType',
					'surveyScore',
					'resourceSourceId',
					'resourceSourceSetId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(AiAgentCsatFilterItemSchema),
		time_dimensions: z.array(AiAgentCsatTimeDimensionSchema).max(1).optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AiAgentHandoverRateFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'aiAgentRole',
			'storeIntegrationId',
			'engagementType',
			'aiIntentCustomFieldL1',
			'aiIntentCustomFieldL2',
			'aiIntentCustomFieldL3',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AiAgentHandoverRateTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AiAgentHandoverRateQuerySchema = z
	.object({
		scope: z.literal('ai-agent-handover-rate'),
		measures: z
			.array(
				z.enum(['handoverRate', 'coveredTicketsCount', 'handoverTicketsCount']),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'ticketId',
					'aiAgentRole',
					'storeIntegrationId',
					'engagementType',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(AiAgentHandoverRateFilterItemSchema),
		time_dimensions: z
			.array(AiAgentHandoverRateTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AiAgentSuccessRateFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'aiAgentRole',
			'storeIntegrationId',
			'engagementType',
			'aiIntentCustomFieldL1',
			'aiIntentCustomFieldL2',
			'aiIntentCustomFieldL3',
			'resourceSourceId',
			'resourceSourceSetId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AiAgentSuccessRateTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AiAgentSuccessRateQuerySchema = z
	.object({
		scope: z.literal('ai-agent-success-rate'),
		measures: z
			.array(z.enum(['successRate', 'aiAgentTicketVolume']))
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'ticketId',
					'aiAgentRole',
					'storeIntegrationId',
					'engagementType',
					'productId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
					'resourceSourceId',
					'resourceSourceSetId',
				]),
			)
			.optional(),
		filters: z.array(AiAgentSuccessRateFilterItemSchema),
		time_dimensions: z
			.array(AiAgentSuccessRateTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AiAgentTicketFieldsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'aiAgentRole',
			'channel',
			'storeIntegrationId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AiAgentTicketFieldsTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AiAgentTicketFieldsQuerySchema = z
	.object({
		scope: z.literal('ai-agent-ticket-fields'),
		measures: z.array(z.literal('ticketCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'aiAgentRole',
					'aiOutcomeCustomField',
					'channel',
					'storeIntegrationId',
					'ticketId',
				]),
			)
			.optional(),
		filters: z.array(AiAgentTicketFieldsFilterItemSchema),
		time_dimensions: z
			.array(AiAgentTicketFieldsTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AiSalesAgentActivityFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'engagementType',
			'productId',
			'attributionWindowDays',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AiSalesAgentActivityTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AiSalesAgentActivityQuerySchema = z
	.object({
		scope: z.literal('ai-sales-agent-activity'),
		measures: z
			.array(
				z.enum([
					'revenuePerInteraction',
					'recommendedProductCount',
					'timesRecommended',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'storeIntegrationId',
					'ticketId',
					'engagementType',
					'attributedRevenue',
					'productRecommended',
					'productId',
					'productVariantIds',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(AiSalesAgentActivityFilterItemSchema),
		time_dimensions: z
			.array(AiSalesAgentActivityTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AiSalesAgentBuyThroughRateFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'engagementType',
			'attributionWindowDays',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AiSalesAgentBuyThroughRateTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AiSalesAgentBuyThroughRateQuerySchema = z
	.object({
		scope: z.literal('ai-sales-agent-buy-through-rate'),
		measures: z
			.array(z.enum(['buyThroughRate', 'productBuyThroughRate']))
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'storeIntegrationId',
					'engagementType',
					'ticketId',
					'productRecommended',
					'boughtProducts',
					'productId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(AiSalesAgentBuyThroughRateFilterItemSchema),
		time_dimensions: z
			.array(AiSalesAgentBuyThroughRateTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AiSalesAgentContributionToTotalSalesFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'engagementType',
			'attributionWindowDays',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AiSalesAgentContributionToTotalSalesTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AiSalesAgentContributionToTotalSalesQuerySchema = z
	.object({
		scope: z.literal('ai-sales-agent-contribution-to-total-sales'),
		measures: z.array(z.literal('contributionToTotalSales')).optional(),
		dimensions: z
			.array(z.enum(['storeIntegrationId', 'orderId', 'currency']))
			.optional(),
		filters: z.array(AiSalesAgentContributionToTotalSalesFilterItemSchema),
		time_dimensions: z
			.array(AiSalesAgentContributionToTotalSalesTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AiSalesAgentConversionRateFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'engagementType',
			'attributionWindowDays',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AiSalesAgentConversionRateTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AiSalesAgentConversionRateQuerySchema = z
	.object({
		scope: z.literal('ai-sales-agent-conversion-rate'),
		measures: z.array(z.literal('conversionRate')).optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'storeIntegrationId',
					'engagementType',
					'ticketId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(AiSalesAgentConversionRateFilterItemSchema),
		time_dimensions: z
			.array(AiSalesAgentConversionRateTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AiSalesAgentDiscountsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'engagementType',
			'currency',
			'attributionWindowDays',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AiSalesAgentDiscountsTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AiSalesAgentDiscountsQuerySchema = z
	.object({
		scope: z.literal('ai-sales-agent-discounts'),
		measures: z
			.array(
				z.enum([
					'offeredDiscountCodesCount',
					'appliedDiscountCodesCount',
					'averageDiscountAmount',
					'averageDiscountUsd',
					'medianDiscountAmount',
					'discountUsage',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'currency',
					'storeIntegrationId',
					'engagementType',
					'ticketId',
					'discountAmount',
					'discountCodeOffered',
					'discountCodeUsed',
					'productId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(AiSalesAgentDiscountsFilterItemSchema),
		time_dimensions: z
			.array(AiSalesAgentDiscountsTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AiSalesAgentOrdersPerformanceFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'engagementType',
			'currency',
			'orderId',
			'attributionWindowDays',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AiSalesAgentOrdersPerformanceTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const AiSalesAgentOrdersPerformanceQuerySchema = z
	.object({
		scope: z.literal('ai-sales-agent-orders-performance'),
		measures: z
			.array(
				z.enum([
					'ordersInfluencedCount',
					'totalSalesAmount',
					'totalSalesAmountUsd',
					'averageOrderValue',
					'averageOrderValueUsd',
					'medianOrderValue',
					'medianOrderValueUsd',
					'averagePurchaseTime',
					'medianPurchaseTime',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'currency',
					'storeIntegrationId',
					'engagementType',
					'ticketId',
					'orderId',
					'totalAmount',
					'purchaseTime',
					'productId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(AiSalesAgentOrdersPerformanceFilterItemSchema),
		time_dimensions: z
			.array(AiSalesAgentOrdersPerformanceTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const AutoQAFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'status',
			'ticketQAScorerUserId',
			'aiIntentCustomFieldL1',
			'aiIntentCustomFieldL2',
			'aiIntentCustomFieldL3',
			'hasScore',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const AutoQATimeDimensionSchema = z
	.object({
		dimension: z.literal('periodStart'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const BaseReportingStatsCustomFilterValueItemSchema = z
	.object({
		custom_field_id: z.number().int().min(1),
		operator: z.enum(['one-of', 'not-one-of']),
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const BaseReportingStatsCustomFilterItemSchema = z
	.object({
		member: z.literal('customFields'),
		values: z.array(BaseReportingStatsCustomFilterValueItemSchema).min(1),
	})
	.strict();
const BaseReportingStatsRepeatableFilterItemValueSchema = z
	.object({
		operator: z.enum(['one-of', 'not-one-of', 'all-of']),
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const BaseReportingStatsRepeatableFilterItemSchema = z
	.object({
		member: z.literal('tags'),
		values: z.array(BaseReportingStatsRepeatableFilterItemValueSchema).min(1),
	})
	.strict();
const AutoQAQuerySchema = z
	.object({
		scope: z.literal('auto-qa'),
		measures: z
			.array(
				z.enum([
					'averageResolutionCompletenessScore',
					'averageCommunicationSkillsScore',
					'averageLanguageProficiencyScore',
					'averageAccuracyScore',
					'averageEfficiencyScore',
					'averageInternalComplianceScore',
					'averageBrandVoiceScore',
					'ticketCount',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'storeId',
					'storeIntegrationId',
					'ticketQAScorerUserId',
					'ticketFields',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				AutoQAFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z.array(AutoQATimeDimensionSchema).max(1).optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const ReportingStatsTimeDimensionsEnumSchema = z.enum([
	'closedDatetime',
	'createdDatetime',
	'sentDatetime',
	'updatedDatetime',
	'firstAgentMessageDatetime',
	'timestamp',
	'anchorDatetime',
	'queuedDate',
	'periodStart',
	'scoredDatetime',
	'eventDatetime',
	'billingTimestamp',
]);
const BaseReportingStatsTimeDimensionSchema = z
	.object({
		dimension: ReportingStatsTimeDimensionsEnumSchema,
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const BillingUsageFilterItemSchema = z
	.object({
		member: z.enum(['periodStart', 'periodEnd', 'billingProduct', 'billingId']),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const BillingUsageTimeDimensionSchema = z
	.object({
		dimension: z.literal('billingTimestamp'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const BillingUsageQuerySchema = z
	.object({
		scope: z.literal('billing-usage'),
		measures: z
			.array(
				z.enum([
					'smsUsageCount',
					'voiceUsageCount',
					'convertUsageCount',
					'helpdeskUsageCount',
					'aiAgentUsageCount',
					'gaiaUsageCount',
				]),
			)
			.optional(),
		dimensions: z.array(z.enum(['billingId', 'billingProduct'])).optional(),
		filters: z.array(BillingUsageFilterItemSchema),
		time_dimensions: z.array(BillingUsageTimeDimensionSchema).max(1).optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const FirstResponseTimeFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const FirstResponseTimeTimeDimensionSchema = z
	.object({
		dimension: z.enum([
			'createdDatetime',
			'firstAgentMessageDatetime',
			'periodStart',
		]),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const FirstResponseTimeQuerySchema = z
	.object({
		scope: z.literal('first-response-time'),
		measures: z
			.array(z.enum(['medianFirstResponseTime', 'averageFirstResponseTime']))
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'firstResponseTime',
					'storeId',
					'storeIntegrationId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				FirstResponseTimeFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(FirstResponseTimeTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const FlowDatasetFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const FlowDatasetTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const FlowDatasetQuerySchema = z
	.object({
		scope: z.literal('flow-dataset'),
		measures: z
			.array(z.enum(['dropOffCount', 'handoverInteractionsCount']))
			.optional(),
		dimensions: z
			.array(z.enum(['channel', 'flowId', 'storeIntegrationId']))
			.optional(),
		filters: z.array(FlowDatasetFilterItemSchema),
		time_dimensions: z.array(FlowDatasetTimeDimensionSchema).max(1).optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const HandoverInteractionsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'automationFeatureType',
			'aiAgentRole',
			'engagementType',
			'resourceSourceId',
			'resourceSourceSetId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const HandoverInteractionsTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const HandoverInteractionsQuerySchema = z
	.object({
		scope: z.literal('handover-interactions'),
		measures: z.array(z.literal('handoverInteractionsCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'automationFeatureType',
					'aiAgentRole',
					'engagementType',
					'channel',
					'storeIntegrationId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
					'ticketId',
					'orderManagementType',
					'resourceSourceId',
					'resourceSourceSetId',
				]),
			)
			.optional(),
		filters: z.array(HandoverInteractionsFilterItemSchema),
		time_dimensions: z
			.array(HandoverInteractionsTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const HelpCenterFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'helpCenterId',
			'helpCenterEventType',
			'localeCodes',
			'searchQuery',
			'isSearchRequestWithClick',
			'searchResultCount',
			'articleId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const HelpCenterTimeDimensionSchema = z
	.object({
		dimension: z.literal('timestamp'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const HelpCenterQuerySchema = z
	.object({
		scope: z.literal('help-center'),
		measures: z
			.array(
				z.enum([
					'articleViewCount',
					'searchRequestedCount',
					'articleCount',
					'searchRequestedQueryCount',
					'searchArticlesClickedCount',
					'uniqueSearchArticlesClickedCount',
					'uniqueSearchQueryCount',
					'clickThroughRate',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'helpCenterId',
					'helpCenterEventType',
					'localeCodes',
					'articleId',
					'articleTitle',
					'articleSlug',
					'searchQuery',
					'searchResultRange',
				]),
			)
			.optional(),
		filters: z.array(HelpCenterFilterItemSchema),
		time_dimensions: z.array(HelpCenterTimeDimensionSchema).max(1).optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const HumanFirstResponseTimeFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const HumanFirstResponseTimeTimeDimensionSchema = z
	.object({
		dimension: z.enum([
			'createdDatetime',
			'firstAgentMessageDatetime',
			'periodStart',
		]),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const HumanFirstResponseTimeQuerySchema = z
	.object({
		scope: z.literal('human-first-response-time'),
		measures: z
			.array(z.enum(['medianFirstResponseTime', 'averageFirstResponseTime']))
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'firstResponseTime',
					'storeId',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				HumanFirstResponseTimeFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(HumanFirstResponseTimeTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const KnowledgeInsightsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'storeId',
			'resourceSourceId',
			'resourceSourceSetId',
			'resourceVersion',
			'customFieldId',
			'customFieldValueString',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const KnowledgeInsightsQuerySchema = z
	.object({
		scope: z.literal('knowledge-insights'),
		measures: z
			.array(z.enum(['averageSurveyScore', 'ticketCount', 'interactionsCount']))
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'resourceType',
					'resourceSourceId',
					'resourceSourceSetId',
					'resourceVersion',
					'customFieldTop2LevelsValue',
					'createdDatetime',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				KnowledgeInsightsFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
			]),
		),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const MessagesPerTicketFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const MessagesPerTicketTimeDimensionSchema = z
	.object({
		dimension: z.enum(['createdDatetime', 'closedDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const MessagesPerTicketQuerySchema = z
	.object({
		scope: z.literal('messages-per-ticket'),
		measures: z.array(z.literal('averageMessagesCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'messagesCount',
					'storeId',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				MessagesPerTicketFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(MessagesPerTicketTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const MessagesReceivedFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const MessagesReceivedTimeDimensionSchema = z
	.object({
		dimension: z.enum(['sentDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const MessagesReceivedQuerySchema = z
	.object({
		scope: z.literal('messages-received'),
		measures: z.array(z.literal('messagesCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'storeId',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				MessagesReceivedFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(MessagesReceivedTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const MessagesSentFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const MessagesSentTimeDimensionSchema = z
	.object({
		dimension: z.enum(['sentDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const MessagesSentQuerySchema = z
	.object({
		scope: z.literal('messages-sent'),
		measures: z.array(z.literal('messagesCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'storeId',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				MessagesSentFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z.array(MessagesSentTimeDimensionSchema).max(1).optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const OneTouchTicketsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const OneTouchTicketsTimeDimensionSchema = z
	.object({
		dimension: z.enum(['createdDatetime', 'closedDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const OneTouchTicketsQuerySchema = z
	.object({
		scope: z.literal('one-touch-tickets'),
		measures: z.array(z.literal('ticketCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'storeId',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				OneTouchTicketsFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(OneTouchTicketsTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const OnlineTimeFilterItemSchema = z
	.object({
		member: z.enum([
			'agentId',
			'periodStart',
			'periodEnd',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const OnlineTimeQuerySchema = z
	.object({
		scope: z.literal('online-time'),
		measures: z.array(z.literal('onlineTime')).optional(),
		dimensions: z.array(z.enum(['agentId'])).optional(),
		filters: z.array(OnlineTimeFilterItemSchema),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const OverallAutomatedInteractionsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'automationFeatureType',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const OverallAutomatedInteractionsTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const OverallAutomatedInteractionsQuerySchema = z
	.object({
		scope: z.literal('overall-automated-interactions'),
		measures: z.array(z.literal('automatedInteractionsCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'automationFeatureType',
					'orderManagementType',
					'flowId',
					'channel',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(OverallAutomatedInteractionsFilterItemSchema),
		time_dimensions: z
			.array(OverallAutomatedInteractionsTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const OverallAutomationRateFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'automationFeatureType',
			'aiAgentRole',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const OverallAutomationRateTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const OverallAutomationRateQuerySchema = z
	.object({
		scope: z.literal('overall-automation-rate'),
		measures: z.array(z.literal('automationRate')).optional(),
		dimensions: z
			.array(
				z.enum([
					'automationFeatureType',
					'channel',
					'storeIntegrationId',
					'aiAgentRole',
					'orderManagementType',
					'flowId',
				]),
			)
			.optional(),
		filters: z.array(OverallAutomationRateFilterItemSchema),
		time_dimensions: z
			.array(OverallAutomationRateTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const OverallDecreaseInFirstResponseTimeFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'automationFeatureType',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const OverallDecreaseInFirstResponseTimeTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const OverallDecreaseInFirstResponseTimeQuerySchema = z
	.object({
		scope: z.literal('overall-decrease-in-first-response-time'),
		measures: z
			.array(
				z.enum([
					'averageDecreaseInFirstResponseTime',
					'medianDecreaseInFirstResponseTime',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'automationFeatureType',
					'orderManagementType',
					'flowId',
					'storeIntegrationId',
					'ticketId',
					'firstResponseTime',
				]),
			)
			.optional(),
		filters: z.array(OverallDecreaseInFirstResponseTimeFilterItemSchema),
		time_dimensions: z
			.array(OverallDecreaseInFirstResponseTimeTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const OverallDecreaseInResolutionTimeFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'automationFeatureType',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const OverallDecreaseInResolutionTimeTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const OverallDecreaseInResolutionTimeQuerySchema = z
	.object({
		scope: z.literal('overall-decrease-in-resolution-time'),
		measures: z
			.array(
				z.enum([
					'averageDecreaseInResolutionTime',
					'medianDecreaseInResolutionTime',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'automationFeatureType',
					'orderManagementType',
					'flowId',
					'storeIntegrationId',
					'ticketId',
					'resolutionTime',
				]),
			)
			.optional(),
		filters: z.array(OverallDecreaseInResolutionTimeFilterItemSchema),
		time_dimensions: z
			.array(OverallDecreaseInResolutionTimeTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const OverallTimeSavedByAgentFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'automationFeatureType',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const OverallTimeSavedByAgentTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const OverallTimeSavedByAgentQuerySchema = z
	.object({
		scope: z.literal('overall-time-saved-by-agent'),
		measures: z
			.array(z.enum(['averageTimeSavedByAgent', 'medianTimeSavedByAgent']))
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'automationFeatureType',
					'orderManagementType',
					'flowId',
					'storeIntegrationId',
					'ticketId',
				]),
			)
			.optional(),
		filters: z.array(OverallTimeSavedByAgentFilterItemSchema),
		time_dimensions: z
			.array(OverallTimeSavedByAgentTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const ResolutionTimeFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const ResolutionTimeTimeDimensionSchema = z
	.object({
		dimension: z.enum(['createdDatetime', 'periodStart', 'closedDatetime']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const ResolutionTimeQuerySchema = z
	.object({
		scope: z.literal('resolution-time'),
		measures: z
			.array(z.enum(['medianResolutionTime', 'averageResolutionTime']))
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'resolutionTime',
					'storeId',
					'storeIntegrationId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				ResolutionTimeFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(ResolutionTimeTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const ResponseTimeFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const ResponseTimeTimeDimensionSchema = z
	.object({
		dimension: z.enum(['createdDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const ResponseTimeQuerySchema = z
	.object({
		scope: z.literal('response-time'),
		measures: z.array(z.literal('medianResponseTime')).optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'storeId',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				ResponseTimeFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z.array(ResponseTimeTimeDimensionSchema).max(1).optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const SatisfactionSurveysFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const SatisfactionSurveysTimeDimensionSchema = z
	.object({
		dimension: z.enum(['createdDatetime', 'sentDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const SatisfactionSurveysQuerySchema = z
	.object({
		scope: z.literal('satisfaction-surveys'),
		measures: z
			.array(
				z.enum([
					'scoredSurveysCount',
					'averageSurveyScore',
					'satisfactionScore',
					'responseRate',
					'sentSurveysCount',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'surveyScore',
					'storeId',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				SatisfactionSurveysFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(SatisfactionSurveysTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const TagsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'tagId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'createdDatetime',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const TagsTimeDimensionSchema = z
	.object({
		dimension: z.literal('timestamp'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const TagsQuerySchema = z
	.object({
		scope: z.literal('tags'),
		measures: z.array(z.literal('ticketCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'storeId',
					'tagId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				TagsFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z.array(TagsTimeDimensionSchema).max(1).optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const TicketFieldsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'integrationId',
			'storeId',
			'customFieldId',
			'productId',
			'createdDatetime',
			'customFieldValue',
			'customFieldValueString',
			'integrationChannelPair',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'score',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const TicketFieldsTimeDimensionSchema = z
	.object({
		dimension: z.literal('updatedDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const TicketFieldsQuerySchema = z
	.object({
		scope: z.literal('ticket-fields'),
		measures: z.array(z.literal('ticketCount')).optional(),
		dimensions: z.array(z.enum(['ticketId', 'customFieldValue'])).optional(),
		filters: z.array(
			z.union([
				TicketFieldsFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z.array(TicketFieldsTimeDimensionSchema).max(1).optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const TicketHandleTimeFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const TicketHandleTimeTimeDimensionSchema = z
	.object({
		dimension: z.enum(['createdDatetime', 'closedDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const TicketHandleTimeQuerySchema = z
	.object({
		scope: z.literal('ticket-handle-time'),
		measures: z.array(z.enum(['averageHandleTime', 'handleTime'])).optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'handleTime',
					'storeId',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				TicketHandleTimeFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(TicketHandleTimeTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const TicketMacroUsageFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'agentId',
			'teamId',
			'integrationId',
			'storeId',
			'storeIntegrationId',
			'score',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'macroId',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const TicketMacroUsageQuerySchema = z
	.object({
		scope: z.literal('ticket-macro-usage'),
		measures: z.array(z.enum(['ticketCount', 'ticketShare'])).optional(),
		dimensions: z
			.array(z.enum(['macroId', 'macroName', 'ticketId']))
			.optional(),
		filters: z.array(
			z.union([
				TicketMacroUsageFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(BaseReportingStatsTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const TicketSlaFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'integrationId',
			'storeId',
			'storeIntegrationId',
			'status',
			'slaPolicyUuid',
			'score',
			'resolutionCompleteness',
			'communicationSkills',
			'languageProficiency',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const TicketSlaTimeDimensionSchema = z
	.object({
		dimension: z.enum(['anchorDatetime', 'periodStart', 'createdDatetime']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const TicketSlaQuerySchema = z
	.object({
		scope: z.literal('ticket-sla'),
		measures: z.array(z.enum(['ticketCount', 'slaAchievementRate'])).optional(),
		dimensions: z
			.array(
				z.enum([
					'status',
					'channel',
					'storeId',
					'storeIntegrationId',
					'slaPolicyUuid',
					'slaDelta',
					'slaPolicyMetricName',
					'slaPolicyMetricStatus',
					'ticketId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				TicketSlaFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z.array(TicketSlaTimeDimensionSchema).max(1).optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const TicketStatusBreakdownFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'integrationId',
			'storeId',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const TicketStatusBreakdownTimeDimensionSchema = z
	.object({
		dimension: z.enum(['createdDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const TicketStatusBreakdownQuerySchema = z
	.object({
		scope: z.literal('ticket-status-breakdown'),
		measures: z
			.array(
				z.enum([
					'total',
					'inbound',
					'outbound',
					'spam',
					'inboundDeleted',
					'inboundTrashed',
					'inboundReopened',
					'inboundClosed',
					'inboundOpen',
					'outboundDeleted',
					'outboundTrashed',
					'outboundReopened',
					'outboundClosed',
					'outboundOpen',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum(['ticketId', 'agentId', 'channel', 'integrationId', 'storeId']),
			)
			.optional(),
		filters: z.array(
			z.union([
				TicketStatusBreakdownFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(TicketStatusBreakdownTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const TicketsClosedFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const TicketsClosedTimeDimensionSchema = z
	.object({
		dimension: z.enum(['closedDatetime', 'createdDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const TicketsClosedQuerySchema = z
	.object({
		scope: z.literal('tickets-closed'),
		measures: z.array(z.literal('ticketCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'storeId',
					'storeIntegrationId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				TicketsClosedFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(TicketsClosedTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const TicketsCreatedFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'aiIntentCustomFieldL1',
			'aiIntentCustomFieldL2',
			'aiIntentCustomFieldL3',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const TicketsCreatedTimeDimensionSchema = z
	.object({
		dimension: z.enum(['createdDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const TicketsCreatedQuerySchema = z
	.object({
		scope: z.literal('tickets-created'),
		measures: z.array(z.literal('ticketCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'storeId',
					'storeIntegrationId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				TicketsCreatedFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(TicketsCreatedTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const TicketsOpenFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const TicketsOpenTimeDimensionSchema = z
	.object({
		dimension: z.enum(['createdDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const TicketsOpenQuerySchema = z
	.object({
		scope: z.literal('tickets-open'),
		measures: z.array(z.literal('ticketCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'storeId',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				TicketsOpenFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z.array(TicketsOpenTimeDimensionSchema).max(1).optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const TicketsRepliedFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const TicketsRepliedTimeDimensionSchema = z
	.object({
		dimension: z.enum(['createdDatetime', 'sentDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const TicketsRepliedQuerySchema = z
	.object({
		scope: z.literal('tickets-replied'),
		measures: z.array(z.literal('ticketCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'storeId',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				TicketsRepliedFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(TicketsRepliedTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const TimeSavedByAiAgentFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'channel',
			'storeIntegrationId',
			'aiAgentRole',
			'engagementType',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const TimeSavedByAiAgentTimeDimensionSchema = z
	.object({
		dimension: z.literal('eventDatetime'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const TimeSavedByAiAgentQuerySchema = z
	.object({
		scope: z.literal('ai-agent-time-saved'),
		measures: z
			.array(z.enum(['averageTimeSavedByAgent', 'medianTimeSavedByAgent']))
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'channel',
					'aiAgentRole',
					'storeIntegrationId',
					'ticketId',
					'engagementType',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(TimeSavedByAiAgentFilterItemSchema),
		time_dimensions: z
			.array(TimeSavedByAiAgentTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const UserAvailabilityTrackingFilterItemSchema = z
	.object({
		member: z.enum([
			'agentId',
			'periodStart',
			'periodEnd',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const UserAvailabilityTrackingQuerySchema = z
	.object({
		scope: z.literal('user-availability-tracking'),
		measures: z
			.array(
				z.enum([
					'totalDurationSeconds',
					'onlineDurationSeconds',
					'offlineDurationSeconds',
					'intervalCount',
				]),
			)
			.optional(),
		dimensions: z.array(z.enum(['agentId', 'statusName'])).optional(),
		filters: z.array(UserAvailabilityTrackingFilterItemSchema),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const VoiceAgentEventsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'integrationId',
			'agentId',
			'transferredCalls',
			'declinedCalls',
			'storeId',
			'storeIntegrationId',
			'queueId',
			'isDuringBusinessHours',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const VoiceAgentEventsQuerySchema = z
	.object({
		scope: z.literal('voice-agent-events'),
		measures: z.array(z.literal('voiceCallsCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'agentId',
					'integrationId',
					'createdDatetime',
					'ticketId',
					'status',
					'transferType',
					'transferTargetAgentId',
					'transferTargetExternalNumber',
					'transferTargetQueueId',
					'assignedAgentId',
					'customerId',
					'duration',
					'source',
					'destination',
					'callDirection',
					'voicemailAvailable',
					'voicemailUrl',
					'callRecordingAvailable',
					'callRecordingUrl',
					'displayStatus',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				VoiceAgentEventsFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const VoiceCallsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'integrationId',
			'agentId',
			'queueId',
			'isDuringBusinessHours',
			'callTerminationStatus',
			'callDirection',
			'storeId',
			'displayStatus',
			'callSlaStatus',
			'talkTime',
			'waitTime',
			'storeIntegrationId',
			'isAnsweredByAgent',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const VoiceCallsQuerySchema = z
	.object({
		scope: z.literal('voice-calls'),
		measures: z
			.array(
				z.enum([
					'voiceCallsCount',
					'averageTalkTimeInSeconds',
					'averageWaitTimeInSeconds',
					'inboundCallsCount',
					'outboundCallsCount',
					'inboundAnsweredCallsCount',
					'inboundUnansweredCallsCount',
					'inboundMissedCallsCount',
					'inboundAbandonedCallsCount',
					'inboundCancelledCallsCount',
					'inboundCallbackRequestedCallsCount',
					'abandonedRate',
					'callbackRequestedRate',
					'cancelledRate',
					'missedRate',
					'slaAchievementRate',
					'breachedExposures',
					'achievedExposures',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'agentId',
					'filteringAgentId',
					'integrationId',
					'queueId',
					'customerId',
					'createdDatetime',
					'status',
					'duration',
					'source',
					'destination',
					'callDirection',
					'talkTime',
					'waitTime',
					'voicemailAvailable',
					'voicemailUrl',
					'callRecordingAvailable',
					'callRecordingUrl',
					'displayStatus',
					'queueName',
					'ticketId',
					'isPossibleSpam',
					'callSlaStatus',
					'callSlaStatusLabel',
					'storeIntegrationId',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				VoiceCallsFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const VoiceCallsSummaryFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'integrationId',
			'agentId',
			'queueId',
			'isDuringBusinessHours',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const VoiceCallsSummaryQuerySchema = z
	.object({
		scope: z.literal('voice-calls-summary'),
		measures: z
			.array(
				z.enum([
					'inboundVoiceCallsCount',
					'outboundVoiceCallsCount',
					'answeredVoiceCallsCount',
					'cancelledVoiceCallsCount',
					'abandonedVoiceCallsCount',
					'missedVoiceCallsCount',
					'unansweredVoiceCallsCount',
					'callbackRequestedVoiceCallsCount',
					'averageTalkTimeInSeconds',
					'averageWaitTimeInSeconds',
					'slaAchievementRate',
				]),
			)
			.optional(),
		filters: z.array(VoiceCallsSummaryFilterItemSchema),
		timezone: z.string(),
	})
	.strict();
const VoiceQueueExposureFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'integrationId',
			'queueId',
			'callSlaStatus',
			'storeId',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const VoiceQueueExposureTimeDimensionSchema = z
	.object({
		dimension: z.literal('queuedDate'),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const VoiceQueueExposureQuerySchema = z
	.object({
		scope: z.literal('voice-queue-exposure'),
		measures: z
			.array(
				z.enum([
					'slaAchievementRate',
					'breachedExposures',
					'achievedExposures',
					'totalExposures',
				]),
			)
			.optional(),
		dimensions: z
			.array(
				z.enum([
					'agentId',
					'integrationId',
					'queueId',
					'queueName',
					'callSlaStatusLabel',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				VoiceQueueExposureFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(VoiceQueueExposureTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const WorkloadTicketsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'agentIdFromTeamId',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const WorkloadTicketsQuerySchema = z
	.object({
		scope: z.literal('workload-tickets'),
		measures: z.array(z.literal('ticketCount')).optional(),
		dimensions: z.array(z.enum(['ticketId', 'channel'])).optional(),
		filters: z.array(
			z.union([
				WorkloadTicketsFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const ZeroTouchTicketsFilterItemSchema = z
	.object({
		member: z.enum([
			'periodStart',
			'periodEnd',
			'agentId',
			'teamId',
			'channel',
			'score',
			'integrationId',
			'communicationSkills',
			'languageProficiency',
			'resolutionCompleteness',
			'accuracy',
			'efficiency',
			'internalCompliance',
			'brandVoice',
			'storeId',
			'storeIntegrationId',
			'agentIdFromTeamId',
			'aiAgentFilter',
		]),
		operator: ReportingStatsOperatorsEnumSchema,
		values: z.union([z.array(z.string()), z.array(z.number().int())]),
	})
	.strict();
const ZeroTouchTicketsTimeDimensionSchema = z
	.object({
		dimension: z.enum(['createdDatetime', 'closedDatetime', 'periodStart']),
		granularity: CubeTimeDimensionGranularitiesEnumSchema,
	})
	.strict();
const ZeroTouchTicketsQuerySchema = z
	.object({
		scope: z.literal('zero-touch-tickets'),
		measures: z.array(z.literal('ticketCount')).optional(),
		dimensions: z
			.array(
				z.enum([
					'ticketId',
					'agentId',
					'channel',
					'integrationId',
					'storeId',
					'storeIntegrationId',
					'aiIntentCustomField',
					'aiIntentCustomFieldL1',
					'aiIntentCustomFieldL2',
					'aiIntentCustomFieldL3',
				]),
			)
			.optional(),
		filters: z.array(
			z.union([
				ZeroTouchTicketsFilterItemSchema,
				BaseReportingStatsCustomFilterItemSchema,
				BaseReportingStatsRepeatableFilterItemSchema,
			]),
		),
		time_dimensions: z
			.array(ZeroTouchTicketsTimeDimensionSchema)
			.max(1)
			.optional(),
		timezone: z.string(),
		order: z
			.array(z.array(z.record(z.string(), z.json())).min(2).max(2))
			.optional(),
	})
	.strict();
const ReportingStatsSchema = z
	.object({
		query: z.union([
			TicketsClosedQuerySchema,
			TicketsCreatedQuerySchema,
			TicketsOpenQuerySchema,
			TicketsRepliedQuerySchema,
			OneTouchTicketsQuerySchema,
			ZeroTouchTicketsQuerySchema,
			SatisfactionSurveysQuerySchema,
			ResolutionTimeQuerySchema,
			MessagesSentQuerySchema,
			TicketMacroUsageQuerySchema,
			FirstResponseTimeQuerySchema,
			HumanFirstResponseTimeQuerySchema,
			ResponseTimeQuerySchema,
			MessagesPerTicketQuerySchema,
			TicketHandleTimeQuerySchema,
			OnlineTimeQuerySchema,
			TagsQuerySchema,
			TicketFieldsQuerySchema,
			AutoQAQuerySchema,
			MessagesReceivedQuerySchema,
			WorkloadTicketsQuerySchema,
			VoiceCallsQuerySchema,
			VoiceAgentEventsQuerySchema,
			TicketSlaQuerySchema,
			KnowledgeInsightsQuerySchema,
			VoiceCallsSummaryQuerySchema,
			VoiceQueueExposureQuerySchema,
			UserAvailabilityTrackingQuerySchema,
			HelpCenterQuerySchema,
			AiSalesAgentOrdersPerformanceQuerySchema,
			AiSalesAgentDiscountsQuerySchema,
			AiSalesAgentActivityQuerySchema,
			OverallAutomationRateQuerySchema,
			AIAgentAutomatedInteractionsQuerySchema,
			OverallAutomatedInteractionsQuerySchema,
			HandoverInteractionsQuerySchema,
			AiSalesAgentBuyThroughRateQuerySchema,
			AiSalesAgentConversionRateQuerySchema,
			AiSalesAgentContributionToTotalSalesQuerySchema,
			AiAgentCoverageRateQuerySchema,
			AiAgentHandoverRateQuerySchema,
			AiAgentSuccessRateQuerySchema,
			OverallTimeSavedByAgentQuerySchema,
			TimeSavedByAiAgentQuerySchema,
			AiAgentTicketFieldsQuerySchema,
			OverallDecreaseInResolutionTimeQuerySchema,
			AIAgentDecreaseInResolutionTimeQuerySchema,
			FlowDatasetQuerySchema,
			AiAgentCsatQuerySchema,
			OverallDecreaseInFirstResponseTimeQuerySchema,
			AIAgentDecreaseInFirstResponseTimeQuerySchema,
			TicketStatusBreakdownQuerySchema,
			BillingUsageQuerySchema,
		]),
	})
	.strict();
const ReportingStatsScopesEnumSchema = z.enum([
	'tickets-closed',
	'tickets-created',
	'tickets-open',
	'tickets-replied',
	'one-touch-tickets',
	'zero-touch-tickets',
	'satisfaction-surveys',
	'satisfaction-surveys-v2',
	'resolution-time',
	'messages-sent',
	'first-response-time',
	'human-first-response-time',
	'response-time',
	'messages-per-ticket',
	'ticket-handle-time',
	'online-time',
	'tags',
	'auto-qa',
	'messages-received',
	'messages-sent-per-macro',
	'ticket-macro-usage',
	'automation-rate',
	'workload-tickets',
	'automated-interactions',
	'ticket-fields',
	'voice-calls',
	'voice-agent-events',
	'ticket-sla',
	'knowledge-insights',
	'voice-calls-summary',
	'voice-queue-exposure',
	'user-availability-tracking',
	'convert-campaign-events',
	'convert-order-conversion',
	'convert-campaign-order-events',
	'help-center',
	'ai-sales-agent-orders',
	'ai-sales-agent-conversations',
	'overall-automation-rate',
	'ai-agent-automated-interactions',
	'overall-automated-interactions',
	'handover-interactions',
	'ai-sales-agent-orders-performance',
	'ai-sales-agent-discounts',
	'ai-sales-agent-activity',
	'ai-sales-agent-buy-through-rate',
	'ai-sales-agent-conversion-rate',
	'ai-sales-agent-contribution-to-total-sales',
	'ai-agent-coverage-rate',
	'ai-agent-success-rate',
	'ai-agent-handover-rate',
	'ai-agent-funnel',
	'overall-time-saved-by-agent',
	'ai-agent-time-saved',
	'ai-agent-tickets-closed',
	'ai-agent-ticket-fields',
	'overall-decrease-in-resolution-time',
	'ai-agent-decrease-in-resolution-time',
	'flow-dataset',
	'ai-agent-csat',
	'overall-decrease-in-first-response-time',
	'ai-agent-decrease-in-first-response-time',
	'revenue',
	'ai-influenced-orders-lookup',
	'ticket-status-breakdown',
	'gaia-current-billing-usage',
	'billing-usage',
	'live-chat-summary',
	'live-ticket-summary',
]);
const AnalyticsReportingMetaSchema = z
	.object({
		scope: ReportingStatsScopesEnumSchema,
		prev_cursor: z.string(),
		next_cursor: z.string(),
		total: z.number().int(),
		offset: z.number().int(),
		limit: z.number().int(),
	})
	.strict();
const AnalyticsReportingSchema = z
	.object({
		object: z.string(),
		uri: z.string(),
		data: z
			.array(
				z.record(
					z.string(),
					z.union([
						z.boolean(),
						z.string(),
						z.number().int(),
						z.array(z.record(z.string(), z.json())),
						z.record(z.string(), z.json()),
					]),
				),
			)
			.max(10000),
		meta: AnalyticsReportingMetaSchema,
	})
	.strict();
const TicketExtraAttributeSchema = z.literal('custom_fields');
const VoiceCallEventSchema = z
	.object({
		id: z.number().int().optional(),
		type: z
			.enum([
				'phone-call-answered',
				'phone-call-ringing',
				'phone-call-dial-failed',
				'phone-call-agent-dialed',
				'incoming-phone-call',
				'outgoing-phone-call',
				'completed-phone-call',
				'call-recording',
				'missed-phone-call',
				'declined-phone-call',
				'call-ending-triggered',
				'voicemail-recording',
				'phone-call-conversation-started',
				'phone-call-forwarded-to-external-number',
				'phone-call-forwarded-to-gorgias-number',
				'phone-call-forwarded',
				'message-played',
				'outgoing-phone-call-connected',
				'child-call-not_answered',
				'phone-call-transfer-initiated',
				'phone-call-transfer-failed',
				'phone-call-enqueued',
				'phone-call-enqueue-skipped',
				'phone-call-dequeued',
				'phone-call-wrap-up-started',
				'phone-call-wrap-up-ended',
				'ivr-menu-presented',
				'ivr-option-selected',
				'phone-call-deflected-to-sms',
				'customer-field-conditional-evaluated',
				'monitoring-started',
				'monitoring-ended',
				'monitoring-updated',
			])
			.optional(),
		account_id: z.number().int().optional(),
		call_id: z.number().int().optional(),
		user_id: z.number().int().optional(),
		customer_id: z.number().int().optional(),
		created_datetime: z.string().optional(),
		meta: z.record(z.string(), z.json()).optional(),
	})
	.strict();
const VoiceCallRecordingSchema = z
	.object({
		id: z.number().int().optional(),
		call_id: z.number().int().optional(),
		external_id: z.string().optional(),
		url: z.string().optional(),
		duration: z.number().int().optional(),
		type: z.enum(['call-recording', 'voicemail']).optional(),
		created_datetime: z.string().optional(),
		deleted_datetime: z.string().optional(),
		deleted_by_user_id: z.number().int().optional(),
		error_code: z.enum(['RECORDING_IS_PRIVATE']).optional(),
		transcription_status: z
			.union([
				z.literal('requested'),
				z.literal('completed'),
				z.literal('failed'),
				z.literal('recording_too_short'),
				z.literal('recording_too_long'),
				z.literal(null),
				z.literal('low_quality_transcription'),
			])
			.optional(),
	})
	.strict();
const VoiceCallSchema = z
	.object({
		id: z.number().int(),
		integration_id: z.number().int(),
		ticket_id: z.number().int().optional(),
		phone_number_id: z.number().int().optional(),
		external_id: z.string(),
		provider: z.string(),
		status: z.enum([
			'answered',
			'connected',
			'in-progress',
			'initiated',
			'queued',
			'ringing',
			'ending',
			'busy',
			'canceled',
			'completed',
			'failed',
			'no-answer',
			'missed',
		]),
		direction: z.enum(['inbound', 'outbound']),
		phone_number_source: z.string().optional(),
		country_source: z.string().optional(),
		phone_number_destination: z.string().optional(),
		country_destination: z.string().optional(),
		duration: z.number().int().optional(),
		started_datetime: z.string().optional(),
		created_datetime: z.string(),
		updated_datetime: z.string().optional(),
		initiated_by_agent_id: z.number().int().optional(),
		last_answered_by_agent_id: z.number().int().optional(),
		customer_id: z.number().int().optional(),
		last_rang_agent_id: z.number().int().optional(),
		has_voicemail: z.boolean().optional(),
		has_call_recording: z.boolean().optional(),
		summaries: z
			.array(
				z
					.object({
						id: z.number().int(),
						recording_id: z.number().int(),
						summary: z.string(),
						created_datetime: z.string(),
					})
					.strict(),
			)
			.optional(),
		termination_status: z
			.enum([
				'answered',
				'cancelled',
				'missed',
				'abandoned',
				'callback-requested',
			])
			.optional(),
		queue_id: z.number().int().optional(),
		status_in_queue: z.string().optional(),
		answered_by_external_number: z.string().optional(),
		answered_by_external_customer_id: z.number().int().optional(),
		monitoring_status: z.enum(['listening', 'whispering', 'none']).optional(),
		last_monitoring_agent_id: z.number().int().nullable().optional(),
	})
	.strict();
const CursorPaginationMetaSchema = z
	.object({
		prev_cursor: z.string(),
		next_cursor: z.string(),
		total_resources: z.number().int(),
	})
	.strict();
const CustomerCustomFieldSchema = z
	.object({
		id: z.number().int(),
		external_id: z.string(),
		object_type: ObjectTypeSchema,
		label: z.string().min(0).max(255),
		description: z.string().min(0).max(1024),
		priority: z.number().int().min(0),
		required: z.boolean(),
		managed_type: ManagedCustomerFieldTypeSchema,
		definition: z.union([
			TextDataTypeDefinitionSchema,
			NumberDataTypeDefinitionSchema,
			BooleanDataTypeDefinitionSchema,
		]),
		created_datetime: z.string(),
		updated_datetime: z.string(),
		deactivated_datetime: z.string(),
	})
	.strict();
const CustomerCustomFieldWithValueSchema = z
	.object({
		field: CustomerCustomFieldSchema,
		value: z.record(z.string(), z.json()),
	})
	.strict();
const TicketTeamSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		decoration: z.record(z.string(), z.json()),
	})
	.strict();
const IntegrationTypeSchema = z.enum([
	'aircall',
	'alloy',
	'app',
	'bigcommerce',
	'ecom',
	'email',
	'facebook',
	'gmail',
	'gorgias_chat',
	'http',
	'klaviyo',
	'magento2',
	'outlook',
	'phone',
	'recharge',
	'self_service',
	'shopify',
	'smile',
	'smooch',
	'smooch_inside',
	'sms',
	'twitter',
	'whatsapp',
	'yotpo',
	'zendesk',
]);
const TicketCompactCustomerSchema = z
	.object({
		id: z.number().int(),
		email: z.string(),
		name: z.string(),
		firstname: z.string(),
		lastname: z.string(),
		meta: z.record(z.string(), z.json()),
	})
	.strict();
const TicketCompactIntegrationSchema = z
	.object({
		name: z.string(),
		address: z.string(),
		type: IntegrationTypeSchema,
	})
	.strict();
const TicketCompactSchema = z
	.object({
		id: z.number().int(),
		uri: z.string(),
		external_id: z.string(),
		language: z.string(),
		status: TicketStatusSchema.optional(),
		priority: TicketPrioritySchema.optional(),
		channel: z.union([LegacyChannelSlugSchema, z.string()]),
		via: TicketViaSchema,
		from_agent: z.boolean(),
		customer: TicketCompactCustomerSchema,
		assignee_user: TicketUserSchema,
		assignee_team: TicketTeamSchema,
		subject: z.string(),
		summary: TicketSummarySchema.optional(),
		excerpt: z.string(),
		integrations: z.array(TicketCompactIntegrationSchema),
		meta: TicketMetaSchema,
		tags: z.array(TicketTagSchema),
		messages_count: z.number().int(),
		is_unread: z.boolean(),
		spam: z.boolean(),
		created_datetime: z.string(),
		opened_datetime: z.string(),
		last_received_message_datetime: z.string(),
		last_message_datetime: z.string(),
		last_sent_message_not_delivered: z.boolean(),
		updated_datetime: z.string(),
		closed_datetime: z.string(),
		snooze_datetime: z.string(),
		trashed_datetime: z.string(),
		custom_fields: z
			.record(z.string(), TicketCustomFieldValueSchema)
			.optional(),
	})
	.strict();
const ViewItemsListRespMetaSchema = z
	.object({
		current_cursor: z.string().optional(),
		next_items: z.string().url().optional(),
		prev_items: z.string().url().optional(),
	})
	.strict();
const ViewCategorySchema = z.enum(['system', 'user']);
const FileSchema = z
	.object({
		content_type: z.string().optional(),
		name: z.string().optional(),
		size: z.number().int().optional(),
		url: z.string().url().optional(),
	})
	.strict();
const MetricCardIncludeEnumSchema = z.literal('deprecated');
const MetricCardListSchema = z
	.object({
		data: z.array(MetricCardSchema),
	})
	.strict();
const UpdateCustomFieldSchema = z
	.object({
		external_id: z.string().optional(),
		object_type: ObjectTypeSchema.optional(),
		label: z.string().min(1).max(255).optional(),
		description: z.string().min(0).max(1024).optional(),
		priority: z.number().int().optional(),
		required: z.boolean().optional(),
		requirement_type: RequirementTypeSchema.optional(),
		managed_type: z
			.union([ManagedTicketFieldTypeSchema, ManagedCustomerFieldTypeSchema])
			.optional(),
		definition: z
			.union([
				TextDataTypeDefinitionSchema,
				NumberDataTypeDefinitionSchema,
				BooleanDataTypeDefinitionSchema,
			])
			.optional(),
		deactivated_datetime: z.string().optional(),
	})
	.strict();
const UpdateCustomFieldItemSchema = z
	.object({
		external_id: z.string().optional(),
		object_type: ObjectTypeSchema.optional(),
		label: z.string().min(1).max(255).optional(),
		description: z.string().min(0).max(1024).optional(),
		priority: z.number().int().optional(),
		required: z.boolean().optional(),
		requirement_type: RequirementTypeSchema.optional(),
		managed_type: z
			.union([ManagedTicketFieldTypeSchema, ManagedCustomerFieldTypeSchema])
			.optional(),
		definition: z
			.union([
				TextDataTypeDefinitionSchema,
				NumberDataTypeDefinitionSchema,
				BooleanDataTypeDefinitionSchema,
			])
			.optional(),
		deactivated_datetime: z.string().optional(),
		id: z.number().int(),
	})
	.strict();
const UpdateCustomFieldListSchema = z.array(UpdateCustomFieldItemSchema);
const CustomerCustomFieldValueSchema = z
	.object({
		id: z.number().int(),
		value: z.record(z.string(), z.json()),
	})
	.strict();
const UpdateTicketCustomFieldValueSchema = z
	.object({
		id: z.number().int(),
		value: z.union([z.string(), z.boolean(), z.number(), z.number().int()]),
	})
	.strict();
const UpdateTicketCustomFieldValuesSchema = z.array(
	UpdateTicketCustomFieldValueSchema,
);
const UpdateTicketAssigneeTeamSchema = z
	.object({
		id: z.number().int().min(0).optional(),
	})
	.strict();
const UpdateTicketAssigneeUserSchema = z
	.object({
		id: z.number().int().min(0).optional(),
	})
	.strict();
const UpdateTicketCustomFieldSchema = z
	.object({
		id: z.number().int(),
		value: z.record(z.string(), z.json()),
	})
	.strict();
const UpdateTicketCustomerSchema = z
	.object({
		id: z.number().int().min(1).optional(),
		email: z.string().max(320).optional(),
		name: z.string().optional(),
	})
	.strict();
const UpdateTicketTagDecorationSchema = z
	.object({
		color: z.string().optional(),
	})
	.strict();
const UpdateTicketTagSchema = z
	.object({
		name: z.string().min(1).max(256),
		decoration: UpdateTicketTagDecorationSchema.optional(),
	})
	.strict();
const UpdateTicketSchema = z
	.object({
		assignee_team: UpdateTicketAssigneeTeamSchema.optional(),
		assignee_user: UpdateTicketAssigneeUserSchema.optional(),
		channel: z.union([LegacyChannelSlugSchema, z.string()]).optional(),
		closed_datetime: z.string().optional(),
		custom_fields: z.array(UpdateTicketCustomFieldSchema).optional(),
		customer: UpdateTicketCustomerSchema.optional(),
		external_id: z.string().max(255).optional(),
		from_agent: z.boolean().optional(),
		is_unread: z.boolean().optional(),
		language: z.string().optional(),
		last_message_datetime: z.string().optional(),
		last_received_message_datetime: z.string().optional(),
		meta: z
			.record(
				z.string(),
				z.union([
					z.string(),
					z.number().int(),
					z.number(),
					z.boolean(),
					z.record(z.string(), z.json()),
					z.array(z.record(z.string(), z.json())),
				]),
			)
			.optional(),
		opened_datetime: z.string().optional(),
		priority: TicketPrioritySchema.optional(),
		snooze_datetime: z.string().optional(),
		spam: z.boolean().optional(),
		status: TicketStatusSchema.optional(),
		subject: z.string().optional(),
		tags: z.array(UpdateTicketTagSchema).optional(),
		trashed_datetime: z.string().optional(),
		updated_datetime: z.string().optional(),
		via: z
			.enum([
				'aircall',
				'api',
				'chat',
				'contact_form',
				'email',
				'facebook',
				'facebook-mention',
				'facebook-messenger',
				'facebook-recommendations',
				'form',
				'helpdesk',
				'help-center',
				'instagram',
				'instagram-ad-comment',
				'instagram-comment',
				'instagram-direct-message',
				'instagram-mention',
				'internal-note',
				'phone',
				'rule',
				'shopify',
				'sms',
				'twilio',
				'twitter',
				'twitter-direct-message',
				'whatsapp',
				'yotpo',
				'yotpo-review',
				'zendesk',
			])
			.optional(),
	})
	.strict();
const ViewUpdateSchema = z
	.object({
		decoration: ViewDecorationSchema.optional(),
		fields: z.array(ViewFieldSchema).optional(),
		filters: z.string().optional(),
		name: z.string().optional(),
		order_by: z.string().optional(),
		order_dir: z.enum(['asc', 'desc']).optional(),
		shared_with_teams: z.array(z.number().int()).max(100).optional(),
		shared_with_users: z.array(z.number().int()).max(100).optional(),
		slug: z.string().optional(),
		type: ViewTypeSchema.optional(),
		visibility: ViewVisibilitySchema.optional(),
	})
	.strict();

export const GorgiasComponents = {
	ArchiveMacrosAsUser: ArchiveMacrosAsUserSchema,
	ArchiveMacroAsUserStatusEnum: ArchiveMacroAsUserStatusEnumSchema,
	MacroUsageErrorData: MacroUsageErrorDataSchema,
	MacroUsageError: MacroUsageErrorSchema,
	ArchiveMacroAsUserResult: ArchiveMacroAsUserResultSchema,
	ArchiveMacrosAsUserResult: ArchiveMacrosAsUserResultSchema,
	UnarchiveMacrosAsUser: UnarchiveMacrosAsUserSchema,
	UnarchiveMacroAsUserStatusEnum: UnarchiveMacroAsUserStatusEnumSchema,
	UnArchiveMacroAsUserResult: UnArchiveMacroAsUserResultSchema,
	UnarchiveMacrosAsUserResult: UnarchiveMacrosAsUserResultSchema,
	AccountSettingSatisfactionSurveysTyped:
		AccountSettingSatisfactionSurveysTypedSchema,
	AccountSettingAutoMergeTyped: AccountSettingAutoMergeTypedSchema,
	AccountSettingAutoSplitTyped: AccountSettingAutoSplitTypedSchema,
	AccountSettingBusinessHoursTyped: AccountSettingBusinessHoursTypedSchema,
	AccountSettingTicketAssignmentTyped:
		AccountSettingTicketAssignmentTypedSchema,
	AccountSettingViewsOrderingTyped: AccountSettingViewsOrderingTypedSchema,
	AccountSettingAccessTyped: AccountSettingAccessTypedSchema,
	AccountSettingViewsVisibilityTyped: AccountSettingViewsVisibilityTypedSchema,
	AccountSettingAgentsTableConfigTyped:
		AccountSettingAgentsTableConfigTypedSchema,
	AccountSettingAgentsAvailabilityTableConfigTyped:
		AccountSettingAgentsAvailabilityTableConfigTypedSchema,
	AccountSettingChannelsTableConfigTyped:
		AccountSettingChannelsTableConfigTypedSchema,
	AccountSettingProductInsightsTableConfigTyped:
		AccountSettingProductInsightsTableConfigTypedSchema,
	AccountSettingInTicketSuggestionTyped:
		AccountSettingInTicketSuggestionTypedSchema,
	AccountSettingAgentCostsTyped: AccountSettingAgentCostsTypedSchema,
	AccountSettingLimitsTyped: AccountSettingLimitsTypedSchema,
	AccountSettingDefaultIntegrationTyped:
		AccountSettingDefaultIntegrationTypedSchema,
	AccountSettingBillingProductHardLimitsTyped:
		AccountSettingBillingProductHardLimitsTypedSchema,
	BooleanDropdownInputSettings: BooleanDropdownInputSettingsSchema,
	BooleanDataTypeDefinition: BooleanDataTypeDefinitionSchema,
	DropdownInputSettingsSettings: DropdownInputSettingsSettingsSchema,
	ManagedCustomerFieldType: ManagedCustomerFieldTypeSchema,
	NumberInputSettings: NumberInputSettingsSchema,
	NumberDataTypeDefinition: NumberDataTypeDefinitionSchema,
	ObjectType: ObjectTypeSchema,
	TextInputSettings: TextInputSettingsSchema,
	TextDataTypeDefinition: TextDataTypeDefinitionSchema,
	ManagedTicketFieldType: ManagedTicketFieldTypeSchema,
	RequirementType: RequirementTypeSchema,
	CreateCustomField: CreateCustomFieldSchema,
	CustomField: CustomFieldSchema,
	Customer: CustomerSchema,
	Integration: IntegrationSchema,
	Job: JobSchema,
	MacroAction: MacroActionSchema,
	Macro: MacroSchema,
	MetricFeedbackDisagreementType: MetricFeedbackDisagreementTypeSchema,
	MetricFeedbackRequest: MetricFeedbackRequestSchema,
	MetricFeedbackResponse: MetricFeedbackResponseSchema,
	Rule: RuleSchema,
	SatisfactionSurvey: SatisfactionSurveySchema,
	TagDecoration: TagDecorationSchema,
	Tag: TagSchema,
	Team: TeamSchema,
	LegacyChannelSlug: LegacyChannelSlugSchema,
	TicketVia: TicketViaSchema,
	TicketMessageSourceType: TicketMessageSourceTypeSchema,
	TicketMessageAttachment: TicketMessageAttachmentSchema,
	TicketMessageAuthCustomerIdentityService:
		TicketMessageAuthCustomerIdentityServiceSchema,
	TicketMessageAuthCustomerIdentity: TicketMessageAuthCustomerIdentitySchema,
	TicketMessageIntent: TicketMessageIntentSchema,
	TicketMessageMacro: TicketMessageMacroSchema,
	TicketMessageSourceAddress: TicketMessageSourceAddressSchema,
	TicketMessageSource: TicketMessageSourceSchema,
	TicketMessageUserOrCustomer: TicketMessageUserOrCustomerSchema,
	TicketMessageRepliedByOrTo: TicketMessageRepliedByOrToSchema,
	TicketMessageSendingError: TicketMessageSendingErrorSchema,
	TicketMessage: TicketMessageSchema,
	CreateMessageAttachment: CreateMessageAttachmentSchema,
	CreateMessageCustomerChannel: CreateMessageCustomerChannelSchema,
	CreateMessageCustomerOrUser: CreateMessageCustomerOrUserSchema,
	CreateMessageLastSendingError: CreateMessageLastSendingErrorSchema,
	CreateMessageMacro: CreateMessageMacroSchema,
	CreateMessageSourcePerson: CreateMessageSourcePersonSchema,
	CreateMessageMeta: CreateMessageMetaSchema,
	CreateMessageSource: CreateMessageSourceSchema,
	CreateMessage: CreateMessageSchema,
	TicketStatus: TicketStatusSchema,
	CreateTicketAssignee: CreateTicketAssigneeSchema,
	CreateTicketCustomField: CreateTicketCustomFieldSchema,
	CreateTicketCustomer: CreateTicketCustomerSchema,
	CreateTicketMessageAttachment: CreateTicketMessageAttachmentSchema,
	CreateTicketMessageCustomerChannel: CreateTicketMessageCustomerChannelSchema,
	CreateTicketMessageCustomerOrUser: CreateTicketMessageCustomerOrUserSchema,
	CreateTicketMessageLastSendingError:
		CreateTicketMessageLastSendingErrorSchema,
	CreateTicketMessageMacro: CreateTicketMessageMacroSchema,
	CreateTicketMessageMeta: CreateTicketMessageMetaSchema,
	CreateTicketMessageSourcePerson: CreateTicketMessageSourcePersonSchema,
	CreateTicketMessageSource: CreateTicketMessageSourceSchema,
	CreateTicketMessage: CreateTicketMessageSchema,
	CreateTicketTagDecoration: CreateTicketTagDecorationSchema,
	CreateTicketTag: CreateTicketTagSchema,
	TicketPriority: TicketPrioritySchema,
	CreateTicket: CreateTicketSchema,
	Currency: CurrencySchema,
	InputSettingsDropdown_bool: InputSettingsDropdown_boolSchema,
	DefinitionBoolean: DefinitionBooleanSchema,
	InputSettingsNumber: InputSettingsNumberSchema,
	DefinitionNumber: DefinitionNumberSchema,
	InputSettingsDropdown_str: InputSettingsDropdown_strSchema,
	InputSettingsText: InputSettingsTextSchema,
	DefinitionText: DefinitionTextSchema,
	DiscountType: DiscountTypeSchema,
	EventObjectType: EventObjectTypeSchema,
	OrderLine: OrderLineSchema,
	PaymentStatus: PaymentStatusSchema,
	ShopperAddress: ShopperAddressSchema,
	Status: StatusSchema,
	Order: OrderSchema,
	ShopperStatus: ShopperStatusSchema,
	Shopper: ShopperSchema,
	StoreType: StoreTypeSchema,
	Store: StoreSchema,
	ShopperEcommerceData: ShopperEcommerceDataSchema,
	TicketCustomField: TicketCustomFieldSchema,
	TicketCustomFieldValue: TicketCustomFieldValueSchema,
	TicketCustomerChannelCustomer: TicketCustomerChannelCustomerSchema,
	TicketCustomerChannel: TicketCustomerChannelSchema,
	TicketCustomer: TicketCustomerSchema,
	TicketEventUser: TicketEventUserSchema,
	TicketEvent: TicketEventSchema,
	TicketMeta: TicketMetaSchema,
	TicketReplyOptionIntegration: TicketReplyOptionIntegrationSchema,
	TicketReplyOption: TicketReplyOptionSchema,
	TicketSatisfactionSurvey: TicketSatisfactionSurveySchema,
	TicketSummary: TicketSummarySchema,
	TicketTagDecoration: TicketTagDecorationSchema,
	TicketTag: TicketTagSchema,
	TicketUser: TicketUserSchema,
	Ticket: TicketSchema,
	User: UserSchema,
	ViewDecoration: ViewDecorationSchema,
	ViewField: ViewFieldSchema,
	ViewType: ViewTypeSchema,
	ViewVisibility: ViewVisibilitySchema,
	ViewCreate: ViewCreateSchema,
	ViewSharedWithTeam: ViewSharedWithTeamSchema,
	ViewSharedWithUser: ViewSharedWithUserSchema,
	View: ViewSchema,
	Widget: WidgetSchema,
	Account: AccountSchema,
	Event: EventSchema,
	IntegrationDetail: IntegrationDetailSchema,
	Statistic: StatisticSchema,
	MetricCardApiFilter: MetricCardApiFilterSchema,
	MetricCardApiMapping: MetricCardApiMappingSchema,
	MetricCardPublic: MetricCardPublicSchema,
	MetricCardRef: MetricCardRefSchema,
	MetricCardSlugEnum: MetricCardSlugEnumSchema,
	MetricCardStatusEnum: MetricCardStatusEnumSchema,
	MetricCard: MetricCardSchema,
	ReportingStatsOperatorsEnum: ReportingStatsOperatorsEnumSchema,
	AIAgentAutomatedInteractionsFilterItem:
		AIAgentAutomatedInteractionsFilterItemSchema,
	CubeTimeDimensionGranularitiesEnum: CubeTimeDimensionGranularitiesEnumSchema,
	AIAgentAutomatedInteractionsTimeDimension:
		AIAgentAutomatedInteractionsTimeDimensionSchema,
	CubeOrderDirectionsEnum: CubeOrderDirectionsEnumSchema,
	AIAgentAutomatedInteractionsQuery: AIAgentAutomatedInteractionsQuerySchema,
	AIAgentDecreaseInFirstResponseTimeFilterItem:
		AIAgentDecreaseInFirstResponseTimeFilterItemSchema,
	AIAgentDecreaseInFirstResponseTimeTimeDimension:
		AIAgentDecreaseInFirstResponseTimeTimeDimensionSchema,
	AIAgentDecreaseInFirstResponseTimeQuery:
		AIAgentDecreaseInFirstResponseTimeQuerySchema,
	AIAgentDecreaseInResolutionTimeFilterItem:
		AIAgentDecreaseInResolutionTimeFilterItemSchema,
	AIAgentDecreaseInResolutionTimeTimeDimension:
		AIAgentDecreaseInResolutionTimeTimeDimensionSchema,
	AIAgentDecreaseInResolutionTimeQuery:
		AIAgentDecreaseInResolutionTimeQuerySchema,
	AiAgentCoverageRateFilterItem: AiAgentCoverageRateFilterItemSchema,
	AiAgentCoverageRateTimeDimension: AiAgentCoverageRateTimeDimensionSchema,
	AiAgentCoverageRateQuery: AiAgentCoverageRateQuerySchema,
	AiAgentCsatFilterItem: AiAgentCsatFilterItemSchema,
	AiAgentCsatTimeDimension: AiAgentCsatTimeDimensionSchema,
	AiAgentCsatQuery: AiAgentCsatQuerySchema,
	AiAgentHandoverRateFilterItem: AiAgentHandoverRateFilterItemSchema,
	AiAgentHandoverRateTimeDimension: AiAgentHandoverRateTimeDimensionSchema,
	AiAgentHandoverRateQuery: AiAgentHandoverRateQuerySchema,
	AiAgentSuccessRateFilterItem: AiAgentSuccessRateFilterItemSchema,
	AiAgentSuccessRateTimeDimension: AiAgentSuccessRateTimeDimensionSchema,
	AiAgentSuccessRateQuery: AiAgentSuccessRateQuerySchema,
	AiAgentTicketFieldsFilterItem: AiAgentTicketFieldsFilterItemSchema,
	AiAgentTicketFieldsTimeDimension: AiAgentTicketFieldsTimeDimensionSchema,
	AiAgentTicketFieldsQuery: AiAgentTicketFieldsQuerySchema,
	AiSalesAgentActivityFilterItem: AiSalesAgentActivityFilterItemSchema,
	AiSalesAgentActivityTimeDimension: AiSalesAgentActivityTimeDimensionSchema,
	AiSalesAgentActivityQuery: AiSalesAgentActivityQuerySchema,
	AiSalesAgentBuyThroughRateFilterItem:
		AiSalesAgentBuyThroughRateFilterItemSchema,
	AiSalesAgentBuyThroughRateTimeDimension:
		AiSalesAgentBuyThroughRateTimeDimensionSchema,
	AiSalesAgentBuyThroughRateQuery: AiSalesAgentBuyThroughRateQuerySchema,
	AiSalesAgentContributionToTotalSalesFilterItem:
		AiSalesAgentContributionToTotalSalesFilterItemSchema,
	AiSalesAgentContributionToTotalSalesTimeDimension:
		AiSalesAgentContributionToTotalSalesTimeDimensionSchema,
	AiSalesAgentContributionToTotalSalesQuery:
		AiSalesAgentContributionToTotalSalesQuerySchema,
	AiSalesAgentConversionRateFilterItem:
		AiSalesAgentConversionRateFilterItemSchema,
	AiSalesAgentConversionRateTimeDimension:
		AiSalesAgentConversionRateTimeDimensionSchema,
	AiSalesAgentConversionRateQuery: AiSalesAgentConversionRateQuerySchema,
	AiSalesAgentDiscountsFilterItem: AiSalesAgentDiscountsFilterItemSchema,
	AiSalesAgentDiscountsTimeDimension: AiSalesAgentDiscountsTimeDimensionSchema,
	AiSalesAgentDiscountsQuery: AiSalesAgentDiscountsQuerySchema,
	AiSalesAgentOrdersPerformanceFilterItem:
		AiSalesAgentOrdersPerformanceFilterItemSchema,
	AiSalesAgentOrdersPerformanceTimeDimension:
		AiSalesAgentOrdersPerformanceTimeDimensionSchema,
	AiSalesAgentOrdersPerformanceQuery: AiSalesAgentOrdersPerformanceQuerySchema,
	AutoQAFilterItem: AutoQAFilterItemSchema,
	AutoQATimeDimension: AutoQATimeDimensionSchema,
	BaseReportingStatsCustomFilterValueItem:
		BaseReportingStatsCustomFilterValueItemSchema,
	BaseReportingStatsCustomFilterItem: BaseReportingStatsCustomFilterItemSchema,
	BaseReportingStatsRepeatableFilterItemValue:
		BaseReportingStatsRepeatableFilterItemValueSchema,
	BaseReportingStatsRepeatableFilterItem:
		BaseReportingStatsRepeatableFilterItemSchema,
	AutoQAQuery: AutoQAQuerySchema,
	ReportingStatsTimeDimensionsEnum: ReportingStatsTimeDimensionsEnumSchema,
	BaseReportingStatsTimeDimension: BaseReportingStatsTimeDimensionSchema,
	BillingUsageFilterItem: BillingUsageFilterItemSchema,
	BillingUsageTimeDimension: BillingUsageTimeDimensionSchema,
	BillingUsageQuery: BillingUsageQuerySchema,
	FirstResponseTimeFilterItem: FirstResponseTimeFilterItemSchema,
	FirstResponseTimeTimeDimension: FirstResponseTimeTimeDimensionSchema,
	FirstResponseTimeQuery: FirstResponseTimeQuerySchema,
	FlowDatasetFilterItem: FlowDatasetFilterItemSchema,
	FlowDatasetTimeDimension: FlowDatasetTimeDimensionSchema,
	FlowDatasetQuery: FlowDatasetQuerySchema,
	HandoverInteractionsFilterItem: HandoverInteractionsFilterItemSchema,
	HandoverInteractionsTimeDimension: HandoverInteractionsTimeDimensionSchema,
	HandoverInteractionsQuery: HandoverInteractionsQuerySchema,
	HelpCenterFilterItem: HelpCenterFilterItemSchema,
	HelpCenterTimeDimension: HelpCenterTimeDimensionSchema,
	HelpCenterQuery: HelpCenterQuerySchema,
	HumanFirstResponseTimeFilterItem: HumanFirstResponseTimeFilterItemSchema,
	HumanFirstResponseTimeTimeDimension:
		HumanFirstResponseTimeTimeDimensionSchema,
	HumanFirstResponseTimeQuery: HumanFirstResponseTimeQuerySchema,
	KnowledgeInsightsFilterItem: KnowledgeInsightsFilterItemSchema,
	KnowledgeInsightsQuery: KnowledgeInsightsQuerySchema,
	MessagesPerTicketFilterItem: MessagesPerTicketFilterItemSchema,
	MessagesPerTicketTimeDimension: MessagesPerTicketTimeDimensionSchema,
	MessagesPerTicketQuery: MessagesPerTicketQuerySchema,
	MessagesReceivedFilterItem: MessagesReceivedFilterItemSchema,
	MessagesReceivedTimeDimension: MessagesReceivedTimeDimensionSchema,
	MessagesReceivedQuery: MessagesReceivedQuerySchema,
	MessagesSentFilterItem: MessagesSentFilterItemSchema,
	MessagesSentTimeDimension: MessagesSentTimeDimensionSchema,
	MessagesSentQuery: MessagesSentQuerySchema,
	OneTouchTicketsFilterItem: OneTouchTicketsFilterItemSchema,
	OneTouchTicketsTimeDimension: OneTouchTicketsTimeDimensionSchema,
	OneTouchTicketsQuery: OneTouchTicketsQuerySchema,
	OnlineTimeFilterItem: OnlineTimeFilterItemSchema,
	OnlineTimeQuery: OnlineTimeQuerySchema,
	OverallAutomatedInteractionsFilterItem:
		OverallAutomatedInteractionsFilterItemSchema,
	OverallAutomatedInteractionsTimeDimension:
		OverallAutomatedInteractionsTimeDimensionSchema,
	OverallAutomatedInteractionsQuery: OverallAutomatedInteractionsQuerySchema,
	OverallAutomationRateFilterItem: OverallAutomationRateFilterItemSchema,
	OverallAutomationRateTimeDimension: OverallAutomationRateTimeDimensionSchema,
	OverallAutomationRateQuery: OverallAutomationRateQuerySchema,
	OverallDecreaseInFirstResponseTimeFilterItem:
		OverallDecreaseInFirstResponseTimeFilterItemSchema,
	OverallDecreaseInFirstResponseTimeTimeDimension:
		OverallDecreaseInFirstResponseTimeTimeDimensionSchema,
	OverallDecreaseInFirstResponseTimeQuery:
		OverallDecreaseInFirstResponseTimeQuerySchema,
	OverallDecreaseInResolutionTimeFilterItem:
		OverallDecreaseInResolutionTimeFilterItemSchema,
	OverallDecreaseInResolutionTimeTimeDimension:
		OverallDecreaseInResolutionTimeTimeDimensionSchema,
	OverallDecreaseInResolutionTimeQuery:
		OverallDecreaseInResolutionTimeQuerySchema,
	OverallTimeSavedByAgentFilterItem: OverallTimeSavedByAgentFilterItemSchema,
	OverallTimeSavedByAgentTimeDimension:
		OverallTimeSavedByAgentTimeDimensionSchema,
	OverallTimeSavedByAgentQuery: OverallTimeSavedByAgentQuerySchema,
	ResolutionTimeFilterItem: ResolutionTimeFilterItemSchema,
	ResolutionTimeTimeDimension: ResolutionTimeTimeDimensionSchema,
	ResolutionTimeQuery: ResolutionTimeQuerySchema,
	ResponseTimeFilterItem: ResponseTimeFilterItemSchema,
	ResponseTimeTimeDimension: ResponseTimeTimeDimensionSchema,
	ResponseTimeQuery: ResponseTimeQuerySchema,
	SatisfactionSurveysFilterItem: SatisfactionSurveysFilterItemSchema,
	SatisfactionSurveysTimeDimension: SatisfactionSurveysTimeDimensionSchema,
	SatisfactionSurveysQuery: SatisfactionSurveysQuerySchema,
	TagsFilterItem: TagsFilterItemSchema,
	TagsTimeDimension: TagsTimeDimensionSchema,
	TagsQuery: TagsQuerySchema,
	TicketFieldsFilterItem: TicketFieldsFilterItemSchema,
	TicketFieldsTimeDimension: TicketFieldsTimeDimensionSchema,
	TicketFieldsQuery: TicketFieldsQuerySchema,
	TicketHandleTimeFilterItem: TicketHandleTimeFilterItemSchema,
	TicketHandleTimeTimeDimension: TicketHandleTimeTimeDimensionSchema,
	TicketHandleTimeQuery: TicketHandleTimeQuerySchema,
	TicketMacroUsageFilterItem: TicketMacroUsageFilterItemSchema,
	TicketMacroUsageQuery: TicketMacroUsageQuerySchema,
	TicketSlaFilterItem: TicketSlaFilterItemSchema,
	TicketSlaTimeDimension: TicketSlaTimeDimensionSchema,
	TicketSlaQuery: TicketSlaQuerySchema,
	TicketStatusBreakdownFilterItem: TicketStatusBreakdownFilterItemSchema,
	TicketStatusBreakdownTimeDimension: TicketStatusBreakdownTimeDimensionSchema,
	TicketStatusBreakdownQuery: TicketStatusBreakdownQuerySchema,
	TicketsClosedFilterItem: TicketsClosedFilterItemSchema,
	TicketsClosedTimeDimension: TicketsClosedTimeDimensionSchema,
	TicketsClosedQuery: TicketsClosedQuerySchema,
	TicketsCreatedFilterItem: TicketsCreatedFilterItemSchema,
	TicketsCreatedTimeDimension: TicketsCreatedTimeDimensionSchema,
	TicketsCreatedQuery: TicketsCreatedQuerySchema,
	TicketsOpenFilterItem: TicketsOpenFilterItemSchema,
	TicketsOpenTimeDimension: TicketsOpenTimeDimensionSchema,
	TicketsOpenQuery: TicketsOpenQuerySchema,
	TicketsRepliedFilterItem: TicketsRepliedFilterItemSchema,
	TicketsRepliedTimeDimension: TicketsRepliedTimeDimensionSchema,
	TicketsRepliedQuery: TicketsRepliedQuerySchema,
	TimeSavedByAiAgentFilterItem: TimeSavedByAiAgentFilterItemSchema,
	TimeSavedByAiAgentTimeDimension: TimeSavedByAiAgentTimeDimensionSchema,
	TimeSavedByAiAgentQuery: TimeSavedByAiAgentQuerySchema,
	UserAvailabilityTrackingFilterItem: UserAvailabilityTrackingFilterItemSchema,
	UserAvailabilityTrackingQuery: UserAvailabilityTrackingQuerySchema,
	VoiceAgentEventsFilterItem: VoiceAgentEventsFilterItemSchema,
	VoiceAgentEventsQuery: VoiceAgentEventsQuerySchema,
	VoiceCallsFilterItem: VoiceCallsFilterItemSchema,
	VoiceCallsQuery: VoiceCallsQuerySchema,
	VoiceCallsSummaryFilterItem: VoiceCallsSummaryFilterItemSchema,
	VoiceCallsSummaryQuery: VoiceCallsSummaryQuerySchema,
	VoiceQueueExposureFilterItem: VoiceQueueExposureFilterItemSchema,
	VoiceQueueExposureTimeDimension: VoiceQueueExposureTimeDimensionSchema,
	VoiceQueueExposureQuery: VoiceQueueExposureQuerySchema,
	WorkloadTicketsFilterItem: WorkloadTicketsFilterItemSchema,
	WorkloadTicketsQuery: WorkloadTicketsQuerySchema,
	ZeroTouchTicketsFilterItem: ZeroTouchTicketsFilterItemSchema,
	ZeroTouchTicketsTimeDimension: ZeroTouchTicketsTimeDimensionSchema,
	ZeroTouchTicketsQuery: ZeroTouchTicketsQuerySchema,
	ReportingStats: ReportingStatsSchema,
	ReportingStatsScopesEnum: ReportingStatsScopesEnumSchema,
	AnalyticsReportingMeta: AnalyticsReportingMetaSchema,
	AnalyticsReporting: AnalyticsReportingSchema,
	TicketExtraAttribute: TicketExtraAttributeSchema,
	VoiceCallEvent: VoiceCallEventSchema,
	VoiceCallRecording: VoiceCallRecordingSchema,
	VoiceCall: VoiceCallSchema,
	CursorPaginationMeta: CursorPaginationMetaSchema,
	CustomerCustomField: CustomerCustomFieldSchema,
	CustomerCustomFieldWithValue: CustomerCustomFieldWithValueSchema,
	TicketTeam: TicketTeamSchema,
	IntegrationType: IntegrationTypeSchema,
	TicketCompactCustomer: TicketCompactCustomerSchema,
	TicketCompactIntegration: TicketCompactIntegrationSchema,
	TicketCompact: TicketCompactSchema,
	ViewItemsListRespMeta: ViewItemsListRespMetaSchema,
	ViewCategory: ViewCategorySchema,
	File: FileSchema,
	MetricCardIncludeEnum: MetricCardIncludeEnumSchema,
	MetricCardList: MetricCardListSchema,
	UpdateCustomField: UpdateCustomFieldSchema,
	UpdateCustomFieldItem: UpdateCustomFieldItemSchema,
	UpdateCustomFieldList: UpdateCustomFieldListSchema,
	CustomerCustomFieldValue: CustomerCustomFieldValueSchema,
	UpdateTicketCustomFieldValue: UpdateTicketCustomFieldValueSchema,
	UpdateTicketCustomFieldValues: UpdateTicketCustomFieldValuesSchema,
	UpdateTicketAssigneeTeam: UpdateTicketAssigneeTeamSchema,
	UpdateTicketAssigneeUser: UpdateTicketAssigneeUserSchema,
	UpdateTicketCustomField: UpdateTicketCustomFieldSchema,
	UpdateTicketCustomer: UpdateTicketCustomerSchema,
	UpdateTicketTagDecoration: UpdateTicketTagDecorationSchema,
	UpdateTicketTag: UpdateTicketTagSchema,
	UpdateTicket: UpdateTicketSchema,
	ViewUpdate: ViewUpdateSchema,
} as const;

export const GorgiasBinaryOutputSchema = z
	.object({
		kind: z.literal('binary'),
		contentType: z.string(),
		base64: z.string(),
		sizeBytes: z.number().int().nonnegative(),
	})
	.strict();

export const GorgiasEndpointInputSchemas = {
	'account.createAccountSetting': z
		.object({
			body: z
				.object({
					data: z.record(z.string(), z.json()).optional(),
					type: z.string(),
				})
				.strict(),
		})
		.strict(),
	'account.getAccount': z.object({}).strict(),
	'account.listAccountSettings': z
		.object({
			query: z
				.object({
					type: z.string().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'account.updateAccountSetting': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					data: z.record(z.string(), z.json()).optional(),
					type: z.string(),
				})
				.strict(),
		})
		.strict(),
	'customFields.createCustomField': z
		.object({
			body: CreateCustomFieldSchema,
		})
		.strict(),
	'customFields.getCustomField': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'customFields.listCustomFields': z
		.object({
			query: z
				.object({
					object_type: z.enum(['Ticket', 'Customer']),
					search: z.string().optional(),
					archived: z.boolean().optional(),
					order_by: z.enum(['priority:asc', 'priority:desc']).optional(),
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'customFields.updateCustomField': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: UpdateCustomFieldSchema,
		})
		.strict(),
	'customFields.updateCustomFields': z
		.object({
			body: UpdateCustomFieldListSchema,
		})
		.strict(),
	'customers.createCustomer': z
		.object({
			body: z
				.object({
					channels: z.array(
						z
							.object({
								type: z.string(),
								address: z.string(),
								preferred: z.boolean(),
							})
							.strict(),
					),
					email: z.string().email().nullable().optional(),
					external_id: z.string().nullable().optional(),
					language: z
						.enum([
							'aa',
							'ab',
							'af',
							'ak',
							'sq',
							'am',
							'ar',
							'an',
							'hy',
							'as',
							'av',
							'ae',
							'ay',
							'az',
							'ba',
							'bm',
							'eu',
							'be',
							'bn',
							'bh',
							'bi',
							'bs',
							'br',
							'bg',
							'my',
							'ca',
							'ch',
							'ce',
							'zh',
							'cu',
							'cv',
							'kw',
							'co',
							'cr',
							'cs',
							'da',
							'dv',
							'nl',
							'dz',
							'en',
							'eo',
							'et',
							'ee',
							'fo',
							'fj',
							'fi',
							'fr',
							'fy',
							'ff',
							'ka',
							'de',
							'gd',
							'ga',
							'gl',
							'gv',
							'el',
							'gn',
							'gu',
							'ht',
							'ha',
							'he',
							'hz',
							'hi',
							'ho',
							'hr',
							'hu',
							'ig',
							'is',
							'io',
							'ii',
							'iu',
							'ie',
							'ia',
							'id',
							'ik',
							'it',
							'jv',
							'ja',
							'kl',
							'kn',
							'ks',
							'kr',
							'kk',
							'km',
							'ki',
							'rw',
							'ky',
							'kv',
							'kg',
							'ko',
							'kj',
							'ku',
							'lo',
							'la',
							'lv',
							'li',
							'ln',
							'lt',
							'lb',
							'lu',
							'lg',
							'mk',
							'mh',
							'ml',
							'mi',
							'mr',
							'ms',
							'mg',
							'mt',
							'mn',
							'na',
							'nv',
							'nr',
							'nd',
							'ng',
							'ne',
							'nn',
							'nb',
							'no',
							'ny',
							'oc',
							'oj',
							'or',
							'om',
							'os',
							'pa',
							'fa',
							'pi',
							'pl',
							'pt',
							'ps',
							'qu',
							'rc',
							'rm',
							'ro',
							'rn',
							'ru',
							'sg',
							'sa',
							'si',
							'sk',
							'sl',
							'se',
							'sm',
							'sn',
							'sd',
							'so',
							'st',
							'es',
							'sc',
							'sr',
							'ss',
							'su',
							'sw',
							'sv',
							'ty',
							'ta',
							'tt',
							'te',
							'tg',
							'tl',
							'th',
							'bo',
							'ti',
							'to',
							'tn',
							'ts',
							'tk',
							'tr',
							'tw',
							'ug',
							'uk',
							'ur',
							'uz',
							've',
							'vi',
							'vo',
							'cy',
							'wa',
							'wo',
							'xh',
							'yi',
							'yo',
							'za',
							'zu',
						])
						.optional(),
					name: z.string().nullable().optional(),
					timezone: z
						.enum([
							'Africa/Abidjan',
							'Africa/Accra',
							'Africa/Addis_Ababa',
							'Africa/Algiers',
							'Africa/Asmara',
							'Africa/Asmera',
							'Africa/Bamako',
							'Africa/Bangui',
							'Africa/Banjul',
							'Africa/Bissau',
							'Africa/Blantyre',
							'Africa/Brazzaville',
							'Africa/Bujumbura',
							'Africa/Cairo',
							'Africa/Casablanca',
							'Africa/Ceuta',
							'Africa/Conakry',
							'Africa/Dakar',
							'Africa/Dar_es_Salaam',
							'Africa/Djibouti',
							'Africa/Douala',
							'Africa/El_Aaiun',
							'Africa/Freetown',
							'Africa/Gaborone',
							'Africa/Harare',
							'Africa/Johannesburg',
							'Africa/Juba',
							'Africa/Kampala',
							'Africa/Khartoum',
							'Africa/Kigali',
							'Africa/Kinshasa',
							'Africa/Lagos',
							'Africa/Libreville',
							'Africa/Lome',
							'Africa/Luanda',
							'Africa/Lubumbashi',
							'Africa/Lusaka',
							'Africa/Malabo',
							'Africa/Maputo',
							'Africa/Maseru',
							'Africa/Mbabane',
							'Africa/Mogadishu',
							'Africa/Monrovia',
							'Africa/Nairobi',
							'Africa/Ndjamena',
							'Africa/Niamey',
							'Africa/Nouakchott',
							'Africa/Ouagadougou',
							'Africa/Porto-Novo',
							'Africa/Sao_Tome',
							'Africa/Timbuktu',
							'Africa/Tripoli',
							'Africa/Tunis',
							'Africa/Windhoek',
							'America/Adak',
							'America/Anchorage',
							'America/Anguilla',
							'America/Antigua',
							'America/Araguaina',
							'America/Argentina/Buenos_Aires',
							'America/Argentina/Catamarca',
							'America/Argentina/ComodRivadavia',
							'America/Argentina/Cordoba',
							'America/Argentina/Jujuy',
							'America/Argentina/La_Rioja',
							'America/Argentina/Mendoza',
							'America/Argentina/Rio_Gallegos',
							'America/Argentina/Salta',
							'America/Argentina/San_Juan',
							'America/Argentina/San_Luis',
							'America/Argentina/Tucuman',
							'America/Argentina/Ushuaia',
							'America/Aruba',
							'America/Asuncion',
							'America/Atikokan',
							'America/Atka',
							'America/Bahia',
							'America/Bahia_Banderas',
							'America/Barbados',
							'America/Belem',
							'America/Belize',
							'America/Blanc-Sablon',
							'America/Boa_Vista',
							'America/Bogota',
							'America/Boise',
							'America/Buenos_Aires',
							'America/Cambridge_Bay',
							'America/Campo_Grande',
							'America/Cancun',
							'America/Caracas',
							'America/Catamarca',
							'America/Cayenne',
							'America/Cayman',
							'America/Chicago',
							'America/Chihuahua',
							'America/Ciudad_Juarez',
							'America/Coral_Harbour',
							'America/Cordoba',
							'America/Costa_Rica',
							'America/Coyhaique',
							'America/Creston',
							'America/Cuiaba',
							'America/Curacao',
							'America/Danmarkshavn',
							'America/Dawson',
							'America/Dawson_Creek',
							'America/Denver',
							'America/Detroit',
							'America/Dominica',
							'America/Edmonton',
							'America/Eirunepe',
							'America/El_Salvador',
							'America/Ensenada',
							'America/Fort_Nelson',
							'America/Fort_Wayne',
							'America/Fortaleza',
							'America/Glace_Bay',
							'America/Godthab',
							'America/Goose_Bay',
							'America/Grand_Turk',
							'America/Grenada',
							'America/Guadeloupe',
							'America/Guatemala',
							'America/Guayaquil',
							'America/Guyana',
							'America/Halifax',
							'America/Havana',
							'America/Hermosillo',
							'America/Indiana/Indianapolis',
							'America/Indiana/Knox',
							'America/Indiana/Marengo',
							'America/Indiana/Petersburg',
							'America/Indiana/Tell_City',
							'America/Indiana/Vevay',
							'America/Indiana/Vincennes',
							'America/Indiana/Winamac',
							'America/Indianapolis',
							'America/Inuvik',
							'America/Iqaluit',
							'America/Jamaica',
							'America/Jujuy',
							'America/Juneau',
							'America/Kentucky/Louisville',
							'America/Kentucky/Monticello',
							'America/Knox_IN',
							'America/Kralendijk',
							'America/La_Paz',
							'America/Lima',
							'America/Los_Angeles',
							'America/Louisville',
							'America/Lower_Princes',
							'America/Maceio',
							'America/Managua',
							'America/Manaus',
							'America/Marigot',
							'America/Martinique',
							'America/Matamoros',
							'America/Mazatlan',
							'America/Mendoza',
							'America/Menominee',
							'America/Merida',
							'America/Metlakatla',
							'America/Mexico_City',
							'America/Miquelon',
							'America/Moncton',
							'America/Monterrey',
							'America/Montevideo',
							'America/Montreal',
							'America/Montserrat',
							'America/Nassau',
							'America/New_York',
							'America/Nipigon',
							'America/Nome',
							'America/Noronha',
							'America/North_Dakota/Beulah',
							'America/North_Dakota/Center',
							'America/North_Dakota/New_Salem',
							'America/Nuuk',
							'America/Ojinaga',
							'America/Panama',
							'America/Pangnirtung',
							'America/Paramaribo',
							'America/Phoenix',
							'America/Port-au-Prince',
							'America/Port_of_Spain',
							'America/Porto_Acre',
							'America/Porto_Velho',
							'America/Puerto_Rico',
							'America/Punta_Arenas',
							'America/Rainy_River',
							'America/Rankin_Inlet',
							'America/Recife',
							'America/Regina',
							'America/Resolute',
							'America/Rio_Branco',
							'America/Rosario',
							'America/Santa_Isabel',
							'America/Santarem',
							'America/Santiago',
							'America/Santo_Domingo',
							'America/Sao_Paulo',
							'America/Scoresbysund',
							'America/Shiprock',
							'America/Sitka',
							'America/St_Barthelemy',
							'America/St_Johns',
							'America/St_Kitts',
							'America/St_Lucia',
							'America/St_Thomas',
							'America/St_Vincent',
							'America/Swift_Current',
							'America/Tegucigalpa',
							'America/Thule',
							'America/Thunder_Bay',
							'America/Tijuana',
							'America/Toronto',
							'America/Tortola',
							'America/Vancouver',
							'America/Virgin',
							'America/Whitehorse',
							'America/Winnipeg',
							'America/Yakutat',
							'America/Yellowknife',
							'Antarctica/Casey',
							'Antarctica/Davis',
							'Antarctica/DumontDUrville',
							'Antarctica/Macquarie',
							'Antarctica/Mawson',
							'Antarctica/McMurdo',
							'Antarctica/Palmer',
							'Antarctica/Rothera',
							'Antarctica/South_Pole',
							'Antarctica/Syowa',
							'Antarctica/Troll',
							'Antarctica/Vostok',
							'Arctic/Longyearbyen',
							'Asia/Aden',
							'Asia/Almaty',
							'Asia/Amman',
							'Asia/Anadyr',
							'Asia/Aqtau',
							'Asia/Aqtobe',
							'Asia/Ashgabat',
							'Asia/Ashkhabad',
							'Asia/Atyrau',
							'Asia/Baghdad',
							'Asia/Bahrain',
							'Asia/Baku',
							'Asia/Bangkok',
							'Asia/Barnaul',
							'Asia/Beirut',
							'Asia/Bishkek',
							'Asia/Brunei',
							'Asia/Calcutta',
							'Asia/Chita',
							'Asia/Choibalsan',
							'Asia/Chongqing',
							'Asia/Chungking',
							'Asia/Colombo',
							'Asia/Dacca',
							'Asia/Damascus',
							'Asia/Dhaka',
							'Asia/Dili',
							'Asia/Dubai',
							'Asia/Dushanbe',
							'Asia/Famagusta',
							'Asia/Gaza',
							'Asia/Harbin',
							'Asia/Hebron',
							'Asia/Ho_Chi_Minh',
							'Asia/Hong_Kong',
							'Asia/Hovd',
							'Asia/Irkutsk',
							'Asia/Istanbul',
							'Asia/Jakarta',
							'Asia/Jayapura',
							'Asia/Jerusalem',
							'Asia/Kabul',
							'Asia/Kamchatka',
							'Asia/Karachi',
							'Asia/Kashgar',
							'Asia/Kathmandu',
							'Asia/Katmandu',
							'Asia/Khandyga',
							'Asia/Kolkata',
							'Asia/Krasnoyarsk',
							'Asia/Kuala_Lumpur',
							'Asia/Kuching',
							'Asia/Kuwait',
							'Asia/Macao',
							'Asia/Macau',
							'Asia/Magadan',
							'Asia/Makassar',
							'Asia/Manila',
							'Asia/Muscat',
							'Asia/Nicosia',
							'Asia/Novokuznetsk',
							'Asia/Novosibirsk',
							'Asia/Omsk',
							'Asia/Oral',
							'Asia/Phnom_Penh',
							'Asia/Pontianak',
							'Asia/Pyongyang',
							'Asia/Qatar',
							'Asia/Qostanay',
							'Asia/Qyzylorda',
							'Asia/Rangoon',
							'Asia/Riyadh',
							'Asia/Saigon',
							'Asia/Sakhalin',
							'Asia/Samarkand',
							'Asia/Seoul',
							'Asia/Shanghai',
							'Asia/Singapore',
							'Asia/Srednekolymsk',
							'Asia/Taipei',
							'Asia/Tashkent',
							'Asia/Tbilisi',
							'Asia/Tehran',
							'Asia/Tel_Aviv',
							'Asia/Thimbu',
							'Asia/Thimphu',
							'Asia/Tokyo',
							'Asia/Tomsk',
							'Asia/Ujung_Pandang',
							'Asia/Ulaanbaatar',
							'Asia/Ulan_Bator',
							'Asia/Urumqi',
							'Asia/Ust-Nera',
							'Asia/Vientiane',
							'Asia/Vladivostok',
							'Asia/Yakutsk',
							'Asia/Yangon',
							'Asia/Yekaterinburg',
							'Asia/Yerevan',
							'Atlantic/Azores',
							'Atlantic/Bermuda',
							'Atlantic/Canary',
							'Atlantic/Cape_Verde',
							'Atlantic/Faeroe',
							'Atlantic/Faroe',
							'Atlantic/Jan_Mayen',
							'Atlantic/Madeira',
							'Atlantic/Reykjavik',
							'Atlantic/South_Georgia',
							'Atlantic/St_Helena',
							'Atlantic/Stanley',
							'Australia/ACT',
							'Australia/Adelaide',
							'Australia/Brisbane',
							'Australia/Broken_Hill',
							'Australia/Canberra',
							'Australia/Currie',
							'Australia/Darwin',
							'Australia/Eucla',
							'Australia/Hobart',
							'Australia/LHI',
							'Australia/Lindeman',
							'Australia/Lord_Howe',
							'Australia/Melbourne',
							'Australia/NSW',
							'Australia/North',
							'Australia/Perth',
							'Australia/Queensland',
							'Australia/South',
							'Australia/Sydney',
							'Australia/Tasmania',
							'Australia/Victoria',
							'Australia/West',
							'Australia/Yancowinna',
							'Brazil/Acre',
							'Brazil/DeNoronha',
							'Brazil/East',
							'Brazil/West',
							'CET',
							'CST6CDT',
							'Canada/Atlantic',
							'Canada/Central',
							'Canada/Eastern',
							'Canada/Mountain',
							'Canada/Newfoundland',
							'Canada/Pacific',
							'Canada/Saskatchewan',
							'Canada/Yukon',
							'Chile/Continental',
							'Chile/EasterIsland',
							'Cuba',
							'EET',
							'EST',
							'EST5EDT',
							'Egypt',
							'Eire',
							'Etc/GMT',
							'Etc/GMT+0',
							'Etc/GMT+1',
							'Etc/GMT+10',
							'Etc/GMT+11',
							'Etc/GMT+12',
							'Etc/GMT+2',
							'Etc/GMT+3',
							'Etc/GMT+4',
							'Etc/GMT+5',
							'Etc/GMT+6',
							'Etc/GMT+7',
							'Etc/GMT+8',
							'Etc/GMT+9',
							'Etc/GMT-0',
							'Etc/GMT-1',
							'Etc/GMT-10',
							'Etc/GMT-11',
							'Etc/GMT-12',
							'Etc/GMT-13',
							'Etc/GMT-14',
							'Etc/GMT-2',
							'Etc/GMT-3',
							'Etc/GMT-4',
							'Etc/GMT-5',
							'Etc/GMT-6',
							'Etc/GMT-7',
							'Etc/GMT-8',
							'Etc/GMT-9',
							'Etc/GMT0',
							'Etc/Greenwich',
							'Etc/UCT',
							'Etc/UTC',
							'Etc/Universal',
							'Etc/Zulu',
							'Europe/Amsterdam',
							'Europe/Andorra',
							'Europe/Astrakhan',
							'Europe/Athens',
							'Europe/Belfast',
							'Europe/Belgrade',
							'Europe/Berlin',
							'Europe/Bratislava',
							'Europe/Brussels',
							'Europe/Bucharest',
							'Europe/Budapest',
							'Europe/Busingen',
							'Europe/Chisinau',
							'Europe/Copenhagen',
							'Europe/Dublin',
							'Europe/Gibraltar',
							'Europe/Guernsey',
							'Europe/Helsinki',
							'Europe/Isle_of_Man',
							'Europe/Istanbul',
							'Europe/Jersey',
							'Europe/Kaliningrad',
							'Europe/Kiev',
							'Europe/Kirov',
							'Europe/Kyiv',
							'Europe/Lisbon',
							'Europe/Ljubljana',
							'Europe/London',
							'Europe/Luxembourg',
							'Europe/Madrid',
							'Europe/Malta',
							'Europe/Mariehamn',
							'Europe/Minsk',
							'Europe/Monaco',
							'Europe/Moscow',
							'Europe/Nicosia',
							'Europe/Oslo',
							'Europe/Paris',
							'Europe/Podgorica',
							'Europe/Prague',
							'Europe/Riga',
							'Europe/Rome',
							'Europe/Samara',
							'Europe/San_Marino',
							'Europe/Sarajevo',
							'Europe/Saratov',
							'Europe/Simferopol',
							'Europe/Skopje',
							'Europe/Sofia',
							'Europe/Stockholm',
							'Europe/Tallinn',
							'Europe/Tirane',
							'Europe/Tiraspol',
							'Europe/Ulyanovsk',
							'Europe/Uzhgorod',
							'Europe/Vaduz',
							'Europe/Vatican',
							'Europe/Vienna',
							'Europe/Vilnius',
							'Europe/Volgograd',
							'Europe/Warsaw',
							'Europe/Zagreb',
							'Europe/Zaporozhye',
							'Europe/Zurich',
							'GB',
							'GB-Eire',
							'GMT',
							'GMT+0',
							'GMT-0',
							'GMT0',
							'Greenwich',
							'HST',
							'Hongkong',
							'Iceland',
							'Indian/Antananarivo',
							'Indian/Chagos',
							'Indian/Christmas',
							'Indian/Cocos',
							'Indian/Comoro',
							'Indian/Kerguelen',
							'Indian/Mahe',
							'Indian/Maldives',
							'Indian/Mauritius',
							'Indian/Mayotte',
							'Indian/Reunion',
							'Iran',
							'Israel',
							'Jamaica',
							'Japan',
							'Kwajalein',
							'Libya',
							'MET',
							'MST',
							'MST7MDT',
							'Mexico/BajaNorte',
							'Mexico/BajaSur',
							'Mexico/General',
							'NZ',
							'NZ-CHAT',
							'Navajo',
							'PRC',
							'PST8PDT',
							'Pacific/Apia',
							'Pacific/Auckland',
							'Pacific/Bougainville',
							'Pacific/Chatham',
							'Pacific/Chuuk',
							'Pacific/Easter',
							'Pacific/Efate',
							'Pacific/Enderbury',
							'Pacific/Fakaofo',
							'Pacific/Fiji',
							'Pacific/Funafuti',
							'Pacific/Galapagos',
							'Pacific/Gambier',
							'Pacific/Guadalcanal',
							'Pacific/Guam',
							'Pacific/Honolulu',
							'Pacific/Johnston',
							'Pacific/Kanton',
							'Pacific/Kiritimati',
							'Pacific/Kosrae',
							'Pacific/Kwajalein',
							'Pacific/Majuro',
							'Pacific/Marquesas',
							'Pacific/Midway',
							'Pacific/Nauru',
							'Pacific/Niue',
							'Pacific/Norfolk',
							'Pacific/Noumea',
							'Pacific/Pago_Pago',
							'Pacific/Palau',
							'Pacific/Pitcairn',
							'Pacific/Pohnpei',
							'Pacific/Ponape',
							'Pacific/Port_Moresby',
							'Pacific/Rarotonga',
							'Pacific/Saipan',
							'Pacific/Samoa',
							'Pacific/Tahiti',
							'Pacific/Tarawa',
							'Pacific/Tongatapu',
							'Pacific/Truk',
							'Pacific/Wake',
							'Pacific/Wallis',
							'Pacific/Yap',
							'Poland',
							'Portugal',
							'ROC',
							'ROK',
							'Singapore',
							'Turkey',
							'UCT',
							'US/Alaska',
							'US/Aleutian',
							'US/Arizona',
							'US/Central',
							'US/East-Indiana',
							'US/Eastern',
							'US/Hawaii',
							'US/Indiana-Starke',
							'US/Michigan',
							'US/Mountain',
							'US/Pacific',
							'US/Samoa',
							'UTC',
							'Universal',
							'W-SU',
							'WET',
							'Zulu',
						])
						.optional(),
				})
				.strict(),
		})
		.strict(),
	'customers.deleteCustomer': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'customers.deleteCustomerCustomFieldValue': z
		.object({
			path: z
				.object({
					customer_id: z.number().int(),
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'customers.deleteCustomers': z
		.object({
			body: z
				.object({
					ids: z.array(z.number().int()),
				})
				.strict(),
		})
		.strict(),
	'customers.getCustomer': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					relationships: z.array(z.enum(['custom_fields'])).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'customers.listCustomerCustomFieldsValues': z
		.object({
			path: z
				.object({
					customer_id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'customers.listCustomers': z
		.object({
			query: z
				.object({
					cursor: z.string().optional(),
					email: z.string().email().nullable().optional(),
					external_id: z.string().nullable().optional(),
					language: z
						.enum([
							'aa',
							'ab',
							'af',
							'ak',
							'sq',
							'am',
							'ar',
							'an',
							'hy',
							'as',
							'av',
							'ae',
							'ay',
							'az',
							'ba',
							'bm',
							'eu',
							'be',
							'bn',
							'bh',
							'bi',
							'bs',
							'br',
							'bg',
							'my',
							'ca',
							'ch',
							'ce',
							'zh',
							'cu',
							'cv',
							'kw',
							'co',
							'cr',
							'cs',
							'da',
							'dv',
							'nl',
							'dz',
							'en',
							'eo',
							'et',
							'ee',
							'fo',
							'fj',
							'fi',
							'fr',
							'fy',
							'ff',
							'ka',
							'de',
							'gd',
							'ga',
							'gl',
							'gv',
							'el',
							'gn',
							'gu',
							'ht',
							'ha',
							'he',
							'hz',
							'hi',
							'ho',
							'hr',
							'hu',
							'ig',
							'is',
							'io',
							'ii',
							'iu',
							'ie',
							'ia',
							'id',
							'ik',
							'it',
							'jv',
							'ja',
							'kl',
							'kn',
							'ks',
							'kr',
							'kk',
							'km',
							'ki',
							'rw',
							'ky',
							'kv',
							'kg',
							'ko',
							'kj',
							'ku',
							'lo',
							'la',
							'lv',
							'li',
							'ln',
							'lt',
							'lb',
							'lu',
							'lg',
							'mk',
							'mh',
							'ml',
							'mi',
							'mr',
							'ms',
							'mg',
							'mt',
							'mn',
							'na',
							'nv',
							'nr',
							'nd',
							'ng',
							'ne',
							'nn',
							'nb',
							'no',
							'ny',
							'oc',
							'oj',
							'or',
							'om',
							'os',
							'pa',
							'fa',
							'pi',
							'pl',
							'pt',
							'ps',
							'qu',
							'rc',
							'rm',
							'ro',
							'rn',
							'ru',
							'sg',
							'sa',
							'si',
							'sk',
							'sl',
							'se',
							'sm',
							'sn',
							'sd',
							'so',
							'st',
							'es',
							'sc',
							'sr',
							'ss',
							'su',
							'sw',
							'sv',
							'ty',
							'ta',
							'tt',
							'te',
							'tg',
							'tl',
							'th',
							'bo',
							'ti',
							'to',
							'tn',
							'ts',
							'tk',
							'tr',
							'tw',
							'ug',
							'uk',
							'ur',
							'uz',
							've',
							'vi',
							'vo',
							'cy',
							'wa',
							'wo',
							'xh',
							'yi',
							'yo',
							'za',
							'zu',
						])
						.optional(),
					limit: z.number().int().min(1).max(100).optional(),
					name: z.string().nullable().optional(),
					order_by: z
						.enum([
							'created_datetime:asc',
							'created_datetime:desc',
							'updated_datetime:asc',
							'updated_datetime:desc',
						])
						.optional(),
					timezone: z
						.enum([
							'Africa/Abidjan',
							'Africa/Accra',
							'Africa/Addis_Ababa',
							'Africa/Algiers',
							'Africa/Asmara',
							'Africa/Asmera',
							'Africa/Bamako',
							'Africa/Bangui',
							'Africa/Banjul',
							'Africa/Bissau',
							'Africa/Blantyre',
							'Africa/Brazzaville',
							'Africa/Bujumbura',
							'Africa/Cairo',
							'Africa/Casablanca',
							'Africa/Ceuta',
							'Africa/Conakry',
							'Africa/Dakar',
							'Africa/Dar_es_Salaam',
							'Africa/Djibouti',
							'Africa/Douala',
							'Africa/El_Aaiun',
							'Africa/Freetown',
							'Africa/Gaborone',
							'Africa/Harare',
							'Africa/Johannesburg',
							'Africa/Juba',
							'Africa/Kampala',
							'Africa/Khartoum',
							'Africa/Kigali',
							'Africa/Kinshasa',
							'Africa/Lagos',
							'Africa/Libreville',
							'Africa/Lome',
							'Africa/Luanda',
							'Africa/Lubumbashi',
							'Africa/Lusaka',
							'Africa/Malabo',
							'Africa/Maputo',
							'Africa/Maseru',
							'Africa/Mbabane',
							'Africa/Mogadishu',
							'Africa/Monrovia',
							'Africa/Nairobi',
							'Africa/Ndjamena',
							'Africa/Niamey',
							'Africa/Nouakchott',
							'Africa/Ouagadougou',
							'Africa/Porto-Novo',
							'Africa/Sao_Tome',
							'Africa/Timbuktu',
							'Africa/Tripoli',
							'Africa/Tunis',
							'Africa/Windhoek',
							'America/Adak',
							'America/Anchorage',
							'America/Anguilla',
							'America/Antigua',
							'America/Araguaina',
							'America/Argentina/Buenos_Aires',
							'America/Argentina/Catamarca',
							'America/Argentina/ComodRivadavia',
							'America/Argentina/Cordoba',
							'America/Argentina/Jujuy',
							'America/Argentina/La_Rioja',
							'America/Argentina/Mendoza',
							'America/Argentina/Rio_Gallegos',
							'America/Argentina/Salta',
							'America/Argentina/San_Juan',
							'America/Argentina/San_Luis',
							'America/Argentina/Tucuman',
							'America/Argentina/Ushuaia',
							'America/Aruba',
							'America/Asuncion',
							'America/Atikokan',
							'America/Atka',
							'America/Bahia',
							'America/Bahia_Banderas',
							'America/Barbados',
							'America/Belem',
							'America/Belize',
							'America/Blanc-Sablon',
							'America/Boa_Vista',
							'America/Bogota',
							'America/Boise',
							'America/Buenos_Aires',
							'America/Cambridge_Bay',
							'America/Campo_Grande',
							'America/Cancun',
							'America/Caracas',
							'America/Catamarca',
							'America/Cayenne',
							'America/Cayman',
							'America/Chicago',
							'America/Chihuahua',
							'America/Ciudad_Juarez',
							'America/Coral_Harbour',
							'America/Cordoba',
							'America/Costa_Rica',
							'America/Coyhaique',
							'America/Creston',
							'America/Cuiaba',
							'America/Curacao',
							'America/Danmarkshavn',
							'America/Dawson',
							'America/Dawson_Creek',
							'America/Denver',
							'America/Detroit',
							'America/Dominica',
							'America/Edmonton',
							'America/Eirunepe',
							'America/El_Salvador',
							'America/Ensenada',
							'America/Fort_Nelson',
							'America/Fort_Wayne',
							'America/Fortaleza',
							'America/Glace_Bay',
							'America/Godthab',
							'America/Goose_Bay',
							'America/Grand_Turk',
							'America/Grenada',
							'America/Guadeloupe',
							'America/Guatemala',
							'America/Guayaquil',
							'America/Guyana',
							'America/Halifax',
							'America/Havana',
							'America/Hermosillo',
							'America/Indiana/Indianapolis',
							'America/Indiana/Knox',
							'America/Indiana/Marengo',
							'America/Indiana/Petersburg',
							'America/Indiana/Tell_City',
							'America/Indiana/Vevay',
							'America/Indiana/Vincennes',
							'America/Indiana/Winamac',
							'America/Indianapolis',
							'America/Inuvik',
							'America/Iqaluit',
							'America/Jamaica',
							'America/Jujuy',
							'America/Juneau',
							'America/Kentucky/Louisville',
							'America/Kentucky/Monticello',
							'America/Knox_IN',
							'America/Kralendijk',
							'America/La_Paz',
							'America/Lima',
							'America/Los_Angeles',
							'America/Louisville',
							'America/Lower_Princes',
							'America/Maceio',
							'America/Managua',
							'America/Manaus',
							'America/Marigot',
							'America/Martinique',
							'America/Matamoros',
							'America/Mazatlan',
							'America/Mendoza',
							'America/Menominee',
							'America/Merida',
							'America/Metlakatla',
							'America/Mexico_City',
							'America/Miquelon',
							'America/Moncton',
							'America/Monterrey',
							'America/Montevideo',
							'America/Montreal',
							'America/Montserrat',
							'America/Nassau',
							'America/New_York',
							'America/Nipigon',
							'America/Nome',
							'America/Noronha',
							'America/North_Dakota/Beulah',
							'America/North_Dakota/Center',
							'America/North_Dakota/New_Salem',
							'America/Nuuk',
							'America/Ojinaga',
							'America/Panama',
							'America/Pangnirtung',
							'America/Paramaribo',
							'America/Phoenix',
							'America/Port-au-Prince',
							'America/Port_of_Spain',
							'America/Porto_Acre',
							'America/Porto_Velho',
							'America/Puerto_Rico',
							'America/Punta_Arenas',
							'America/Rainy_River',
							'America/Rankin_Inlet',
							'America/Recife',
							'America/Regina',
							'America/Resolute',
							'America/Rio_Branco',
							'America/Rosario',
							'America/Santa_Isabel',
							'America/Santarem',
							'America/Santiago',
							'America/Santo_Domingo',
							'America/Sao_Paulo',
							'America/Scoresbysund',
							'America/Shiprock',
							'America/Sitka',
							'America/St_Barthelemy',
							'America/St_Johns',
							'America/St_Kitts',
							'America/St_Lucia',
							'America/St_Thomas',
							'America/St_Vincent',
							'America/Swift_Current',
							'America/Tegucigalpa',
							'America/Thule',
							'America/Thunder_Bay',
							'America/Tijuana',
							'America/Toronto',
							'America/Tortola',
							'America/Vancouver',
							'America/Virgin',
							'America/Whitehorse',
							'America/Winnipeg',
							'America/Yakutat',
							'America/Yellowknife',
							'Antarctica/Casey',
							'Antarctica/Davis',
							'Antarctica/DumontDUrville',
							'Antarctica/Macquarie',
							'Antarctica/Mawson',
							'Antarctica/McMurdo',
							'Antarctica/Palmer',
							'Antarctica/Rothera',
							'Antarctica/South_Pole',
							'Antarctica/Syowa',
							'Antarctica/Troll',
							'Antarctica/Vostok',
							'Arctic/Longyearbyen',
							'Asia/Aden',
							'Asia/Almaty',
							'Asia/Amman',
							'Asia/Anadyr',
							'Asia/Aqtau',
							'Asia/Aqtobe',
							'Asia/Ashgabat',
							'Asia/Ashkhabad',
							'Asia/Atyrau',
							'Asia/Baghdad',
							'Asia/Bahrain',
							'Asia/Baku',
							'Asia/Bangkok',
							'Asia/Barnaul',
							'Asia/Beirut',
							'Asia/Bishkek',
							'Asia/Brunei',
							'Asia/Calcutta',
							'Asia/Chita',
							'Asia/Choibalsan',
							'Asia/Chongqing',
							'Asia/Chungking',
							'Asia/Colombo',
							'Asia/Dacca',
							'Asia/Damascus',
							'Asia/Dhaka',
							'Asia/Dili',
							'Asia/Dubai',
							'Asia/Dushanbe',
							'Asia/Famagusta',
							'Asia/Gaza',
							'Asia/Harbin',
							'Asia/Hebron',
							'Asia/Ho_Chi_Minh',
							'Asia/Hong_Kong',
							'Asia/Hovd',
							'Asia/Irkutsk',
							'Asia/Istanbul',
							'Asia/Jakarta',
							'Asia/Jayapura',
							'Asia/Jerusalem',
							'Asia/Kabul',
							'Asia/Kamchatka',
							'Asia/Karachi',
							'Asia/Kashgar',
							'Asia/Kathmandu',
							'Asia/Katmandu',
							'Asia/Khandyga',
							'Asia/Kolkata',
							'Asia/Krasnoyarsk',
							'Asia/Kuala_Lumpur',
							'Asia/Kuching',
							'Asia/Kuwait',
							'Asia/Macao',
							'Asia/Macau',
							'Asia/Magadan',
							'Asia/Makassar',
							'Asia/Manila',
							'Asia/Muscat',
							'Asia/Nicosia',
							'Asia/Novokuznetsk',
							'Asia/Novosibirsk',
							'Asia/Omsk',
							'Asia/Oral',
							'Asia/Phnom_Penh',
							'Asia/Pontianak',
							'Asia/Pyongyang',
							'Asia/Qatar',
							'Asia/Qostanay',
							'Asia/Qyzylorda',
							'Asia/Rangoon',
							'Asia/Riyadh',
							'Asia/Saigon',
							'Asia/Sakhalin',
							'Asia/Samarkand',
							'Asia/Seoul',
							'Asia/Shanghai',
							'Asia/Singapore',
							'Asia/Srednekolymsk',
							'Asia/Taipei',
							'Asia/Tashkent',
							'Asia/Tbilisi',
							'Asia/Tehran',
							'Asia/Tel_Aviv',
							'Asia/Thimbu',
							'Asia/Thimphu',
							'Asia/Tokyo',
							'Asia/Tomsk',
							'Asia/Ujung_Pandang',
							'Asia/Ulaanbaatar',
							'Asia/Ulan_Bator',
							'Asia/Urumqi',
							'Asia/Ust-Nera',
							'Asia/Vientiane',
							'Asia/Vladivostok',
							'Asia/Yakutsk',
							'Asia/Yangon',
							'Asia/Yekaterinburg',
							'Asia/Yerevan',
							'Atlantic/Azores',
							'Atlantic/Bermuda',
							'Atlantic/Canary',
							'Atlantic/Cape_Verde',
							'Atlantic/Faeroe',
							'Atlantic/Faroe',
							'Atlantic/Jan_Mayen',
							'Atlantic/Madeira',
							'Atlantic/Reykjavik',
							'Atlantic/South_Georgia',
							'Atlantic/St_Helena',
							'Atlantic/Stanley',
							'Australia/ACT',
							'Australia/Adelaide',
							'Australia/Brisbane',
							'Australia/Broken_Hill',
							'Australia/Canberra',
							'Australia/Currie',
							'Australia/Darwin',
							'Australia/Eucla',
							'Australia/Hobart',
							'Australia/LHI',
							'Australia/Lindeman',
							'Australia/Lord_Howe',
							'Australia/Melbourne',
							'Australia/NSW',
							'Australia/North',
							'Australia/Perth',
							'Australia/Queensland',
							'Australia/South',
							'Australia/Sydney',
							'Australia/Tasmania',
							'Australia/Victoria',
							'Australia/West',
							'Australia/Yancowinna',
							'Brazil/Acre',
							'Brazil/DeNoronha',
							'Brazil/East',
							'Brazil/West',
							'CET',
							'CST6CDT',
							'Canada/Atlantic',
							'Canada/Central',
							'Canada/Eastern',
							'Canada/Mountain',
							'Canada/Newfoundland',
							'Canada/Pacific',
							'Canada/Saskatchewan',
							'Canada/Yukon',
							'Chile/Continental',
							'Chile/EasterIsland',
							'Cuba',
							'EET',
							'EST',
							'EST5EDT',
							'Egypt',
							'Eire',
							'Etc/GMT',
							'Etc/GMT+0',
							'Etc/GMT+1',
							'Etc/GMT+10',
							'Etc/GMT+11',
							'Etc/GMT+12',
							'Etc/GMT+2',
							'Etc/GMT+3',
							'Etc/GMT+4',
							'Etc/GMT+5',
							'Etc/GMT+6',
							'Etc/GMT+7',
							'Etc/GMT+8',
							'Etc/GMT+9',
							'Etc/GMT-0',
							'Etc/GMT-1',
							'Etc/GMT-10',
							'Etc/GMT-11',
							'Etc/GMT-12',
							'Etc/GMT-13',
							'Etc/GMT-14',
							'Etc/GMT-2',
							'Etc/GMT-3',
							'Etc/GMT-4',
							'Etc/GMT-5',
							'Etc/GMT-6',
							'Etc/GMT-7',
							'Etc/GMT-8',
							'Etc/GMT-9',
							'Etc/GMT0',
							'Etc/Greenwich',
							'Etc/UCT',
							'Etc/UTC',
							'Etc/Universal',
							'Etc/Zulu',
							'Europe/Amsterdam',
							'Europe/Andorra',
							'Europe/Astrakhan',
							'Europe/Athens',
							'Europe/Belfast',
							'Europe/Belgrade',
							'Europe/Berlin',
							'Europe/Bratislava',
							'Europe/Brussels',
							'Europe/Bucharest',
							'Europe/Budapest',
							'Europe/Busingen',
							'Europe/Chisinau',
							'Europe/Copenhagen',
							'Europe/Dublin',
							'Europe/Gibraltar',
							'Europe/Guernsey',
							'Europe/Helsinki',
							'Europe/Isle_of_Man',
							'Europe/Istanbul',
							'Europe/Jersey',
							'Europe/Kaliningrad',
							'Europe/Kiev',
							'Europe/Kirov',
							'Europe/Kyiv',
							'Europe/Lisbon',
							'Europe/Ljubljana',
							'Europe/London',
							'Europe/Luxembourg',
							'Europe/Madrid',
							'Europe/Malta',
							'Europe/Mariehamn',
							'Europe/Minsk',
							'Europe/Monaco',
							'Europe/Moscow',
							'Europe/Nicosia',
							'Europe/Oslo',
							'Europe/Paris',
							'Europe/Podgorica',
							'Europe/Prague',
							'Europe/Riga',
							'Europe/Rome',
							'Europe/Samara',
							'Europe/San_Marino',
							'Europe/Sarajevo',
							'Europe/Saratov',
							'Europe/Simferopol',
							'Europe/Skopje',
							'Europe/Sofia',
							'Europe/Stockholm',
							'Europe/Tallinn',
							'Europe/Tirane',
							'Europe/Tiraspol',
							'Europe/Ulyanovsk',
							'Europe/Uzhgorod',
							'Europe/Vaduz',
							'Europe/Vatican',
							'Europe/Vienna',
							'Europe/Vilnius',
							'Europe/Volgograd',
							'Europe/Warsaw',
							'Europe/Zagreb',
							'Europe/Zaporozhye',
							'Europe/Zurich',
							'GB',
							'GB-Eire',
							'GMT',
							'GMT+0',
							'GMT-0',
							'GMT0',
							'Greenwich',
							'HST',
							'Hongkong',
							'Iceland',
							'Indian/Antananarivo',
							'Indian/Chagos',
							'Indian/Christmas',
							'Indian/Cocos',
							'Indian/Comoro',
							'Indian/Kerguelen',
							'Indian/Mahe',
							'Indian/Maldives',
							'Indian/Mauritius',
							'Indian/Mayotte',
							'Indian/Reunion',
							'Iran',
							'Israel',
							'Jamaica',
							'Japan',
							'Kwajalein',
							'Libya',
							'MET',
							'MST',
							'MST7MDT',
							'Mexico/BajaNorte',
							'Mexico/BajaSur',
							'Mexico/General',
							'NZ',
							'NZ-CHAT',
							'Navajo',
							'PRC',
							'PST8PDT',
							'Pacific/Apia',
							'Pacific/Auckland',
							'Pacific/Bougainville',
							'Pacific/Chatham',
							'Pacific/Chuuk',
							'Pacific/Easter',
							'Pacific/Efate',
							'Pacific/Enderbury',
							'Pacific/Fakaofo',
							'Pacific/Fiji',
							'Pacific/Funafuti',
							'Pacific/Galapagos',
							'Pacific/Gambier',
							'Pacific/Guadalcanal',
							'Pacific/Guam',
							'Pacific/Honolulu',
							'Pacific/Johnston',
							'Pacific/Kanton',
							'Pacific/Kiritimati',
							'Pacific/Kosrae',
							'Pacific/Kwajalein',
							'Pacific/Majuro',
							'Pacific/Marquesas',
							'Pacific/Midway',
							'Pacific/Nauru',
							'Pacific/Niue',
							'Pacific/Norfolk',
							'Pacific/Noumea',
							'Pacific/Pago_Pago',
							'Pacific/Palau',
							'Pacific/Pitcairn',
							'Pacific/Pohnpei',
							'Pacific/Ponape',
							'Pacific/Port_Moresby',
							'Pacific/Rarotonga',
							'Pacific/Saipan',
							'Pacific/Samoa',
							'Pacific/Tahiti',
							'Pacific/Tarawa',
							'Pacific/Tongatapu',
							'Pacific/Truk',
							'Pacific/Wake',
							'Pacific/Wallis',
							'Pacific/Yap',
							'Poland',
							'Portugal',
							'ROC',
							'ROK',
							'Singapore',
							'Turkey',
							'UCT',
							'US/Alaska',
							'US/Aleutian',
							'US/Arizona',
							'US/Central',
							'US/East-Indiana',
							'US/Eastern',
							'US/Hawaii',
							'US/Indiana-Starke',
							'US/Michigan',
							'US/Mountain',
							'US/Pacific',
							'US/Samoa',
							'UTC',
							'Universal',
							'W-SU',
							'WET',
							'Zulu',
						])
						.optional(),
					view_id: z.number().int().min(1).optional(),
					channel_type: z.string().optional(),
					channel_address: z.string().max(320).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'customers.mergeCustomers': z
		.object({
			query: z
				.object({
					source_id: z.number().int().min(1),
					target_id: z.number().int().min(1),
				})
				.strict()
				.optional(),
			body: z
				.object({
					channels: z
						.array(
							z
								.object({
									type: z.string(),
									address: z.string(),
									preferred: z.boolean(),
								})
								.strict(),
						)
						.optional(),
					email: z.string().email().nullable().optional(),
					external_id: z.string().nullable().optional(),
					language: z
						.enum([
							'aa',
							'ab',
							'af',
							'ak',
							'sq',
							'am',
							'ar',
							'an',
							'hy',
							'as',
							'av',
							'ae',
							'ay',
							'az',
							'ba',
							'bm',
							'eu',
							'be',
							'bn',
							'bh',
							'bi',
							'bs',
							'br',
							'bg',
							'my',
							'ca',
							'ch',
							'ce',
							'zh',
							'cu',
							'cv',
							'kw',
							'co',
							'cr',
							'cs',
							'da',
							'dv',
							'nl',
							'dz',
							'en',
							'eo',
							'et',
							'ee',
							'fo',
							'fj',
							'fi',
							'fr',
							'fy',
							'ff',
							'ka',
							'de',
							'gd',
							'ga',
							'gl',
							'gv',
							'el',
							'gn',
							'gu',
							'ht',
							'ha',
							'he',
							'hz',
							'hi',
							'ho',
							'hr',
							'hu',
							'ig',
							'is',
							'io',
							'ii',
							'iu',
							'ie',
							'ia',
							'id',
							'ik',
							'it',
							'jv',
							'ja',
							'kl',
							'kn',
							'ks',
							'kr',
							'kk',
							'km',
							'ki',
							'rw',
							'ky',
							'kv',
							'kg',
							'ko',
							'kj',
							'ku',
							'lo',
							'la',
							'lv',
							'li',
							'ln',
							'lt',
							'lb',
							'lu',
							'lg',
							'mk',
							'mh',
							'ml',
							'mi',
							'mr',
							'ms',
							'mg',
							'mt',
							'mn',
							'na',
							'nv',
							'nr',
							'nd',
							'ng',
							'ne',
							'nn',
							'nb',
							'no',
							'ny',
							'oc',
							'oj',
							'or',
							'om',
							'os',
							'pa',
							'fa',
							'pi',
							'pl',
							'pt',
							'ps',
							'qu',
							'rc',
							'rm',
							'ro',
							'rn',
							'ru',
							'sg',
							'sa',
							'si',
							'sk',
							'sl',
							'se',
							'sm',
							'sn',
							'sd',
							'so',
							'st',
							'es',
							'sc',
							'sr',
							'ss',
							'su',
							'sw',
							'sv',
							'ty',
							'ta',
							'tt',
							'te',
							'tg',
							'tl',
							'th',
							'bo',
							'ti',
							'to',
							'tn',
							'ts',
							'tk',
							'tr',
							'tw',
							'ug',
							'uk',
							'ur',
							'uz',
							've',
							'vi',
							'vo',
							'cy',
							'wa',
							'wo',
							'xh',
							'yi',
							'yo',
							'za',
							'zu',
						])
						.optional(),
					name: z.string().nullable().optional(),
					timezone: z
						.enum([
							'Africa/Abidjan',
							'Africa/Accra',
							'Africa/Addis_Ababa',
							'Africa/Algiers',
							'Africa/Asmara',
							'Africa/Asmera',
							'Africa/Bamako',
							'Africa/Bangui',
							'Africa/Banjul',
							'Africa/Bissau',
							'Africa/Blantyre',
							'Africa/Brazzaville',
							'Africa/Bujumbura',
							'Africa/Cairo',
							'Africa/Casablanca',
							'Africa/Ceuta',
							'Africa/Conakry',
							'Africa/Dakar',
							'Africa/Dar_es_Salaam',
							'Africa/Djibouti',
							'Africa/Douala',
							'Africa/El_Aaiun',
							'Africa/Freetown',
							'Africa/Gaborone',
							'Africa/Harare',
							'Africa/Johannesburg',
							'Africa/Juba',
							'Africa/Kampala',
							'Africa/Khartoum',
							'Africa/Kigali',
							'Africa/Kinshasa',
							'Africa/Lagos',
							'Africa/Libreville',
							'Africa/Lome',
							'Africa/Luanda',
							'Africa/Lubumbashi',
							'Africa/Lusaka',
							'Africa/Malabo',
							'Africa/Maputo',
							'Africa/Maseru',
							'Africa/Mbabane',
							'Africa/Mogadishu',
							'Africa/Monrovia',
							'Africa/Nairobi',
							'Africa/Ndjamena',
							'Africa/Niamey',
							'Africa/Nouakchott',
							'Africa/Ouagadougou',
							'Africa/Porto-Novo',
							'Africa/Sao_Tome',
							'Africa/Timbuktu',
							'Africa/Tripoli',
							'Africa/Tunis',
							'Africa/Windhoek',
							'America/Adak',
							'America/Anchorage',
							'America/Anguilla',
							'America/Antigua',
							'America/Araguaina',
							'America/Argentina/Buenos_Aires',
							'America/Argentina/Catamarca',
							'America/Argentina/ComodRivadavia',
							'America/Argentina/Cordoba',
							'America/Argentina/Jujuy',
							'America/Argentina/La_Rioja',
							'America/Argentina/Mendoza',
							'America/Argentina/Rio_Gallegos',
							'America/Argentina/Salta',
							'America/Argentina/San_Juan',
							'America/Argentina/San_Luis',
							'America/Argentina/Tucuman',
							'America/Argentina/Ushuaia',
							'America/Aruba',
							'America/Asuncion',
							'America/Atikokan',
							'America/Atka',
							'America/Bahia',
							'America/Bahia_Banderas',
							'America/Barbados',
							'America/Belem',
							'America/Belize',
							'America/Blanc-Sablon',
							'America/Boa_Vista',
							'America/Bogota',
							'America/Boise',
							'America/Buenos_Aires',
							'America/Cambridge_Bay',
							'America/Campo_Grande',
							'America/Cancun',
							'America/Caracas',
							'America/Catamarca',
							'America/Cayenne',
							'America/Cayman',
							'America/Chicago',
							'America/Chihuahua',
							'America/Ciudad_Juarez',
							'America/Coral_Harbour',
							'America/Cordoba',
							'America/Costa_Rica',
							'America/Coyhaique',
							'America/Creston',
							'America/Cuiaba',
							'America/Curacao',
							'America/Danmarkshavn',
							'America/Dawson',
							'America/Dawson_Creek',
							'America/Denver',
							'America/Detroit',
							'America/Dominica',
							'America/Edmonton',
							'America/Eirunepe',
							'America/El_Salvador',
							'America/Ensenada',
							'America/Fort_Nelson',
							'America/Fort_Wayne',
							'America/Fortaleza',
							'America/Glace_Bay',
							'America/Godthab',
							'America/Goose_Bay',
							'America/Grand_Turk',
							'America/Grenada',
							'America/Guadeloupe',
							'America/Guatemala',
							'America/Guayaquil',
							'America/Guyana',
							'America/Halifax',
							'America/Havana',
							'America/Hermosillo',
							'America/Indiana/Indianapolis',
							'America/Indiana/Knox',
							'America/Indiana/Marengo',
							'America/Indiana/Petersburg',
							'America/Indiana/Tell_City',
							'America/Indiana/Vevay',
							'America/Indiana/Vincennes',
							'America/Indiana/Winamac',
							'America/Indianapolis',
							'America/Inuvik',
							'America/Iqaluit',
							'America/Jamaica',
							'America/Jujuy',
							'America/Juneau',
							'America/Kentucky/Louisville',
							'America/Kentucky/Monticello',
							'America/Knox_IN',
							'America/Kralendijk',
							'America/La_Paz',
							'America/Lima',
							'America/Los_Angeles',
							'America/Louisville',
							'America/Lower_Princes',
							'America/Maceio',
							'America/Managua',
							'America/Manaus',
							'America/Marigot',
							'America/Martinique',
							'America/Matamoros',
							'America/Mazatlan',
							'America/Mendoza',
							'America/Menominee',
							'America/Merida',
							'America/Metlakatla',
							'America/Mexico_City',
							'America/Miquelon',
							'America/Moncton',
							'America/Monterrey',
							'America/Montevideo',
							'America/Montreal',
							'America/Montserrat',
							'America/Nassau',
							'America/New_York',
							'America/Nipigon',
							'America/Nome',
							'America/Noronha',
							'America/North_Dakota/Beulah',
							'America/North_Dakota/Center',
							'America/North_Dakota/New_Salem',
							'America/Nuuk',
							'America/Ojinaga',
							'America/Panama',
							'America/Pangnirtung',
							'America/Paramaribo',
							'America/Phoenix',
							'America/Port-au-Prince',
							'America/Port_of_Spain',
							'America/Porto_Acre',
							'America/Porto_Velho',
							'America/Puerto_Rico',
							'America/Punta_Arenas',
							'America/Rainy_River',
							'America/Rankin_Inlet',
							'America/Recife',
							'America/Regina',
							'America/Resolute',
							'America/Rio_Branco',
							'America/Rosario',
							'America/Santa_Isabel',
							'America/Santarem',
							'America/Santiago',
							'America/Santo_Domingo',
							'America/Sao_Paulo',
							'America/Scoresbysund',
							'America/Shiprock',
							'America/Sitka',
							'America/St_Barthelemy',
							'America/St_Johns',
							'America/St_Kitts',
							'America/St_Lucia',
							'America/St_Thomas',
							'America/St_Vincent',
							'America/Swift_Current',
							'America/Tegucigalpa',
							'America/Thule',
							'America/Thunder_Bay',
							'America/Tijuana',
							'America/Toronto',
							'America/Tortola',
							'America/Vancouver',
							'America/Virgin',
							'America/Whitehorse',
							'America/Winnipeg',
							'America/Yakutat',
							'America/Yellowknife',
							'Antarctica/Casey',
							'Antarctica/Davis',
							'Antarctica/DumontDUrville',
							'Antarctica/Macquarie',
							'Antarctica/Mawson',
							'Antarctica/McMurdo',
							'Antarctica/Palmer',
							'Antarctica/Rothera',
							'Antarctica/South_Pole',
							'Antarctica/Syowa',
							'Antarctica/Troll',
							'Antarctica/Vostok',
							'Arctic/Longyearbyen',
							'Asia/Aden',
							'Asia/Almaty',
							'Asia/Amman',
							'Asia/Anadyr',
							'Asia/Aqtau',
							'Asia/Aqtobe',
							'Asia/Ashgabat',
							'Asia/Ashkhabad',
							'Asia/Atyrau',
							'Asia/Baghdad',
							'Asia/Bahrain',
							'Asia/Baku',
							'Asia/Bangkok',
							'Asia/Barnaul',
							'Asia/Beirut',
							'Asia/Bishkek',
							'Asia/Brunei',
							'Asia/Calcutta',
							'Asia/Chita',
							'Asia/Choibalsan',
							'Asia/Chongqing',
							'Asia/Chungking',
							'Asia/Colombo',
							'Asia/Dacca',
							'Asia/Damascus',
							'Asia/Dhaka',
							'Asia/Dili',
							'Asia/Dubai',
							'Asia/Dushanbe',
							'Asia/Famagusta',
							'Asia/Gaza',
							'Asia/Harbin',
							'Asia/Hebron',
							'Asia/Ho_Chi_Minh',
							'Asia/Hong_Kong',
							'Asia/Hovd',
							'Asia/Irkutsk',
							'Asia/Istanbul',
							'Asia/Jakarta',
							'Asia/Jayapura',
							'Asia/Jerusalem',
							'Asia/Kabul',
							'Asia/Kamchatka',
							'Asia/Karachi',
							'Asia/Kashgar',
							'Asia/Kathmandu',
							'Asia/Katmandu',
							'Asia/Khandyga',
							'Asia/Kolkata',
							'Asia/Krasnoyarsk',
							'Asia/Kuala_Lumpur',
							'Asia/Kuching',
							'Asia/Kuwait',
							'Asia/Macao',
							'Asia/Macau',
							'Asia/Magadan',
							'Asia/Makassar',
							'Asia/Manila',
							'Asia/Muscat',
							'Asia/Nicosia',
							'Asia/Novokuznetsk',
							'Asia/Novosibirsk',
							'Asia/Omsk',
							'Asia/Oral',
							'Asia/Phnom_Penh',
							'Asia/Pontianak',
							'Asia/Pyongyang',
							'Asia/Qatar',
							'Asia/Qostanay',
							'Asia/Qyzylorda',
							'Asia/Rangoon',
							'Asia/Riyadh',
							'Asia/Saigon',
							'Asia/Sakhalin',
							'Asia/Samarkand',
							'Asia/Seoul',
							'Asia/Shanghai',
							'Asia/Singapore',
							'Asia/Srednekolymsk',
							'Asia/Taipei',
							'Asia/Tashkent',
							'Asia/Tbilisi',
							'Asia/Tehran',
							'Asia/Tel_Aviv',
							'Asia/Thimbu',
							'Asia/Thimphu',
							'Asia/Tokyo',
							'Asia/Tomsk',
							'Asia/Ujung_Pandang',
							'Asia/Ulaanbaatar',
							'Asia/Ulan_Bator',
							'Asia/Urumqi',
							'Asia/Ust-Nera',
							'Asia/Vientiane',
							'Asia/Vladivostok',
							'Asia/Yakutsk',
							'Asia/Yangon',
							'Asia/Yekaterinburg',
							'Asia/Yerevan',
							'Atlantic/Azores',
							'Atlantic/Bermuda',
							'Atlantic/Canary',
							'Atlantic/Cape_Verde',
							'Atlantic/Faeroe',
							'Atlantic/Faroe',
							'Atlantic/Jan_Mayen',
							'Atlantic/Madeira',
							'Atlantic/Reykjavik',
							'Atlantic/South_Georgia',
							'Atlantic/St_Helena',
							'Atlantic/Stanley',
							'Australia/ACT',
							'Australia/Adelaide',
							'Australia/Brisbane',
							'Australia/Broken_Hill',
							'Australia/Canberra',
							'Australia/Currie',
							'Australia/Darwin',
							'Australia/Eucla',
							'Australia/Hobart',
							'Australia/LHI',
							'Australia/Lindeman',
							'Australia/Lord_Howe',
							'Australia/Melbourne',
							'Australia/NSW',
							'Australia/North',
							'Australia/Perth',
							'Australia/Queensland',
							'Australia/South',
							'Australia/Sydney',
							'Australia/Tasmania',
							'Australia/Victoria',
							'Australia/West',
							'Australia/Yancowinna',
							'Brazil/Acre',
							'Brazil/DeNoronha',
							'Brazil/East',
							'Brazil/West',
							'CET',
							'CST6CDT',
							'Canada/Atlantic',
							'Canada/Central',
							'Canada/Eastern',
							'Canada/Mountain',
							'Canada/Newfoundland',
							'Canada/Pacific',
							'Canada/Saskatchewan',
							'Canada/Yukon',
							'Chile/Continental',
							'Chile/EasterIsland',
							'Cuba',
							'EET',
							'EST',
							'EST5EDT',
							'Egypt',
							'Eire',
							'Etc/GMT',
							'Etc/GMT+0',
							'Etc/GMT+1',
							'Etc/GMT+10',
							'Etc/GMT+11',
							'Etc/GMT+12',
							'Etc/GMT+2',
							'Etc/GMT+3',
							'Etc/GMT+4',
							'Etc/GMT+5',
							'Etc/GMT+6',
							'Etc/GMT+7',
							'Etc/GMT+8',
							'Etc/GMT+9',
							'Etc/GMT-0',
							'Etc/GMT-1',
							'Etc/GMT-10',
							'Etc/GMT-11',
							'Etc/GMT-12',
							'Etc/GMT-13',
							'Etc/GMT-14',
							'Etc/GMT-2',
							'Etc/GMT-3',
							'Etc/GMT-4',
							'Etc/GMT-5',
							'Etc/GMT-6',
							'Etc/GMT-7',
							'Etc/GMT-8',
							'Etc/GMT-9',
							'Etc/GMT0',
							'Etc/Greenwich',
							'Etc/UCT',
							'Etc/UTC',
							'Etc/Universal',
							'Etc/Zulu',
							'Europe/Amsterdam',
							'Europe/Andorra',
							'Europe/Astrakhan',
							'Europe/Athens',
							'Europe/Belfast',
							'Europe/Belgrade',
							'Europe/Berlin',
							'Europe/Bratislava',
							'Europe/Brussels',
							'Europe/Bucharest',
							'Europe/Budapest',
							'Europe/Busingen',
							'Europe/Chisinau',
							'Europe/Copenhagen',
							'Europe/Dublin',
							'Europe/Gibraltar',
							'Europe/Guernsey',
							'Europe/Helsinki',
							'Europe/Isle_of_Man',
							'Europe/Istanbul',
							'Europe/Jersey',
							'Europe/Kaliningrad',
							'Europe/Kiev',
							'Europe/Kirov',
							'Europe/Kyiv',
							'Europe/Lisbon',
							'Europe/Ljubljana',
							'Europe/London',
							'Europe/Luxembourg',
							'Europe/Madrid',
							'Europe/Malta',
							'Europe/Mariehamn',
							'Europe/Minsk',
							'Europe/Monaco',
							'Europe/Moscow',
							'Europe/Nicosia',
							'Europe/Oslo',
							'Europe/Paris',
							'Europe/Podgorica',
							'Europe/Prague',
							'Europe/Riga',
							'Europe/Rome',
							'Europe/Samara',
							'Europe/San_Marino',
							'Europe/Sarajevo',
							'Europe/Saratov',
							'Europe/Simferopol',
							'Europe/Skopje',
							'Europe/Sofia',
							'Europe/Stockholm',
							'Europe/Tallinn',
							'Europe/Tirane',
							'Europe/Tiraspol',
							'Europe/Ulyanovsk',
							'Europe/Uzhgorod',
							'Europe/Vaduz',
							'Europe/Vatican',
							'Europe/Vienna',
							'Europe/Vilnius',
							'Europe/Volgograd',
							'Europe/Warsaw',
							'Europe/Zagreb',
							'Europe/Zaporozhye',
							'Europe/Zurich',
							'GB',
							'GB-Eire',
							'GMT',
							'GMT+0',
							'GMT-0',
							'GMT0',
							'Greenwich',
							'HST',
							'Hongkong',
							'Iceland',
							'Indian/Antananarivo',
							'Indian/Chagos',
							'Indian/Christmas',
							'Indian/Cocos',
							'Indian/Comoro',
							'Indian/Kerguelen',
							'Indian/Mahe',
							'Indian/Maldives',
							'Indian/Mauritius',
							'Indian/Mayotte',
							'Indian/Reunion',
							'Iran',
							'Israel',
							'Jamaica',
							'Japan',
							'Kwajalein',
							'Libya',
							'MET',
							'MST',
							'MST7MDT',
							'Mexico/BajaNorte',
							'Mexico/BajaSur',
							'Mexico/General',
							'NZ',
							'NZ-CHAT',
							'Navajo',
							'PRC',
							'PST8PDT',
							'Pacific/Apia',
							'Pacific/Auckland',
							'Pacific/Bougainville',
							'Pacific/Chatham',
							'Pacific/Chuuk',
							'Pacific/Easter',
							'Pacific/Efate',
							'Pacific/Enderbury',
							'Pacific/Fakaofo',
							'Pacific/Fiji',
							'Pacific/Funafuti',
							'Pacific/Galapagos',
							'Pacific/Gambier',
							'Pacific/Guadalcanal',
							'Pacific/Guam',
							'Pacific/Honolulu',
							'Pacific/Johnston',
							'Pacific/Kanton',
							'Pacific/Kiritimati',
							'Pacific/Kosrae',
							'Pacific/Kwajalein',
							'Pacific/Majuro',
							'Pacific/Marquesas',
							'Pacific/Midway',
							'Pacific/Nauru',
							'Pacific/Niue',
							'Pacific/Norfolk',
							'Pacific/Noumea',
							'Pacific/Pago_Pago',
							'Pacific/Palau',
							'Pacific/Pitcairn',
							'Pacific/Pohnpei',
							'Pacific/Ponape',
							'Pacific/Port_Moresby',
							'Pacific/Rarotonga',
							'Pacific/Saipan',
							'Pacific/Samoa',
							'Pacific/Tahiti',
							'Pacific/Tarawa',
							'Pacific/Tongatapu',
							'Pacific/Truk',
							'Pacific/Wake',
							'Pacific/Wallis',
							'Pacific/Yap',
							'Poland',
							'Portugal',
							'ROC',
							'ROK',
							'Singapore',
							'Turkey',
							'UCT',
							'US/Alaska',
							'US/Aleutian',
							'US/Arizona',
							'US/Central',
							'US/East-Indiana',
							'US/Eastern',
							'US/Hawaii',
							'US/Indiana-Starke',
							'US/Michigan',
							'US/Mountain',
							'US/Pacific',
							'US/Samoa',
							'UTC',
							'Universal',
							'W-SU',
							'WET',
							'Zulu',
						])
						.optional(),
				})
				.strict(),
		})
		.strict(),
	'customers.updateCustomer': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					channels: z
						.array(
							z
								.object({
									type: z.string(),
									address: z.string(),
									preferred: z.boolean(),
								})
								.strict(),
						)
						.optional(),
					email: z.string().email().nullable().optional(),
					external_id: z.string().nullable().optional(),
					language: z
						.enum([
							'aa',
							'ab',
							'af',
							'ak',
							'sq',
							'am',
							'ar',
							'an',
							'hy',
							'as',
							'av',
							'ae',
							'ay',
							'az',
							'ba',
							'bm',
							'eu',
							'be',
							'bn',
							'bh',
							'bi',
							'bs',
							'br',
							'bg',
							'my',
							'ca',
							'ch',
							'ce',
							'zh',
							'cu',
							'cv',
							'kw',
							'co',
							'cr',
							'cs',
							'da',
							'dv',
							'nl',
							'dz',
							'en',
							'eo',
							'et',
							'ee',
							'fo',
							'fj',
							'fi',
							'fr',
							'fy',
							'ff',
							'ka',
							'de',
							'gd',
							'ga',
							'gl',
							'gv',
							'el',
							'gn',
							'gu',
							'ht',
							'ha',
							'he',
							'hz',
							'hi',
							'ho',
							'hr',
							'hu',
							'ig',
							'is',
							'io',
							'ii',
							'iu',
							'ie',
							'ia',
							'id',
							'ik',
							'it',
							'jv',
							'ja',
							'kl',
							'kn',
							'ks',
							'kr',
							'kk',
							'km',
							'ki',
							'rw',
							'ky',
							'kv',
							'kg',
							'ko',
							'kj',
							'ku',
							'lo',
							'la',
							'lv',
							'li',
							'ln',
							'lt',
							'lb',
							'lu',
							'lg',
							'mk',
							'mh',
							'ml',
							'mi',
							'mr',
							'ms',
							'mg',
							'mt',
							'mn',
							'na',
							'nv',
							'nr',
							'nd',
							'ng',
							'ne',
							'nn',
							'nb',
							'no',
							'ny',
							'oc',
							'oj',
							'or',
							'om',
							'os',
							'pa',
							'fa',
							'pi',
							'pl',
							'pt',
							'ps',
							'qu',
							'rc',
							'rm',
							'ro',
							'rn',
							'ru',
							'sg',
							'sa',
							'si',
							'sk',
							'sl',
							'se',
							'sm',
							'sn',
							'sd',
							'so',
							'st',
							'es',
							'sc',
							'sr',
							'ss',
							'su',
							'sw',
							'sv',
							'ty',
							'ta',
							'tt',
							'te',
							'tg',
							'tl',
							'th',
							'bo',
							'ti',
							'to',
							'tn',
							'ts',
							'tk',
							'tr',
							'tw',
							'ug',
							'uk',
							'ur',
							'uz',
							've',
							'vi',
							'vo',
							'cy',
							'wa',
							'wo',
							'xh',
							'yi',
							'yo',
							'za',
							'zu',
						])
						.optional(),
					name: z.string().nullable().optional(),
					timezone: z
						.enum([
							'Africa/Abidjan',
							'Africa/Accra',
							'Africa/Addis_Ababa',
							'Africa/Algiers',
							'Africa/Asmara',
							'Africa/Asmera',
							'Africa/Bamako',
							'Africa/Bangui',
							'Africa/Banjul',
							'Africa/Bissau',
							'Africa/Blantyre',
							'Africa/Brazzaville',
							'Africa/Bujumbura',
							'Africa/Cairo',
							'Africa/Casablanca',
							'Africa/Ceuta',
							'Africa/Conakry',
							'Africa/Dakar',
							'Africa/Dar_es_Salaam',
							'Africa/Djibouti',
							'Africa/Douala',
							'Africa/El_Aaiun',
							'Africa/Freetown',
							'Africa/Gaborone',
							'Africa/Harare',
							'Africa/Johannesburg',
							'Africa/Juba',
							'Africa/Kampala',
							'Africa/Khartoum',
							'Africa/Kigali',
							'Africa/Kinshasa',
							'Africa/Lagos',
							'Africa/Libreville',
							'Africa/Lome',
							'Africa/Luanda',
							'Africa/Lubumbashi',
							'Africa/Lusaka',
							'Africa/Malabo',
							'Africa/Maputo',
							'Africa/Maseru',
							'Africa/Mbabane',
							'Africa/Mogadishu',
							'Africa/Monrovia',
							'Africa/Nairobi',
							'Africa/Ndjamena',
							'Africa/Niamey',
							'Africa/Nouakchott',
							'Africa/Ouagadougou',
							'Africa/Porto-Novo',
							'Africa/Sao_Tome',
							'Africa/Timbuktu',
							'Africa/Tripoli',
							'Africa/Tunis',
							'Africa/Windhoek',
							'America/Adak',
							'America/Anchorage',
							'America/Anguilla',
							'America/Antigua',
							'America/Araguaina',
							'America/Argentina/Buenos_Aires',
							'America/Argentina/Catamarca',
							'America/Argentina/ComodRivadavia',
							'America/Argentina/Cordoba',
							'America/Argentina/Jujuy',
							'America/Argentina/La_Rioja',
							'America/Argentina/Mendoza',
							'America/Argentina/Rio_Gallegos',
							'America/Argentina/Salta',
							'America/Argentina/San_Juan',
							'America/Argentina/San_Luis',
							'America/Argentina/Tucuman',
							'America/Argentina/Ushuaia',
							'America/Aruba',
							'America/Asuncion',
							'America/Atikokan',
							'America/Atka',
							'America/Bahia',
							'America/Bahia_Banderas',
							'America/Barbados',
							'America/Belem',
							'America/Belize',
							'America/Blanc-Sablon',
							'America/Boa_Vista',
							'America/Bogota',
							'America/Boise',
							'America/Buenos_Aires',
							'America/Cambridge_Bay',
							'America/Campo_Grande',
							'America/Cancun',
							'America/Caracas',
							'America/Catamarca',
							'America/Cayenne',
							'America/Cayman',
							'America/Chicago',
							'America/Chihuahua',
							'America/Ciudad_Juarez',
							'America/Coral_Harbour',
							'America/Cordoba',
							'America/Costa_Rica',
							'America/Coyhaique',
							'America/Creston',
							'America/Cuiaba',
							'America/Curacao',
							'America/Danmarkshavn',
							'America/Dawson',
							'America/Dawson_Creek',
							'America/Denver',
							'America/Detroit',
							'America/Dominica',
							'America/Edmonton',
							'America/Eirunepe',
							'America/El_Salvador',
							'America/Ensenada',
							'America/Fort_Nelson',
							'America/Fort_Wayne',
							'America/Fortaleza',
							'America/Glace_Bay',
							'America/Godthab',
							'America/Goose_Bay',
							'America/Grand_Turk',
							'America/Grenada',
							'America/Guadeloupe',
							'America/Guatemala',
							'America/Guayaquil',
							'America/Guyana',
							'America/Halifax',
							'America/Havana',
							'America/Hermosillo',
							'America/Indiana/Indianapolis',
							'America/Indiana/Knox',
							'America/Indiana/Marengo',
							'America/Indiana/Petersburg',
							'America/Indiana/Tell_City',
							'America/Indiana/Vevay',
							'America/Indiana/Vincennes',
							'America/Indiana/Winamac',
							'America/Indianapolis',
							'America/Inuvik',
							'America/Iqaluit',
							'America/Jamaica',
							'America/Jujuy',
							'America/Juneau',
							'America/Kentucky/Louisville',
							'America/Kentucky/Monticello',
							'America/Knox_IN',
							'America/Kralendijk',
							'America/La_Paz',
							'America/Lima',
							'America/Los_Angeles',
							'America/Louisville',
							'America/Lower_Princes',
							'America/Maceio',
							'America/Managua',
							'America/Manaus',
							'America/Marigot',
							'America/Martinique',
							'America/Matamoros',
							'America/Mazatlan',
							'America/Mendoza',
							'America/Menominee',
							'America/Merida',
							'America/Metlakatla',
							'America/Mexico_City',
							'America/Miquelon',
							'America/Moncton',
							'America/Monterrey',
							'America/Montevideo',
							'America/Montreal',
							'America/Montserrat',
							'America/Nassau',
							'America/New_York',
							'America/Nipigon',
							'America/Nome',
							'America/Noronha',
							'America/North_Dakota/Beulah',
							'America/North_Dakota/Center',
							'America/North_Dakota/New_Salem',
							'America/Nuuk',
							'America/Ojinaga',
							'America/Panama',
							'America/Pangnirtung',
							'America/Paramaribo',
							'America/Phoenix',
							'America/Port-au-Prince',
							'America/Port_of_Spain',
							'America/Porto_Acre',
							'America/Porto_Velho',
							'America/Puerto_Rico',
							'America/Punta_Arenas',
							'America/Rainy_River',
							'America/Rankin_Inlet',
							'America/Recife',
							'America/Regina',
							'America/Resolute',
							'America/Rio_Branco',
							'America/Rosario',
							'America/Santa_Isabel',
							'America/Santarem',
							'America/Santiago',
							'America/Santo_Domingo',
							'America/Sao_Paulo',
							'America/Scoresbysund',
							'America/Shiprock',
							'America/Sitka',
							'America/St_Barthelemy',
							'America/St_Johns',
							'America/St_Kitts',
							'America/St_Lucia',
							'America/St_Thomas',
							'America/St_Vincent',
							'America/Swift_Current',
							'America/Tegucigalpa',
							'America/Thule',
							'America/Thunder_Bay',
							'America/Tijuana',
							'America/Toronto',
							'America/Tortola',
							'America/Vancouver',
							'America/Virgin',
							'America/Whitehorse',
							'America/Winnipeg',
							'America/Yakutat',
							'America/Yellowknife',
							'Antarctica/Casey',
							'Antarctica/Davis',
							'Antarctica/DumontDUrville',
							'Antarctica/Macquarie',
							'Antarctica/Mawson',
							'Antarctica/McMurdo',
							'Antarctica/Palmer',
							'Antarctica/Rothera',
							'Antarctica/South_Pole',
							'Antarctica/Syowa',
							'Antarctica/Troll',
							'Antarctica/Vostok',
							'Arctic/Longyearbyen',
							'Asia/Aden',
							'Asia/Almaty',
							'Asia/Amman',
							'Asia/Anadyr',
							'Asia/Aqtau',
							'Asia/Aqtobe',
							'Asia/Ashgabat',
							'Asia/Ashkhabad',
							'Asia/Atyrau',
							'Asia/Baghdad',
							'Asia/Bahrain',
							'Asia/Baku',
							'Asia/Bangkok',
							'Asia/Barnaul',
							'Asia/Beirut',
							'Asia/Bishkek',
							'Asia/Brunei',
							'Asia/Calcutta',
							'Asia/Chita',
							'Asia/Choibalsan',
							'Asia/Chongqing',
							'Asia/Chungking',
							'Asia/Colombo',
							'Asia/Dacca',
							'Asia/Damascus',
							'Asia/Dhaka',
							'Asia/Dili',
							'Asia/Dubai',
							'Asia/Dushanbe',
							'Asia/Famagusta',
							'Asia/Gaza',
							'Asia/Harbin',
							'Asia/Hebron',
							'Asia/Ho_Chi_Minh',
							'Asia/Hong_Kong',
							'Asia/Hovd',
							'Asia/Irkutsk',
							'Asia/Istanbul',
							'Asia/Jakarta',
							'Asia/Jayapura',
							'Asia/Jerusalem',
							'Asia/Kabul',
							'Asia/Kamchatka',
							'Asia/Karachi',
							'Asia/Kashgar',
							'Asia/Kathmandu',
							'Asia/Katmandu',
							'Asia/Khandyga',
							'Asia/Kolkata',
							'Asia/Krasnoyarsk',
							'Asia/Kuala_Lumpur',
							'Asia/Kuching',
							'Asia/Kuwait',
							'Asia/Macao',
							'Asia/Macau',
							'Asia/Magadan',
							'Asia/Makassar',
							'Asia/Manila',
							'Asia/Muscat',
							'Asia/Nicosia',
							'Asia/Novokuznetsk',
							'Asia/Novosibirsk',
							'Asia/Omsk',
							'Asia/Oral',
							'Asia/Phnom_Penh',
							'Asia/Pontianak',
							'Asia/Pyongyang',
							'Asia/Qatar',
							'Asia/Qostanay',
							'Asia/Qyzylorda',
							'Asia/Rangoon',
							'Asia/Riyadh',
							'Asia/Saigon',
							'Asia/Sakhalin',
							'Asia/Samarkand',
							'Asia/Seoul',
							'Asia/Shanghai',
							'Asia/Singapore',
							'Asia/Srednekolymsk',
							'Asia/Taipei',
							'Asia/Tashkent',
							'Asia/Tbilisi',
							'Asia/Tehran',
							'Asia/Tel_Aviv',
							'Asia/Thimbu',
							'Asia/Thimphu',
							'Asia/Tokyo',
							'Asia/Tomsk',
							'Asia/Ujung_Pandang',
							'Asia/Ulaanbaatar',
							'Asia/Ulan_Bator',
							'Asia/Urumqi',
							'Asia/Ust-Nera',
							'Asia/Vientiane',
							'Asia/Vladivostok',
							'Asia/Yakutsk',
							'Asia/Yangon',
							'Asia/Yekaterinburg',
							'Asia/Yerevan',
							'Atlantic/Azores',
							'Atlantic/Bermuda',
							'Atlantic/Canary',
							'Atlantic/Cape_Verde',
							'Atlantic/Faeroe',
							'Atlantic/Faroe',
							'Atlantic/Jan_Mayen',
							'Atlantic/Madeira',
							'Atlantic/Reykjavik',
							'Atlantic/South_Georgia',
							'Atlantic/St_Helena',
							'Atlantic/Stanley',
							'Australia/ACT',
							'Australia/Adelaide',
							'Australia/Brisbane',
							'Australia/Broken_Hill',
							'Australia/Canberra',
							'Australia/Currie',
							'Australia/Darwin',
							'Australia/Eucla',
							'Australia/Hobart',
							'Australia/LHI',
							'Australia/Lindeman',
							'Australia/Lord_Howe',
							'Australia/Melbourne',
							'Australia/NSW',
							'Australia/North',
							'Australia/Perth',
							'Australia/Queensland',
							'Australia/South',
							'Australia/Sydney',
							'Australia/Tasmania',
							'Australia/Victoria',
							'Australia/West',
							'Australia/Yancowinna',
							'Brazil/Acre',
							'Brazil/DeNoronha',
							'Brazil/East',
							'Brazil/West',
							'CET',
							'CST6CDT',
							'Canada/Atlantic',
							'Canada/Central',
							'Canada/Eastern',
							'Canada/Mountain',
							'Canada/Newfoundland',
							'Canada/Pacific',
							'Canada/Saskatchewan',
							'Canada/Yukon',
							'Chile/Continental',
							'Chile/EasterIsland',
							'Cuba',
							'EET',
							'EST',
							'EST5EDT',
							'Egypt',
							'Eire',
							'Etc/GMT',
							'Etc/GMT+0',
							'Etc/GMT+1',
							'Etc/GMT+10',
							'Etc/GMT+11',
							'Etc/GMT+12',
							'Etc/GMT+2',
							'Etc/GMT+3',
							'Etc/GMT+4',
							'Etc/GMT+5',
							'Etc/GMT+6',
							'Etc/GMT+7',
							'Etc/GMT+8',
							'Etc/GMT+9',
							'Etc/GMT-0',
							'Etc/GMT-1',
							'Etc/GMT-10',
							'Etc/GMT-11',
							'Etc/GMT-12',
							'Etc/GMT-13',
							'Etc/GMT-14',
							'Etc/GMT-2',
							'Etc/GMT-3',
							'Etc/GMT-4',
							'Etc/GMT-5',
							'Etc/GMT-6',
							'Etc/GMT-7',
							'Etc/GMT-8',
							'Etc/GMT-9',
							'Etc/GMT0',
							'Etc/Greenwich',
							'Etc/UCT',
							'Etc/UTC',
							'Etc/Universal',
							'Etc/Zulu',
							'Europe/Amsterdam',
							'Europe/Andorra',
							'Europe/Astrakhan',
							'Europe/Athens',
							'Europe/Belfast',
							'Europe/Belgrade',
							'Europe/Berlin',
							'Europe/Bratislava',
							'Europe/Brussels',
							'Europe/Bucharest',
							'Europe/Budapest',
							'Europe/Busingen',
							'Europe/Chisinau',
							'Europe/Copenhagen',
							'Europe/Dublin',
							'Europe/Gibraltar',
							'Europe/Guernsey',
							'Europe/Helsinki',
							'Europe/Isle_of_Man',
							'Europe/Istanbul',
							'Europe/Jersey',
							'Europe/Kaliningrad',
							'Europe/Kiev',
							'Europe/Kirov',
							'Europe/Kyiv',
							'Europe/Lisbon',
							'Europe/Ljubljana',
							'Europe/London',
							'Europe/Luxembourg',
							'Europe/Madrid',
							'Europe/Malta',
							'Europe/Mariehamn',
							'Europe/Minsk',
							'Europe/Monaco',
							'Europe/Moscow',
							'Europe/Nicosia',
							'Europe/Oslo',
							'Europe/Paris',
							'Europe/Podgorica',
							'Europe/Prague',
							'Europe/Riga',
							'Europe/Rome',
							'Europe/Samara',
							'Europe/San_Marino',
							'Europe/Sarajevo',
							'Europe/Saratov',
							'Europe/Simferopol',
							'Europe/Skopje',
							'Europe/Sofia',
							'Europe/Stockholm',
							'Europe/Tallinn',
							'Europe/Tirane',
							'Europe/Tiraspol',
							'Europe/Ulyanovsk',
							'Europe/Uzhgorod',
							'Europe/Vaduz',
							'Europe/Vatican',
							'Europe/Vienna',
							'Europe/Vilnius',
							'Europe/Volgograd',
							'Europe/Warsaw',
							'Europe/Zagreb',
							'Europe/Zaporozhye',
							'Europe/Zurich',
							'GB',
							'GB-Eire',
							'GMT',
							'GMT+0',
							'GMT-0',
							'GMT0',
							'Greenwich',
							'HST',
							'Hongkong',
							'Iceland',
							'Indian/Antananarivo',
							'Indian/Chagos',
							'Indian/Christmas',
							'Indian/Cocos',
							'Indian/Comoro',
							'Indian/Kerguelen',
							'Indian/Mahe',
							'Indian/Maldives',
							'Indian/Mauritius',
							'Indian/Mayotte',
							'Indian/Reunion',
							'Iran',
							'Israel',
							'Jamaica',
							'Japan',
							'Kwajalein',
							'Libya',
							'MET',
							'MST',
							'MST7MDT',
							'Mexico/BajaNorte',
							'Mexico/BajaSur',
							'Mexico/General',
							'NZ',
							'NZ-CHAT',
							'Navajo',
							'PRC',
							'PST8PDT',
							'Pacific/Apia',
							'Pacific/Auckland',
							'Pacific/Bougainville',
							'Pacific/Chatham',
							'Pacific/Chuuk',
							'Pacific/Easter',
							'Pacific/Efate',
							'Pacific/Enderbury',
							'Pacific/Fakaofo',
							'Pacific/Fiji',
							'Pacific/Funafuti',
							'Pacific/Galapagos',
							'Pacific/Gambier',
							'Pacific/Guadalcanal',
							'Pacific/Guam',
							'Pacific/Honolulu',
							'Pacific/Johnston',
							'Pacific/Kanton',
							'Pacific/Kiritimati',
							'Pacific/Kosrae',
							'Pacific/Kwajalein',
							'Pacific/Majuro',
							'Pacific/Marquesas',
							'Pacific/Midway',
							'Pacific/Nauru',
							'Pacific/Niue',
							'Pacific/Norfolk',
							'Pacific/Noumea',
							'Pacific/Pago_Pago',
							'Pacific/Palau',
							'Pacific/Pitcairn',
							'Pacific/Pohnpei',
							'Pacific/Ponape',
							'Pacific/Port_Moresby',
							'Pacific/Rarotonga',
							'Pacific/Saipan',
							'Pacific/Samoa',
							'Pacific/Tahiti',
							'Pacific/Tarawa',
							'Pacific/Tongatapu',
							'Pacific/Truk',
							'Pacific/Wake',
							'Pacific/Wallis',
							'Pacific/Yap',
							'Poland',
							'Portugal',
							'ROC',
							'ROK',
							'Singapore',
							'Turkey',
							'UCT',
							'US/Alaska',
							'US/Aleutian',
							'US/Arizona',
							'US/Central',
							'US/East-Indiana',
							'US/Eastern',
							'US/Hawaii',
							'US/Indiana-Starke',
							'US/Michigan',
							'US/Mountain',
							'US/Pacific',
							'US/Samoa',
							'UTC',
							'Universal',
							'W-SU',
							'WET',
							'Zulu',
						])
						.optional(),
				})
				.strict(),
		})
		.strict(),
	'customers.updateCustomerCustomFieldValue': z
		.object({
			path: z
				.object({
					customer_id: z.number().int(),
					id: z.number().int(),
				})
				.strict(),
			body: z.union([z.string(), z.number().int(), z.boolean()]),
		})
		.strict(),
	'customers.updateCustomerCustomFieldValues': z
		.object({
			path: z
				.object({
					customer_id: z.number().int(),
				})
				.strict(),
			body: z.array(CustomerCustomFieldValueSchema),
		})
		.strict(),
	'customers.updateCustomerData': z
		.object({
			path: z
				.object({
					customer_id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					version: z.string().nullable().optional(),
					data: z.record(z.string(), z.json()),
				})
				.strict(),
		})
		.strict(),
	'events.getEvent': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'events.listEvents': z
		.object({
			query: z
				.object({
					created_datetime: z
						.object({
							lt: z.string().optional(),
							lte: z.string().optional(),
							gt: z.string().optional(),
							gte: z.string().optional(),
						})
						.strict()
						.optional(),
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					object_id: z.number().int().optional(),
					object_type: z
						.enum([
							'Account',
							'AccountSetting',
							'Macro',
							'Tag',
							'Customer',
							'Team',
							'View',
							'Widget',
							'CustomField',
							'CustomFieldCondition',
							'User',
							'TicketMessage',
							'Ticket',
							'Rule',
							'Integration',
							'SatisfactionSurvey',
						])
						.optional(),
					order_by: z
						.enum([
							'created_datetime',
							'created_datetime:asc',
							'created_datetime:desc',
						])
						.optional(),
					types: z
						.array(
							z.enum([
								'account-created',
								'account-deactivated',
								'account-setting-updated',
								'account-updated',
								'action-executed',
								'custom-field-condition-created',
								'custom-field-condition-deleted',
								'custom-field-condition-disabled',
								'custom-field-condition-enabled',
								'custom-field-condition-updated',
								'custom-field-created',
								'custom-field-updated',
								'customer-created',
								'customer-deleted',
								'customer-merged',
								'customer-updated',
								'integration-created',
								'integration-deactivated',
								'integration-deleted',
								'integration-reactivated',
								'integration-updated',
								'macro-created',
								'macro-deleted',
								'macro-updated',
								'rule-created',
								'rule-deleted',
								'rule-executed',
								'rule-priority-updated',
								'rule-updated',
								'satisfaction-survey-responded',
								'satisfaction-survey-sent',
								'tag-created',
								'tag-deleted',
								'tag-merged',
								'tag-renamed',
								'tag-updated',
								'team-created',
								'team-deleted',
								'team-updated',
								'ticket-assigned',
								'ticket-closed',
								'ticket-created',
								'ticket-customer-updated',
								'ticket-deleted',
								'ticket-excluded-from-auto-merge',
								'ticket-excluded-from-csat',
								'ticket-marked-spam',
								'ticket-merged',
								'ticket-message-created',
								'ticket-message-deleted',
								'ticket-message-failed',
								'ticket-message-summary-created',
								'ticket-message-updated',
								'ticket-reopened',
								'ticket-satisfaction-survey-skipped',
								'ticket-self-unsnoozed',
								'ticket-sla-policy-assigned',
								'ticket-snoozed',
								'ticket-split',
								'ticket-subject-updated',
								'ticket-tags-added',
								'ticket-tags-removed',
								'ticket-team-assigned',
								'ticket-team-unassigned',
								'ticket-trashed',
								'ticket-unassigned',
								'ticket-unmarked-spam',
								'ticket-untrashed',
								'ticket-updated',
								'user-2fa-changed',
								'user-availability-updated',
								'user-created',
								'user-deleted',
								'user-impersonated',
								'user-invited',
								'user-logged-in',
								'user-logged-out',
								'user-password-changed',
								'user-password-reset',
								'user-updated',
								'view-created',
								'view-deactivated',
								'view-deleted',
								'view-updated',
								'widget-created',
								'widget-deleted',
								'widget-updated',
							]),
						)
						.optional(),
					user_ids: z.array(z.number().int()).max(1).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'files.uploadFiles': z
		.object({
			query: z
				.object({
					type: z
						.enum([
							'public_attachment',
							'attachment',
							'profile_picture',
							'widget_picture',
						])
						.optional(),
				})
				.strict()
				.optional(),
			body: z
				.object({
					files: z
						.array(
							z
								.object({
									filename: z.string().min(1).max(255),
									contentType: z.string().min(1).max(255),
									contentBase64: z
										.string()
										.max(27_962_028)
										.regex(
											/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
										),
								})
								.strict(),
						)
						.min(1)
						.max(10),
				})
				.strict(),
		})
		.strict(),
	'files.downloadFile': z
		.object({
			path: z
				.object({
					file_type: z.string(),
					domain_hash: z.string(),
					resource_name: z.string(),
				})
				.strict(),
		})
		.strict(),
	'integrations.createIntegration': z
		.object({
			body: z
				.object({
					deactivated_datetime: z.string().nullable().optional(),
					description: z.string().nullable().nullable().optional(),
					http: z
						.object({
							form: z.null().optional(),
							headers: z.null().optional(),
							hmac_secret: z.string().optional(),
							method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH']),
							request_content_type: z.enum([
								'application/json',
								'application/x-www-form-urlencoded',
							]),
							response_content_type: z.enum(['application/json']),
							triggers: z
								.object({
									'ticket-created': z.boolean().optional(),
									'ticket-updated': z.boolean().optional(),
									'ticket-message-created': z.boolean().optional(),
									'ticket-self-unsnoozed': z.boolean().optional(),
									'ticket-message-failed': z.boolean().optional(),
									'ticket-assignment-updated': z.boolean().optional(),
									'ticket-status-updated': z.boolean().optional(),
									'ticket-handed-over': z.boolean().optional(),
								})
								.strict()
								.optional(),
							url: z.string(),
						})
						.strict()
						.optional(),
					name: z.string(),
					type: z.enum(['http']),
					managed: z.boolean().optional(),
				})
				.strict(),
		})
		.strict(),
	'integrations.deleteIntegration': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'integrations.getIntegration': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					include_review_providers: z.boolean().optional(),
					include_shopify_integration: z.boolean().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'integrations.listIntegrations': z
		.object({
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					order_by: z
						.enum(['created_datetime:asc', 'created_datetime:desc'])
						.optional(),
					type: z
						.enum([
							'email',
							'gmail',
							'outlook',
							'app',
							'aircall',
							'facebook',
							'gorgias_chat',
							'phone',
							'sms',
							'twitter',
							'yotpo',
							'whatsapp',
							'http',
							'shopify',
							'recharge',
							'smile',
							'smooch_inside',
							'smooch',
							'magento2',
							'zendesk',
							'klaviyo',
							'bigcommerce',
							'alloy',
							'ecom',
						])
						.optional(),
					purpose: z.enum(['support', 'marketing']).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'integrations.updateIntegration': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					deactivated_datetime: z.string().nullable().optional(),
					description: z.string().nullable().nullable().optional(),
					http: z
						.object({
							form: z.null().optional(),
							headers: z.null().optional(),
							hmac_secret: z.string().optional(),
							method: z
								.enum(['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'])
								.optional(),
							request_content_type: z
								.enum(['application/json', 'application/x-www-form-urlencoded'])
								.optional(),
							response_content_type: z.enum(['application/json']).optional(),
							triggers: z
								.object({
									'ticket-created': z.boolean().optional(),
									'ticket-updated': z.boolean().optional(),
									'ticket-message-created': z.boolean().optional(),
									'ticket-self-unsnoozed': z.boolean().optional(),
									'ticket-message-failed': z.boolean().optional(),
									'ticket-assignment-updated': z.boolean().optional(),
									'ticket-status-updated': z.boolean().optional(),
									'ticket-handed-over': z.boolean().optional(),
								})
								.strict()
								.optional(),
							url: z.string(),
						})
						.strict()
						.optional(),
					name: z.string(),
				})
				.strict(),
		})
		.strict(),
	'jobs.cancelJob': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'jobs.createJob': z
		.object({
			body: z
				.object({
					meta: z.record(z.string(), z.json()).nullable().optional(),
					params: z
						.object({
							apply_and_close: z.boolean().optional(),
							end_datetime: z.string().nullable().optional(),
							macro_id: z.number().int().optional(),
							start_datetime: z.string().nullable().optional(),
							ticket_ids: z.array(z.number().int()).optional(),
							url: z.string().optional(),
							updates: z.record(z.string(), z.json()).optional(),
							view: z.record(z.string(), z.json()).optional(),
							view_id: z.number().int().optional(),
							context: z.record(z.string(), z.json()).optional(),
						})
						.strict(),
					scheduled_datetime: z.string().nullable().optional(),
					type: z.enum([
						'applyMacro',
						'deleteTicket',
						'exportTicket',
						'importMacro',
						'exportMacro',
						'updateTicket',
						'exportTicketDrilldown',
						'exportConvertCampaignSalesDrilldown',
					]),
				})
				.strict(),
		})
		.strict(),
	'jobs.getJob': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'jobs.listJobs': z
		.object({
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					order_by: z
						.enum(['created_datetime:asc', 'created_datetime:desc'])
						.optional(),
					status: z
						.enum([
							'cancel_requested',
							'canceled',
							'done',
							'errored',
							'fatal_errored',
							'pending',
							'running',
							'scheduled',
						])
						.optional(),
					type: z
						.enum([
							'applyMacro',
							'deleteTicket',
							'exportTicket',
							'importMacro',
							'exportMacro',
							'updateTicket',
							'exportTicketDrilldown',
							'exportConvertCampaignSalesDrilldown',
						])
						.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'jobs.updateJob': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					meta: z.record(z.string(), z.json()).nullable().optional(),
					params: z
						.object({
							apply_and_close: z.boolean().optional(),
							end_datetime: z.string().nullable().optional(),
							macro_id: z.number().int().optional(),
							start_datetime: z.string().nullable().optional(),
							ticket_ids: z.array(z.number().int()).optional(),
							url: z.string().optional(),
							updates: z.record(z.string(), z.json()).optional(),
							view: z.record(z.string(), z.json()).optional(),
							view_id: z.number().int().optional(),
							context: z.record(z.string(), z.json()).optional(),
						})
						.strict()
						.optional(),
					scheduled_datetime: z.string().nullable().optional(),
					status: z
						.enum([
							'cancel_requested',
							'canceled',
							'done',
							'errored',
							'fatal_errored',
							'pending',
							'running',
							'scheduled',
						])
						.optional(),
				})
				.strict(),
		})
		.strict(),
	'macros.bulkArchiveMacros': z
		.object({
			body: ArchiveMacrosAsUserSchema,
		})
		.strict(),
	'macros.bulkUnarchiveMacros': z
		.object({
			body: UnarchiveMacrosAsUserSchema,
		})
		.strict(),
	'macros.createMacro': z
		.object({
			body: z
				.object({
					external_id: z.string().nullable().optional(),
					name: z.string(),
					intent: z
						.enum([
							'discount/request',
							'exchange/request',
							'exchange/status',
							'feedback',
							'order/damaged',
							'order/cancel',
							'order/change',
							'order/wrong',
							'other/no_reply',
							'other/question',
							'other/thanks',
							'product/recommendation',
							'product/question',
							'refund/request',
							'refund/status',
							'return/request',
							'return/status',
							'shipping/change',
							'shipping/delivery-issue',
							'shipping/policy',
							'shipping/status',
							'stock/request',
							'subscription/cancel',
							'subscription/change',
						])
						.optional(),
					language: z.string().nullable().optional(),
					actions: z.array(MacroActionSchema).optional(),
				})
				.strict(),
		})
		.strict(),
	'macros.deleteMacro': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'macros.getMacro': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'macros.listMacros': z
		.object({
			query: z
				.object({
					tags: z.array(z.string().nullable()).optional(),
					languages: z.array(z.string().nullable()).optional(),
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					message_id: z.number().int().nullable().optional(),
					order_by: z
						.enum([
							'name',
							'created_datetime',
							'updated_datetime',
							'usage',
							'relevance',
							'language',
							'name:asc',
							'name:desc',
							'created_datetime:asc',
							'created_datetime:desc',
							'updated_datetime:asc',
							'updated_datetime:desc',
							'usage:asc',
							'usage:desc',
							'relevance:asc',
							'relevance:desc',
							'language:asc',
							'language:desc',
						])
						.optional(),
					search: z.string().nullable().optional(),
					ticket_id: z.number().int().nullable().optional(),
					number_predictions: z.number().int().optional(),
					archived: z.boolean().nullable().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'macros.updateMacro': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					external_id: z.string().nullable().optional(),
					name: z.string().optional(),
					intent: z
						.enum([
							'discount/request',
							'exchange/request',
							'exchange/status',
							'feedback',
							'order/damaged',
							'order/cancel',
							'order/change',
							'order/wrong',
							'other/no_reply',
							'other/question',
							'other/thanks',
							'product/recommendation',
							'product/question',
							'refund/request',
							'refund/status',
							'return/request',
							'return/status',
							'shipping/change',
							'shipping/delivery-issue',
							'shipping/policy',
							'shipping/status',
							'stock/request',
							'subscription/cancel',
							'subscription/change',
						])
						.optional(),
					language: z.string().nullable().optional(),
					actions: z.array(MacroActionSchema).optional(),
				})
				.strict(),
		})
		.strict(),
	'metricCards.createMetricCardFeedback': z
		.object({
			path: z
				.object({
					slug: z.string(),
				})
				.strict(),
			body: MetricFeedbackRequestSchema.optional(),
		})
		.strict(),
	'metricCards.getMetricCard': z
		.object({
			path: z
				.object({
					slug: z.string(),
				})
				.strict(),
		})
		.strict(),
	'metricCards.searchMetricCards': z
		.object({
			query: z
				.object({
					category: z.string().optional(),
					status: MetricCardStatusEnumSchema.optional(),
					q: z.string().optional(),
					include: MetricCardIncludeEnumSchema.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'reportingStatistics.getStatistic': z
		.object({
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(10000).optional(),
				})
				.strict()
				.optional(),
			body: ReportingStatsSchema,
		})
		.strict(),
	'rules.createRule': z
		.object({
			body: z
				.object({
					code: z.string(),
					code_ast: z.record(z.string(), z.json()).optional(),
					deactivated_datetime: z.string().nullable().optional(),
					description: z.string().nullable().optional(),
					event_types: z
						.enum([
							'ticket-created',
							'ticket-updated',
							'ticket-message-created',
							'ticket-assigned',
							'ticket-self-unsnoozed',
							'satisfaction-survey-responded',
						])
						.optional(),
					name: z.string(),
					priority: z.number().int().optional(),
				})
				.strict(),
		})
		.strict(),
	'rules.deleteRule': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'rules.getRule': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'rules.listRules': z
		.object({
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					order_by: z
						.enum(['created_datetime:asc', 'created_datetime:desc'])
						.optional(),
					search: z.string().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'rules.updateRule': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					code: z.string().optional(),
					code_ast: z.record(z.string(), z.json()).optional(),
					deactivated_datetime: z.string().nullable().optional(),
					description: z.string().nullable().optional(),
					event_types: z
						.enum([
							'ticket-created',
							'ticket-updated',
							'ticket-message-created',
							'ticket-assigned',
							'ticket-self-unsnoozed',
							'satisfaction-survey-responded',
						])
						.optional(),
					name: z.string().optional(),
					priority: z.number().int().optional(),
				})
				.strict(),
		})
		.strict(),
	'rules.updateRulesPriorities': z
		.object({
			body: z
				.object({
					priorities: z.array(
						z
							.object({
								id: z.number().int(),
								priority: z.number().int(),
							})
							.strict(),
					),
				})
				.strict(),
		})
		.strict(),
	'satisfactionSurveys.createSatisfactionSurvey': z
		.object({
			body: z
				.object({
					body_text: z.string().max(1000).nullable().optional(),
					created_datetime: z.string().nullable().optional(),
					customer_id: z.number().int(),
					meta: z.record(z.string(), z.json()).nullable().optional(),
					score: z.number().int().min(1).max(5).nullable().optional(),
					scored_datetime: z.string().nullable().optional(),
					sent_datetime: z.string().nullable().optional(),
					should_send_datetime: z.string().nullable().optional(),
					ticket_id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'satisfactionSurveys.getSatisfactionSurvey': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'satisfactionSurveys.listSatisfactionSurveys': z
		.object({
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					order_by: z
						.enum(['created_datetime:asc', 'created_datetime:desc'])
						.optional(),
					ticket_id: z.number().int().nullable().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'satisfactionSurveys.updateSatisfactionSurvey': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					body_text: z.string().max(1000).nullable().optional(),
					created_datetime: z.string().nullable().optional(),
					customer_id: z.number().int().optional(),
					meta: z.record(z.string(), z.json()).nullable().optional(),
					score: z.number().int().min(1).max(5).nullable().optional(),
					scored_datetime: z.string().nullable().optional(),
					sent_datetime: z.string().nullable().optional(),
					should_send_datetime: z.string().nullable().optional(),
					ticket_id: z.number().int().optional(),
				})
				.strict(),
		})
		.strict(),
	'search.search': z
		.object({
			body: z
				.object({
					type: z.enum([
						'agent',
						'customer',
						'customer_profile',
						'customer_channel',
						'customer_channel_email',
						'customer_channel_phone',
						'customers_by_phone',
						'integration',
						'team',
						'tag',
					]),
					query: z.string().optional(),
					size: z.number().int().min(1).max(50).optional(),
				})
				.strict(),
		})
		.strict(),
	'statistics.downloadLegacyStatistic': z
		.object({
			path: z
				.object({
					name: z.enum([
						'overview',
						'total-tickets-created',
						'total-tickets-replied',
						'total-tickets-closed',
						'total-messages-sent',
						'total-messages-received',
						'median-first-response-time',
						'median-resolution-time',
						'total-one-touch-tickets',
						'support-volume',
						'resolution-time',
						'first-response-time',
						'tickets-created-per-hour-per-weekday',
						'tickets-per-tag',
						'tickets-created-per-channel',
						'tickets-created-per-channel-per-day',
						'tickets-closed-per-agent',
						'tickets-closed-per-agent-per-day',
						'messages-sent-per-macro',
						'satisfaction-surveys',
						'latest-satisfaction-surveys',
						'intents-occurrence',
						'intents-overview',
						'intents-breakdown-per-day',
						'revenue-overview',
						'revenue-per-agent',
						'revenue-per-day',
						'revenue-per-ticket',
						'self-service-volume-per-flow',
						'self-service-article-recommendation-performance',
						'self-service-top-reported-issues',
						'self-service-products-with-most-issues-and-return-requests',
						'self-service-workflows-performance',
					]),
				})
				.strict(),
			body: z
				.object({
					filters: z
						.object({
							period: z
								.object({
									start_datetime: z.string(),
									end_datetime: z.string(),
								})
								.strict()
								.optional(),
							agents: z.array(z.number().int()).optional(),
							channels: z.array(z.string()).optional(),
							campaigns: z.array(z.string()).optional(),
							tags: z.array(z.number().int()).optional(),
							integrations: z.array(z.number().int()).optional(),
							score: z.array(z.number().int().min(1).max(5)).optional(),
						})
						.strict(),
				})
				.strict(),
		})
		.strict(),
	'statistics.getLegacyStatistic': z
		.object({
			path: z
				.object({
					name: z.enum([
						'overview',
						'total-tickets-created',
						'total-tickets-replied',
						'total-tickets-closed',
						'total-messages-sent',
						'total-messages-received',
						'median-first-response-time',
						'median-resolution-time',
						'total-one-touch-tickets',
						'support-volume',
						'resolution-time',
						'first-response-time',
						'tickets-created-per-hour-per-weekday',
						'tickets-per-tag',
						'tickets-created-per-channel',
						'tickets-created-per-channel-per-day',
						'tickets-closed-per-agent',
						'tickets-closed-per-agent-per-day',
						'messages-sent-per-macro',
						'satisfaction-surveys',
						'latest-satisfaction-surveys',
						'intents-occurrence',
						'intents-overview',
						'intents-breakdown-per-day',
						'revenue-overview',
						'revenue-per-agent',
						'revenue-per-day',
						'revenue-per-ticket',
						'self-service-volume-per-flow',
						'self-service-article-recommendation-performance',
						'self-service-top-reported-issues',
						'self-service-products-with-most-issues-and-return-requests',
						'self-service-workflows-performance',
					]),
				})
				.strict(),
			body: z
				.object({
					filters: z
						.object({
							period: z
								.object({
									start_datetime: z.string(),
									end_datetime: z.string(),
								})
								.strict()
								.optional(),
							agents: z.array(z.number().int()).optional(),
							channels: z.array(z.string()).optional(),
							campaigns: z.array(z.string()).optional(),
							tags: z.array(z.number().int()).optional(),
							integrations: z.array(z.number().int()).optional(),
							score: z.array(z.number().int().min(1).max(5)).optional(),
						})
						.strict(),
				})
				.strict(),
		})
		.strict(),
	'tags.createTag': z
		.object({
			body: z
				.object({
					decoration: z
						.object({
							color: z.string(),
						})
						.strict()
						.optional(),
					description: z.string().max(1024).optional(),
					name: z.string().max(256),
				})
				.strict(),
		})
		.strict(),
	'tags.deleteTag': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'tags.deleteTags': z
		.object({
			body: z
				.object({
					ids: z.array(z.number().int()).min(1),
				})
				.strict(),
		})
		.strict(),
	'tags.getTag': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'tags.listTags': z
		.object({
			query: z
				.object({
					order_by: z
						.enum([
							'created_datetime',
							'name',
							'usage',
							'created_datetime:asc',
							'created_datetime:desc',
							'name:asc',
							'name:desc',
							'usage:asc,name:asc',
							'usage:desc,name:desc',
						])
						.optional(),
					search: z.string().optional(),
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'tags.mergeTags': z
		.object({
			path: z
				.object({
					destination_tag_id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					source_tags_ids: z.array(z.number().int()),
				})
				.strict(),
		})
		.strict(),
	'tags.updateTag': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					name: z.string().max(256).optional(),
					description: z.string().max(1024).optional(),
					decoration: z
						.object({
							color: z.string(),
						})
						.strict()
						.optional(),
				})
				.strict(),
		})
		.strict(),
	'teams.createTeam': z
		.object({
			body: z
				.object({
					name: z.string(),
					description: z.string().nullable().optional(),
					default_email_integration_id: z
						.number()
						.int()
						.min(1)
						.nullable()
						.optional(),
					decoration: z.record(z.string(), z.json()).nullable().optional(),
					members: z
						.array(
							z
								.object({
									id: z.number().int().optional(),
									name: z.string().nullable().optional(),
									email: z.string().email().max(320).nullable().optional(),
									meta: z.null().optional(),
								})
								.strict(),
						)
						.optional(),
				})
				.strict(),
		})
		.strict(),
	'teams.deleteTeam': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'teams.getTeam': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'teams.listTeams': z
		.object({
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					order_by: z
						.enum([
							'created_datetime:asc',
							'created_datetime:desc',
							'name:asc',
							'name:desc',
						])
						.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'teams.updateTeam': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					name: z.string().optional(),
					description: z.string().nullable().optional(),
					default_email_integration_id: z
						.number()
						.int()
						.min(1)
						.nullable()
						.optional(),
					decoration: z.record(z.string(), z.json()).nullable().optional(),
					members: z
						.array(
							z
								.object({
									id: z.number().int().optional(),
									name: z.string().nullable().optional(),
									email: z.string().email().max(320).nullable().optional(),
									meta: z.null().optional(),
								})
								.strict(),
						)
						.optional(),
				})
				.strict(),
		})
		.strict(),
	'ticketMessages.createTicketMessage': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					action: z.enum(['force', 'retry', 'cancel']).optional(),
				})
				.strict()
				.optional(),
			headers: z
				.object({
					'If-Unmodified-Since': z.string().optional(),
				})
				.strict()
				.optional(),
			body: CreateMessageSchema,
		})
		.strict(),
	'ticketMessages.deleteTicketMessage': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'ticketMessages.getTicketMessage': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'ticketMessages.listMessages': z
		.object({
			query: z
				.object({
					cursor: z.string().nullable().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					order_by: z
						.enum(['created_datetime:asc', 'created_datetime:desc'])
						.optional(),
					ticket_id: z.number().int().nullable().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'ticketMessages.listTicketMessages': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'ticketMessages.updateTicketMessage': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
					id: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					action: z.enum(['force', 'retry', 'cancel']).optional(),
				})
				.strict()
				.optional(),
			body: z
				.object({
					attachments: z
						.array(
							z
								.object({
									url: z.string().url(),
									name: z.string(),
									size: z.number().int().nullable(),
									content_type: z.string(),
									public: z.boolean().optional(),
									extra: z.record(z.string(), z.json()).optional(),
								})
								.strict(),
						)
						.optional(),
					body_html: z.string().nullable().optional(),
					body_text: z.string().nullable().optional(),
					channel: z.enum([
						'aircall',
						'api',
						'chat',
						'contact_form',
						'email',
						'facebook',
						'facebook-mention',
						'facebook-messenger',
						'facebook-recommendations',
						'help-center',
						'instagram-ad-comment',
						'instagram-comment',
						'instagram-direct-message',
						'instagram-mention',
						'internal-note',
						'phone',
						'sms',
						'twitter',
						'twitter-direct-message',
						'whatsapp',
						'yotpo-review',
					]),
					external_id: z.string().nullable().optional(),
					failed_datetime: z.string().nullable().optional(),
					from_agent: z.boolean(),
					message_id: z.string().nullable().optional(),
					receiver: z
						.object({
							id: z.number().int().optional(),
							email: z.string().optional(),
						})
						.strict()
						.optional(),
					sender: z
						.object({
							id: z.number().int().optional(),
							email: z.string().optional(),
						})
						.strict()
						.optional(),
					sent_datetime: z.string().nullable().optional(),
					source: z
						.object({
							type: z.string().optional(),
							to: z
								.array(
									z
										.object({
											name: z.string().nullable().optional(),
											address: z.string().optional(),
										})
										.strict(),
								)
								.optional(),
							cc: z
								.array(
									z
										.object({
											name: z.string().nullable().optional(),
											address: z.string().optional(),
										})
										.strict(),
								)
								.optional(),
							bcc: z
								.array(
									z
										.object({
											name: z.string().nullable().optional(),
											address: z.string().optional(),
										})
										.strict(),
								)
								.optional(),
							from: z
								.object({
									name: z.string().nullable().optional(),
									address: z.string().optional(),
								})
								.strict()
								.optional(),
						})
						.strict()
						.optional(),
					subject: z.string().nullable().optional(),
					via: z
						.enum([
							'aircall',
							'api',
							'chat',
							'contact_form',
							'email',
							'facebook',
							'facebook-mention',
							'facebook-messenger',
							'facebook-recommendations',
							'form',
							'help-center',
							'helpdesk',
							'instagram',
							'instagram-ad-comment',
							'instagram-comment',
							'instagram-direct-message',
							'instagram-mention',
							'internal-note',
							'phone',
							'rule',
							'shopify',
							'sms',
							'twilio',
							'twitter',
							'twitter-direct-message',
							'whatsapp',
							'yotpo',
							'yotpo-review',
							'zendesk',
						])
						.optional(),
				})
				.strict(),
		})
		.strict(),
	'tickets.createTicket': z
		.object({
			body: CreateTicketSchema,
		})
		.strict(),
	'tickets.createTicketTags': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					names: z.array(z.string()).optional(),
					ids: z.array(z.number().int()).optional(),
				})
				.strict(),
		})
		.strict(),
	'tickets.deleteTicket': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'tickets.deleteTicketCustomField': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'tickets.deleteTicketTags': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					names: z.array(z.string()).optional(),
					ids: z.array(z.number().int()).optional(),
				})
				.strict(),
		})
		.strict(),
	'tickets.getTicket': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					relationships: z.array(TicketExtraAttributeSchema).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'tickets.listTicketCustomFields': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'tickets.listTicketTags': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'tickets.listTickets': z
		.object({
			query: z
				.object({
					order_by: z
						.enum([
							'created_datetime:asc',
							'created_datetime:desc',
							'updated_datetime:asc',
							'updated_datetime:desc',
						])
						.optional(),
					cursor: z.string().optional(),
					customer_id: z.number().int().min(1).optional(),
					trashed: z.boolean().optional(),
					external_id: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					view_id: z.number().int().min(1).optional(),
					rule_id: z.number().int().min(1).optional(),
					ticket_ids: z
						.array(z.number().int().min(1))
						.min(1)
						.max(100)
						.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'tickets.updateTicket': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: UpdateTicketSchema,
		})
		.strict(),
	'tickets.updateTicketCustomField': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
					id: z.number().int(),
				})
				.strict(),
			body: z.union([z.string(), z.number().int(), z.boolean()]),
		})
		.strict(),
	'tickets.updateTicketCustomFields': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
				})
				.strict(),
			body: UpdateTicketCustomFieldValuesSchema,
		})
		.strict(),
	'tickets.updateTicketTags': z
		.object({
			path: z
				.object({
					ticket_id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					names: z.array(z.string()).optional(),
					ids: z.array(z.number().int()).optional(),
				})
				.strict(),
		})
		.strict(),
	'users.createUser': z
		.object({
			body: z
				.object({
					bio: z.string().nullable().optional(),
					country: z.string().nullable().optional(),
					email: z.string().email(),
					external_id: z.string().optional(),
					'g-recaptcha-response': z.string().optional(),
					language: z.enum(['fr', 'en']).optional(),
					meta: z
						.object({
							sso: z.enum(['google', 'office365']).optional(),
							profile_picture_url: z.string().url().nullable().optional(),
						})
						.strict()
						.optional(),
					name: z.string(),
					role: z
						.object({
							name: z.enum([
								'admin',
								'agent',
								'basic-agent',
								'lite-agent',
								'observer-agent',
							]),
						})
						.strict(),
					timezone: z
						.enum([
							'Africa/Abidjan',
							'Africa/Accra',
							'Africa/Addis_Ababa',
							'Africa/Algiers',
							'Africa/Asmara',
							'Africa/Asmera',
							'Africa/Bamako',
							'Africa/Bangui',
							'Africa/Banjul',
							'Africa/Bissau',
							'Africa/Blantyre',
							'Africa/Brazzaville',
							'Africa/Bujumbura',
							'Africa/Cairo',
							'Africa/Casablanca',
							'Africa/Ceuta',
							'Africa/Conakry',
							'Africa/Dakar',
							'Africa/Dar_es_Salaam',
							'Africa/Djibouti',
							'Africa/Douala',
							'Africa/El_Aaiun',
							'Africa/Freetown',
							'Africa/Gaborone',
							'Africa/Harare',
							'Africa/Johannesburg',
							'Africa/Juba',
							'Africa/Kampala',
							'Africa/Khartoum',
							'Africa/Kigali',
							'Africa/Kinshasa',
							'Africa/Lagos',
							'Africa/Libreville',
							'Africa/Lome',
							'Africa/Luanda',
							'Africa/Lubumbashi',
							'Africa/Lusaka',
							'Africa/Malabo',
							'Africa/Maputo',
							'Africa/Maseru',
							'Africa/Mbabane',
							'Africa/Mogadishu',
							'Africa/Monrovia',
							'Africa/Nairobi',
							'Africa/Ndjamena',
							'Africa/Niamey',
							'Africa/Nouakchott',
							'Africa/Ouagadougou',
							'Africa/Porto-Novo',
							'Africa/Sao_Tome',
							'Africa/Timbuktu',
							'Africa/Tripoli',
							'Africa/Tunis',
							'Africa/Windhoek',
							'America/Adak',
							'America/Anchorage',
							'America/Anguilla',
							'America/Antigua',
							'America/Araguaina',
							'America/Argentina/Buenos_Aires',
							'America/Argentina/Catamarca',
							'America/Argentina/ComodRivadavia',
							'America/Argentina/Cordoba',
							'America/Argentina/Jujuy',
							'America/Argentina/La_Rioja',
							'America/Argentina/Mendoza',
							'America/Argentina/Rio_Gallegos',
							'America/Argentina/Salta',
							'America/Argentina/San_Juan',
							'America/Argentina/San_Luis',
							'America/Argentina/Tucuman',
							'America/Argentina/Ushuaia',
							'America/Aruba',
							'America/Asuncion',
							'America/Atikokan',
							'America/Atka',
							'America/Bahia',
							'America/Bahia_Banderas',
							'America/Barbados',
							'America/Belem',
							'America/Belize',
							'America/Blanc-Sablon',
							'America/Boa_Vista',
							'America/Bogota',
							'America/Boise',
							'America/Buenos_Aires',
							'America/Cambridge_Bay',
							'America/Campo_Grande',
							'America/Cancun',
							'America/Caracas',
							'America/Catamarca',
							'America/Cayenne',
							'America/Cayman',
							'America/Chicago',
							'America/Chihuahua',
							'America/Ciudad_Juarez',
							'America/Coral_Harbour',
							'America/Cordoba',
							'America/Costa_Rica',
							'America/Coyhaique',
							'America/Creston',
							'America/Cuiaba',
							'America/Curacao',
							'America/Danmarkshavn',
							'America/Dawson',
							'America/Dawson_Creek',
							'America/Denver',
							'America/Detroit',
							'America/Dominica',
							'America/Edmonton',
							'America/Eirunepe',
							'America/El_Salvador',
							'America/Ensenada',
							'America/Fort_Nelson',
							'America/Fort_Wayne',
							'America/Fortaleza',
							'America/Glace_Bay',
							'America/Godthab',
							'America/Goose_Bay',
							'America/Grand_Turk',
							'America/Grenada',
							'America/Guadeloupe',
							'America/Guatemala',
							'America/Guayaquil',
							'America/Guyana',
							'America/Halifax',
							'America/Havana',
							'America/Hermosillo',
							'America/Indiana/Indianapolis',
							'America/Indiana/Knox',
							'America/Indiana/Marengo',
							'America/Indiana/Petersburg',
							'America/Indiana/Tell_City',
							'America/Indiana/Vevay',
							'America/Indiana/Vincennes',
							'America/Indiana/Winamac',
							'America/Indianapolis',
							'America/Inuvik',
							'America/Iqaluit',
							'America/Jamaica',
							'America/Jujuy',
							'America/Juneau',
							'America/Kentucky/Louisville',
							'America/Kentucky/Monticello',
							'America/Knox_IN',
							'America/Kralendijk',
							'America/La_Paz',
							'America/Lima',
							'America/Los_Angeles',
							'America/Louisville',
							'America/Lower_Princes',
							'America/Maceio',
							'America/Managua',
							'America/Manaus',
							'America/Marigot',
							'America/Martinique',
							'America/Matamoros',
							'America/Mazatlan',
							'America/Mendoza',
							'America/Menominee',
							'America/Merida',
							'America/Metlakatla',
							'America/Mexico_City',
							'America/Miquelon',
							'America/Moncton',
							'America/Monterrey',
							'America/Montevideo',
							'America/Montreal',
							'America/Montserrat',
							'America/Nassau',
							'America/New_York',
							'America/Nipigon',
							'America/Nome',
							'America/Noronha',
							'America/North_Dakota/Beulah',
							'America/North_Dakota/Center',
							'America/North_Dakota/New_Salem',
							'America/Nuuk',
							'America/Ojinaga',
							'America/Panama',
							'America/Pangnirtung',
							'America/Paramaribo',
							'America/Phoenix',
							'America/Port-au-Prince',
							'America/Port_of_Spain',
							'America/Porto_Acre',
							'America/Porto_Velho',
							'America/Puerto_Rico',
							'America/Punta_Arenas',
							'America/Rainy_River',
							'America/Rankin_Inlet',
							'America/Recife',
							'America/Regina',
							'America/Resolute',
							'America/Rio_Branco',
							'America/Rosario',
							'America/Santa_Isabel',
							'America/Santarem',
							'America/Santiago',
							'America/Santo_Domingo',
							'America/Sao_Paulo',
							'America/Scoresbysund',
							'America/Shiprock',
							'America/Sitka',
							'America/St_Barthelemy',
							'America/St_Johns',
							'America/St_Kitts',
							'America/St_Lucia',
							'America/St_Thomas',
							'America/St_Vincent',
							'America/Swift_Current',
							'America/Tegucigalpa',
							'America/Thule',
							'America/Thunder_Bay',
							'America/Tijuana',
							'America/Toronto',
							'America/Tortola',
							'America/Vancouver',
							'America/Virgin',
							'America/Whitehorse',
							'America/Winnipeg',
							'America/Yakutat',
							'America/Yellowknife',
							'Antarctica/Casey',
							'Antarctica/Davis',
							'Antarctica/DumontDUrville',
							'Antarctica/Macquarie',
							'Antarctica/Mawson',
							'Antarctica/McMurdo',
							'Antarctica/Palmer',
							'Antarctica/Rothera',
							'Antarctica/South_Pole',
							'Antarctica/Syowa',
							'Antarctica/Troll',
							'Antarctica/Vostok',
							'Arctic/Longyearbyen',
							'Asia/Aden',
							'Asia/Almaty',
							'Asia/Amman',
							'Asia/Anadyr',
							'Asia/Aqtau',
							'Asia/Aqtobe',
							'Asia/Ashgabat',
							'Asia/Ashkhabad',
							'Asia/Atyrau',
							'Asia/Baghdad',
							'Asia/Bahrain',
							'Asia/Baku',
							'Asia/Bangkok',
							'Asia/Barnaul',
							'Asia/Beirut',
							'Asia/Bishkek',
							'Asia/Brunei',
							'Asia/Calcutta',
							'Asia/Chita',
							'Asia/Choibalsan',
							'Asia/Chongqing',
							'Asia/Chungking',
							'Asia/Colombo',
							'Asia/Dacca',
							'Asia/Damascus',
							'Asia/Dhaka',
							'Asia/Dili',
							'Asia/Dubai',
							'Asia/Dushanbe',
							'Asia/Famagusta',
							'Asia/Gaza',
							'Asia/Harbin',
							'Asia/Hebron',
							'Asia/Ho_Chi_Minh',
							'Asia/Hong_Kong',
							'Asia/Hovd',
							'Asia/Irkutsk',
							'Asia/Istanbul',
							'Asia/Jakarta',
							'Asia/Jayapura',
							'Asia/Jerusalem',
							'Asia/Kabul',
							'Asia/Kamchatka',
							'Asia/Karachi',
							'Asia/Kashgar',
							'Asia/Kathmandu',
							'Asia/Katmandu',
							'Asia/Khandyga',
							'Asia/Kolkata',
							'Asia/Krasnoyarsk',
							'Asia/Kuala_Lumpur',
							'Asia/Kuching',
							'Asia/Kuwait',
							'Asia/Macao',
							'Asia/Macau',
							'Asia/Magadan',
							'Asia/Makassar',
							'Asia/Manila',
							'Asia/Muscat',
							'Asia/Nicosia',
							'Asia/Novokuznetsk',
							'Asia/Novosibirsk',
							'Asia/Omsk',
							'Asia/Oral',
							'Asia/Phnom_Penh',
							'Asia/Pontianak',
							'Asia/Pyongyang',
							'Asia/Qatar',
							'Asia/Qostanay',
							'Asia/Qyzylorda',
							'Asia/Rangoon',
							'Asia/Riyadh',
							'Asia/Saigon',
							'Asia/Sakhalin',
							'Asia/Samarkand',
							'Asia/Seoul',
							'Asia/Shanghai',
							'Asia/Singapore',
							'Asia/Srednekolymsk',
							'Asia/Taipei',
							'Asia/Tashkent',
							'Asia/Tbilisi',
							'Asia/Tehran',
							'Asia/Tel_Aviv',
							'Asia/Thimbu',
							'Asia/Thimphu',
							'Asia/Tokyo',
							'Asia/Tomsk',
							'Asia/Ujung_Pandang',
							'Asia/Ulaanbaatar',
							'Asia/Ulan_Bator',
							'Asia/Urumqi',
							'Asia/Ust-Nera',
							'Asia/Vientiane',
							'Asia/Vladivostok',
							'Asia/Yakutsk',
							'Asia/Yangon',
							'Asia/Yekaterinburg',
							'Asia/Yerevan',
							'Atlantic/Azores',
							'Atlantic/Bermuda',
							'Atlantic/Canary',
							'Atlantic/Cape_Verde',
							'Atlantic/Faeroe',
							'Atlantic/Faroe',
							'Atlantic/Jan_Mayen',
							'Atlantic/Madeira',
							'Atlantic/Reykjavik',
							'Atlantic/South_Georgia',
							'Atlantic/St_Helena',
							'Atlantic/Stanley',
							'Australia/ACT',
							'Australia/Adelaide',
							'Australia/Brisbane',
							'Australia/Broken_Hill',
							'Australia/Canberra',
							'Australia/Currie',
							'Australia/Darwin',
							'Australia/Eucla',
							'Australia/Hobart',
							'Australia/LHI',
							'Australia/Lindeman',
							'Australia/Lord_Howe',
							'Australia/Melbourne',
							'Australia/NSW',
							'Australia/North',
							'Australia/Perth',
							'Australia/Queensland',
							'Australia/South',
							'Australia/Sydney',
							'Australia/Tasmania',
							'Australia/Victoria',
							'Australia/West',
							'Australia/Yancowinna',
							'Brazil/Acre',
							'Brazil/DeNoronha',
							'Brazil/East',
							'Brazil/West',
							'CET',
							'CST6CDT',
							'Canada/Atlantic',
							'Canada/Central',
							'Canada/Eastern',
							'Canada/Mountain',
							'Canada/Newfoundland',
							'Canada/Pacific',
							'Canada/Saskatchewan',
							'Canada/Yukon',
							'Chile/Continental',
							'Chile/EasterIsland',
							'Cuba',
							'EET',
							'EST',
							'EST5EDT',
							'Egypt',
							'Eire',
							'Etc/GMT',
							'Etc/GMT+0',
							'Etc/GMT+1',
							'Etc/GMT+10',
							'Etc/GMT+11',
							'Etc/GMT+12',
							'Etc/GMT+2',
							'Etc/GMT+3',
							'Etc/GMT+4',
							'Etc/GMT+5',
							'Etc/GMT+6',
							'Etc/GMT+7',
							'Etc/GMT+8',
							'Etc/GMT+9',
							'Etc/GMT-0',
							'Etc/GMT-1',
							'Etc/GMT-10',
							'Etc/GMT-11',
							'Etc/GMT-12',
							'Etc/GMT-13',
							'Etc/GMT-14',
							'Etc/GMT-2',
							'Etc/GMT-3',
							'Etc/GMT-4',
							'Etc/GMT-5',
							'Etc/GMT-6',
							'Etc/GMT-7',
							'Etc/GMT-8',
							'Etc/GMT-9',
							'Etc/GMT0',
							'Etc/Greenwich',
							'Etc/UCT',
							'Etc/UTC',
							'Etc/Universal',
							'Etc/Zulu',
							'Europe/Amsterdam',
							'Europe/Andorra',
							'Europe/Astrakhan',
							'Europe/Athens',
							'Europe/Belfast',
							'Europe/Belgrade',
							'Europe/Berlin',
							'Europe/Bratislava',
							'Europe/Brussels',
							'Europe/Bucharest',
							'Europe/Budapest',
							'Europe/Busingen',
							'Europe/Chisinau',
							'Europe/Copenhagen',
							'Europe/Dublin',
							'Europe/Gibraltar',
							'Europe/Guernsey',
							'Europe/Helsinki',
							'Europe/Isle_of_Man',
							'Europe/Istanbul',
							'Europe/Jersey',
							'Europe/Kaliningrad',
							'Europe/Kiev',
							'Europe/Kirov',
							'Europe/Kyiv',
							'Europe/Lisbon',
							'Europe/Ljubljana',
							'Europe/London',
							'Europe/Luxembourg',
							'Europe/Madrid',
							'Europe/Malta',
							'Europe/Mariehamn',
							'Europe/Minsk',
							'Europe/Monaco',
							'Europe/Moscow',
							'Europe/Nicosia',
							'Europe/Oslo',
							'Europe/Paris',
							'Europe/Podgorica',
							'Europe/Prague',
							'Europe/Riga',
							'Europe/Rome',
							'Europe/Samara',
							'Europe/San_Marino',
							'Europe/Sarajevo',
							'Europe/Saratov',
							'Europe/Simferopol',
							'Europe/Skopje',
							'Europe/Sofia',
							'Europe/Stockholm',
							'Europe/Tallinn',
							'Europe/Tirane',
							'Europe/Tiraspol',
							'Europe/Ulyanovsk',
							'Europe/Uzhgorod',
							'Europe/Vaduz',
							'Europe/Vatican',
							'Europe/Vienna',
							'Europe/Vilnius',
							'Europe/Volgograd',
							'Europe/Warsaw',
							'Europe/Zagreb',
							'Europe/Zaporozhye',
							'Europe/Zurich',
							'GB',
							'GB-Eire',
							'GMT',
							'GMT+0',
							'GMT-0',
							'GMT0',
							'Greenwich',
							'HST',
							'Hongkong',
							'Iceland',
							'Indian/Antananarivo',
							'Indian/Chagos',
							'Indian/Christmas',
							'Indian/Cocos',
							'Indian/Comoro',
							'Indian/Kerguelen',
							'Indian/Mahe',
							'Indian/Maldives',
							'Indian/Mauritius',
							'Indian/Mayotte',
							'Indian/Reunion',
							'Iran',
							'Israel',
							'Jamaica',
							'Japan',
							'Kwajalein',
							'Libya',
							'MET',
							'MST',
							'MST7MDT',
							'Mexico/BajaNorte',
							'Mexico/BajaSur',
							'Mexico/General',
							'NZ',
							'NZ-CHAT',
							'Navajo',
							'PRC',
							'PST8PDT',
							'Pacific/Apia',
							'Pacific/Auckland',
							'Pacific/Bougainville',
							'Pacific/Chatham',
							'Pacific/Chuuk',
							'Pacific/Easter',
							'Pacific/Efate',
							'Pacific/Enderbury',
							'Pacific/Fakaofo',
							'Pacific/Fiji',
							'Pacific/Funafuti',
							'Pacific/Galapagos',
							'Pacific/Gambier',
							'Pacific/Guadalcanal',
							'Pacific/Guam',
							'Pacific/Honolulu',
							'Pacific/Johnston',
							'Pacific/Kanton',
							'Pacific/Kiritimati',
							'Pacific/Kosrae',
							'Pacific/Kwajalein',
							'Pacific/Majuro',
							'Pacific/Marquesas',
							'Pacific/Midway',
							'Pacific/Nauru',
							'Pacific/Niue',
							'Pacific/Norfolk',
							'Pacific/Noumea',
							'Pacific/Pago_Pago',
							'Pacific/Palau',
							'Pacific/Pitcairn',
							'Pacific/Pohnpei',
							'Pacific/Ponape',
							'Pacific/Port_Moresby',
							'Pacific/Rarotonga',
							'Pacific/Saipan',
							'Pacific/Samoa',
							'Pacific/Tahiti',
							'Pacific/Tarawa',
							'Pacific/Tongatapu',
							'Pacific/Truk',
							'Pacific/Wake',
							'Pacific/Wallis',
							'Pacific/Yap',
							'Poland',
							'Portugal',
							'ROC',
							'ROK',
							'Singapore',
							'Turkey',
							'UCT',
							'US/Alaska',
							'US/Aleutian',
							'US/Arizona',
							'US/Central',
							'US/East-Indiana',
							'US/Eastern',
							'US/Hawaii',
							'US/Indiana-Starke',
							'US/Michigan',
							'US/Mountain',
							'US/Pacific',
							'US/Samoa',
							'UTC',
							'Universal',
							'W-SU',
							'WET',
							'Zulu',
						])
						.optional(),
				})
				.strict(),
		})
		.strict(),
	'users.deleteUser': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'users.getUser': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'users.listUsers': z
		.object({
			query: z
				.object({
					cursor: z.string().optional(),
					external_id: z.string().optional(),
					email: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					order_by: z
						.enum([
							'created_datetime:asc',
							'created_datetime:desc',
							'name:asc',
							'name:desc',
							'email:asc',
							'email:desc',
							'role.name:asc',
							'role.name:desc',
						])
						.optional(),
					roles: z
						.array(
							z.enum([
								'admin',
								'agent',
								'basic-agent',
								'bot',
								'internal-agent',
								'lite-agent',
								'observer-agent',
							]),
						)
						.optional(),
					search: z.string().optional(),
					available_first: z.boolean().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'users.updateUser': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					bio: z.string().nullable().optional(),
					country: z.string().nullable().optional(),
					email: z.string().email().optional(),
					external_id: z.string().optional(),
					language: z.enum(['fr', 'en']).optional(),
					meta: z
						.object({
							sso: z.enum(['google', 'office365']).optional(),
							profile_picture_url: z.string().url().nullable().optional(),
						})
						.strict()
						.optional(),
					name: z.string().optional(),
					new_password: z.string().optional(),
					old_password: z.string().optional(),
					password_confirmation: z.string().optional(),
					role: z
						.object({
							name: z.enum([
								'admin',
								'agent',
								'basic-agent',
								'lite-agent',
								'observer-agent',
							]),
						})
						.strict()
						.optional(),
					timezone: z
						.enum([
							'Africa/Abidjan',
							'Africa/Accra',
							'Africa/Addis_Ababa',
							'Africa/Algiers',
							'Africa/Asmara',
							'Africa/Asmera',
							'Africa/Bamako',
							'Africa/Bangui',
							'Africa/Banjul',
							'Africa/Bissau',
							'Africa/Blantyre',
							'Africa/Brazzaville',
							'Africa/Bujumbura',
							'Africa/Cairo',
							'Africa/Casablanca',
							'Africa/Ceuta',
							'Africa/Conakry',
							'Africa/Dakar',
							'Africa/Dar_es_Salaam',
							'Africa/Djibouti',
							'Africa/Douala',
							'Africa/El_Aaiun',
							'Africa/Freetown',
							'Africa/Gaborone',
							'Africa/Harare',
							'Africa/Johannesburg',
							'Africa/Juba',
							'Africa/Kampala',
							'Africa/Khartoum',
							'Africa/Kigali',
							'Africa/Kinshasa',
							'Africa/Lagos',
							'Africa/Libreville',
							'Africa/Lome',
							'Africa/Luanda',
							'Africa/Lubumbashi',
							'Africa/Lusaka',
							'Africa/Malabo',
							'Africa/Maputo',
							'Africa/Maseru',
							'Africa/Mbabane',
							'Africa/Mogadishu',
							'Africa/Monrovia',
							'Africa/Nairobi',
							'Africa/Ndjamena',
							'Africa/Niamey',
							'Africa/Nouakchott',
							'Africa/Ouagadougou',
							'Africa/Porto-Novo',
							'Africa/Sao_Tome',
							'Africa/Timbuktu',
							'Africa/Tripoli',
							'Africa/Tunis',
							'Africa/Windhoek',
							'America/Adak',
							'America/Anchorage',
							'America/Anguilla',
							'America/Antigua',
							'America/Araguaina',
							'America/Argentina/Buenos_Aires',
							'America/Argentina/Catamarca',
							'America/Argentina/ComodRivadavia',
							'America/Argentina/Cordoba',
							'America/Argentina/Jujuy',
							'America/Argentina/La_Rioja',
							'America/Argentina/Mendoza',
							'America/Argentina/Rio_Gallegos',
							'America/Argentina/Salta',
							'America/Argentina/San_Juan',
							'America/Argentina/San_Luis',
							'America/Argentina/Tucuman',
							'America/Argentina/Ushuaia',
							'America/Aruba',
							'America/Asuncion',
							'America/Atikokan',
							'America/Atka',
							'America/Bahia',
							'America/Bahia_Banderas',
							'America/Barbados',
							'America/Belem',
							'America/Belize',
							'America/Blanc-Sablon',
							'America/Boa_Vista',
							'America/Bogota',
							'America/Boise',
							'America/Buenos_Aires',
							'America/Cambridge_Bay',
							'America/Campo_Grande',
							'America/Cancun',
							'America/Caracas',
							'America/Catamarca',
							'America/Cayenne',
							'America/Cayman',
							'America/Chicago',
							'America/Chihuahua',
							'America/Ciudad_Juarez',
							'America/Coral_Harbour',
							'America/Cordoba',
							'America/Costa_Rica',
							'America/Coyhaique',
							'America/Creston',
							'America/Cuiaba',
							'America/Curacao',
							'America/Danmarkshavn',
							'America/Dawson',
							'America/Dawson_Creek',
							'America/Denver',
							'America/Detroit',
							'America/Dominica',
							'America/Edmonton',
							'America/Eirunepe',
							'America/El_Salvador',
							'America/Ensenada',
							'America/Fort_Nelson',
							'America/Fort_Wayne',
							'America/Fortaleza',
							'America/Glace_Bay',
							'America/Godthab',
							'America/Goose_Bay',
							'America/Grand_Turk',
							'America/Grenada',
							'America/Guadeloupe',
							'America/Guatemala',
							'America/Guayaquil',
							'America/Guyana',
							'America/Halifax',
							'America/Havana',
							'America/Hermosillo',
							'America/Indiana/Indianapolis',
							'America/Indiana/Knox',
							'America/Indiana/Marengo',
							'America/Indiana/Petersburg',
							'America/Indiana/Tell_City',
							'America/Indiana/Vevay',
							'America/Indiana/Vincennes',
							'America/Indiana/Winamac',
							'America/Indianapolis',
							'America/Inuvik',
							'America/Iqaluit',
							'America/Jamaica',
							'America/Jujuy',
							'America/Juneau',
							'America/Kentucky/Louisville',
							'America/Kentucky/Monticello',
							'America/Knox_IN',
							'America/Kralendijk',
							'America/La_Paz',
							'America/Lima',
							'America/Los_Angeles',
							'America/Louisville',
							'America/Lower_Princes',
							'America/Maceio',
							'America/Managua',
							'America/Manaus',
							'America/Marigot',
							'America/Martinique',
							'America/Matamoros',
							'America/Mazatlan',
							'America/Mendoza',
							'America/Menominee',
							'America/Merida',
							'America/Metlakatla',
							'America/Mexico_City',
							'America/Miquelon',
							'America/Moncton',
							'America/Monterrey',
							'America/Montevideo',
							'America/Montreal',
							'America/Montserrat',
							'America/Nassau',
							'America/New_York',
							'America/Nipigon',
							'America/Nome',
							'America/Noronha',
							'America/North_Dakota/Beulah',
							'America/North_Dakota/Center',
							'America/North_Dakota/New_Salem',
							'America/Nuuk',
							'America/Ojinaga',
							'America/Panama',
							'America/Pangnirtung',
							'America/Paramaribo',
							'America/Phoenix',
							'America/Port-au-Prince',
							'America/Port_of_Spain',
							'America/Porto_Acre',
							'America/Porto_Velho',
							'America/Puerto_Rico',
							'America/Punta_Arenas',
							'America/Rainy_River',
							'America/Rankin_Inlet',
							'America/Recife',
							'America/Regina',
							'America/Resolute',
							'America/Rio_Branco',
							'America/Rosario',
							'America/Santa_Isabel',
							'America/Santarem',
							'America/Santiago',
							'America/Santo_Domingo',
							'America/Sao_Paulo',
							'America/Scoresbysund',
							'America/Shiprock',
							'America/Sitka',
							'America/St_Barthelemy',
							'America/St_Johns',
							'America/St_Kitts',
							'America/St_Lucia',
							'America/St_Thomas',
							'America/St_Vincent',
							'America/Swift_Current',
							'America/Tegucigalpa',
							'America/Thule',
							'America/Thunder_Bay',
							'America/Tijuana',
							'America/Toronto',
							'America/Tortola',
							'America/Vancouver',
							'America/Virgin',
							'America/Whitehorse',
							'America/Winnipeg',
							'America/Yakutat',
							'America/Yellowknife',
							'Antarctica/Casey',
							'Antarctica/Davis',
							'Antarctica/DumontDUrville',
							'Antarctica/Macquarie',
							'Antarctica/Mawson',
							'Antarctica/McMurdo',
							'Antarctica/Palmer',
							'Antarctica/Rothera',
							'Antarctica/South_Pole',
							'Antarctica/Syowa',
							'Antarctica/Troll',
							'Antarctica/Vostok',
							'Arctic/Longyearbyen',
							'Asia/Aden',
							'Asia/Almaty',
							'Asia/Amman',
							'Asia/Anadyr',
							'Asia/Aqtau',
							'Asia/Aqtobe',
							'Asia/Ashgabat',
							'Asia/Ashkhabad',
							'Asia/Atyrau',
							'Asia/Baghdad',
							'Asia/Bahrain',
							'Asia/Baku',
							'Asia/Bangkok',
							'Asia/Barnaul',
							'Asia/Beirut',
							'Asia/Bishkek',
							'Asia/Brunei',
							'Asia/Calcutta',
							'Asia/Chita',
							'Asia/Choibalsan',
							'Asia/Chongqing',
							'Asia/Chungking',
							'Asia/Colombo',
							'Asia/Dacca',
							'Asia/Damascus',
							'Asia/Dhaka',
							'Asia/Dili',
							'Asia/Dubai',
							'Asia/Dushanbe',
							'Asia/Famagusta',
							'Asia/Gaza',
							'Asia/Harbin',
							'Asia/Hebron',
							'Asia/Ho_Chi_Minh',
							'Asia/Hong_Kong',
							'Asia/Hovd',
							'Asia/Irkutsk',
							'Asia/Istanbul',
							'Asia/Jakarta',
							'Asia/Jayapura',
							'Asia/Jerusalem',
							'Asia/Kabul',
							'Asia/Kamchatka',
							'Asia/Karachi',
							'Asia/Kashgar',
							'Asia/Kathmandu',
							'Asia/Katmandu',
							'Asia/Khandyga',
							'Asia/Kolkata',
							'Asia/Krasnoyarsk',
							'Asia/Kuala_Lumpur',
							'Asia/Kuching',
							'Asia/Kuwait',
							'Asia/Macao',
							'Asia/Macau',
							'Asia/Magadan',
							'Asia/Makassar',
							'Asia/Manila',
							'Asia/Muscat',
							'Asia/Nicosia',
							'Asia/Novokuznetsk',
							'Asia/Novosibirsk',
							'Asia/Omsk',
							'Asia/Oral',
							'Asia/Phnom_Penh',
							'Asia/Pontianak',
							'Asia/Pyongyang',
							'Asia/Qatar',
							'Asia/Qostanay',
							'Asia/Qyzylorda',
							'Asia/Rangoon',
							'Asia/Riyadh',
							'Asia/Saigon',
							'Asia/Sakhalin',
							'Asia/Samarkand',
							'Asia/Seoul',
							'Asia/Shanghai',
							'Asia/Singapore',
							'Asia/Srednekolymsk',
							'Asia/Taipei',
							'Asia/Tashkent',
							'Asia/Tbilisi',
							'Asia/Tehran',
							'Asia/Tel_Aviv',
							'Asia/Thimbu',
							'Asia/Thimphu',
							'Asia/Tokyo',
							'Asia/Tomsk',
							'Asia/Ujung_Pandang',
							'Asia/Ulaanbaatar',
							'Asia/Ulan_Bator',
							'Asia/Urumqi',
							'Asia/Ust-Nera',
							'Asia/Vientiane',
							'Asia/Vladivostok',
							'Asia/Yakutsk',
							'Asia/Yangon',
							'Asia/Yekaterinburg',
							'Asia/Yerevan',
							'Atlantic/Azores',
							'Atlantic/Bermuda',
							'Atlantic/Canary',
							'Atlantic/Cape_Verde',
							'Atlantic/Faeroe',
							'Atlantic/Faroe',
							'Atlantic/Jan_Mayen',
							'Atlantic/Madeira',
							'Atlantic/Reykjavik',
							'Atlantic/South_Georgia',
							'Atlantic/St_Helena',
							'Atlantic/Stanley',
							'Australia/ACT',
							'Australia/Adelaide',
							'Australia/Brisbane',
							'Australia/Broken_Hill',
							'Australia/Canberra',
							'Australia/Currie',
							'Australia/Darwin',
							'Australia/Eucla',
							'Australia/Hobart',
							'Australia/LHI',
							'Australia/Lindeman',
							'Australia/Lord_Howe',
							'Australia/Melbourne',
							'Australia/NSW',
							'Australia/North',
							'Australia/Perth',
							'Australia/Queensland',
							'Australia/South',
							'Australia/Sydney',
							'Australia/Tasmania',
							'Australia/Victoria',
							'Australia/West',
							'Australia/Yancowinna',
							'Brazil/Acre',
							'Brazil/DeNoronha',
							'Brazil/East',
							'Brazil/West',
							'CET',
							'CST6CDT',
							'Canada/Atlantic',
							'Canada/Central',
							'Canada/Eastern',
							'Canada/Mountain',
							'Canada/Newfoundland',
							'Canada/Pacific',
							'Canada/Saskatchewan',
							'Canada/Yukon',
							'Chile/Continental',
							'Chile/EasterIsland',
							'Cuba',
							'EET',
							'EST',
							'EST5EDT',
							'Egypt',
							'Eire',
							'Etc/GMT',
							'Etc/GMT+0',
							'Etc/GMT+1',
							'Etc/GMT+10',
							'Etc/GMT+11',
							'Etc/GMT+12',
							'Etc/GMT+2',
							'Etc/GMT+3',
							'Etc/GMT+4',
							'Etc/GMT+5',
							'Etc/GMT+6',
							'Etc/GMT+7',
							'Etc/GMT+8',
							'Etc/GMT+9',
							'Etc/GMT-0',
							'Etc/GMT-1',
							'Etc/GMT-10',
							'Etc/GMT-11',
							'Etc/GMT-12',
							'Etc/GMT-13',
							'Etc/GMT-14',
							'Etc/GMT-2',
							'Etc/GMT-3',
							'Etc/GMT-4',
							'Etc/GMT-5',
							'Etc/GMT-6',
							'Etc/GMT-7',
							'Etc/GMT-8',
							'Etc/GMT-9',
							'Etc/GMT0',
							'Etc/Greenwich',
							'Etc/UCT',
							'Etc/UTC',
							'Etc/Universal',
							'Etc/Zulu',
							'Europe/Amsterdam',
							'Europe/Andorra',
							'Europe/Astrakhan',
							'Europe/Athens',
							'Europe/Belfast',
							'Europe/Belgrade',
							'Europe/Berlin',
							'Europe/Bratislava',
							'Europe/Brussels',
							'Europe/Bucharest',
							'Europe/Budapest',
							'Europe/Busingen',
							'Europe/Chisinau',
							'Europe/Copenhagen',
							'Europe/Dublin',
							'Europe/Gibraltar',
							'Europe/Guernsey',
							'Europe/Helsinki',
							'Europe/Isle_of_Man',
							'Europe/Istanbul',
							'Europe/Jersey',
							'Europe/Kaliningrad',
							'Europe/Kiev',
							'Europe/Kirov',
							'Europe/Kyiv',
							'Europe/Lisbon',
							'Europe/Ljubljana',
							'Europe/London',
							'Europe/Luxembourg',
							'Europe/Madrid',
							'Europe/Malta',
							'Europe/Mariehamn',
							'Europe/Minsk',
							'Europe/Monaco',
							'Europe/Moscow',
							'Europe/Nicosia',
							'Europe/Oslo',
							'Europe/Paris',
							'Europe/Podgorica',
							'Europe/Prague',
							'Europe/Riga',
							'Europe/Rome',
							'Europe/Samara',
							'Europe/San_Marino',
							'Europe/Sarajevo',
							'Europe/Saratov',
							'Europe/Simferopol',
							'Europe/Skopje',
							'Europe/Sofia',
							'Europe/Stockholm',
							'Europe/Tallinn',
							'Europe/Tirane',
							'Europe/Tiraspol',
							'Europe/Ulyanovsk',
							'Europe/Uzhgorod',
							'Europe/Vaduz',
							'Europe/Vatican',
							'Europe/Vienna',
							'Europe/Vilnius',
							'Europe/Volgograd',
							'Europe/Warsaw',
							'Europe/Zagreb',
							'Europe/Zaporozhye',
							'Europe/Zurich',
							'GB',
							'GB-Eire',
							'GMT',
							'GMT+0',
							'GMT-0',
							'GMT0',
							'Greenwich',
							'HST',
							'Hongkong',
							'Iceland',
							'Indian/Antananarivo',
							'Indian/Chagos',
							'Indian/Christmas',
							'Indian/Cocos',
							'Indian/Comoro',
							'Indian/Kerguelen',
							'Indian/Mahe',
							'Indian/Maldives',
							'Indian/Mauritius',
							'Indian/Mayotte',
							'Indian/Reunion',
							'Iran',
							'Israel',
							'Jamaica',
							'Japan',
							'Kwajalein',
							'Libya',
							'MET',
							'MST',
							'MST7MDT',
							'Mexico/BajaNorte',
							'Mexico/BajaSur',
							'Mexico/General',
							'NZ',
							'NZ-CHAT',
							'Navajo',
							'PRC',
							'PST8PDT',
							'Pacific/Apia',
							'Pacific/Auckland',
							'Pacific/Bougainville',
							'Pacific/Chatham',
							'Pacific/Chuuk',
							'Pacific/Easter',
							'Pacific/Efate',
							'Pacific/Enderbury',
							'Pacific/Fakaofo',
							'Pacific/Fiji',
							'Pacific/Funafuti',
							'Pacific/Galapagos',
							'Pacific/Gambier',
							'Pacific/Guadalcanal',
							'Pacific/Guam',
							'Pacific/Honolulu',
							'Pacific/Johnston',
							'Pacific/Kanton',
							'Pacific/Kiritimati',
							'Pacific/Kosrae',
							'Pacific/Kwajalein',
							'Pacific/Majuro',
							'Pacific/Marquesas',
							'Pacific/Midway',
							'Pacific/Nauru',
							'Pacific/Niue',
							'Pacific/Norfolk',
							'Pacific/Noumea',
							'Pacific/Pago_Pago',
							'Pacific/Palau',
							'Pacific/Pitcairn',
							'Pacific/Pohnpei',
							'Pacific/Ponape',
							'Pacific/Port_Moresby',
							'Pacific/Rarotonga',
							'Pacific/Saipan',
							'Pacific/Samoa',
							'Pacific/Tahiti',
							'Pacific/Tarawa',
							'Pacific/Tongatapu',
							'Pacific/Truk',
							'Pacific/Wake',
							'Pacific/Wallis',
							'Pacific/Yap',
							'Poland',
							'Portugal',
							'ROC',
							'ROK',
							'Singapore',
							'Turkey',
							'UCT',
							'US/Alaska',
							'US/Aleutian',
							'US/Arizona',
							'US/Central',
							'US/East-Indiana',
							'US/Eastern',
							'US/Hawaii',
							'US/Indiana-Starke',
							'US/Michigan',
							'US/Mountain',
							'US/Pacific',
							'US/Samoa',
							'UTC',
							'Universal',
							'W-SU',
							'WET',
							'Zulu',
						])
						.optional(),
					two_fa_code: z.string().nullable().optional(),
				})
				.strict(),
		})
		.strict(),
	'views.createView': z
		.object({
			body: ViewCreateSchema,
		})
		.strict(),
	'views.deleteView': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'views.getView': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'views.listViewItems': z
		.object({
			path: z
				.object({
					view_id: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					cursor: z.string().optional(),
					direction: z.enum(['prev', 'next']).optional(),
					ignored_item: z.number().int().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					order_by: z
						.enum([
							'created_datetime:asc',
							'created_datetime:desc',
							'updated_datetime:asc',
							'updated_datetime:desc',
							'last_message_datetime:asc',
							'last_message_datetime:desc',
							'last_received_message_datetime:asc',
							'last_received_message_datetime:desc',
							'closed_datetime:asc',
							'closed_datetime:desc',
							'snooze_datetime:asc',
							'snooze_datetime:desc',
							'priority:asc',
							'priority:desc',
						])
						.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'views.listViews': z
		.object({
			query: z
				.object({
					order_by: z
						.enum(['created_datetime:asc', 'created_datetime:desc'])
						.optional(),
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					category: ViewCategorySchema.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'views.updateView': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: ViewUpdateSchema,
		})
		.strict(),
	'views.updateViewItems': z
		.object({
			path: z
				.object({
					view_id: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					cursor: z.string().optional(),
					direction: z.enum(['prev', 'next']).optional(),
					ignored_item: z.number().int().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					order_by: z
						.enum([
							'created_datetime:asc',
							'created_datetime:desc',
							'updated_datetime:asc',
							'updated_datetime:desc',
							'last_message_datetime:asc',
							'last_message_datetime:desc',
							'last_received_message_datetime:asc',
							'last_received_message_datetime:desc',
							'closed_datetime:asc',
							'closed_datetime:desc',
							'snooze_datetime:asc',
							'snooze_datetime:desc',
							'priority:asc',
							'priority:desc',
						])
						.optional(),
				})
				.strict()
				.optional(),
			body: z
				.object({
					view: z
						.object({
							category: z.string().nullable().optional(),
							fields: z
								.array(
									z.enum([
										'id',
										'details',
										'tags',
										'customer',
										'last_message',
										'name',
										'email',
										'created',
										'updated',
										'assignee',
										'assignee_team',
										'channel',
										'closed',
										'language',
										'last_received_message',
										'integrations',
										'snooze',
										'status',
										'subject',
										'priority',
									]),
								)
								.optional(),
							filters: z.string().optional(),
							order_by: z.string().optional(),
							order_dir: z.enum(['asc', 'desc']).optional(),
							search: z.string().nullable().optional(),
							type: z.enum(['ticket-list']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
		})
		.strict(),
	'voiceCallEvents.getVoiceCallEvent': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'voiceCallEvents.listVoiceCallEvents': z
		.object({
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					call_id: z.number().int().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'voiceCallRecordings.deleteVoiceCallRecording': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'voiceCallRecordings.getVoiceCallRecording': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'voiceCallRecordings.listVoiceCallRecordings': z
		.object({
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					call_id: z.number().int().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'voiceCalls.getVoiceCall': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'voiceCalls.listVoiceCalls': z
		.object({
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					ticket_id: z.number().int().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'widgets.createWidget': z
		.object({
			body: z
				.object({
					context: z.enum(['ticket', 'customer', 'user']).optional(),
					deactivated_datetime: z.string().nullable().optional(),
					integration_id: z.number().int().min(0).nullable().optional(),
					app_id: z.string().nullable().optional(),
					order: z.number().int().min(0).optional(),
					template: z.record(z.string(), z.json()),
					type: z.enum([
						'bigcommerce',
						'custom',
						'customer_external_data',
						'http',
						'magento2',
						'recharge',
						'shopify',
						'smile',
						'standalone',
						'yotpo',
						'klaviyo',
						'stripe',
						'woocommerce',
					]),
				})
				.strict(),
		})
		.strict(),
	'widgets.deleteWidget': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'widgets.getWidget': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
		})
		.strict(),
	'widgets.listWidgets': z
		.object({
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					order_by: z
						.enum([
							'created_datetime:asc',
							'created_datetime:desc',
							'order:asc',
							'order:desc',
						])
						.optional(),
					integration_id: z.number().int().nullable().optional(),
					app_id: z.string().nullable().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'widgets.updateWidget': z
		.object({
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			body: z
				.object({
					context: z.enum(['ticket', 'customer', 'user']).optional(),
					deactivated_datetime: z.string().nullable().optional(),
					integration_id: z.number().int().min(0).nullable().optional(),
					app_id: z.string().nullable().optional(),
					order: z.number().int().min(0).optional(),
					template: z.record(z.string(), z.json()).optional(),
					type: z
						.enum([
							'bigcommerce',
							'custom',
							'customer_external_data',
							'http',
							'magento2',
							'recharge',
							'shopify',
							'smile',
							'standalone',
							'yotpo',
							'klaviyo',
							'stripe',
							'woocommerce',
						])
						.optional(),
				})
				.strict(),
		})
		.strict(),
} as const;

export const GorgiasEndpointOutputSchemas = {
	'account.createAccountSetting': z.union([
		AccountSettingSatisfactionSurveysTypedSchema,
		AccountSettingAutoMergeTypedSchema,
		AccountSettingAutoSplitTypedSchema,
		AccountSettingBusinessHoursTypedSchema,
		AccountSettingTicketAssignmentTypedSchema,
		AccountSettingViewsOrderingTypedSchema,
		AccountSettingAccessTypedSchema,
		AccountSettingViewsVisibilityTypedSchema,
		AccountSettingAgentsTableConfigTypedSchema,
		AccountSettingAgentsAvailabilityTableConfigTypedSchema,
		AccountSettingChannelsTableConfigTypedSchema,
		AccountSettingProductInsightsTableConfigTypedSchema,
		AccountSettingInTicketSuggestionTypedSchema,
		AccountSettingAgentCostsTypedSchema,
		AccountSettingLimitsTypedSchema,
		AccountSettingDefaultIntegrationTypedSchema,
		AccountSettingBillingProductHardLimitsTypedSchema,
	]),
	'account.getAccount': AccountSchema,
	'account.listAccountSettings': z
		.object({
			data: z.array(
				z.union([
					AccountSettingSatisfactionSurveysTypedSchema,
					AccountSettingAutoMergeTypedSchema,
					AccountSettingAutoSplitTypedSchema,
					AccountSettingBusinessHoursTypedSchema,
					AccountSettingTicketAssignmentTypedSchema,
					AccountSettingViewsOrderingTypedSchema,
					AccountSettingAccessTypedSchema,
					AccountSettingViewsVisibilityTypedSchema,
					AccountSettingAgentsTableConfigTypedSchema,
					AccountSettingAgentsAvailabilityTableConfigTypedSchema,
					AccountSettingChannelsTableConfigTypedSchema,
					AccountSettingProductInsightsTableConfigTypedSchema,
					AccountSettingInTicketSuggestionTypedSchema,
					AccountSettingAgentCostsTypedSchema,
					AccountSettingLimitsTypedSchema,
					AccountSettingDefaultIntegrationTypedSchema,
					AccountSettingBillingProductHardLimitsTypedSchema,
				]),
			),
		})
		.strict(),
	'account.updateAccountSetting': z.union([
		AccountSettingSatisfactionSurveysTypedSchema,
		AccountSettingAutoMergeTypedSchema,
		AccountSettingAutoSplitTypedSchema,
		AccountSettingBusinessHoursTypedSchema,
		AccountSettingTicketAssignmentTypedSchema,
		AccountSettingViewsOrderingTypedSchema,
		AccountSettingAccessTypedSchema,
		AccountSettingViewsVisibilityTypedSchema,
		AccountSettingAgentsTableConfigTypedSchema,
		AccountSettingAgentsAvailabilityTableConfigTypedSchema,
		AccountSettingChannelsTableConfigTypedSchema,
		AccountSettingProductInsightsTableConfigTypedSchema,
		AccountSettingInTicketSuggestionTypedSchema,
		AccountSettingAgentCostsTypedSchema,
		AccountSettingLimitsTypedSchema,
		AccountSettingDefaultIntegrationTypedSchema,
		AccountSettingBillingProductHardLimitsTypedSchema,
	]),
	'customFields.createCustomField': CustomFieldSchema,
	'customFields.getCustomField': CustomFieldSchema,
	'customFields.listCustomFields': z
		.object({
			object: z.string(),
			uri: z.string(),
			data: z.array(CustomFieldSchema),
			meta: CursorPaginationMetaSchema,
		})
		.strict(),
	'customFields.updateCustomField': CustomFieldSchema,
	'customFields.updateCustomFields': z.array(CustomFieldSchema),
	'customers.createCustomer': CustomerSchema,
	'customers.deleteCustomer': z.void(),
	'customers.deleteCustomerCustomFieldValue': z.void(),
	'customers.deleteCustomers': z.void(),
	'customers.getCustomer': z
		.object({
			id: z.number().int().optional(),
			channels: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
						})
						.strict(),
				)
				.optional(),
			created_datetime: z.string().nullable().optional(),
			email: z.string().email().nullable().optional(),
			external_id: z.string().nullable().optional(),
			firstname: z.string().optional(),
			integrations: z.record(z.string(), z.json()).optional(),
			language: z
				.enum([
					'aa',
					'ab',
					'af',
					'ak',
					'sq',
					'am',
					'ar',
					'an',
					'hy',
					'as',
					'av',
					'ae',
					'ay',
					'az',
					'ba',
					'bm',
					'eu',
					'be',
					'bn',
					'bh',
					'bi',
					'bs',
					'br',
					'bg',
					'my',
					'ca',
					'ch',
					'ce',
					'zh',
					'cu',
					'cv',
					'kw',
					'co',
					'cr',
					'cs',
					'da',
					'dv',
					'nl',
					'dz',
					'en',
					'eo',
					'et',
					'ee',
					'fo',
					'fj',
					'fi',
					'fr',
					'fy',
					'ff',
					'ka',
					'de',
					'gd',
					'ga',
					'gl',
					'gv',
					'el',
					'gn',
					'gu',
					'ht',
					'ha',
					'he',
					'hz',
					'hi',
					'ho',
					'hr',
					'hu',
					'ig',
					'is',
					'io',
					'ii',
					'iu',
					'ie',
					'ia',
					'id',
					'ik',
					'it',
					'jv',
					'ja',
					'kl',
					'kn',
					'ks',
					'kr',
					'kk',
					'km',
					'ki',
					'rw',
					'ky',
					'kv',
					'kg',
					'ko',
					'kj',
					'ku',
					'lo',
					'la',
					'lv',
					'li',
					'ln',
					'lt',
					'lb',
					'lu',
					'lg',
					'mk',
					'mh',
					'ml',
					'mi',
					'mr',
					'ms',
					'mg',
					'mt',
					'mn',
					'na',
					'nv',
					'nr',
					'nd',
					'ng',
					'ne',
					'nn',
					'nb',
					'no',
					'ny',
					'oc',
					'oj',
					'or',
					'om',
					'os',
					'pa',
					'fa',
					'pi',
					'pl',
					'pt',
					'ps',
					'qu',
					'rc',
					'rm',
					'ro',
					'rn',
					'ru',
					'sg',
					'sa',
					'si',
					'sk',
					'sl',
					'se',
					'sm',
					'sn',
					'sd',
					'so',
					'st',
					'es',
					'sc',
					'sr',
					'ss',
					'su',
					'sw',
					'sv',
					'ty',
					'ta',
					'tt',
					'te',
					'tg',
					'tl',
					'th',
					'bo',
					'ti',
					'to',
					'tn',
					'ts',
					'tk',
					'tr',
					'tw',
					'ug',
					'uk',
					'ur',
					'uz',
					've',
					'vi',
					'vo',
					'cy',
					'wa',
					'wo',
					'xh',
					'yi',
					'yo',
					'za',
					'zu',
				])
				.optional(),
			lastname: z.string().optional(),
			name: z.string().nullable().optional(),
			note: z.string().nullable().optional(),
			timezone: z
				.enum([
					'Africa/Abidjan',
					'Africa/Accra',
					'Africa/Addis_Ababa',
					'Africa/Algiers',
					'Africa/Asmara',
					'Africa/Asmera',
					'Africa/Bamako',
					'Africa/Bangui',
					'Africa/Banjul',
					'Africa/Bissau',
					'Africa/Blantyre',
					'Africa/Brazzaville',
					'Africa/Bujumbura',
					'Africa/Cairo',
					'Africa/Casablanca',
					'Africa/Ceuta',
					'Africa/Conakry',
					'Africa/Dakar',
					'Africa/Dar_es_Salaam',
					'Africa/Djibouti',
					'Africa/Douala',
					'Africa/El_Aaiun',
					'Africa/Freetown',
					'Africa/Gaborone',
					'Africa/Harare',
					'Africa/Johannesburg',
					'Africa/Juba',
					'Africa/Kampala',
					'Africa/Khartoum',
					'Africa/Kigali',
					'Africa/Kinshasa',
					'Africa/Lagos',
					'Africa/Libreville',
					'Africa/Lome',
					'Africa/Luanda',
					'Africa/Lubumbashi',
					'Africa/Lusaka',
					'Africa/Malabo',
					'Africa/Maputo',
					'Africa/Maseru',
					'Africa/Mbabane',
					'Africa/Mogadishu',
					'Africa/Monrovia',
					'Africa/Nairobi',
					'Africa/Ndjamena',
					'Africa/Niamey',
					'Africa/Nouakchott',
					'Africa/Ouagadougou',
					'Africa/Porto-Novo',
					'Africa/Sao_Tome',
					'Africa/Timbuktu',
					'Africa/Tripoli',
					'Africa/Tunis',
					'Africa/Windhoek',
					'America/Adak',
					'America/Anchorage',
					'America/Anguilla',
					'America/Antigua',
					'America/Araguaina',
					'America/Argentina/Buenos_Aires',
					'America/Argentina/Catamarca',
					'America/Argentina/ComodRivadavia',
					'America/Argentina/Cordoba',
					'America/Argentina/Jujuy',
					'America/Argentina/La_Rioja',
					'America/Argentina/Mendoza',
					'America/Argentina/Rio_Gallegos',
					'America/Argentina/Salta',
					'America/Argentina/San_Juan',
					'America/Argentina/San_Luis',
					'America/Argentina/Tucuman',
					'America/Argentina/Ushuaia',
					'America/Aruba',
					'America/Asuncion',
					'America/Atikokan',
					'America/Atka',
					'America/Bahia',
					'America/Bahia_Banderas',
					'America/Barbados',
					'America/Belem',
					'America/Belize',
					'America/Blanc-Sablon',
					'America/Boa_Vista',
					'America/Bogota',
					'America/Boise',
					'America/Buenos_Aires',
					'America/Cambridge_Bay',
					'America/Campo_Grande',
					'America/Cancun',
					'America/Caracas',
					'America/Catamarca',
					'America/Cayenne',
					'America/Cayman',
					'America/Chicago',
					'America/Chihuahua',
					'America/Ciudad_Juarez',
					'America/Coral_Harbour',
					'America/Cordoba',
					'America/Costa_Rica',
					'America/Coyhaique',
					'America/Creston',
					'America/Cuiaba',
					'America/Curacao',
					'America/Danmarkshavn',
					'America/Dawson',
					'America/Dawson_Creek',
					'America/Denver',
					'America/Detroit',
					'America/Dominica',
					'America/Edmonton',
					'America/Eirunepe',
					'America/El_Salvador',
					'America/Ensenada',
					'America/Fort_Nelson',
					'America/Fort_Wayne',
					'America/Fortaleza',
					'America/Glace_Bay',
					'America/Godthab',
					'America/Goose_Bay',
					'America/Grand_Turk',
					'America/Grenada',
					'America/Guadeloupe',
					'America/Guatemala',
					'America/Guayaquil',
					'America/Guyana',
					'America/Halifax',
					'America/Havana',
					'America/Hermosillo',
					'America/Indiana/Indianapolis',
					'America/Indiana/Knox',
					'America/Indiana/Marengo',
					'America/Indiana/Petersburg',
					'America/Indiana/Tell_City',
					'America/Indiana/Vevay',
					'America/Indiana/Vincennes',
					'America/Indiana/Winamac',
					'America/Indianapolis',
					'America/Inuvik',
					'America/Iqaluit',
					'America/Jamaica',
					'America/Jujuy',
					'America/Juneau',
					'America/Kentucky/Louisville',
					'America/Kentucky/Monticello',
					'America/Knox_IN',
					'America/Kralendijk',
					'America/La_Paz',
					'America/Lima',
					'America/Los_Angeles',
					'America/Louisville',
					'America/Lower_Princes',
					'America/Maceio',
					'America/Managua',
					'America/Manaus',
					'America/Marigot',
					'America/Martinique',
					'America/Matamoros',
					'America/Mazatlan',
					'America/Mendoza',
					'America/Menominee',
					'America/Merida',
					'America/Metlakatla',
					'America/Mexico_City',
					'America/Miquelon',
					'America/Moncton',
					'America/Monterrey',
					'America/Montevideo',
					'America/Montreal',
					'America/Montserrat',
					'America/Nassau',
					'America/New_York',
					'America/Nipigon',
					'America/Nome',
					'America/Noronha',
					'America/North_Dakota/Beulah',
					'America/North_Dakota/Center',
					'America/North_Dakota/New_Salem',
					'America/Nuuk',
					'America/Ojinaga',
					'America/Panama',
					'America/Pangnirtung',
					'America/Paramaribo',
					'America/Phoenix',
					'America/Port-au-Prince',
					'America/Port_of_Spain',
					'America/Porto_Acre',
					'America/Porto_Velho',
					'America/Puerto_Rico',
					'America/Punta_Arenas',
					'America/Rainy_River',
					'America/Rankin_Inlet',
					'America/Recife',
					'America/Regina',
					'America/Resolute',
					'America/Rio_Branco',
					'America/Rosario',
					'America/Santa_Isabel',
					'America/Santarem',
					'America/Santiago',
					'America/Santo_Domingo',
					'America/Sao_Paulo',
					'America/Scoresbysund',
					'America/Shiprock',
					'America/Sitka',
					'America/St_Barthelemy',
					'America/St_Johns',
					'America/St_Kitts',
					'America/St_Lucia',
					'America/St_Thomas',
					'America/St_Vincent',
					'America/Swift_Current',
					'America/Tegucigalpa',
					'America/Thule',
					'America/Thunder_Bay',
					'America/Tijuana',
					'America/Toronto',
					'America/Tortola',
					'America/Vancouver',
					'America/Virgin',
					'America/Whitehorse',
					'America/Winnipeg',
					'America/Yakutat',
					'America/Yellowknife',
					'Antarctica/Casey',
					'Antarctica/Davis',
					'Antarctica/DumontDUrville',
					'Antarctica/Macquarie',
					'Antarctica/Mawson',
					'Antarctica/McMurdo',
					'Antarctica/Palmer',
					'Antarctica/Rothera',
					'Antarctica/South_Pole',
					'Antarctica/Syowa',
					'Antarctica/Troll',
					'Antarctica/Vostok',
					'Arctic/Longyearbyen',
					'Asia/Aden',
					'Asia/Almaty',
					'Asia/Amman',
					'Asia/Anadyr',
					'Asia/Aqtau',
					'Asia/Aqtobe',
					'Asia/Ashgabat',
					'Asia/Ashkhabad',
					'Asia/Atyrau',
					'Asia/Baghdad',
					'Asia/Bahrain',
					'Asia/Baku',
					'Asia/Bangkok',
					'Asia/Barnaul',
					'Asia/Beirut',
					'Asia/Bishkek',
					'Asia/Brunei',
					'Asia/Calcutta',
					'Asia/Chita',
					'Asia/Choibalsan',
					'Asia/Chongqing',
					'Asia/Chungking',
					'Asia/Colombo',
					'Asia/Dacca',
					'Asia/Damascus',
					'Asia/Dhaka',
					'Asia/Dili',
					'Asia/Dubai',
					'Asia/Dushanbe',
					'Asia/Famagusta',
					'Asia/Gaza',
					'Asia/Harbin',
					'Asia/Hebron',
					'Asia/Ho_Chi_Minh',
					'Asia/Hong_Kong',
					'Asia/Hovd',
					'Asia/Irkutsk',
					'Asia/Istanbul',
					'Asia/Jakarta',
					'Asia/Jayapura',
					'Asia/Jerusalem',
					'Asia/Kabul',
					'Asia/Kamchatka',
					'Asia/Karachi',
					'Asia/Kashgar',
					'Asia/Kathmandu',
					'Asia/Katmandu',
					'Asia/Khandyga',
					'Asia/Kolkata',
					'Asia/Krasnoyarsk',
					'Asia/Kuala_Lumpur',
					'Asia/Kuching',
					'Asia/Kuwait',
					'Asia/Macao',
					'Asia/Macau',
					'Asia/Magadan',
					'Asia/Makassar',
					'Asia/Manila',
					'Asia/Muscat',
					'Asia/Nicosia',
					'Asia/Novokuznetsk',
					'Asia/Novosibirsk',
					'Asia/Omsk',
					'Asia/Oral',
					'Asia/Phnom_Penh',
					'Asia/Pontianak',
					'Asia/Pyongyang',
					'Asia/Qatar',
					'Asia/Qostanay',
					'Asia/Qyzylorda',
					'Asia/Rangoon',
					'Asia/Riyadh',
					'Asia/Saigon',
					'Asia/Sakhalin',
					'Asia/Samarkand',
					'Asia/Seoul',
					'Asia/Shanghai',
					'Asia/Singapore',
					'Asia/Srednekolymsk',
					'Asia/Taipei',
					'Asia/Tashkent',
					'Asia/Tbilisi',
					'Asia/Tehran',
					'Asia/Tel_Aviv',
					'Asia/Thimbu',
					'Asia/Thimphu',
					'Asia/Tokyo',
					'Asia/Tomsk',
					'Asia/Ujung_Pandang',
					'Asia/Ulaanbaatar',
					'Asia/Ulan_Bator',
					'Asia/Urumqi',
					'Asia/Ust-Nera',
					'Asia/Vientiane',
					'Asia/Vladivostok',
					'Asia/Yakutsk',
					'Asia/Yangon',
					'Asia/Yekaterinburg',
					'Asia/Yerevan',
					'Atlantic/Azores',
					'Atlantic/Bermuda',
					'Atlantic/Canary',
					'Atlantic/Cape_Verde',
					'Atlantic/Faeroe',
					'Atlantic/Faroe',
					'Atlantic/Jan_Mayen',
					'Atlantic/Madeira',
					'Atlantic/Reykjavik',
					'Atlantic/South_Georgia',
					'Atlantic/St_Helena',
					'Atlantic/Stanley',
					'Australia/ACT',
					'Australia/Adelaide',
					'Australia/Brisbane',
					'Australia/Broken_Hill',
					'Australia/Canberra',
					'Australia/Currie',
					'Australia/Darwin',
					'Australia/Eucla',
					'Australia/Hobart',
					'Australia/LHI',
					'Australia/Lindeman',
					'Australia/Lord_Howe',
					'Australia/Melbourne',
					'Australia/NSW',
					'Australia/North',
					'Australia/Perth',
					'Australia/Queensland',
					'Australia/South',
					'Australia/Sydney',
					'Australia/Tasmania',
					'Australia/Victoria',
					'Australia/West',
					'Australia/Yancowinna',
					'Brazil/Acre',
					'Brazil/DeNoronha',
					'Brazil/East',
					'Brazil/West',
					'CET',
					'CST6CDT',
					'Canada/Atlantic',
					'Canada/Central',
					'Canada/Eastern',
					'Canada/Mountain',
					'Canada/Newfoundland',
					'Canada/Pacific',
					'Canada/Saskatchewan',
					'Canada/Yukon',
					'Chile/Continental',
					'Chile/EasterIsland',
					'Cuba',
					'EET',
					'EST',
					'EST5EDT',
					'Egypt',
					'Eire',
					'Etc/GMT',
					'Etc/GMT+0',
					'Etc/GMT+1',
					'Etc/GMT+10',
					'Etc/GMT+11',
					'Etc/GMT+12',
					'Etc/GMT+2',
					'Etc/GMT+3',
					'Etc/GMT+4',
					'Etc/GMT+5',
					'Etc/GMT+6',
					'Etc/GMT+7',
					'Etc/GMT+8',
					'Etc/GMT+9',
					'Etc/GMT-0',
					'Etc/GMT-1',
					'Etc/GMT-10',
					'Etc/GMT-11',
					'Etc/GMT-12',
					'Etc/GMT-13',
					'Etc/GMT-14',
					'Etc/GMT-2',
					'Etc/GMT-3',
					'Etc/GMT-4',
					'Etc/GMT-5',
					'Etc/GMT-6',
					'Etc/GMT-7',
					'Etc/GMT-8',
					'Etc/GMT-9',
					'Etc/GMT0',
					'Etc/Greenwich',
					'Etc/UCT',
					'Etc/UTC',
					'Etc/Universal',
					'Etc/Zulu',
					'Europe/Amsterdam',
					'Europe/Andorra',
					'Europe/Astrakhan',
					'Europe/Athens',
					'Europe/Belfast',
					'Europe/Belgrade',
					'Europe/Berlin',
					'Europe/Bratislava',
					'Europe/Brussels',
					'Europe/Bucharest',
					'Europe/Budapest',
					'Europe/Busingen',
					'Europe/Chisinau',
					'Europe/Copenhagen',
					'Europe/Dublin',
					'Europe/Gibraltar',
					'Europe/Guernsey',
					'Europe/Helsinki',
					'Europe/Isle_of_Man',
					'Europe/Istanbul',
					'Europe/Jersey',
					'Europe/Kaliningrad',
					'Europe/Kiev',
					'Europe/Kirov',
					'Europe/Kyiv',
					'Europe/Lisbon',
					'Europe/Ljubljana',
					'Europe/London',
					'Europe/Luxembourg',
					'Europe/Madrid',
					'Europe/Malta',
					'Europe/Mariehamn',
					'Europe/Minsk',
					'Europe/Monaco',
					'Europe/Moscow',
					'Europe/Nicosia',
					'Europe/Oslo',
					'Europe/Paris',
					'Europe/Podgorica',
					'Europe/Prague',
					'Europe/Riga',
					'Europe/Rome',
					'Europe/Samara',
					'Europe/San_Marino',
					'Europe/Sarajevo',
					'Europe/Saratov',
					'Europe/Simferopol',
					'Europe/Skopje',
					'Europe/Sofia',
					'Europe/Stockholm',
					'Europe/Tallinn',
					'Europe/Tirane',
					'Europe/Tiraspol',
					'Europe/Ulyanovsk',
					'Europe/Uzhgorod',
					'Europe/Vaduz',
					'Europe/Vatican',
					'Europe/Vienna',
					'Europe/Vilnius',
					'Europe/Volgograd',
					'Europe/Warsaw',
					'Europe/Zagreb',
					'Europe/Zaporozhye',
					'Europe/Zurich',
					'GB',
					'GB-Eire',
					'GMT',
					'GMT+0',
					'GMT-0',
					'GMT0',
					'Greenwich',
					'HST',
					'Hongkong',
					'Iceland',
					'Indian/Antananarivo',
					'Indian/Chagos',
					'Indian/Christmas',
					'Indian/Cocos',
					'Indian/Comoro',
					'Indian/Kerguelen',
					'Indian/Mahe',
					'Indian/Maldives',
					'Indian/Mauritius',
					'Indian/Mayotte',
					'Indian/Reunion',
					'Iran',
					'Israel',
					'Jamaica',
					'Japan',
					'Kwajalein',
					'Libya',
					'MET',
					'MST',
					'MST7MDT',
					'Mexico/BajaNorte',
					'Mexico/BajaSur',
					'Mexico/General',
					'NZ',
					'NZ-CHAT',
					'Navajo',
					'PRC',
					'PST8PDT',
					'Pacific/Apia',
					'Pacific/Auckland',
					'Pacific/Bougainville',
					'Pacific/Chatham',
					'Pacific/Chuuk',
					'Pacific/Easter',
					'Pacific/Efate',
					'Pacific/Enderbury',
					'Pacific/Fakaofo',
					'Pacific/Fiji',
					'Pacific/Funafuti',
					'Pacific/Galapagos',
					'Pacific/Gambier',
					'Pacific/Guadalcanal',
					'Pacific/Guam',
					'Pacific/Honolulu',
					'Pacific/Johnston',
					'Pacific/Kanton',
					'Pacific/Kiritimati',
					'Pacific/Kosrae',
					'Pacific/Kwajalein',
					'Pacific/Majuro',
					'Pacific/Marquesas',
					'Pacific/Midway',
					'Pacific/Nauru',
					'Pacific/Niue',
					'Pacific/Norfolk',
					'Pacific/Noumea',
					'Pacific/Pago_Pago',
					'Pacific/Palau',
					'Pacific/Pitcairn',
					'Pacific/Pohnpei',
					'Pacific/Ponape',
					'Pacific/Port_Moresby',
					'Pacific/Rarotonga',
					'Pacific/Saipan',
					'Pacific/Samoa',
					'Pacific/Tahiti',
					'Pacific/Tarawa',
					'Pacific/Tongatapu',
					'Pacific/Truk',
					'Pacific/Wake',
					'Pacific/Wallis',
					'Pacific/Yap',
					'Poland',
					'Portugal',
					'ROC',
					'ROK',
					'Singapore',
					'Turkey',
					'UCT',
					'US/Alaska',
					'US/Aleutian',
					'US/Arizona',
					'US/Central',
					'US/East-Indiana',
					'US/Eastern',
					'US/Hawaii',
					'US/Indiana-Starke',
					'US/Michigan',
					'US/Mountain',
					'US/Pacific',
					'US/Samoa',
					'UTC',
					'Universal',
					'W-SU',
					'WET',
					'Zulu',
				])
				.optional(),
			updated_datetime: z.string().nullable().optional(),
			external_data: z
				.record(z.string(), z.record(z.string(), z.json()))
				.optional(),
			ecommerce_data: z
				.record(
					z.string(),
					z
						.object({
							store: z
								.object({
									id: z.number().int().optional(),
									currencies: z
										.array(
											z.enum([
												'afn',
												'eur',
												'all',
												'dzd',
												'usd',
												'aoa',
												'xcd',
												'ars',
												'amd',
												'awg',
												'aud',
												'azn',
												'bsd',
												'bhd',
												'bdt',
												'bbd',
												'byn',
												'bzd',
												'xof',
												'bmd',
												'inr',
												'btn',
												'bob',
												'bov',
												'bam',
												'bwp',
												'nok',
												'brl',
												'bnd',
												'bgn',
												'bif',
												'cve',
												'khr',
												'xaf',
												'cad',
												'kyd',
												'clp',
												'clf',
												'cny',
												'cop',
												'cou',
												'kmf',
												'cdf',
												'nzd',
												'crc',
												'hrk',
												'cup',
												'cuc',
												'ang',
												'czk',
												'dkk',
												'djf',
												'dop',
												'egp',
												'svc',
												'ern',
												'szl',
												'etb',
												'fkp',
												'fjd',
												'xpf',
												'gmd',
												'gel',
												'ghs',
												'gip',
												'gtq',
												'gbp',
												'gnf',
												'gyd',
												'htg',
												'hnl',
												'hkd',
												'huf',
												'isk',
												'idr',
												'xdr',
												'irr',
												'iqd',
												'ils',
												'jmd',
												'jpy',
												'jod',
												'kzt',
												'kes',
												'kpw',
												'krw',
												'kwd',
												'kgs',
												'lak',
												'lbp',
												'lsl',
												'zar',
												'lrd',
												'lyd',
												'chf',
												'mop',
												'mkd',
												'mga',
												'mwk',
												'myr',
												'mvr',
												'mru',
												'mur',
												'xua',
												'mxn',
												'mxv',
												'mdl',
												'mnt',
												'mad',
												'mzn',
												'mmk',
												'nad',
												'npr',
												'nio',
												'ngn',
												'omr',
												'pkr',
												'pab',
												'pgk',
												'pyg',
												'pen',
												'php',
												'pln',
												'qar',
												'ron',
												'rub',
												'rwf',
												'shp',
												'wst',
												'stn',
												'sar',
												'rsd',
												'scr',
												'sll',
												'sle',
												'sgd',
												'xsu',
												'sbd',
												'sos',
												'ssp',
												'lkr',
												'sdg',
												'srd',
												'sek',
												'che',
												'chw',
												'syp',
												'twd',
												'tjs',
												'tzs',
												'thb',
												'top',
												'ttd',
												'tnd',
												'try',
												'tmt',
												'ugx',
												'uah',
												'aed',
												'usn',
												'uyu',
												'uyi',
												'uyw',
												'uzs',
												'vuv',
												'ves',
												'ved',
												'vnd',
												'yer',
												'zmw',
												'zwl',
												'xba',
												'xbb',
												'xbc',
												'xbd',
												'xts',
												'xxx',
												'xau',
												'xpd',
												'xpt',
												'xag',
											]),
										)
										.optional(),
									default_currency: z
										.enum([
											'afn',
											'eur',
											'all',
											'dzd',
											'usd',
											'aoa',
											'xcd',
											'ars',
											'amd',
											'awg',
											'aud',
											'azn',
											'bsd',
											'bhd',
											'bdt',
											'bbd',
											'byn',
											'bzd',
											'xof',
											'bmd',
											'inr',
											'btn',
											'bob',
											'bov',
											'bam',
											'bwp',
											'nok',
											'brl',
											'bnd',
											'bgn',
											'bif',
											'cve',
											'khr',
											'xaf',
											'cad',
											'kyd',
											'clp',
											'clf',
											'cny',
											'cop',
											'cou',
											'kmf',
											'cdf',
											'nzd',
											'crc',
											'hrk',
											'cup',
											'cuc',
											'ang',
											'czk',
											'dkk',
											'djf',
											'dop',
											'egp',
											'svc',
											'ern',
											'szl',
											'etb',
											'fkp',
											'fjd',
											'xpf',
											'gmd',
											'gel',
											'ghs',
											'gip',
											'gtq',
											'gbp',
											'gnf',
											'gyd',
											'htg',
											'hnl',
											'hkd',
											'huf',
											'isk',
											'idr',
											'xdr',
											'irr',
											'iqd',
											'ils',
											'jmd',
											'jpy',
											'jod',
											'kzt',
											'kes',
											'kpw',
											'krw',
											'kwd',
											'kgs',
											'lak',
											'lbp',
											'lsl',
											'zar',
											'lrd',
											'lyd',
											'chf',
											'mop',
											'mkd',
											'mga',
											'mwk',
											'myr',
											'mvr',
											'mru',
											'mur',
											'xua',
											'mxn',
											'mxv',
											'mdl',
											'mnt',
											'mad',
											'mzn',
											'mmk',
											'nad',
											'npr',
											'nio',
											'ngn',
											'omr',
											'pkr',
											'pab',
											'pgk',
											'pyg',
											'pen',
											'php',
											'pln',
											'qar',
											'ron',
											'rub',
											'rwf',
											'shp',
											'wst',
											'stn',
											'sar',
											'rsd',
											'scr',
											'sll',
											'sle',
											'sgd',
											'xsu',
											'sbd',
											'sos',
											'ssp',
											'lkr',
											'sdg',
											'srd',
											'sek',
											'che',
											'chw',
											'syp',
											'twd',
											'tjs',
											'tzs',
											'thb',
											'top',
											'ttd',
											'tnd',
											'try',
											'tmt',
											'ugx',
											'uah',
											'aed',
											'usn',
											'uyu',
											'uyi',
											'uyw',
											'uzs',
											'vuv',
											'ves',
											'ved',
											'vnd',
											'yer',
											'zmw',
											'zwl',
											'xba',
											'xbb',
											'xbc',
											'xbd',
											'xts',
											'xxx',
											'xau',
											'xpd',
											'xpt',
											'xag',
										])
										.optional(),
									display_name: z.string().optional(),
									name: z.string().optional(),
									type: z
										.enum(['bigcommerce', 'magento', 'shopify', 'woocommerce'])
										.optional(),
									url: z.string().optional(),
									helpdesk_integration_id: z.number().int().optional(),
									uuid: z.string().optional(),
									created_datetime: z.string().optional(),
									updated_datetime: z.string().nullable().optional(),
									deleted_datetime: z.string().nullable().optional(),
								})
								.strict()
								.optional(),
							shopper: z
								.object({
									id: z.number().int().optional(),
									external_id: z.string().optional(),
									helpdesk_customer_id: z.number().int().optional(),
									email_address: z.string().email().nullable().optional(),
									phone_number: z.string().nullable().optional(),
									first_name: z.string().nullable().optional(),
									middle_name: z.string().nullable().optional(),
									last_name: z.string().nullable().optional(),
									birthdate: z.string().nullable().optional(),
									status: z.enum(['tax_exempt', 'veteran']).optional(),
									accepts_marketing_email: z.boolean().optional(),
									accepts_marketing_sms: z.boolean().optional(),
									created_datetime: z.string().optional(),
									updated_datetime: z.string().nullable().optional(),
									deleted_datetime: z.string().nullable().optional(),
								})
								.strict()
								.optional(),
							orders: z
								.array(
									z
										.object({
											id: z.number().int().optional(),
											external_id: z.string().optional(),
											shopper_external_id: z.string().optional(),
											number: z.number().int().optional(),
											name: z.string().optional(),
											currency: z
												.enum([
													'afn',
													'eur',
													'all',
													'dzd',
													'usd',
													'aoa',
													'xcd',
													'ars',
													'amd',
													'awg',
													'aud',
													'azn',
													'bsd',
													'bhd',
													'bdt',
													'bbd',
													'byn',
													'bzd',
													'xof',
													'bmd',
													'inr',
													'btn',
													'bob',
													'bov',
													'bam',
													'bwp',
													'nok',
													'brl',
													'bnd',
													'bgn',
													'bif',
													'cve',
													'khr',
													'xaf',
													'cad',
													'kyd',
													'clp',
													'clf',
													'cny',
													'cop',
													'cou',
													'kmf',
													'cdf',
													'nzd',
													'crc',
													'hrk',
													'cup',
													'cuc',
													'ang',
													'czk',
													'dkk',
													'djf',
													'dop',
													'egp',
													'svc',
													'ern',
													'szl',
													'etb',
													'fkp',
													'fjd',
													'xpf',
													'gmd',
													'gel',
													'ghs',
													'gip',
													'gtq',
													'gbp',
													'gnf',
													'gyd',
													'htg',
													'hnl',
													'hkd',
													'huf',
													'isk',
													'idr',
													'xdr',
													'irr',
													'iqd',
													'ils',
													'jmd',
													'jpy',
													'jod',
													'kzt',
													'kes',
													'kpw',
													'krw',
													'kwd',
													'kgs',
													'lak',
													'lbp',
													'lsl',
													'zar',
													'lrd',
													'lyd',
													'chf',
													'mop',
													'mkd',
													'mga',
													'mwk',
													'myr',
													'mvr',
													'mru',
													'mur',
													'xua',
													'mxn',
													'mxv',
													'mdl',
													'mnt',
													'mad',
													'mzn',
													'mmk',
													'nad',
													'npr',
													'nio',
													'ngn',
													'omr',
													'pkr',
													'pab',
													'pgk',
													'pyg',
													'pen',
													'php',
													'pln',
													'qar',
													'ron',
													'rub',
													'rwf',
													'shp',
													'wst',
													'stn',
													'sar',
													'rsd',
													'scr',
													'sll',
													'sle',
													'sgd',
													'xsu',
													'sbd',
													'sos',
													'ssp',
													'lkr',
													'sdg',
													'srd',
													'sek',
													'che',
													'chw',
													'syp',
													'twd',
													'tjs',
													'tzs',
													'thb',
													'top',
													'ttd',
													'tnd',
													'try',
													'tmt',
													'ugx',
													'uah',
													'aed',
													'usn',
													'uyu',
													'uyi',
													'uyw',
													'uzs',
													'vuv',
													'ves',
													'ved',
													'vnd',
													'yer',
													'zmw',
													'zwl',
													'xba',
													'xbb',
													'xbc',
													'xbd',
													'xts',
													'xxx',
													'xau',
													'xpd',
													'xpt',
													'xag',
												])
												.optional(),
											discount_codes: z.array(z.string()).nullable().optional(),
											discount_amount: z.number().nullable().optional(),
											subtotal_amount: z.number().nullable().optional(),
											shipping_amount: z.number().nullable().optional(),
											tax_amount: z.number().nullable().optional(),
											total_amount: z.number().optional(),
											external_status: z.string().nullable().optional(),
											external_fulfillment_status: z
												.string()
												.nullable()
												.optional(),
											external_payment_status: z.string().nullable().optional(),
											status: z
												.enum([
													'partially_fulfilled',
													'completed',
													'canceled',
													'on_hold',
													'awaiting_fulfillment',
													'awaiting_payment',
													'scheduled',
													'order_pending',
												])
												.optional(),
											payment_status: z
												.enum([
													'refunded',
													'partially_refunded',
													'unpaid',
													'voided',
													'failed',
													'manual_verification_required',
													'customer_authentication_required',
													'paid',
													'declined',
													'authorized',
												])
												.optional(),
											billing_address: z
												.object({
													id: z.number().int().optional(),
													external_id: z.string().optional(),
													shopper_external_id: z.string().optional(),
													preferred: z.boolean().optional(),
													line_1: z.string().optional(),
													line_2: z.string().nullable().optional(),
													city: z.string().optional(),
													state: z.string().nullable().optional(),
													country: z.string().optional(),
													zip_code: z.string().optional(),
													first_name: z.string().optional(),
													last_name: z.string().optional(),
													phone_number: z.string().nullable().optional(),
													created_datetime: z.string().optional(),
													updated_datetime: z.string().nullable().optional(),
													deleted_datetime: z.string().nullable().optional(),
												})
												.strict()
												.optional(),
											shipping_address: z
												.object({
													id: z.number().int().optional(),
													external_id: z.string().optional(),
													shopper_external_id: z.string().optional(),
													preferred: z.boolean().optional(),
													line_1: z.string().optional(),
													line_2: z.string().nullable().optional(),
													city: z.string().optional(),
													state: z.string().nullable().optional(),
													country: z.string().optional(),
													zip_code: z.string().optional(),
													first_name: z.string().optional(),
													last_name: z.string().optional(),
													phone_number: z.string().nullable().optional(),
													created_datetime: z.string().optional(),
													updated_datetime: z.string().nullable().optional(),
													deleted_datetime: z.string().nullable().optional(),
												})
												.strict()
												.optional(),
											line_items: z
												.array(
													z
														.object({
															id: z.number().int().optional(),
															title: z.string().optional(),
															taxable: z.boolean().nullable().optional(),
															requires_shipping: z
																.boolean()
																.nullable()
																.optional(),
															unit_price: z.number().optional(),
															discount_amount: z.number().nullable().optional(),
															discount_type: z
																.enum(['percentage', 'fixed_amount'])
																.optional(),
															discount_reason: z.string().nullable().optional(),
															quantity: z.number().int().optional(),
															total_amount: z.number().optional(),
															product_options: z
																.record(z.string(), z.json())
																.nullable()
																.optional(),
															fulfilled_quantity: z
																.number()
																.int()
																.nullable()
																.optional(),
															created_datetime: z.string().optional(),
															updated_datetime: z
																.string()
																.nullable()
																.optional(),
															deleted_datetime: z
																.string()
																.nullable()
																.optional(),
														})
														.strict(),
												)
												.optional(),
											created_datetime: z.string().optional(),
											updated_datetime: z.string().nullable().optional(),
											deleted_datetime: z.string().nullable().optional(),
										})
										.strict(),
								)
								.optional(),
							addresses: z
								.array(
									z
										.object({
											id: z.number().int().optional(),
											external_id: z.string().optional(),
											shopper_external_id: z.string().optional(),
											preferred: z.boolean().optional(),
											line_1: z.string().optional(),
											line_2: z.string().nullable().optional(),
											city: z.string().optional(),
											state: z.string().nullable().optional(),
											country: z.string().optional(),
											zip_code: z.string().optional(),
											first_name: z.string().optional(),
											last_name: z.string().optional(),
											phone_number: z.string().nullable().optional(),
											created_datetime: z.string().optional(),
											updated_datetime: z.string().nullable().optional(),
											deleted_datetime: z.string().nullable().optional(),
										})
										.strict(),
								)
								.optional(),
						})
						.strict(),
				)
				.optional(),
		})
		.strict(),
	'customers.listCustomerCustomFieldsValues': z.array(
		CustomerCustomFieldWithValueSchema,
	),
	'customers.listCustomers': z.array(
		z
			.object({
				id: z.number().int().optional(),
				created_datetime: z.string().nullable().optional(),
				email: z.string().email().nullable().optional(),
				external_id: z.string().nullable().optional(),
				firstname: z.string().optional(),
				language: z
					.enum([
						'aa',
						'ab',
						'af',
						'ak',
						'sq',
						'am',
						'ar',
						'an',
						'hy',
						'as',
						'av',
						'ae',
						'ay',
						'az',
						'ba',
						'bm',
						'eu',
						'be',
						'bn',
						'bh',
						'bi',
						'bs',
						'br',
						'bg',
						'my',
						'ca',
						'ch',
						'ce',
						'zh',
						'cu',
						'cv',
						'kw',
						'co',
						'cr',
						'cs',
						'da',
						'dv',
						'nl',
						'dz',
						'en',
						'eo',
						'et',
						'ee',
						'fo',
						'fj',
						'fi',
						'fr',
						'fy',
						'ff',
						'ka',
						'de',
						'gd',
						'ga',
						'gl',
						'gv',
						'el',
						'gn',
						'gu',
						'ht',
						'ha',
						'he',
						'hz',
						'hi',
						'ho',
						'hr',
						'hu',
						'ig',
						'is',
						'io',
						'ii',
						'iu',
						'ie',
						'ia',
						'id',
						'ik',
						'it',
						'jv',
						'ja',
						'kl',
						'kn',
						'ks',
						'kr',
						'kk',
						'km',
						'ki',
						'rw',
						'ky',
						'kv',
						'kg',
						'ko',
						'kj',
						'ku',
						'lo',
						'la',
						'lv',
						'li',
						'ln',
						'lt',
						'lb',
						'lu',
						'lg',
						'mk',
						'mh',
						'ml',
						'mi',
						'mr',
						'ms',
						'mg',
						'mt',
						'mn',
						'na',
						'nv',
						'nr',
						'nd',
						'ng',
						'ne',
						'nn',
						'nb',
						'no',
						'ny',
						'oc',
						'oj',
						'or',
						'om',
						'os',
						'pa',
						'fa',
						'pi',
						'pl',
						'pt',
						'ps',
						'qu',
						'rc',
						'rm',
						'ro',
						'rn',
						'ru',
						'sg',
						'sa',
						'si',
						'sk',
						'sl',
						'se',
						'sm',
						'sn',
						'sd',
						'so',
						'st',
						'es',
						'sc',
						'sr',
						'ss',
						'su',
						'sw',
						'sv',
						'ty',
						'ta',
						'tt',
						'te',
						'tg',
						'tl',
						'th',
						'bo',
						'ti',
						'to',
						'tn',
						'ts',
						'tk',
						'tr',
						'tw',
						'ug',
						'uk',
						'ur',
						'uz',
						've',
						'vi',
						'vo',
						'cy',
						'wa',
						'wo',
						'xh',
						'yi',
						'yo',
						'za',
						'zu',
					])
					.optional(),
				lastname: z.string().optional(),
				name: z.string().nullable().optional(),
				timezone: z
					.enum([
						'Africa/Abidjan',
						'Africa/Accra',
						'Africa/Addis_Ababa',
						'Africa/Algiers',
						'Africa/Asmara',
						'Africa/Asmera',
						'Africa/Bamako',
						'Africa/Bangui',
						'Africa/Banjul',
						'Africa/Bissau',
						'Africa/Blantyre',
						'Africa/Brazzaville',
						'Africa/Bujumbura',
						'Africa/Cairo',
						'Africa/Casablanca',
						'Africa/Ceuta',
						'Africa/Conakry',
						'Africa/Dakar',
						'Africa/Dar_es_Salaam',
						'Africa/Djibouti',
						'Africa/Douala',
						'Africa/El_Aaiun',
						'Africa/Freetown',
						'Africa/Gaborone',
						'Africa/Harare',
						'Africa/Johannesburg',
						'Africa/Juba',
						'Africa/Kampala',
						'Africa/Khartoum',
						'Africa/Kigali',
						'Africa/Kinshasa',
						'Africa/Lagos',
						'Africa/Libreville',
						'Africa/Lome',
						'Africa/Luanda',
						'Africa/Lubumbashi',
						'Africa/Lusaka',
						'Africa/Malabo',
						'Africa/Maputo',
						'Africa/Maseru',
						'Africa/Mbabane',
						'Africa/Mogadishu',
						'Africa/Monrovia',
						'Africa/Nairobi',
						'Africa/Ndjamena',
						'Africa/Niamey',
						'Africa/Nouakchott',
						'Africa/Ouagadougou',
						'Africa/Porto-Novo',
						'Africa/Sao_Tome',
						'Africa/Timbuktu',
						'Africa/Tripoli',
						'Africa/Tunis',
						'Africa/Windhoek',
						'America/Adak',
						'America/Anchorage',
						'America/Anguilla',
						'America/Antigua',
						'America/Araguaina',
						'America/Argentina/Buenos_Aires',
						'America/Argentina/Catamarca',
						'America/Argentina/ComodRivadavia',
						'America/Argentina/Cordoba',
						'America/Argentina/Jujuy',
						'America/Argentina/La_Rioja',
						'America/Argentina/Mendoza',
						'America/Argentina/Rio_Gallegos',
						'America/Argentina/Salta',
						'America/Argentina/San_Juan',
						'America/Argentina/San_Luis',
						'America/Argentina/Tucuman',
						'America/Argentina/Ushuaia',
						'America/Aruba',
						'America/Asuncion',
						'America/Atikokan',
						'America/Atka',
						'America/Bahia',
						'America/Bahia_Banderas',
						'America/Barbados',
						'America/Belem',
						'America/Belize',
						'America/Blanc-Sablon',
						'America/Boa_Vista',
						'America/Bogota',
						'America/Boise',
						'America/Buenos_Aires',
						'America/Cambridge_Bay',
						'America/Campo_Grande',
						'America/Cancun',
						'America/Caracas',
						'America/Catamarca',
						'America/Cayenne',
						'America/Cayman',
						'America/Chicago',
						'America/Chihuahua',
						'America/Ciudad_Juarez',
						'America/Coral_Harbour',
						'America/Cordoba',
						'America/Costa_Rica',
						'America/Coyhaique',
						'America/Creston',
						'America/Cuiaba',
						'America/Curacao',
						'America/Danmarkshavn',
						'America/Dawson',
						'America/Dawson_Creek',
						'America/Denver',
						'America/Detroit',
						'America/Dominica',
						'America/Edmonton',
						'America/Eirunepe',
						'America/El_Salvador',
						'America/Ensenada',
						'America/Fort_Nelson',
						'America/Fort_Wayne',
						'America/Fortaleza',
						'America/Glace_Bay',
						'America/Godthab',
						'America/Goose_Bay',
						'America/Grand_Turk',
						'America/Grenada',
						'America/Guadeloupe',
						'America/Guatemala',
						'America/Guayaquil',
						'America/Guyana',
						'America/Halifax',
						'America/Havana',
						'America/Hermosillo',
						'America/Indiana/Indianapolis',
						'America/Indiana/Knox',
						'America/Indiana/Marengo',
						'America/Indiana/Petersburg',
						'America/Indiana/Tell_City',
						'America/Indiana/Vevay',
						'America/Indiana/Vincennes',
						'America/Indiana/Winamac',
						'America/Indianapolis',
						'America/Inuvik',
						'America/Iqaluit',
						'America/Jamaica',
						'America/Jujuy',
						'America/Juneau',
						'America/Kentucky/Louisville',
						'America/Kentucky/Monticello',
						'America/Knox_IN',
						'America/Kralendijk',
						'America/La_Paz',
						'America/Lima',
						'America/Los_Angeles',
						'America/Louisville',
						'America/Lower_Princes',
						'America/Maceio',
						'America/Managua',
						'America/Manaus',
						'America/Marigot',
						'America/Martinique',
						'America/Matamoros',
						'America/Mazatlan',
						'America/Mendoza',
						'America/Menominee',
						'America/Merida',
						'America/Metlakatla',
						'America/Mexico_City',
						'America/Miquelon',
						'America/Moncton',
						'America/Monterrey',
						'America/Montevideo',
						'America/Montreal',
						'America/Montserrat',
						'America/Nassau',
						'America/New_York',
						'America/Nipigon',
						'America/Nome',
						'America/Noronha',
						'America/North_Dakota/Beulah',
						'America/North_Dakota/Center',
						'America/North_Dakota/New_Salem',
						'America/Nuuk',
						'America/Ojinaga',
						'America/Panama',
						'America/Pangnirtung',
						'America/Paramaribo',
						'America/Phoenix',
						'America/Port-au-Prince',
						'America/Port_of_Spain',
						'America/Porto_Acre',
						'America/Porto_Velho',
						'America/Puerto_Rico',
						'America/Punta_Arenas',
						'America/Rainy_River',
						'America/Rankin_Inlet',
						'America/Recife',
						'America/Regina',
						'America/Resolute',
						'America/Rio_Branco',
						'America/Rosario',
						'America/Santa_Isabel',
						'America/Santarem',
						'America/Santiago',
						'America/Santo_Domingo',
						'America/Sao_Paulo',
						'America/Scoresbysund',
						'America/Shiprock',
						'America/Sitka',
						'America/St_Barthelemy',
						'America/St_Johns',
						'America/St_Kitts',
						'America/St_Lucia',
						'America/St_Thomas',
						'America/St_Vincent',
						'America/Swift_Current',
						'America/Tegucigalpa',
						'America/Thule',
						'America/Thunder_Bay',
						'America/Tijuana',
						'America/Toronto',
						'America/Tortola',
						'America/Vancouver',
						'America/Virgin',
						'America/Whitehorse',
						'America/Winnipeg',
						'America/Yakutat',
						'America/Yellowknife',
						'Antarctica/Casey',
						'Antarctica/Davis',
						'Antarctica/DumontDUrville',
						'Antarctica/Macquarie',
						'Antarctica/Mawson',
						'Antarctica/McMurdo',
						'Antarctica/Palmer',
						'Antarctica/Rothera',
						'Antarctica/South_Pole',
						'Antarctica/Syowa',
						'Antarctica/Troll',
						'Antarctica/Vostok',
						'Arctic/Longyearbyen',
						'Asia/Aden',
						'Asia/Almaty',
						'Asia/Amman',
						'Asia/Anadyr',
						'Asia/Aqtau',
						'Asia/Aqtobe',
						'Asia/Ashgabat',
						'Asia/Ashkhabad',
						'Asia/Atyrau',
						'Asia/Baghdad',
						'Asia/Bahrain',
						'Asia/Baku',
						'Asia/Bangkok',
						'Asia/Barnaul',
						'Asia/Beirut',
						'Asia/Bishkek',
						'Asia/Brunei',
						'Asia/Calcutta',
						'Asia/Chita',
						'Asia/Choibalsan',
						'Asia/Chongqing',
						'Asia/Chungking',
						'Asia/Colombo',
						'Asia/Dacca',
						'Asia/Damascus',
						'Asia/Dhaka',
						'Asia/Dili',
						'Asia/Dubai',
						'Asia/Dushanbe',
						'Asia/Famagusta',
						'Asia/Gaza',
						'Asia/Harbin',
						'Asia/Hebron',
						'Asia/Ho_Chi_Minh',
						'Asia/Hong_Kong',
						'Asia/Hovd',
						'Asia/Irkutsk',
						'Asia/Istanbul',
						'Asia/Jakarta',
						'Asia/Jayapura',
						'Asia/Jerusalem',
						'Asia/Kabul',
						'Asia/Kamchatka',
						'Asia/Karachi',
						'Asia/Kashgar',
						'Asia/Kathmandu',
						'Asia/Katmandu',
						'Asia/Khandyga',
						'Asia/Kolkata',
						'Asia/Krasnoyarsk',
						'Asia/Kuala_Lumpur',
						'Asia/Kuching',
						'Asia/Kuwait',
						'Asia/Macao',
						'Asia/Macau',
						'Asia/Magadan',
						'Asia/Makassar',
						'Asia/Manila',
						'Asia/Muscat',
						'Asia/Nicosia',
						'Asia/Novokuznetsk',
						'Asia/Novosibirsk',
						'Asia/Omsk',
						'Asia/Oral',
						'Asia/Phnom_Penh',
						'Asia/Pontianak',
						'Asia/Pyongyang',
						'Asia/Qatar',
						'Asia/Qostanay',
						'Asia/Qyzylorda',
						'Asia/Rangoon',
						'Asia/Riyadh',
						'Asia/Saigon',
						'Asia/Sakhalin',
						'Asia/Samarkand',
						'Asia/Seoul',
						'Asia/Shanghai',
						'Asia/Singapore',
						'Asia/Srednekolymsk',
						'Asia/Taipei',
						'Asia/Tashkent',
						'Asia/Tbilisi',
						'Asia/Tehran',
						'Asia/Tel_Aviv',
						'Asia/Thimbu',
						'Asia/Thimphu',
						'Asia/Tokyo',
						'Asia/Tomsk',
						'Asia/Ujung_Pandang',
						'Asia/Ulaanbaatar',
						'Asia/Ulan_Bator',
						'Asia/Urumqi',
						'Asia/Ust-Nera',
						'Asia/Vientiane',
						'Asia/Vladivostok',
						'Asia/Yakutsk',
						'Asia/Yangon',
						'Asia/Yekaterinburg',
						'Asia/Yerevan',
						'Atlantic/Azores',
						'Atlantic/Bermuda',
						'Atlantic/Canary',
						'Atlantic/Cape_Verde',
						'Atlantic/Faeroe',
						'Atlantic/Faroe',
						'Atlantic/Jan_Mayen',
						'Atlantic/Madeira',
						'Atlantic/Reykjavik',
						'Atlantic/South_Georgia',
						'Atlantic/St_Helena',
						'Atlantic/Stanley',
						'Australia/ACT',
						'Australia/Adelaide',
						'Australia/Brisbane',
						'Australia/Broken_Hill',
						'Australia/Canberra',
						'Australia/Currie',
						'Australia/Darwin',
						'Australia/Eucla',
						'Australia/Hobart',
						'Australia/LHI',
						'Australia/Lindeman',
						'Australia/Lord_Howe',
						'Australia/Melbourne',
						'Australia/NSW',
						'Australia/North',
						'Australia/Perth',
						'Australia/Queensland',
						'Australia/South',
						'Australia/Sydney',
						'Australia/Tasmania',
						'Australia/Victoria',
						'Australia/West',
						'Australia/Yancowinna',
						'Brazil/Acre',
						'Brazil/DeNoronha',
						'Brazil/East',
						'Brazil/West',
						'CET',
						'CST6CDT',
						'Canada/Atlantic',
						'Canada/Central',
						'Canada/Eastern',
						'Canada/Mountain',
						'Canada/Newfoundland',
						'Canada/Pacific',
						'Canada/Saskatchewan',
						'Canada/Yukon',
						'Chile/Continental',
						'Chile/EasterIsland',
						'Cuba',
						'EET',
						'EST',
						'EST5EDT',
						'Egypt',
						'Eire',
						'Etc/GMT',
						'Etc/GMT+0',
						'Etc/GMT+1',
						'Etc/GMT+10',
						'Etc/GMT+11',
						'Etc/GMT+12',
						'Etc/GMT+2',
						'Etc/GMT+3',
						'Etc/GMT+4',
						'Etc/GMT+5',
						'Etc/GMT+6',
						'Etc/GMT+7',
						'Etc/GMT+8',
						'Etc/GMT+9',
						'Etc/GMT-0',
						'Etc/GMT-1',
						'Etc/GMT-10',
						'Etc/GMT-11',
						'Etc/GMT-12',
						'Etc/GMT-13',
						'Etc/GMT-14',
						'Etc/GMT-2',
						'Etc/GMT-3',
						'Etc/GMT-4',
						'Etc/GMT-5',
						'Etc/GMT-6',
						'Etc/GMT-7',
						'Etc/GMT-8',
						'Etc/GMT-9',
						'Etc/GMT0',
						'Etc/Greenwich',
						'Etc/UCT',
						'Etc/UTC',
						'Etc/Universal',
						'Etc/Zulu',
						'Europe/Amsterdam',
						'Europe/Andorra',
						'Europe/Astrakhan',
						'Europe/Athens',
						'Europe/Belfast',
						'Europe/Belgrade',
						'Europe/Berlin',
						'Europe/Bratislava',
						'Europe/Brussels',
						'Europe/Bucharest',
						'Europe/Budapest',
						'Europe/Busingen',
						'Europe/Chisinau',
						'Europe/Copenhagen',
						'Europe/Dublin',
						'Europe/Gibraltar',
						'Europe/Guernsey',
						'Europe/Helsinki',
						'Europe/Isle_of_Man',
						'Europe/Istanbul',
						'Europe/Jersey',
						'Europe/Kaliningrad',
						'Europe/Kiev',
						'Europe/Kirov',
						'Europe/Kyiv',
						'Europe/Lisbon',
						'Europe/Ljubljana',
						'Europe/London',
						'Europe/Luxembourg',
						'Europe/Madrid',
						'Europe/Malta',
						'Europe/Mariehamn',
						'Europe/Minsk',
						'Europe/Monaco',
						'Europe/Moscow',
						'Europe/Nicosia',
						'Europe/Oslo',
						'Europe/Paris',
						'Europe/Podgorica',
						'Europe/Prague',
						'Europe/Riga',
						'Europe/Rome',
						'Europe/Samara',
						'Europe/San_Marino',
						'Europe/Sarajevo',
						'Europe/Saratov',
						'Europe/Simferopol',
						'Europe/Skopje',
						'Europe/Sofia',
						'Europe/Stockholm',
						'Europe/Tallinn',
						'Europe/Tirane',
						'Europe/Tiraspol',
						'Europe/Ulyanovsk',
						'Europe/Uzhgorod',
						'Europe/Vaduz',
						'Europe/Vatican',
						'Europe/Vienna',
						'Europe/Vilnius',
						'Europe/Volgograd',
						'Europe/Warsaw',
						'Europe/Zagreb',
						'Europe/Zaporozhye',
						'Europe/Zurich',
						'GB',
						'GB-Eire',
						'GMT',
						'GMT+0',
						'GMT-0',
						'GMT0',
						'Greenwich',
						'HST',
						'Hongkong',
						'Iceland',
						'Indian/Antananarivo',
						'Indian/Chagos',
						'Indian/Christmas',
						'Indian/Cocos',
						'Indian/Comoro',
						'Indian/Kerguelen',
						'Indian/Mahe',
						'Indian/Maldives',
						'Indian/Mauritius',
						'Indian/Mayotte',
						'Indian/Reunion',
						'Iran',
						'Israel',
						'Jamaica',
						'Japan',
						'Kwajalein',
						'Libya',
						'MET',
						'MST',
						'MST7MDT',
						'Mexico/BajaNorte',
						'Mexico/BajaSur',
						'Mexico/General',
						'NZ',
						'NZ-CHAT',
						'Navajo',
						'PRC',
						'PST8PDT',
						'Pacific/Apia',
						'Pacific/Auckland',
						'Pacific/Bougainville',
						'Pacific/Chatham',
						'Pacific/Chuuk',
						'Pacific/Easter',
						'Pacific/Efate',
						'Pacific/Enderbury',
						'Pacific/Fakaofo',
						'Pacific/Fiji',
						'Pacific/Funafuti',
						'Pacific/Galapagos',
						'Pacific/Gambier',
						'Pacific/Guadalcanal',
						'Pacific/Guam',
						'Pacific/Honolulu',
						'Pacific/Johnston',
						'Pacific/Kanton',
						'Pacific/Kiritimati',
						'Pacific/Kosrae',
						'Pacific/Kwajalein',
						'Pacific/Majuro',
						'Pacific/Marquesas',
						'Pacific/Midway',
						'Pacific/Nauru',
						'Pacific/Niue',
						'Pacific/Norfolk',
						'Pacific/Noumea',
						'Pacific/Pago_Pago',
						'Pacific/Palau',
						'Pacific/Pitcairn',
						'Pacific/Pohnpei',
						'Pacific/Ponape',
						'Pacific/Port_Moresby',
						'Pacific/Rarotonga',
						'Pacific/Saipan',
						'Pacific/Samoa',
						'Pacific/Tahiti',
						'Pacific/Tarawa',
						'Pacific/Tongatapu',
						'Pacific/Truk',
						'Pacific/Wake',
						'Pacific/Wallis',
						'Pacific/Yap',
						'Poland',
						'Portugal',
						'ROC',
						'ROK',
						'Singapore',
						'Turkey',
						'UCT',
						'US/Alaska',
						'US/Aleutian',
						'US/Arizona',
						'US/Central',
						'US/East-Indiana',
						'US/Eastern',
						'US/Hawaii',
						'US/Indiana-Starke',
						'US/Michigan',
						'US/Mountain',
						'US/Pacific',
						'US/Samoa',
						'UTC',
						'Universal',
						'W-SU',
						'WET',
						'Zulu',
					])
					.optional(),
				updated_datetime: z.string().nullable().optional(),
			})
			.strict(),
	),
	'customers.mergeCustomers': z
		.object({
			id: z.number().int().optional(),
			channels: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
						})
						.strict(),
				)
				.optional(),
			created_datetime: z.string().nullable().optional(),
			email: z.string().email().nullable().optional(),
			external_id: z.string().nullable().optional(),
			firstname: z.string().optional(),
			integrations: z.record(z.string(), z.json()).optional(),
			language: z
				.enum([
					'aa',
					'ab',
					'af',
					'ak',
					'sq',
					'am',
					'ar',
					'an',
					'hy',
					'as',
					'av',
					'ae',
					'ay',
					'az',
					'ba',
					'bm',
					'eu',
					'be',
					'bn',
					'bh',
					'bi',
					'bs',
					'br',
					'bg',
					'my',
					'ca',
					'ch',
					'ce',
					'zh',
					'cu',
					'cv',
					'kw',
					'co',
					'cr',
					'cs',
					'da',
					'dv',
					'nl',
					'dz',
					'en',
					'eo',
					'et',
					'ee',
					'fo',
					'fj',
					'fi',
					'fr',
					'fy',
					'ff',
					'ka',
					'de',
					'gd',
					'ga',
					'gl',
					'gv',
					'el',
					'gn',
					'gu',
					'ht',
					'ha',
					'he',
					'hz',
					'hi',
					'ho',
					'hr',
					'hu',
					'ig',
					'is',
					'io',
					'ii',
					'iu',
					'ie',
					'ia',
					'id',
					'ik',
					'it',
					'jv',
					'ja',
					'kl',
					'kn',
					'ks',
					'kr',
					'kk',
					'km',
					'ki',
					'rw',
					'ky',
					'kv',
					'kg',
					'ko',
					'kj',
					'ku',
					'lo',
					'la',
					'lv',
					'li',
					'ln',
					'lt',
					'lb',
					'lu',
					'lg',
					'mk',
					'mh',
					'ml',
					'mi',
					'mr',
					'ms',
					'mg',
					'mt',
					'mn',
					'na',
					'nv',
					'nr',
					'nd',
					'ng',
					'ne',
					'nn',
					'nb',
					'no',
					'ny',
					'oc',
					'oj',
					'or',
					'om',
					'os',
					'pa',
					'fa',
					'pi',
					'pl',
					'pt',
					'ps',
					'qu',
					'rc',
					'rm',
					'ro',
					'rn',
					'ru',
					'sg',
					'sa',
					'si',
					'sk',
					'sl',
					'se',
					'sm',
					'sn',
					'sd',
					'so',
					'st',
					'es',
					'sc',
					'sr',
					'ss',
					'su',
					'sw',
					'sv',
					'ty',
					'ta',
					'tt',
					'te',
					'tg',
					'tl',
					'th',
					'bo',
					'ti',
					'to',
					'tn',
					'ts',
					'tk',
					'tr',
					'tw',
					'ug',
					'uk',
					'ur',
					'uz',
					've',
					'vi',
					'vo',
					'cy',
					'wa',
					'wo',
					'xh',
					'yi',
					'yo',
					'za',
					'zu',
				])
				.optional(),
			lastname: z.string().optional(),
			name: z.string().nullable().optional(),
			note: z.string().nullable().optional(),
			timezone: z
				.enum([
					'Africa/Abidjan',
					'Africa/Accra',
					'Africa/Addis_Ababa',
					'Africa/Algiers',
					'Africa/Asmara',
					'Africa/Asmera',
					'Africa/Bamako',
					'Africa/Bangui',
					'Africa/Banjul',
					'Africa/Bissau',
					'Africa/Blantyre',
					'Africa/Brazzaville',
					'Africa/Bujumbura',
					'Africa/Cairo',
					'Africa/Casablanca',
					'Africa/Ceuta',
					'Africa/Conakry',
					'Africa/Dakar',
					'Africa/Dar_es_Salaam',
					'Africa/Djibouti',
					'Africa/Douala',
					'Africa/El_Aaiun',
					'Africa/Freetown',
					'Africa/Gaborone',
					'Africa/Harare',
					'Africa/Johannesburg',
					'Africa/Juba',
					'Africa/Kampala',
					'Africa/Khartoum',
					'Africa/Kigali',
					'Africa/Kinshasa',
					'Africa/Lagos',
					'Africa/Libreville',
					'Africa/Lome',
					'Africa/Luanda',
					'Africa/Lubumbashi',
					'Africa/Lusaka',
					'Africa/Malabo',
					'Africa/Maputo',
					'Africa/Maseru',
					'Africa/Mbabane',
					'Africa/Mogadishu',
					'Africa/Monrovia',
					'Africa/Nairobi',
					'Africa/Ndjamena',
					'Africa/Niamey',
					'Africa/Nouakchott',
					'Africa/Ouagadougou',
					'Africa/Porto-Novo',
					'Africa/Sao_Tome',
					'Africa/Timbuktu',
					'Africa/Tripoli',
					'Africa/Tunis',
					'Africa/Windhoek',
					'America/Adak',
					'America/Anchorage',
					'America/Anguilla',
					'America/Antigua',
					'America/Araguaina',
					'America/Argentina/Buenos_Aires',
					'America/Argentina/Catamarca',
					'America/Argentina/ComodRivadavia',
					'America/Argentina/Cordoba',
					'America/Argentina/Jujuy',
					'America/Argentina/La_Rioja',
					'America/Argentina/Mendoza',
					'America/Argentina/Rio_Gallegos',
					'America/Argentina/Salta',
					'America/Argentina/San_Juan',
					'America/Argentina/San_Luis',
					'America/Argentina/Tucuman',
					'America/Argentina/Ushuaia',
					'America/Aruba',
					'America/Asuncion',
					'America/Atikokan',
					'America/Atka',
					'America/Bahia',
					'America/Bahia_Banderas',
					'America/Barbados',
					'America/Belem',
					'America/Belize',
					'America/Blanc-Sablon',
					'America/Boa_Vista',
					'America/Bogota',
					'America/Boise',
					'America/Buenos_Aires',
					'America/Cambridge_Bay',
					'America/Campo_Grande',
					'America/Cancun',
					'America/Caracas',
					'America/Catamarca',
					'America/Cayenne',
					'America/Cayman',
					'America/Chicago',
					'America/Chihuahua',
					'America/Ciudad_Juarez',
					'America/Coral_Harbour',
					'America/Cordoba',
					'America/Costa_Rica',
					'America/Coyhaique',
					'America/Creston',
					'America/Cuiaba',
					'America/Curacao',
					'America/Danmarkshavn',
					'America/Dawson',
					'America/Dawson_Creek',
					'America/Denver',
					'America/Detroit',
					'America/Dominica',
					'America/Edmonton',
					'America/Eirunepe',
					'America/El_Salvador',
					'America/Ensenada',
					'America/Fort_Nelson',
					'America/Fort_Wayne',
					'America/Fortaleza',
					'America/Glace_Bay',
					'America/Godthab',
					'America/Goose_Bay',
					'America/Grand_Turk',
					'America/Grenada',
					'America/Guadeloupe',
					'America/Guatemala',
					'America/Guayaquil',
					'America/Guyana',
					'America/Halifax',
					'America/Havana',
					'America/Hermosillo',
					'America/Indiana/Indianapolis',
					'America/Indiana/Knox',
					'America/Indiana/Marengo',
					'America/Indiana/Petersburg',
					'America/Indiana/Tell_City',
					'America/Indiana/Vevay',
					'America/Indiana/Vincennes',
					'America/Indiana/Winamac',
					'America/Indianapolis',
					'America/Inuvik',
					'America/Iqaluit',
					'America/Jamaica',
					'America/Jujuy',
					'America/Juneau',
					'America/Kentucky/Louisville',
					'America/Kentucky/Monticello',
					'America/Knox_IN',
					'America/Kralendijk',
					'America/La_Paz',
					'America/Lima',
					'America/Los_Angeles',
					'America/Louisville',
					'America/Lower_Princes',
					'America/Maceio',
					'America/Managua',
					'America/Manaus',
					'America/Marigot',
					'America/Martinique',
					'America/Matamoros',
					'America/Mazatlan',
					'America/Mendoza',
					'America/Menominee',
					'America/Merida',
					'America/Metlakatla',
					'America/Mexico_City',
					'America/Miquelon',
					'America/Moncton',
					'America/Monterrey',
					'America/Montevideo',
					'America/Montreal',
					'America/Montserrat',
					'America/Nassau',
					'America/New_York',
					'America/Nipigon',
					'America/Nome',
					'America/Noronha',
					'America/North_Dakota/Beulah',
					'America/North_Dakota/Center',
					'America/North_Dakota/New_Salem',
					'America/Nuuk',
					'America/Ojinaga',
					'America/Panama',
					'America/Pangnirtung',
					'America/Paramaribo',
					'America/Phoenix',
					'America/Port-au-Prince',
					'America/Port_of_Spain',
					'America/Porto_Acre',
					'America/Porto_Velho',
					'America/Puerto_Rico',
					'America/Punta_Arenas',
					'America/Rainy_River',
					'America/Rankin_Inlet',
					'America/Recife',
					'America/Regina',
					'America/Resolute',
					'America/Rio_Branco',
					'America/Rosario',
					'America/Santa_Isabel',
					'America/Santarem',
					'America/Santiago',
					'America/Santo_Domingo',
					'America/Sao_Paulo',
					'America/Scoresbysund',
					'America/Shiprock',
					'America/Sitka',
					'America/St_Barthelemy',
					'America/St_Johns',
					'America/St_Kitts',
					'America/St_Lucia',
					'America/St_Thomas',
					'America/St_Vincent',
					'America/Swift_Current',
					'America/Tegucigalpa',
					'America/Thule',
					'America/Thunder_Bay',
					'America/Tijuana',
					'America/Toronto',
					'America/Tortola',
					'America/Vancouver',
					'America/Virgin',
					'America/Whitehorse',
					'America/Winnipeg',
					'America/Yakutat',
					'America/Yellowknife',
					'Antarctica/Casey',
					'Antarctica/Davis',
					'Antarctica/DumontDUrville',
					'Antarctica/Macquarie',
					'Antarctica/Mawson',
					'Antarctica/McMurdo',
					'Antarctica/Palmer',
					'Antarctica/Rothera',
					'Antarctica/South_Pole',
					'Antarctica/Syowa',
					'Antarctica/Troll',
					'Antarctica/Vostok',
					'Arctic/Longyearbyen',
					'Asia/Aden',
					'Asia/Almaty',
					'Asia/Amman',
					'Asia/Anadyr',
					'Asia/Aqtau',
					'Asia/Aqtobe',
					'Asia/Ashgabat',
					'Asia/Ashkhabad',
					'Asia/Atyrau',
					'Asia/Baghdad',
					'Asia/Bahrain',
					'Asia/Baku',
					'Asia/Bangkok',
					'Asia/Barnaul',
					'Asia/Beirut',
					'Asia/Bishkek',
					'Asia/Brunei',
					'Asia/Calcutta',
					'Asia/Chita',
					'Asia/Choibalsan',
					'Asia/Chongqing',
					'Asia/Chungking',
					'Asia/Colombo',
					'Asia/Dacca',
					'Asia/Damascus',
					'Asia/Dhaka',
					'Asia/Dili',
					'Asia/Dubai',
					'Asia/Dushanbe',
					'Asia/Famagusta',
					'Asia/Gaza',
					'Asia/Harbin',
					'Asia/Hebron',
					'Asia/Ho_Chi_Minh',
					'Asia/Hong_Kong',
					'Asia/Hovd',
					'Asia/Irkutsk',
					'Asia/Istanbul',
					'Asia/Jakarta',
					'Asia/Jayapura',
					'Asia/Jerusalem',
					'Asia/Kabul',
					'Asia/Kamchatka',
					'Asia/Karachi',
					'Asia/Kashgar',
					'Asia/Kathmandu',
					'Asia/Katmandu',
					'Asia/Khandyga',
					'Asia/Kolkata',
					'Asia/Krasnoyarsk',
					'Asia/Kuala_Lumpur',
					'Asia/Kuching',
					'Asia/Kuwait',
					'Asia/Macao',
					'Asia/Macau',
					'Asia/Magadan',
					'Asia/Makassar',
					'Asia/Manila',
					'Asia/Muscat',
					'Asia/Nicosia',
					'Asia/Novokuznetsk',
					'Asia/Novosibirsk',
					'Asia/Omsk',
					'Asia/Oral',
					'Asia/Phnom_Penh',
					'Asia/Pontianak',
					'Asia/Pyongyang',
					'Asia/Qatar',
					'Asia/Qostanay',
					'Asia/Qyzylorda',
					'Asia/Rangoon',
					'Asia/Riyadh',
					'Asia/Saigon',
					'Asia/Sakhalin',
					'Asia/Samarkand',
					'Asia/Seoul',
					'Asia/Shanghai',
					'Asia/Singapore',
					'Asia/Srednekolymsk',
					'Asia/Taipei',
					'Asia/Tashkent',
					'Asia/Tbilisi',
					'Asia/Tehran',
					'Asia/Tel_Aviv',
					'Asia/Thimbu',
					'Asia/Thimphu',
					'Asia/Tokyo',
					'Asia/Tomsk',
					'Asia/Ujung_Pandang',
					'Asia/Ulaanbaatar',
					'Asia/Ulan_Bator',
					'Asia/Urumqi',
					'Asia/Ust-Nera',
					'Asia/Vientiane',
					'Asia/Vladivostok',
					'Asia/Yakutsk',
					'Asia/Yangon',
					'Asia/Yekaterinburg',
					'Asia/Yerevan',
					'Atlantic/Azores',
					'Atlantic/Bermuda',
					'Atlantic/Canary',
					'Atlantic/Cape_Verde',
					'Atlantic/Faeroe',
					'Atlantic/Faroe',
					'Atlantic/Jan_Mayen',
					'Atlantic/Madeira',
					'Atlantic/Reykjavik',
					'Atlantic/South_Georgia',
					'Atlantic/St_Helena',
					'Atlantic/Stanley',
					'Australia/ACT',
					'Australia/Adelaide',
					'Australia/Brisbane',
					'Australia/Broken_Hill',
					'Australia/Canberra',
					'Australia/Currie',
					'Australia/Darwin',
					'Australia/Eucla',
					'Australia/Hobart',
					'Australia/LHI',
					'Australia/Lindeman',
					'Australia/Lord_Howe',
					'Australia/Melbourne',
					'Australia/NSW',
					'Australia/North',
					'Australia/Perth',
					'Australia/Queensland',
					'Australia/South',
					'Australia/Sydney',
					'Australia/Tasmania',
					'Australia/Victoria',
					'Australia/West',
					'Australia/Yancowinna',
					'Brazil/Acre',
					'Brazil/DeNoronha',
					'Brazil/East',
					'Brazil/West',
					'CET',
					'CST6CDT',
					'Canada/Atlantic',
					'Canada/Central',
					'Canada/Eastern',
					'Canada/Mountain',
					'Canada/Newfoundland',
					'Canada/Pacific',
					'Canada/Saskatchewan',
					'Canada/Yukon',
					'Chile/Continental',
					'Chile/EasterIsland',
					'Cuba',
					'EET',
					'EST',
					'EST5EDT',
					'Egypt',
					'Eire',
					'Etc/GMT',
					'Etc/GMT+0',
					'Etc/GMT+1',
					'Etc/GMT+10',
					'Etc/GMT+11',
					'Etc/GMT+12',
					'Etc/GMT+2',
					'Etc/GMT+3',
					'Etc/GMT+4',
					'Etc/GMT+5',
					'Etc/GMT+6',
					'Etc/GMT+7',
					'Etc/GMT+8',
					'Etc/GMT+9',
					'Etc/GMT-0',
					'Etc/GMT-1',
					'Etc/GMT-10',
					'Etc/GMT-11',
					'Etc/GMT-12',
					'Etc/GMT-13',
					'Etc/GMT-14',
					'Etc/GMT-2',
					'Etc/GMT-3',
					'Etc/GMT-4',
					'Etc/GMT-5',
					'Etc/GMT-6',
					'Etc/GMT-7',
					'Etc/GMT-8',
					'Etc/GMT-9',
					'Etc/GMT0',
					'Etc/Greenwich',
					'Etc/UCT',
					'Etc/UTC',
					'Etc/Universal',
					'Etc/Zulu',
					'Europe/Amsterdam',
					'Europe/Andorra',
					'Europe/Astrakhan',
					'Europe/Athens',
					'Europe/Belfast',
					'Europe/Belgrade',
					'Europe/Berlin',
					'Europe/Bratislava',
					'Europe/Brussels',
					'Europe/Bucharest',
					'Europe/Budapest',
					'Europe/Busingen',
					'Europe/Chisinau',
					'Europe/Copenhagen',
					'Europe/Dublin',
					'Europe/Gibraltar',
					'Europe/Guernsey',
					'Europe/Helsinki',
					'Europe/Isle_of_Man',
					'Europe/Istanbul',
					'Europe/Jersey',
					'Europe/Kaliningrad',
					'Europe/Kiev',
					'Europe/Kirov',
					'Europe/Kyiv',
					'Europe/Lisbon',
					'Europe/Ljubljana',
					'Europe/London',
					'Europe/Luxembourg',
					'Europe/Madrid',
					'Europe/Malta',
					'Europe/Mariehamn',
					'Europe/Minsk',
					'Europe/Monaco',
					'Europe/Moscow',
					'Europe/Nicosia',
					'Europe/Oslo',
					'Europe/Paris',
					'Europe/Podgorica',
					'Europe/Prague',
					'Europe/Riga',
					'Europe/Rome',
					'Europe/Samara',
					'Europe/San_Marino',
					'Europe/Sarajevo',
					'Europe/Saratov',
					'Europe/Simferopol',
					'Europe/Skopje',
					'Europe/Sofia',
					'Europe/Stockholm',
					'Europe/Tallinn',
					'Europe/Tirane',
					'Europe/Tiraspol',
					'Europe/Ulyanovsk',
					'Europe/Uzhgorod',
					'Europe/Vaduz',
					'Europe/Vatican',
					'Europe/Vienna',
					'Europe/Vilnius',
					'Europe/Volgograd',
					'Europe/Warsaw',
					'Europe/Zagreb',
					'Europe/Zaporozhye',
					'Europe/Zurich',
					'GB',
					'GB-Eire',
					'GMT',
					'GMT+0',
					'GMT-0',
					'GMT0',
					'Greenwich',
					'HST',
					'Hongkong',
					'Iceland',
					'Indian/Antananarivo',
					'Indian/Chagos',
					'Indian/Christmas',
					'Indian/Cocos',
					'Indian/Comoro',
					'Indian/Kerguelen',
					'Indian/Mahe',
					'Indian/Maldives',
					'Indian/Mauritius',
					'Indian/Mayotte',
					'Indian/Reunion',
					'Iran',
					'Israel',
					'Jamaica',
					'Japan',
					'Kwajalein',
					'Libya',
					'MET',
					'MST',
					'MST7MDT',
					'Mexico/BajaNorte',
					'Mexico/BajaSur',
					'Mexico/General',
					'NZ',
					'NZ-CHAT',
					'Navajo',
					'PRC',
					'PST8PDT',
					'Pacific/Apia',
					'Pacific/Auckland',
					'Pacific/Bougainville',
					'Pacific/Chatham',
					'Pacific/Chuuk',
					'Pacific/Easter',
					'Pacific/Efate',
					'Pacific/Enderbury',
					'Pacific/Fakaofo',
					'Pacific/Fiji',
					'Pacific/Funafuti',
					'Pacific/Galapagos',
					'Pacific/Gambier',
					'Pacific/Guadalcanal',
					'Pacific/Guam',
					'Pacific/Honolulu',
					'Pacific/Johnston',
					'Pacific/Kanton',
					'Pacific/Kiritimati',
					'Pacific/Kosrae',
					'Pacific/Kwajalein',
					'Pacific/Majuro',
					'Pacific/Marquesas',
					'Pacific/Midway',
					'Pacific/Nauru',
					'Pacific/Niue',
					'Pacific/Norfolk',
					'Pacific/Noumea',
					'Pacific/Pago_Pago',
					'Pacific/Palau',
					'Pacific/Pitcairn',
					'Pacific/Pohnpei',
					'Pacific/Ponape',
					'Pacific/Port_Moresby',
					'Pacific/Rarotonga',
					'Pacific/Saipan',
					'Pacific/Samoa',
					'Pacific/Tahiti',
					'Pacific/Tarawa',
					'Pacific/Tongatapu',
					'Pacific/Truk',
					'Pacific/Wake',
					'Pacific/Wallis',
					'Pacific/Yap',
					'Poland',
					'Portugal',
					'ROC',
					'ROK',
					'Singapore',
					'Turkey',
					'UCT',
					'US/Alaska',
					'US/Aleutian',
					'US/Arizona',
					'US/Central',
					'US/East-Indiana',
					'US/Eastern',
					'US/Hawaii',
					'US/Indiana-Starke',
					'US/Michigan',
					'US/Mountain',
					'US/Pacific',
					'US/Samoa',
					'UTC',
					'Universal',
					'W-SU',
					'WET',
					'Zulu',
				])
				.optional(),
			updated_datetime: z.string().nullable().optional(),
			external_data: z
				.record(z.string(), z.record(z.string(), z.json()))
				.optional(),
			ecommerce_data: z
				.record(
					z.string(),
					z
						.object({
							store: z
								.object({
									id: z.number().int().optional(),
									currencies: z
										.array(
											z.enum([
												'afn',
												'eur',
												'all',
												'dzd',
												'usd',
												'aoa',
												'xcd',
												'ars',
												'amd',
												'awg',
												'aud',
												'azn',
												'bsd',
												'bhd',
												'bdt',
												'bbd',
												'byn',
												'bzd',
												'xof',
												'bmd',
												'inr',
												'btn',
												'bob',
												'bov',
												'bam',
												'bwp',
												'nok',
												'brl',
												'bnd',
												'bgn',
												'bif',
												'cve',
												'khr',
												'xaf',
												'cad',
												'kyd',
												'clp',
												'clf',
												'cny',
												'cop',
												'cou',
												'kmf',
												'cdf',
												'nzd',
												'crc',
												'hrk',
												'cup',
												'cuc',
												'ang',
												'czk',
												'dkk',
												'djf',
												'dop',
												'egp',
												'svc',
												'ern',
												'szl',
												'etb',
												'fkp',
												'fjd',
												'xpf',
												'gmd',
												'gel',
												'ghs',
												'gip',
												'gtq',
												'gbp',
												'gnf',
												'gyd',
												'htg',
												'hnl',
												'hkd',
												'huf',
												'isk',
												'idr',
												'xdr',
												'irr',
												'iqd',
												'ils',
												'jmd',
												'jpy',
												'jod',
												'kzt',
												'kes',
												'kpw',
												'krw',
												'kwd',
												'kgs',
												'lak',
												'lbp',
												'lsl',
												'zar',
												'lrd',
												'lyd',
												'chf',
												'mop',
												'mkd',
												'mga',
												'mwk',
												'myr',
												'mvr',
												'mru',
												'mur',
												'xua',
												'mxn',
												'mxv',
												'mdl',
												'mnt',
												'mad',
												'mzn',
												'mmk',
												'nad',
												'npr',
												'nio',
												'ngn',
												'omr',
												'pkr',
												'pab',
												'pgk',
												'pyg',
												'pen',
												'php',
												'pln',
												'qar',
												'ron',
												'rub',
												'rwf',
												'shp',
												'wst',
												'stn',
												'sar',
												'rsd',
												'scr',
												'sll',
												'sle',
												'sgd',
												'xsu',
												'sbd',
												'sos',
												'ssp',
												'lkr',
												'sdg',
												'srd',
												'sek',
												'che',
												'chw',
												'syp',
												'twd',
												'tjs',
												'tzs',
												'thb',
												'top',
												'ttd',
												'tnd',
												'try',
												'tmt',
												'ugx',
												'uah',
												'aed',
												'usn',
												'uyu',
												'uyi',
												'uyw',
												'uzs',
												'vuv',
												'ves',
												'ved',
												'vnd',
												'yer',
												'zmw',
												'zwl',
												'xba',
												'xbb',
												'xbc',
												'xbd',
												'xts',
												'xxx',
												'xau',
												'xpd',
												'xpt',
												'xag',
											]),
										)
										.optional(),
									default_currency: z
										.enum([
											'afn',
											'eur',
											'all',
											'dzd',
											'usd',
											'aoa',
											'xcd',
											'ars',
											'amd',
											'awg',
											'aud',
											'azn',
											'bsd',
											'bhd',
											'bdt',
											'bbd',
											'byn',
											'bzd',
											'xof',
											'bmd',
											'inr',
											'btn',
											'bob',
											'bov',
											'bam',
											'bwp',
											'nok',
											'brl',
											'bnd',
											'bgn',
											'bif',
											'cve',
											'khr',
											'xaf',
											'cad',
											'kyd',
											'clp',
											'clf',
											'cny',
											'cop',
											'cou',
											'kmf',
											'cdf',
											'nzd',
											'crc',
											'hrk',
											'cup',
											'cuc',
											'ang',
											'czk',
											'dkk',
											'djf',
											'dop',
											'egp',
											'svc',
											'ern',
											'szl',
											'etb',
											'fkp',
											'fjd',
											'xpf',
											'gmd',
											'gel',
											'ghs',
											'gip',
											'gtq',
											'gbp',
											'gnf',
											'gyd',
											'htg',
											'hnl',
											'hkd',
											'huf',
											'isk',
											'idr',
											'xdr',
											'irr',
											'iqd',
											'ils',
											'jmd',
											'jpy',
											'jod',
											'kzt',
											'kes',
											'kpw',
											'krw',
											'kwd',
											'kgs',
											'lak',
											'lbp',
											'lsl',
											'zar',
											'lrd',
											'lyd',
											'chf',
											'mop',
											'mkd',
											'mga',
											'mwk',
											'myr',
											'mvr',
											'mru',
											'mur',
											'xua',
											'mxn',
											'mxv',
											'mdl',
											'mnt',
											'mad',
											'mzn',
											'mmk',
											'nad',
											'npr',
											'nio',
											'ngn',
											'omr',
											'pkr',
											'pab',
											'pgk',
											'pyg',
											'pen',
											'php',
											'pln',
											'qar',
											'ron',
											'rub',
											'rwf',
											'shp',
											'wst',
											'stn',
											'sar',
											'rsd',
											'scr',
											'sll',
											'sle',
											'sgd',
											'xsu',
											'sbd',
											'sos',
											'ssp',
											'lkr',
											'sdg',
											'srd',
											'sek',
											'che',
											'chw',
											'syp',
											'twd',
											'tjs',
											'tzs',
											'thb',
											'top',
											'ttd',
											'tnd',
											'try',
											'tmt',
											'ugx',
											'uah',
											'aed',
											'usn',
											'uyu',
											'uyi',
											'uyw',
											'uzs',
											'vuv',
											'ves',
											'ved',
											'vnd',
											'yer',
											'zmw',
											'zwl',
											'xba',
											'xbb',
											'xbc',
											'xbd',
											'xts',
											'xxx',
											'xau',
											'xpd',
											'xpt',
											'xag',
										])
										.optional(),
									display_name: z.string().optional(),
									name: z.string().optional(),
									type: z
										.enum(['bigcommerce', 'magento', 'shopify', 'woocommerce'])
										.optional(),
									url: z.string().optional(),
									helpdesk_integration_id: z.number().int().optional(),
									uuid: z.string().optional(),
									created_datetime: z.string().optional(),
									updated_datetime: z.string().nullable().optional(),
									deleted_datetime: z.string().nullable().optional(),
								})
								.strict()
								.optional(),
							shopper: z
								.object({
									id: z.number().int().optional(),
									external_id: z.string().optional(),
									helpdesk_customer_id: z.number().int().optional(),
									email_address: z.string().email().nullable().optional(),
									phone_number: z.string().nullable().optional(),
									first_name: z.string().nullable().optional(),
									middle_name: z.string().nullable().optional(),
									last_name: z.string().nullable().optional(),
									birthdate: z.string().nullable().optional(),
									status: z.enum(['tax_exempt', 'veteran']).optional(),
									accepts_marketing_email: z.boolean().optional(),
									accepts_marketing_sms: z.boolean().optional(),
									created_datetime: z.string().optional(),
									updated_datetime: z.string().nullable().optional(),
									deleted_datetime: z.string().nullable().optional(),
								})
								.strict()
								.optional(),
							orders: z
								.array(
									z
										.object({
											id: z.number().int().optional(),
											external_id: z.string().optional(),
											shopper_external_id: z.string().optional(),
											number: z.number().int().optional(),
											name: z.string().optional(),
											currency: z
												.enum([
													'afn',
													'eur',
													'all',
													'dzd',
													'usd',
													'aoa',
													'xcd',
													'ars',
													'amd',
													'awg',
													'aud',
													'azn',
													'bsd',
													'bhd',
													'bdt',
													'bbd',
													'byn',
													'bzd',
													'xof',
													'bmd',
													'inr',
													'btn',
													'bob',
													'bov',
													'bam',
													'bwp',
													'nok',
													'brl',
													'bnd',
													'bgn',
													'bif',
													'cve',
													'khr',
													'xaf',
													'cad',
													'kyd',
													'clp',
													'clf',
													'cny',
													'cop',
													'cou',
													'kmf',
													'cdf',
													'nzd',
													'crc',
													'hrk',
													'cup',
													'cuc',
													'ang',
													'czk',
													'dkk',
													'djf',
													'dop',
													'egp',
													'svc',
													'ern',
													'szl',
													'etb',
													'fkp',
													'fjd',
													'xpf',
													'gmd',
													'gel',
													'ghs',
													'gip',
													'gtq',
													'gbp',
													'gnf',
													'gyd',
													'htg',
													'hnl',
													'hkd',
													'huf',
													'isk',
													'idr',
													'xdr',
													'irr',
													'iqd',
													'ils',
													'jmd',
													'jpy',
													'jod',
													'kzt',
													'kes',
													'kpw',
													'krw',
													'kwd',
													'kgs',
													'lak',
													'lbp',
													'lsl',
													'zar',
													'lrd',
													'lyd',
													'chf',
													'mop',
													'mkd',
													'mga',
													'mwk',
													'myr',
													'mvr',
													'mru',
													'mur',
													'xua',
													'mxn',
													'mxv',
													'mdl',
													'mnt',
													'mad',
													'mzn',
													'mmk',
													'nad',
													'npr',
													'nio',
													'ngn',
													'omr',
													'pkr',
													'pab',
													'pgk',
													'pyg',
													'pen',
													'php',
													'pln',
													'qar',
													'ron',
													'rub',
													'rwf',
													'shp',
													'wst',
													'stn',
													'sar',
													'rsd',
													'scr',
													'sll',
													'sle',
													'sgd',
													'xsu',
													'sbd',
													'sos',
													'ssp',
													'lkr',
													'sdg',
													'srd',
													'sek',
													'che',
													'chw',
													'syp',
													'twd',
													'tjs',
													'tzs',
													'thb',
													'top',
													'ttd',
													'tnd',
													'try',
													'tmt',
													'ugx',
													'uah',
													'aed',
													'usn',
													'uyu',
													'uyi',
													'uyw',
													'uzs',
													'vuv',
													'ves',
													'ved',
													'vnd',
													'yer',
													'zmw',
													'zwl',
													'xba',
													'xbb',
													'xbc',
													'xbd',
													'xts',
													'xxx',
													'xau',
													'xpd',
													'xpt',
													'xag',
												])
												.optional(),
											discount_codes: z.array(z.string()).nullable().optional(),
											discount_amount: z.number().nullable().optional(),
											subtotal_amount: z.number().nullable().optional(),
											shipping_amount: z.number().nullable().optional(),
											tax_amount: z.number().nullable().optional(),
											total_amount: z.number().optional(),
											external_status: z.string().nullable().optional(),
											external_fulfillment_status: z
												.string()
												.nullable()
												.optional(),
											external_payment_status: z.string().nullable().optional(),
											status: z
												.enum([
													'partially_fulfilled',
													'completed',
													'canceled',
													'on_hold',
													'awaiting_fulfillment',
													'awaiting_payment',
													'scheduled',
													'order_pending',
												])
												.optional(),
											payment_status: z
												.enum([
													'refunded',
													'partially_refunded',
													'unpaid',
													'voided',
													'failed',
													'manual_verification_required',
													'customer_authentication_required',
													'paid',
													'declined',
													'authorized',
												])
												.optional(),
											billing_address: z
												.object({
													id: z.number().int().optional(),
													external_id: z.string().optional(),
													shopper_external_id: z.string().optional(),
													preferred: z.boolean().optional(),
													line_1: z.string().optional(),
													line_2: z.string().nullable().optional(),
													city: z.string().optional(),
													state: z.string().nullable().optional(),
													country: z.string().optional(),
													zip_code: z.string().optional(),
													first_name: z.string().optional(),
													last_name: z.string().optional(),
													phone_number: z.string().nullable().optional(),
													created_datetime: z.string().optional(),
													updated_datetime: z.string().nullable().optional(),
													deleted_datetime: z.string().nullable().optional(),
												})
												.strict()
												.optional(),
											shipping_address: z
												.object({
													id: z.number().int().optional(),
													external_id: z.string().optional(),
													shopper_external_id: z.string().optional(),
													preferred: z.boolean().optional(),
													line_1: z.string().optional(),
													line_2: z.string().nullable().optional(),
													city: z.string().optional(),
													state: z.string().nullable().optional(),
													country: z.string().optional(),
													zip_code: z.string().optional(),
													first_name: z.string().optional(),
													last_name: z.string().optional(),
													phone_number: z.string().nullable().optional(),
													created_datetime: z.string().optional(),
													updated_datetime: z.string().nullable().optional(),
													deleted_datetime: z.string().nullable().optional(),
												})
												.strict()
												.optional(),
											line_items: z
												.array(
													z
														.object({
															id: z.number().int().optional(),
															title: z.string().optional(),
															taxable: z.boolean().nullable().optional(),
															requires_shipping: z
																.boolean()
																.nullable()
																.optional(),
															unit_price: z.number().optional(),
															discount_amount: z.number().nullable().optional(),
															discount_type: z
																.enum(['percentage', 'fixed_amount'])
																.optional(),
															discount_reason: z.string().nullable().optional(),
															quantity: z.number().int().optional(),
															total_amount: z.number().optional(),
															product_options: z
																.record(z.string(), z.json())
																.nullable()
																.optional(),
															fulfilled_quantity: z
																.number()
																.int()
																.nullable()
																.optional(),
															created_datetime: z.string().optional(),
															updated_datetime: z
																.string()
																.nullable()
																.optional(),
															deleted_datetime: z
																.string()
																.nullable()
																.optional(),
														})
														.strict(),
												)
												.optional(),
											created_datetime: z.string().optional(),
											updated_datetime: z.string().nullable().optional(),
											deleted_datetime: z.string().nullable().optional(),
										})
										.strict(),
								)
								.optional(),
							addresses: z
								.array(
									z
										.object({
											id: z.number().int().optional(),
											external_id: z.string().optional(),
											shopper_external_id: z.string().optional(),
											preferred: z.boolean().optional(),
											line_1: z.string().optional(),
											line_2: z.string().nullable().optional(),
											city: z.string().optional(),
											state: z.string().nullable().optional(),
											country: z.string().optional(),
											zip_code: z.string().optional(),
											first_name: z.string().optional(),
											last_name: z.string().optional(),
											phone_number: z.string().nullable().optional(),
											created_datetime: z.string().optional(),
											updated_datetime: z.string().nullable().optional(),
											deleted_datetime: z.string().nullable().optional(),
										})
										.strict(),
								)
								.optional(),
						})
						.strict(),
				)
				.optional(),
		})
		.strict(),
	'customers.updateCustomer': CustomerSchema,
	'customers.updateCustomerCustomFieldValue':
		CustomerCustomFieldWithValueSchema,
	'customers.updateCustomerCustomFieldValues': z.array(
		CustomerCustomFieldWithValueSchema,
	),
	'customers.updateCustomerData': z.void(),
	'events.getEvent': EventSchema,
	'events.listEvents': z.array(EventSchema),
	'files.uploadFiles': z.array(FileSchema),
	'files.downloadFile': GorgiasBinaryOutputSchema,
	'integrations.createIntegration': IntegrationSchema,
	'integrations.deleteIntegration': z.void(),
	'integrations.getIntegration': IntegrationDetailSchema,
	'integrations.listIntegrations': z
		.object({
			meta: z
				.object({
					next_cursor: z.string().nullable(),
					prev_cursor: z.string().nullable(),
				})
				.strict(),
			object: z.record(z.string(), z.json()),
			uri: z.string().url(),
			data: z.array(IntegrationSchema),
		})
		.strict(),
	'integrations.updateIntegration': IntegrationSchema,
	'jobs.cancelJob': z.void(),
	'jobs.createJob': JobSchema,
	'jobs.getJob': JobSchema,
	'jobs.listJobs': z
		.object({
			data: z.array(JobSchema),
			meta: z
				.object({
					next_cursor: z.string().optional(),
					prev_cursor: z.string().optional(),
				})
				.strict(),
		})
		.strict(),
	'jobs.updateJob': JobSchema,
	'macros.bulkArchiveMacros': ArchiveMacrosAsUserResultSchema,
	'macros.bulkUnarchiveMacros': UnarchiveMacrosAsUserResultSchema,
	'macros.createMacro': MacroSchema,
	'macros.deleteMacro': z.void(),
	'macros.getMacro': MacroSchema,
	'macros.listMacros': z.array(MacroSchema),
	'macros.updateMacro': MacroSchema,
	'metricCards.createMetricCardFeedback': MetricFeedbackResponseSchema,
	'metricCards.getMetricCard': MetricCardSchema,
	'metricCards.searchMetricCards': MetricCardListSchema,
	'reportingStatistics.getStatistic': AnalyticsReportingSchema,
	'rules.createRule': RuleSchema,
	'rules.deleteRule': z.void(),
	'rules.getRule': RuleSchema,
	'rules.listRules': z.array(RuleSchema),
	'rules.updateRule': RuleSchema,
	'rules.updateRulesPriorities': z.array(RuleSchema),
	'satisfactionSurveys.createSatisfactionSurvey': SatisfactionSurveySchema,
	'satisfactionSurveys.getSatisfactionSurvey': SatisfactionSurveySchema,
	'satisfactionSurveys.listSatisfactionSurveys': z.array(
		SatisfactionSurveySchema,
	),
	'satisfactionSurveys.updateSatisfactionSurvey': SatisfactionSurveySchema,
	'search.search': z.record(z.string(), z.json()),
	'statistics.downloadLegacyStatistic': GorgiasBinaryOutputSchema,
	'statistics.getLegacyStatistic': StatisticSchema,
	'tags.createTag': TagSchema,
	'tags.deleteTag': z.void(),
	'tags.deleteTags': z.void(),
	'tags.getTag': TagSchema,
	'tags.listTags': z
		.object({
			object: z.string(),
			uri: z.string(),
			data: z.array(TagSchema),
			meta: CursorPaginationMetaSchema,
		})
		.strict(),
	'tags.mergeTags': TagSchema,
	'tags.updateTag': TagSchema,
	'teams.createTeam': TeamSchema,
	'teams.deleteTeam': z.void(),
	'teams.getTeam': TeamSchema,
	'teams.listTeams': z.array(TeamSchema),
	'teams.updateTeam': TeamSchema,
	'ticketMessages.createTicketMessage': TicketMessageSchema,
	'ticketMessages.deleteTicketMessage': z.void(),
	'ticketMessages.getTicketMessage': TicketMessageSchema,
	'ticketMessages.listMessages': z
		.object({
			object: z.string(),
			uri: z.string(),
			data: z.array(TicketMessageSchema),
			meta: CursorPaginationMetaSchema,
		})
		.strict(),
	'ticketMessages.listTicketMessages': z
		.object({
			object: z.string(),
			uri: z.string(),
			data: z.array(TicketMessageSchema),
			meta: CursorPaginationMetaSchema,
		})
		.strict(),
	'ticketMessages.updateTicketMessage': TicketMessageSchema,
	'tickets.createTicket': TicketSchema,
	'tickets.createTicketTags': z.void(),
	'tickets.deleteTicket': z.void(),
	'tickets.deleteTicketCustomField': z.void(),
	'tickets.deleteTicketTags': z.void(),
	'tickets.getTicket': TicketSchema,
	'tickets.listTicketCustomFields': z.array(TicketCustomFieldValueSchema),
	'tickets.listTicketTags': z.array(
		z
			.object({
				id: z.number().int().optional(),
				created_datetime: z.string().optional(),
				decoration: z
					.object({
						color: z.string(),
					})
					.strict()
					.optional(),
				deleted_datetime: z.string().optional(),
				description: z.string().optional(),
				name: z.string().optional(),
				usage: z.number().int().optional(),
				uri: z.string().optional(),
			})
			.strict(),
	),
	'tickets.listTickets': z
		.object({
			object: z.string(),
			uri: z.string(),
			data: z.array(TicketCompactSchema),
			meta: CursorPaginationMetaSchema,
		})
		.strict(),
	'tickets.updateTicket': TicketSchema,
	'tickets.updateTicketCustomField': TicketCustomFieldValueSchema,
	'tickets.updateTicketCustomFields': z.array(TicketCustomFieldValueSchema),
	'tickets.updateTicketTags': z.void(),
	'users.createUser': UserSchema,
	'users.deleteUser': z.void(),
	'users.getUser': UserSchema,
	'users.listUsers': z.array(UserSchema),
	'users.updateUser': UserSchema,
	'views.createView': ViewSchema,
	'views.deleteView': z.void(),
	'views.getView': ViewSchema,
	'views.listViewItems': z
		.object({
			data: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
							uri: z.string().optional(),
							external_id: z.string().nullable().optional(),
							language: z.string().nullable().optional(),
							status: z.string().optional(),
							priority: z.string().optional(),
							channel: z.string().optional(),
							via: z.string().optional(),
							from_agent: z.boolean().optional(),
							customer: z
								.object({
									id: z.number().int().optional(),
									email: z.string().email().max(320).nullable().optional(),
									name: z.string().nullable().optional(),
									firstname: z.string().optional(),
									lastname: z.string().optional(),
									meta: z.null().optional(),
								})
								.strict(),
							assignee_user: z
								.object({
									id: z.number().int().optional(),
									email: z.string().email().max(320).nullable().optional(),
									name: z.string().nullable().optional(),
									firstname: z.string().optional(),
									lastname: z.string().optional(),
									meta: z.null().optional(),
									bio: z.string().nullable().optional(),
								})
								.strict()
								.optional(),
							assignee_team: z
								.object({
									id: z.number().int().optional(),
									name: z.string(),
									decoration: z.null().optional(),
								})
								.strict()
								.optional(),
							subject: z.string().nullable().optional(),
							excerpt: z.string().optional(),
							integrations: z.array(z.record(z.string(), z.json())).optional(),
							meta: z.null().optional(),
							tags: z
								.array(
									z
										.object({
											id: z.number().int().optional(),
											name: z.string().max(256),
											uri: z.string().optional(),
											decoration: z.null().optional(),
										})
										.strict(),
								)
								.optional(),
							messages_count: z.number().int().optional(),
							is_unread: z.boolean().optional(),
							spam: z.boolean().nullable().optional(),
							created_datetime: z.string().nullable().optional(),
							opened_datetime: z.string().nullable().optional(),
							last_received_message_datetime: z.string().nullable().optional(),
							last_message_datetime: z.string().nullable().optional(),
							updated_datetime: z.string().nullable().optional(),
							closed_datetime: z.string().nullable().optional(),
							snooze_datetime: z.string().nullable().optional(),
							trashed_datetime: z.string().nullable().optional(),
							last_sent_message_not_delivered: z
								.boolean()
								.nullable()
								.optional(),
						})
						.strict(),
				)
				.optional(),
			meta: ViewItemsListRespMetaSchema.optional(),
		})
		.strict(),
	'views.listViews': z
		.object({
			object: z.string(),
			uri: z.string(),
			data: z.array(ViewSchema),
			meta: CursorPaginationMetaSchema,
		})
		.strict(),
	'views.updateView': ViewSchema,
	'views.updateViewItems': z
		.object({
			data: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
							uri: z.string().optional(),
							external_id: z.string().nullable().optional(),
							language: z.string().nullable().optional(),
							status: z.string().optional(),
							priority: z.string().optional(),
							channel: z.string().optional(),
							via: z.string().optional(),
							from_agent: z.boolean().optional(),
							customer: z
								.object({
									id: z.number().int().optional(),
									email: z.string().email().max(320).nullable().optional(),
									name: z.string().nullable().optional(),
									firstname: z.string().optional(),
									lastname: z.string().optional(),
									meta: z.null().optional(),
								})
								.strict(),
							assignee_user: z
								.object({
									id: z.number().int().optional(),
									email: z.string().email().max(320).nullable().optional(),
									name: z.string().nullable().optional(),
									firstname: z.string().optional(),
									lastname: z.string().optional(),
									meta: z.null().optional(),
									bio: z.string().nullable().optional(),
								})
								.strict()
								.optional(),
							assignee_team: z
								.object({
									id: z.number().int().optional(),
									name: z.string(),
									decoration: z.null().optional(),
								})
								.strict()
								.optional(),
							subject: z.string().nullable().optional(),
							excerpt: z.string().optional(),
							integrations: z.array(z.record(z.string(), z.json())).optional(),
							meta: z.null().optional(),
							tags: z
								.array(
									z
										.object({
											id: z.number().int().optional(),
											name: z.string().max(256),
											uri: z.string().optional(),
											decoration: z.null().optional(),
										})
										.strict(),
								)
								.optional(),
							messages_count: z.number().int().optional(),
							is_unread: z.boolean().optional(),
							spam: z.boolean().nullable().optional(),
							created_datetime: z.string().nullable().optional(),
							opened_datetime: z.string().nullable().optional(),
							last_received_message_datetime: z.string().nullable().optional(),
							last_message_datetime: z.string().nullable().optional(),
							updated_datetime: z.string().nullable().optional(),
							closed_datetime: z.string().nullable().optional(),
							snooze_datetime: z.string().nullable().optional(),
							trashed_datetime: z.string().nullable().optional(),
							last_sent_message_not_delivered: z
								.boolean()
								.nullable()
								.optional(),
						})
						.strict(),
				)
				.optional(),
			meta: ViewItemsListRespMetaSchema.optional(),
		})
		.strict(),
	'voiceCallEvents.getVoiceCallEvent': VoiceCallEventSchema,
	'voiceCallEvents.listVoiceCallEvents': z.array(VoiceCallEventSchema),
	'voiceCallRecordings.deleteVoiceCallRecording': z.void(),
	'voiceCallRecordings.getVoiceCallRecording': VoiceCallRecordingSchema,
	'voiceCallRecordings.listVoiceCallRecordings': z.array(
		VoiceCallRecordingSchema,
	),
	'voiceCalls.getVoiceCall': VoiceCallSchema,
	'voiceCalls.listVoiceCalls': z
		.object({
			meta: z
				.object({
					next_cursor: z.string().nullable(),
					prev_cursor: z.string().nullable(),
				})
				.strict(),
			object: z.record(z.string(), z.json()),
			uri: z.string().url(),
			data: z.array(VoiceCallSchema),
		})
		.strict(),
	'widgets.createWidget': WidgetSchema,
	'widgets.deleteWidget': z.void(),
	'widgets.getWidget': WidgetSchema,
	'widgets.listWidgets': z.array(WidgetSchema),
	'widgets.updateWidget': WidgetSchema,
} as const;

export type GorgiasEndpointInputs = {
	'account.createAccountSetting': z.input<
		(typeof GorgiasEndpointInputSchemas)['account.createAccountSetting']
	>;
	'account.getAccount': z.input<
		(typeof GorgiasEndpointInputSchemas)['account.getAccount']
	>;
	'account.listAccountSettings': z.input<
		(typeof GorgiasEndpointInputSchemas)['account.listAccountSettings']
	>;
	'account.updateAccountSetting': z.input<
		(typeof GorgiasEndpointInputSchemas)['account.updateAccountSetting']
	>;
	'customFields.createCustomField': z.input<
		(typeof GorgiasEndpointInputSchemas)['customFields.createCustomField']
	>;
	'customFields.getCustomField': z.input<
		(typeof GorgiasEndpointInputSchemas)['customFields.getCustomField']
	>;
	'customFields.listCustomFields': z.input<
		(typeof GorgiasEndpointInputSchemas)['customFields.listCustomFields']
	>;
	'customFields.updateCustomField': z.input<
		(typeof GorgiasEndpointInputSchemas)['customFields.updateCustomField']
	>;
	'customFields.updateCustomFields': z.input<
		(typeof GorgiasEndpointInputSchemas)['customFields.updateCustomFields']
	>;
	'customers.createCustomer': z.input<
		(typeof GorgiasEndpointInputSchemas)['customers.createCustomer']
	>;
	'customers.deleteCustomer': z.input<
		(typeof GorgiasEndpointInputSchemas)['customers.deleteCustomer']
	>;
	'customers.deleteCustomerCustomFieldValue': z.input<
		(typeof GorgiasEndpointInputSchemas)['customers.deleteCustomerCustomFieldValue']
	>;
	'customers.deleteCustomers': z.input<
		(typeof GorgiasEndpointInputSchemas)['customers.deleteCustomers']
	>;
	'customers.getCustomer': z.input<
		(typeof GorgiasEndpointInputSchemas)['customers.getCustomer']
	>;
	'customers.listCustomerCustomFieldsValues': z.input<
		(typeof GorgiasEndpointInputSchemas)['customers.listCustomerCustomFieldsValues']
	>;
	'customers.listCustomers': z.input<
		(typeof GorgiasEndpointInputSchemas)['customers.listCustomers']
	>;
	'customers.mergeCustomers': z.input<
		(typeof GorgiasEndpointInputSchemas)['customers.mergeCustomers']
	>;
	'customers.updateCustomer': z.input<
		(typeof GorgiasEndpointInputSchemas)['customers.updateCustomer']
	>;
	'customers.updateCustomerCustomFieldValue': z.input<
		(typeof GorgiasEndpointInputSchemas)['customers.updateCustomerCustomFieldValue']
	>;
	'customers.updateCustomerCustomFieldValues': z.input<
		(typeof GorgiasEndpointInputSchemas)['customers.updateCustomerCustomFieldValues']
	>;
	'customers.updateCustomerData': z.input<
		(typeof GorgiasEndpointInputSchemas)['customers.updateCustomerData']
	>;
	'events.getEvent': z.input<
		(typeof GorgiasEndpointInputSchemas)['events.getEvent']
	>;
	'events.listEvents': z.input<
		(typeof GorgiasEndpointInputSchemas)['events.listEvents']
	>;
	'files.uploadFiles': z.input<
		(typeof GorgiasEndpointInputSchemas)['files.uploadFiles']
	>;
	'files.downloadFile': z.input<
		(typeof GorgiasEndpointInputSchemas)['files.downloadFile']
	>;
	'integrations.createIntegration': z.input<
		(typeof GorgiasEndpointInputSchemas)['integrations.createIntegration']
	>;
	'integrations.deleteIntegration': z.input<
		(typeof GorgiasEndpointInputSchemas)['integrations.deleteIntegration']
	>;
	'integrations.getIntegration': z.input<
		(typeof GorgiasEndpointInputSchemas)['integrations.getIntegration']
	>;
	'integrations.listIntegrations': z.input<
		(typeof GorgiasEndpointInputSchemas)['integrations.listIntegrations']
	>;
	'integrations.updateIntegration': z.input<
		(typeof GorgiasEndpointInputSchemas)['integrations.updateIntegration']
	>;
	'jobs.cancelJob': z.input<
		(typeof GorgiasEndpointInputSchemas)['jobs.cancelJob']
	>;
	'jobs.createJob': z.input<
		(typeof GorgiasEndpointInputSchemas)['jobs.createJob']
	>;
	'jobs.getJob': z.input<(typeof GorgiasEndpointInputSchemas)['jobs.getJob']>;
	'jobs.listJobs': z.input<
		(typeof GorgiasEndpointInputSchemas)['jobs.listJobs']
	>;
	'jobs.updateJob': z.input<
		(typeof GorgiasEndpointInputSchemas)['jobs.updateJob']
	>;
	'macros.bulkArchiveMacros': z.input<
		(typeof GorgiasEndpointInputSchemas)['macros.bulkArchiveMacros']
	>;
	'macros.bulkUnarchiveMacros': z.input<
		(typeof GorgiasEndpointInputSchemas)['macros.bulkUnarchiveMacros']
	>;
	'macros.createMacro': z.input<
		(typeof GorgiasEndpointInputSchemas)['macros.createMacro']
	>;
	'macros.deleteMacro': z.input<
		(typeof GorgiasEndpointInputSchemas)['macros.deleteMacro']
	>;
	'macros.getMacro': z.input<
		(typeof GorgiasEndpointInputSchemas)['macros.getMacro']
	>;
	'macros.listMacros': z.input<
		(typeof GorgiasEndpointInputSchemas)['macros.listMacros']
	>;
	'macros.updateMacro': z.input<
		(typeof GorgiasEndpointInputSchemas)['macros.updateMacro']
	>;
	'metricCards.createMetricCardFeedback': z.input<
		(typeof GorgiasEndpointInputSchemas)['metricCards.createMetricCardFeedback']
	>;
	'metricCards.getMetricCard': z.input<
		(typeof GorgiasEndpointInputSchemas)['metricCards.getMetricCard']
	>;
	'metricCards.searchMetricCards': z.input<
		(typeof GorgiasEndpointInputSchemas)['metricCards.searchMetricCards']
	>;
	'reportingStatistics.getStatistic': z.input<
		(typeof GorgiasEndpointInputSchemas)['reportingStatistics.getStatistic']
	>;
	'rules.createRule': z.input<
		(typeof GorgiasEndpointInputSchemas)['rules.createRule']
	>;
	'rules.deleteRule': z.input<
		(typeof GorgiasEndpointInputSchemas)['rules.deleteRule']
	>;
	'rules.getRule': z.input<
		(typeof GorgiasEndpointInputSchemas)['rules.getRule']
	>;
	'rules.listRules': z.input<
		(typeof GorgiasEndpointInputSchemas)['rules.listRules']
	>;
	'rules.updateRule': z.input<
		(typeof GorgiasEndpointInputSchemas)['rules.updateRule']
	>;
	'rules.updateRulesPriorities': z.input<
		(typeof GorgiasEndpointInputSchemas)['rules.updateRulesPriorities']
	>;
	'satisfactionSurveys.createSatisfactionSurvey': z.input<
		(typeof GorgiasEndpointInputSchemas)['satisfactionSurveys.createSatisfactionSurvey']
	>;
	'satisfactionSurveys.getSatisfactionSurvey': z.input<
		(typeof GorgiasEndpointInputSchemas)['satisfactionSurveys.getSatisfactionSurvey']
	>;
	'satisfactionSurveys.listSatisfactionSurveys': z.input<
		(typeof GorgiasEndpointInputSchemas)['satisfactionSurveys.listSatisfactionSurveys']
	>;
	'satisfactionSurveys.updateSatisfactionSurvey': z.input<
		(typeof GorgiasEndpointInputSchemas)['satisfactionSurveys.updateSatisfactionSurvey']
	>;
	'search.search': z.input<
		(typeof GorgiasEndpointInputSchemas)['search.search']
	>;
	'statistics.downloadLegacyStatistic': z.input<
		(typeof GorgiasEndpointInputSchemas)['statistics.downloadLegacyStatistic']
	>;
	'statistics.getLegacyStatistic': z.input<
		(typeof GorgiasEndpointInputSchemas)['statistics.getLegacyStatistic']
	>;
	'tags.createTag': z.input<
		(typeof GorgiasEndpointInputSchemas)['tags.createTag']
	>;
	'tags.deleteTag': z.input<
		(typeof GorgiasEndpointInputSchemas)['tags.deleteTag']
	>;
	'tags.deleteTags': z.input<
		(typeof GorgiasEndpointInputSchemas)['tags.deleteTags']
	>;
	'tags.getTag': z.input<(typeof GorgiasEndpointInputSchemas)['tags.getTag']>;
	'tags.listTags': z.input<
		(typeof GorgiasEndpointInputSchemas)['tags.listTags']
	>;
	'tags.mergeTags': z.input<
		(typeof GorgiasEndpointInputSchemas)['tags.mergeTags']
	>;
	'tags.updateTag': z.input<
		(typeof GorgiasEndpointInputSchemas)['tags.updateTag']
	>;
	'teams.createTeam': z.input<
		(typeof GorgiasEndpointInputSchemas)['teams.createTeam']
	>;
	'teams.deleteTeam': z.input<
		(typeof GorgiasEndpointInputSchemas)['teams.deleteTeam']
	>;
	'teams.getTeam': z.input<
		(typeof GorgiasEndpointInputSchemas)['teams.getTeam']
	>;
	'teams.listTeams': z.input<
		(typeof GorgiasEndpointInputSchemas)['teams.listTeams']
	>;
	'teams.updateTeam': z.input<
		(typeof GorgiasEndpointInputSchemas)['teams.updateTeam']
	>;
	'ticketMessages.createTicketMessage': z.input<
		(typeof GorgiasEndpointInputSchemas)['ticketMessages.createTicketMessage']
	>;
	'ticketMessages.deleteTicketMessage': z.input<
		(typeof GorgiasEndpointInputSchemas)['ticketMessages.deleteTicketMessage']
	>;
	'ticketMessages.getTicketMessage': z.input<
		(typeof GorgiasEndpointInputSchemas)['ticketMessages.getTicketMessage']
	>;
	'ticketMessages.listMessages': z.input<
		(typeof GorgiasEndpointInputSchemas)['ticketMessages.listMessages']
	>;
	'ticketMessages.listTicketMessages': z.input<
		(typeof GorgiasEndpointInputSchemas)['ticketMessages.listTicketMessages']
	>;
	'ticketMessages.updateTicketMessage': z.input<
		(typeof GorgiasEndpointInputSchemas)['ticketMessages.updateTicketMessage']
	>;
	'tickets.createTicket': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.createTicket']
	>;
	'tickets.createTicketTags': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.createTicketTags']
	>;
	'tickets.deleteTicket': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.deleteTicket']
	>;
	'tickets.deleteTicketCustomField': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.deleteTicketCustomField']
	>;
	'tickets.deleteTicketTags': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.deleteTicketTags']
	>;
	'tickets.getTicket': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.getTicket']
	>;
	'tickets.listTicketCustomFields': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.listTicketCustomFields']
	>;
	'tickets.listTicketTags': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.listTicketTags']
	>;
	'tickets.listTickets': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.listTickets']
	>;
	'tickets.updateTicket': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.updateTicket']
	>;
	'tickets.updateTicketCustomField': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.updateTicketCustomField']
	>;
	'tickets.updateTicketCustomFields': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.updateTicketCustomFields']
	>;
	'tickets.updateTicketTags': z.input<
		(typeof GorgiasEndpointInputSchemas)['tickets.updateTicketTags']
	>;
	'users.createUser': z.input<
		(typeof GorgiasEndpointInputSchemas)['users.createUser']
	>;
	'users.deleteUser': z.input<
		(typeof GorgiasEndpointInputSchemas)['users.deleteUser']
	>;
	'users.getUser': z.input<
		(typeof GorgiasEndpointInputSchemas)['users.getUser']
	>;
	'users.listUsers': z.input<
		(typeof GorgiasEndpointInputSchemas)['users.listUsers']
	>;
	'users.updateUser': z.input<
		(typeof GorgiasEndpointInputSchemas)['users.updateUser']
	>;
	'views.createView': z.input<
		(typeof GorgiasEndpointInputSchemas)['views.createView']
	>;
	'views.deleteView': z.input<
		(typeof GorgiasEndpointInputSchemas)['views.deleteView']
	>;
	'views.getView': z.input<
		(typeof GorgiasEndpointInputSchemas)['views.getView']
	>;
	'views.listViewItems': z.input<
		(typeof GorgiasEndpointInputSchemas)['views.listViewItems']
	>;
	'views.listViews': z.input<
		(typeof GorgiasEndpointInputSchemas)['views.listViews']
	>;
	'views.updateView': z.input<
		(typeof GorgiasEndpointInputSchemas)['views.updateView']
	>;
	'views.updateViewItems': z.input<
		(typeof GorgiasEndpointInputSchemas)['views.updateViewItems']
	>;
	'voiceCallEvents.getVoiceCallEvent': z.input<
		(typeof GorgiasEndpointInputSchemas)['voiceCallEvents.getVoiceCallEvent']
	>;
	'voiceCallEvents.listVoiceCallEvents': z.input<
		(typeof GorgiasEndpointInputSchemas)['voiceCallEvents.listVoiceCallEvents']
	>;
	'voiceCallRecordings.deleteVoiceCallRecording': z.input<
		(typeof GorgiasEndpointInputSchemas)['voiceCallRecordings.deleteVoiceCallRecording']
	>;
	'voiceCallRecordings.getVoiceCallRecording': z.input<
		(typeof GorgiasEndpointInputSchemas)['voiceCallRecordings.getVoiceCallRecording']
	>;
	'voiceCallRecordings.listVoiceCallRecordings': z.input<
		(typeof GorgiasEndpointInputSchemas)['voiceCallRecordings.listVoiceCallRecordings']
	>;
	'voiceCalls.getVoiceCall': z.input<
		(typeof GorgiasEndpointInputSchemas)['voiceCalls.getVoiceCall']
	>;
	'voiceCalls.listVoiceCalls': z.input<
		(typeof GorgiasEndpointInputSchemas)['voiceCalls.listVoiceCalls']
	>;
	'widgets.createWidget': z.input<
		(typeof GorgiasEndpointInputSchemas)['widgets.createWidget']
	>;
	'widgets.deleteWidget': z.input<
		(typeof GorgiasEndpointInputSchemas)['widgets.deleteWidget']
	>;
	'widgets.getWidget': z.input<
		(typeof GorgiasEndpointInputSchemas)['widgets.getWidget']
	>;
	'widgets.listWidgets': z.input<
		(typeof GorgiasEndpointInputSchemas)['widgets.listWidgets']
	>;
	'widgets.updateWidget': z.input<
		(typeof GorgiasEndpointInputSchemas)['widgets.updateWidget']
	>;
};

export type GorgiasEndpointOutputs = {
	'account.createAccountSetting': z.output<
		(typeof GorgiasEndpointOutputSchemas)['account.createAccountSetting']
	>;
	'account.getAccount': z.output<
		(typeof GorgiasEndpointOutputSchemas)['account.getAccount']
	>;
	'account.listAccountSettings': z.output<
		(typeof GorgiasEndpointOutputSchemas)['account.listAccountSettings']
	>;
	'account.updateAccountSetting': z.output<
		(typeof GorgiasEndpointOutputSchemas)['account.updateAccountSetting']
	>;
	'customFields.createCustomField': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customFields.createCustomField']
	>;
	'customFields.getCustomField': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customFields.getCustomField']
	>;
	'customFields.listCustomFields': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customFields.listCustomFields']
	>;
	'customFields.updateCustomField': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customFields.updateCustomField']
	>;
	'customFields.updateCustomFields': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customFields.updateCustomFields']
	>;
	'customers.createCustomer': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customers.createCustomer']
	>;
	'customers.deleteCustomer': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customers.deleteCustomer']
	>;
	'customers.deleteCustomerCustomFieldValue': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customers.deleteCustomerCustomFieldValue']
	>;
	'customers.deleteCustomers': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customers.deleteCustomers']
	>;
	'customers.getCustomer': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customers.getCustomer']
	>;
	'customers.listCustomerCustomFieldsValues': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customers.listCustomerCustomFieldsValues']
	>;
	'customers.listCustomers': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customers.listCustomers']
	>;
	'customers.mergeCustomers': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customers.mergeCustomers']
	>;
	'customers.updateCustomer': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customers.updateCustomer']
	>;
	'customers.updateCustomerCustomFieldValue': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customers.updateCustomerCustomFieldValue']
	>;
	'customers.updateCustomerCustomFieldValues': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customers.updateCustomerCustomFieldValues']
	>;
	'customers.updateCustomerData': z.output<
		(typeof GorgiasEndpointOutputSchemas)['customers.updateCustomerData']
	>;
	'events.getEvent': z.output<
		(typeof GorgiasEndpointOutputSchemas)['events.getEvent']
	>;
	'events.listEvents': z.output<
		(typeof GorgiasEndpointOutputSchemas)['events.listEvents']
	>;
	'files.uploadFiles': z.output<
		(typeof GorgiasEndpointOutputSchemas)['files.uploadFiles']
	>;
	'files.downloadFile': z.output<
		(typeof GorgiasEndpointOutputSchemas)['files.downloadFile']
	>;
	'integrations.createIntegration': z.output<
		(typeof GorgiasEndpointOutputSchemas)['integrations.createIntegration']
	>;
	'integrations.deleteIntegration': z.output<
		(typeof GorgiasEndpointOutputSchemas)['integrations.deleteIntegration']
	>;
	'integrations.getIntegration': z.output<
		(typeof GorgiasEndpointOutputSchemas)['integrations.getIntegration']
	>;
	'integrations.listIntegrations': z.output<
		(typeof GorgiasEndpointOutputSchemas)['integrations.listIntegrations']
	>;
	'integrations.updateIntegration': z.output<
		(typeof GorgiasEndpointOutputSchemas)['integrations.updateIntegration']
	>;
	'jobs.cancelJob': z.output<
		(typeof GorgiasEndpointOutputSchemas)['jobs.cancelJob']
	>;
	'jobs.createJob': z.output<
		(typeof GorgiasEndpointOutputSchemas)['jobs.createJob']
	>;
	'jobs.getJob': z.output<(typeof GorgiasEndpointOutputSchemas)['jobs.getJob']>;
	'jobs.listJobs': z.output<
		(typeof GorgiasEndpointOutputSchemas)['jobs.listJobs']
	>;
	'jobs.updateJob': z.output<
		(typeof GorgiasEndpointOutputSchemas)['jobs.updateJob']
	>;
	'macros.bulkArchiveMacros': z.output<
		(typeof GorgiasEndpointOutputSchemas)['macros.bulkArchiveMacros']
	>;
	'macros.bulkUnarchiveMacros': z.output<
		(typeof GorgiasEndpointOutputSchemas)['macros.bulkUnarchiveMacros']
	>;
	'macros.createMacro': z.output<
		(typeof GorgiasEndpointOutputSchemas)['macros.createMacro']
	>;
	'macros.deleteMacro': z.output<
		(typeof GorgiasEndpointOutputSchemas)['macros.deleteMacro']
	>;
	'macros.getMacro': z.output<
		(typeof GorgiasEndpointOutputSchemas)['macros.getMacro']
	>;
	'macros.listMacros': z.output<
		(typeof GorgiasEndpointOutputSchemas)['macros.listMacros']
	>;
	'macros.updateMacro': z.output<
		(typeof GorgiasEndpointOutputSchemas)['macros.updateMacro']
	>;
	'metricCards.createMetricCardFeedback': z.output<
		(typeof GorgiasEndpointOutputSchemas)['metricCards.createMetricCardFeedback']
	>;
	'metricCards.getMetricCard': z.output<
		(typeof GorgiasEndpointOutputSchemas)['metricCards.getMetricCard']
	>;
	'metricCards.searchMetricCards': z.output<
		(typeof GorgiasEndpointOutputSchemas)['metricCards.searchMetricCards']
	>;
	'reportingStatistics.getStatistic': z.output<
		(typeof GorgiasEndpointOutputSchemas)['reportingStatistics.getStatistic']
	>;
	'rules.createRule': z.output<
		(typeof GorgiasEndpointOutputSchemas)['rules.createRule']
	>;
	'rules.deleteRule': z.output<
		(typeof GorgiasEndpointOutputSchemas)['rules.deleteRule']
	>;
	'rules.getRule': z.output<
		(typeof GorgiasEndpointOutputSchemas)['rules.getRule']
	>;
	'rules.listRules': z.output<
		(typeof GorgiasEndpointOutputSchemas)['rules.listRules']
	>;
	'rules.updateRule': z.output<
		(typeof GorgiasEndpointOutputSchemas)['rules.updateRule']
	>;
	'rules.updateRulesPriorities': z.output<
		(typeof GorgiasEndpointOutputSchemas)['rules.updateRulesPriorities']
	>;
	'satisfactionSurveys.createSatisfactionSurvey': z.output<
		(typeof GorgiasEndpointOutputSchemas)['satisfactionSurveys.createSatisfactionSurvey']
	>;
	'satisfactionSurveys.getSatisfactionSurvey': z.output<
		(typeof GorgiasEndpointOutputSchemas)['satisfactionSurveys.getSatisfactionSurvey']
	>;
	'satisfactionSurveys.listSatisfactionSurveys': z.output<
		(typeof GorgiasEndpointOutputSchemas)['satisfactionSurveys.listSatisfactionSurveys']
	>;
	'satisfactionSurveys.updateSatisfactionSurvey': z.output<
		(typeof GorgiasEndpointOutputSchemas)['satisfactionSurveys.updateSatisfactionSurvey']
	>;
	'search.search': z.output<
		(typeof GorgiasEndpointOutputSchemas)['search.search']
	>;
	'statistics.downloadLegacyStatistic': z.output<
		(typeof GorgiasEndpointOutputSchemas)['statistics.downloadLegacyStatistic']
	>;
	'statistics.getLegacyStatistic': z.output<
		(typeof GorgiasEndpointOutputSchemas)['statistics.getLegacyStatistic']
	>;
	'tags.createTag': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tags.createTag']
	>;
	'tags.deleteTag': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tags.deleteTag']
	>;
	'tags.deleteTags': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tags.deleteTags']
	>;
	'tags.getTag': z.output<(typeof GorgiasEndpointOutputSchemas)['tags.getTag']>;
	'tags.listTags': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tags.listTags']
	>;
	'tags.mergeTags': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tags.mergeTags']
	>;
	'tags.updateTag': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tags.updateTag']
	>;
	'teams.createTeam': z.output<
		(typeof GorgiasEndpointOutputSchemas)['teams.createTeam']
	>;
	'teams.deleteTeam': z.output<
		(typeof GorgiasEndpointOutputSchemas)['teams.deleteTeam']
	>;
	'teams.getTeam': z.output<
		(typeof GorgiasEndpointOutputSchemas)['teams.getTeam']
	>;
	'teams.listTeams': z.output<
		(typeof GorgiasEndpointOutputSchemas)['teams.listTeams']
	>;
	'teams.updateTeam': z.output<
		(typeof GorgiasEndpointOutputSchemas)['teams.updateTeam']
	>;
	'ticketMessages.createTicketMessage': z.output<
		(typeof GorgiasEndpointOutputSchemas)['ticketMessages.createTicketMessage']
	>;
	'ticketMessages.deleteTicketMessage': z.output<
		(typeof GorgiasEndpointOutputSchemas)['ticketMessages.deleteTicketMessage']
	>;
	'ticketMessages.getTicketMessage': z.output<
		(typeof GorgiasEndpointOutputSchemas)['ticketMessages.getTicketMessage']
	>;
	'ticketMessages.listMessages': z.output<
		(typeof GorgiasEndpointOutputSchemas)['ticketMessages.listMessages']
	>;
	'ticketMessages.listTicketMessages': z.output<
		(typeof GorgiasEndpointOutputSchemas)['ticketMessages.listTicketMessages']
	>;
	'ticketMessages.updateTicketMessage': z.output<
		(typeof GorgiasEndpointOutputSchemas)['ticketMessages.updateTicketMessage']
	>;
	'tickets.createTicket': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.createTicket']
	>;
	'tickets.createTicketTags': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.createTicketTags']
	>;
	'tickets.deleteTicket': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.deleteTicket']
	>;
	'tickets.deleteTicketCustomField': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.deleteTicketCustomField']
	>;
	'tickets.deleteTicketTags': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.deleteTicketTags']
	>;
	'tickets.getTicket': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.getTicket']
	>;
	'tickets.listTicketCustomFields': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.listTicketCustomFields']
	>;
	'tickets.listTicketTags': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.listTicketTags']
	>;
	'tickets.listTickets': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.listTickets']
	>;
	'tickets.updateTicket': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.updateTicket']
	>;
	'tickets.updateTicketCustomField': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.updateTicketCustomField']
	>;
	'tickets.updateTicketCustomFields': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.updateTicketCustomFields']
	>;
	'tickets.updateTicketTags': z.output<
		(typeof GorgiasEndpointOutputSchemas)['tickets.updateTicketTags']
	>;
	'users.createUser': z.output<
		(typeof GorgiasEndpointOutputSchemas)['users.createUser']
	>;
	'users.deleteUser': z.output<
		(typeof GorgiasEndpointOutputSchemas)['users.deleteUser']
	>;
	'users.getUser': z.output<
		(typeof GorgiasEndpointOutputSchemas)['users.getUser']
	>;
	'users.listUsers': z.output<
		(typeof GorgiasEndpointOutputSchemas)['users.listUsers']
	>;
	'users.updateUser': z.output<
		(typeof GorgiasEndpointOutputSchemas)['users.updateUser']
	>;
	'views.createView': z.output<
		(typeof GorgiasEndpointOutputSchemas)['views.createView']
	>;
	'views.deleteView': z.output<
		(typeof GorgiasEndpointOutputSchemas)['views.deleteView']
	>;
	'views.getView': z.output<
		(typeof GorgiasEndpointOutputSchemas)['views.getView']
	>;
	'views.listViewItems': z.output<
		(typeof GorgiasEndpointOutputSchemas)['views.listViewItems']
	>;
	'views.listViews': z.output<
		(typeof GorgiasEndpointOutputSchemas)['views.listViews']
	>;
	'views.updateView': z.output<
		(typeof GorgiasEndpointOutputSchemas)['views.updateView']
	>;
	'views.updateViewItems': z.output<
		(typeof GorgiasEndpointOutputSchemas)['views.updateViewItems']
	>;
	'voiceCallEvents.getVoiceCallEvent': z.output<
		(typeof GorgiasEndpointOutputSchemas)['voiceCallEvents.getVoiceCallEvent']
	>;
	'voiceCallEvents.listVoiceCallEvents': z.output<
		(typeof GorgiasEndpointOutputSchemas)['voiceCallEvents.listVoiceCallEvents']
	>;
	'voiceCallRecordings.deleteVoiceCallRecording': z.output<
		(typeof GorgiasEndpointOutputSchemas)['voiceCallRecordings.deleteVoiceCallRecording']
	>;
	'voiceCallRecordings.getVoiceCallRecording': z.output<
		(typeof GorgiasEndpointOutputSchemas)['voiceCallRecordings.getVoiceCallRecording']
	>;
	'voiceCallRecordings.listVoiceCallRecordings': z.output<
		(typeof GorgiasEndpointOutputSchemas)['voiceCallRecordings.listVoiceCallRecordings']
	>;
	'voiceCalls.getVoiceCall': z.output<
		(typeof GorgiasEndpointOutputSchemas)['voiceCalls.getVoiceCall']
	>;
	'voiceCalls.listVoiceCalls': z.output<
		(typeof GorgiasEndpointOutputSchemas)['voiceCalls.listVoiceCalls']
	>;
	'widgets.createWidget': z.output<
		(typeof GorgiasEndpointOutputSchemas)['widgets.createWidget']
	>;
	'widgets.deleteWidget': z.output<
		(typeof GorgiasEndpointOutputSchemas)['widgets.deleteWidget']
	>;
	'widgets.getWidget': z.output<
		(typeof GorgiasEndpointOutputSchemas)['widgets.getWidget']
	>;
	'widgets.listWidgets': z.output<
		(typeof GorgiasEndpointOutputSchemas)['widgets.listWidgets']
	>;
	'widgets.updateWidget': z.output<
		(typeof GorgiasEndpointOutputSchemas)['widgets.updateWidget']
	>;
};
