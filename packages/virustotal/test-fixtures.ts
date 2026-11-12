// Response bodies built from the examples in
// https://docs.virustotal.com/reference, with made-up hashes, domains and
// addresses. They were not captured from the live API.

export const fileId =
	'275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f';

export const file = {
	data: {
		type: 'file',
		id: fileId,
		attributes: {
			meaningful_name: 'invoice_2024.pdf.exe',
			type_description: 'Win32 EXE',
			type_tag: 'peexe',
			size: 38_912,
			names: ['invoice_2024.pdf.exe', 'invoice.exe'],
			md5: 'd41d8cd98f00b204e9800998ecf8427e',
			sha1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
			sha256: fileId,
			reputation: -42,
			tags: ['peexe', 'overlay'],
			first_submission_date: 1_700_000_000,
			last_analysis_date: 1_710_000_000,
			last_analysis_stats: {
				harmless: 0,
				'type-unsupported': 12,
				suspicious: 3,
				undetected: 20,
				timeout: 0,
				failure: 1,
				malicious: 47,
			},
			last_analysis_results: {
				Kaspersky: { category: 'malicious', result: 'Trojan.Win32.Agent' },
				ESET: { category: 'malicious', result: 'Win32/Trojan' },
				'Acme AV': { category: 'undetected', result: null },
			},
		},
		links: { self: 'https://www.virustotal.com/api/v3/files/275a02' },
	},
};

export const urlId = 'aHR0cHM6Ly9hY21lLmV4YW1wbGUvbG9naW4';

export const url = {
	data: {
		type: 'url',
		id: urlId,
		attributes: {
			url: 'https://acme.example/login',
			final_url: 'https://acme.example/login',
			title: 'Acme login',
			first_submission_date: 1_700_000_000,
			last_analysis_date: 1_710_000_000,
			reputation: 0,
			tags: [],
			categories: { 'Acme Security': 'phishing' },
			threat_names: ['Phishing.Generic'],
			last_analysis_stats: {
				harmless: 61,
				suspicious: 2,
				undetected: 20,
				timeout: 0,
				malicious: 4,
			},
		},
	},
};

export const domain = {
	data: {
		type: 'domain',
		id: 'acme.example',
		attributes: {
			registrar: 'Acme Registrar',
			creation_date: 1_600_000_000,
			last_update_date: 1_700_000_000,
			expiration_date: 1_800_000_000,
			categories: { 'Acme Security': 'business' },
			reputation: 12,
			tags: ['business'],
			last_dns_records: [{ type: 'A', value: '203.0.113.10' }],
			last_dns_records_date: 1_710_000_000,
			last_analysis_stats: {
				harmless: 70,
				suspicious: 0,
				undetected: 15,
				timeout: 0,
				malicious: 0,
			},
		},
	},
};

export const ip = {
	data: {
		type: 'ip_address',
		id: '203.0.113.10',
		attributes: {
			country: 'NL',
			continent: 'EU',
			as_owner: 'Acme Hosting BV',
			asn: 64_500,
			network: '203.0.113.0/24',
			regional_internet_registry: 'RIPE NCC',
			reputation: -5,
			tags: ['hosting'],
			last_analysis_date: 1_710_000_000,
			last_analysis_stats: {
				harmless: 60,
				suspicious: 1,
				undetected: 20,
				timeout: 0,
				malicious: 2,
			},
		},
	},
};

export const analysisId =
	'NjY0MjRlOTFjMDIyYTkyNWM0NjU2NWQzYWNlMzFmZmI6MTQ3NTA0ODI3Nw==';

export const analysisDescriptor = {
	data: { type: 'analysis', id: analysisId },
};

export const analysis = {
	data: {
		type: 'analysis',
		id: analysisId,
		attributes: {
			status: 'completed',
			date: 1_710_000_000,
			stats: { malicious: 4, harmless: 61, undetected: 20 },
			results: {
				Kaspersky: { category: 'malicious', result: 'Phishing.Generic' },
			},
		},
	},
};

/**
 * Real analyses read on 11-12 (trimmed): a URL scan answers `url_analysis` and a
 * domain or IP rescan `netloc_analysis`; only a file analysis says `analysis`.
 */
export const urlAnalysisLive = {
	data: {
		id: 'u-0f115db062b7c0dd030b16878c99dea5c354b49dc37b38eb8846179c7783e9d7-1794461454',
		type: 'url_analysis',
		links: {
			self: 'https://www.virustotal.com/api/v3/analyses/u-0f115db062b7c0dd030b16878c99dea5c354b49dc37b38eb8846179c7783e9d7-1794461454',
		},
		attributes: {
			status: 'completed',
			date: 1_794_461_454,
			url: 'https://example.com/',
			final_url: 'https://example.com/',
			stats: {
				undetected: 31,
				harmless: 62,
				malicious: 0,
				suspicious: 0,
				timeout: 0,
				confirmed_timeout: 0,
				failure: 0,
				type_unsupported: 0,
			},
			results: {
				'Dr.Web': {
					category: 'harmless',
					engine_name: 'Dr.Web',
					method: 'blacklist',
					result: 'clean',
				},
			},
		},
	},
	meta: {
		url_info: {
			id: '0f115db062b7c0dd030b16878c99dea5c354b49dc37b38eb8846179c7783e9d7',
			url: 'https://example.com/',
		},
	},
};

export const netlocAnalysisLive = {
	data: {
		id: 'd-97f4099c628fa154ddac9ddef304b8ef9807f8e0795767aabbd2bafbe075676c-1794462460',
		type: 'netloc_analysis',
		attributes: {
			status: 'completed',
			stats: {
				malicious: 0,
				suspicious: 0,
				undetected: 31,
				harmless: 61,
				timeout: 0,
			},
		},
	},
};

/** An analysis that has been submitted but not started. */
export const analysisQueued = {
	data: {
		type: 'analysis',
		id: analysisId,
		attributes: { status: 'queued', date: 1_710_000_000 },
	},
};

export const comment = {
	data: {
		type: 'comment',
		id: 'u-011915942db556bbab5137f761efe61fed2b00598fea900360b800b193a7bf31-d94d7c8a',
		attributes: {
			text: '#malware seen in the wild',
			html: '#malware seen in the wild',
			date: 1_619_424_604,
			tags: ['malware'],
			votes: { positive: 2, negative: 0, abuse: 0 },
		},
	},
};

export const commentsPage = {
	data: [comment.data],
	meta: {
		cursor: 'Cs8BChEKBGRhdGUSCQiCnsTiupvwAhK1AWoRc352aXJ1c3RvdGFsY2xvdWRynwE',
	},
};

/** The last page still carries a cursor in some list answers, so `hasMore` is
 * read from its presence rather than a count. */
export const commentsLastPage = { data: [comment.data], meta: {} };

export const vote = {
	data: {
		type: 'vote',
		id: 'v-1',
		attributes: { verdict: 'harmless', date: 1_710_000_000 },
	},
};

export const votesPage = {
	data: [vote.data],
	meta: { cursor: 'next-cursor' },
};

/** The error bodies the API sends. */
export const invalidKey = {
	error: { code: 'WrongCredentialsError', message: 'Wrong API key' },
};

export const missingKey = {
	error: {
		code: 'AuthenticationRequiredError',
		message: 'X-Apikey header is missing',
	},
};

export const notFound = {
	error: { code: 'NotFoundError', message: 'Resource not found.' },
};

/** Exists but not processed yet — a 400, not a 404. */
export const notAvailableYet = {
	error: {
		code: 'NotAvailableYet',
		message:
			'The requested resource is not available yet, please try again later',
	},
};

/** A spent minute, daily or monthly allowance. */
export const quotaExceeded = {
	error: {
		code: 'QuotaExceededError',
		message: 'Quota exceeded',
	},
};

/** A burst that will clear. */
export const tooManyRequests = {
	error: { code: 'TooManyRequestsError', message: 'Too many requests' },
};
