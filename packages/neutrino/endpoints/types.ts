import { z } from 'zod';

// Inputs use Neutrino's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field the provider adds or omits cannot fail
// a call that has already happened.
//
// Neutrino accepts parameters as either GET query values or an urlencoded POST
// body, and every method here is wrapped with whichever form its spec declares.

// ── shared output shapes ──────────────────────────────────────────────────

const TimezoneSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		abbr: z.string().nullish(),
		date: z.string().nullish(),
		time: z.string().nullish(),
		offset: z.string().nullish(),
	})
	.loose();

/** One sensor or blocklist that has flagged an IP or domain. */
const BlocklistSensorSchema = z
	.object({
		id: z.number().nullish(),
		blocklist: z.string().nullish(),
		description: z.string().nullish(),
	})
	.loose();

/** One DNSBL that a host was checked against. */
const BlacklistSchema = z
	.object({
		'is-listed': z.boolean().nullish(),
		'list-host': z.string().nullish(),
		'list-rating': z.number().nullish(),
		'list-name': z.string().nullish(),
		'txt-record': z.string().nullish(),
		'return-code': z.string().nullish(),
		'response-time': z.number().nullish(),
	})
	.loose();

const AddressStructuredSchema = z
	.object({
		name: z.string().nullish(),
		number: z.string().nullish(),
		street: z.string().nullish(),
		area: z.string().nullish(),
		city: z.string().nullish(),
		county: z.string().nullish(),
		state: z.string().nullish(),
		'postal-code': z.string().nullish(),
		country: z.string().nullish(),
	})
	.loose();

const LocationSchema = z
	.object({
		country: z.string().nullish(),
		address: z.string().nullish(),
		city: z.string().nullish(),
		'country-code': z.string().nullish(),
		'country-code3': z.string().nullish(),
		latitude: z.number().nullish(),
		'postal-code': z.string().nullish(),
		longitude: z.number().nullish(),
		state: z.string().nullish(),
		'address-structured': AddressStructuredSchema.nullish(),
		'address-components': z.record(z.string(), z.string()).nullish(),
		'currency-code': z.string().nullish(),
		'location-type': z.string().nullish(),
		'location-tags': z.array(z.string()).nullish(),
		timezone: TimezoneSchema.nullish(),
		'region-code': z.string().nullish(),
		'postal-address': z.string().nullish(),
		'language-code': z.string().nullish(),
		geohash: z.string().nullish(),
		'continent-code': z.string().nullish(),
		'building-type': z.string().nullish(),
		'location-profile': z.record(z.string(), z.string()).nullish(),
	})
	.loose();

// ── ip.info ───────────────────────────────────────────────────────────────

const IpInfoInputSchema = z.object({
	ip: z.string().min(1).describe('The IPv4 or IPv6 address to look up.'),
});

export type IpInfoInput = z.input<typeof IpInfoInputSchema>;

const IpInfoResponseSchema = z
	.object({
		valid: z.boolean().nullish(),
		country: z.string().nullish(),
		hostname: z.string().nullish(),
		city: z.string().nullish(),
		'country-code': z.string().nullish(),
		latitude: z.number().nullish(),
		region: z.string().nullish(),
		longitude: z.number().nullish(),
		'continent-code': z.string().nullish(),
		ip: z.string().nullish(),
		'country-code3': z.string().nullish(),
		'currency-code': z.string().nullish(),
		'host-domain': z.string().nullish(),
		timezone: TimezoneSchema.nullish(),
		'is-v6': z.boolean().nullish(),
		'is-v4-mapped': z.boolean().nullish(),
		'is-bogon': z.boolean().nullish(),
		'region-code': z.string().nullish(),
		'language-code': z.string().nullish(),
	})
	.loose();

export type IpInfoResponse = z.infer<typeof IpInfoResponseSchema>;

// ── ip.blocklist ──────────────────────────────────────────────────────────

const IpBlocklistInputSchema = z.object({
	ip: z.string().min(1).describe('The IPv4 or IPv6 address to check.'),
});

export type IpBlocklistInput = z.input<typeof IpBlocklistInputSchema>;

const IpBlocklistResponseSchema = z
	.object({
		ip: z.string().nullish(),
		'is-bot': z.boolean().nullish(),
		'is-exploit-bot': z.boolean().nullish(),
		'is-malware': z.boolean().nullish(),
		'is-spider': z.boolean().nullish(),
		'is-dshield': z.boolean().nullish(),
		'list-count': z.number().nullish(),
		'is-proxy': z.boolean().nullish(),
		'is-hijacked': z.boolean().nullish(),
		'is-tor': z.boolean().nullish(),
		'is-spyware': z.boolean().nullish(),
		'is-spam-bot': z.boolean().nullish(),
		'is-listed': z.boolean().nullish(),
		'is-vpn': z.boolean().nullish(),
		'last-seen': z.number().nullish(),
		blocklists: z.array(z.string()).nullish(),
		sensors: z.array(BlocklistSensorSchema).nullish(),
		cidr: z.string().nullish(),
		'first-seen': z.number().nullish(),
		'last-seen-date': z.string().nullish(),
		'first-seen-date': z.string().nullish(),
		'total-hits': z.number().nullish(),
	})
	.loose();

export type IpBlocklistResponse = z.infer<typeof IpBlocklistResponseSchema>;

// ── ip.probe ──────────────────────────────────────────────────────────────

const IpProbeInputSchema = z.object({
	ip: z.string().min(1).describe('The IPv4 or IPv6 address to probe.'),
});

export type IpProbeInput = z.input<typeof IpProbeInputSchema>;

const IpProbeResponseSchema = z
	.object({
		valid: z.boolean().nullish(),
		country: z.string().nullish(),
		'provider-type': z.string().nullish(),
		'country-code': z.string().nullish(),
		hostname: z.string().nullish(),
		'provider-domain': z.string().nullish(),
		city: z.string().nullish(),
		'provider-website': z.string().nullish(),
		region: z.string().nullish(),
		'provider-description': z.string().nullish(),
		'continent-code': z.string().nullish(),
		'is-hosting': z.boolean().nullish(),
		'is-isp': z.boolean().nullish(),
	})
	.loose();

export type IpProbeResponse = z.infer<typeof IpProbeResponseSchema>;

// ── email.validate ────────────────────────────────────────────────────────

const EmailInputSchema = z.object({
	email: z.string().min(1).describe('The email address to check.'),
});

export type EmailInput = z.input<typeof EmailInputSchema>;

const EmailValidateResponseSchema = z
	.object({
		valid: z.boolean().nullish(),
		'syntax-error': z.boolean().nullish(),
		domain: z.string().nullish(),
		'domain-error': z.boolean().nullish(),
		'is-freemail': z.boolean().nullish(),
		email: z.string().nullish(),
		'is-disposable': z.boolean().nullish(),
		'typos-fixed': z.boolean().nullish(),
		'is-personal': z.boolean().nullish(),
		provider: z.string().nullish(),
		'mx-ip': z.string().nullish(),
		'domain-status': z.string().nullish(),
	})
	.loose();

export type EmailValidateResponse = z.infer<typeof EmailValidateResponseSchema>;

// ── email.verify ──────────────────────────────────────────────────────────

const EmailVerifyResponseSchema = z
	.object({
		valid: z.boolean().nullish(),
		verified: z.boolean().nullish(),
		email: z.string().nullish(),
		'typos-fixed': z.boolean().nullish(),
		'syntax-error': z.boolean().nullish(),
		'domain-error': z.boolean().nullish(),
		domain: z.string().nullish(),
		provider: z.string().nullish(),
		'is-freemail': z.boolean().nullish(),
		'is-disposable': z.boolean().nullish(),
		'is-personal': z.boolean().nullish(),
		'smtp-status': z.string().nullish(),
		'smtp-response': z.string().nullish(),
		'is-catch-all': z.boolean().nullish(),
		'is-deferred': z.boolean().nullish(),
		'mx-ip': z.string().nullish(),
		'domain-status': z.string().nullish(),
	})
	.loose();

export type EmailVerifyResponse = z.infer<typeof EmailVerifyResponseSchema>;

// ── phone.validate ────────────────────────────────────────────────────────

const PhoneInputSchema = z.object({
	number: z.string().min(1).describe('The phone number to check.'),
	countryCode: z
		.string()
		.min(2)
		.max(2)
		.optional()
		.describe(
			'The ISO two-letter country code to assume when the number has no country prefix.',
		),
});

export type PhoneInput = z.input<typeof PhoneInputSchema>;

const PhoneValidateResponseSchema = z
	.object({
		valid: z.boolean().nullish(),
		'international-calling-code': z.string().nullish(),
		'country-code': z.string().nullish(),
		location: z.string().nullish(),
		'is-mobile': z.boolean().nullish(),
		type: z.string().nullish(),
		'international-number': z.string().nullish(),
		'local-number': z.string().nullish(),
		country: z.string().nullish(),
		'country-code3': z.string().nullish(),
		'currency-code': z.string().nullish(),
		'prefix-network': z.string().nullish(),
	})
	.loose();

export type PhoneValidateResponse = z.infer<typeof PhoneValidateResponseSchema>;

// ── phone.hlrLookup ───────────────────────────────────────────────────────

const HlrLookupResponseSchema = z
	.object({
		'number-valid': z.boolean().nullish(),
		'international-calling-code': z.string().nullish(),
		mnc: z.string().nullish(),
		'number-type': z.string().nullish(),
		'hlr-valid': z.boolean().nullish(),
		'hlr-status': z.string().nullish(),
		'ported-network': z.string().nullish(),
		imsi: z.string().nullish(),
		mcc: z.string().nullish(),
		'international-number': z.string().nullish(),
		'local-number': z.string().nullish(),
		'country-code': z.string().nullish(),
		'is-ported': z.boolean().nullish(),
		msin: z.string().nullish(),
	})
	.loose();

export type HlrLookupResponse = z.infer<typeof HlrLookupResponseSchema>;

// ── web.uaLookup ──────────────────────────────────────────────────────────

const UaLookupInputSchema = z.object({
	ua: z.string().min(1).describe('The User-Agent string to parse.'),
});

export type UaLookupInput = z.input<typeof UaLookupInputSchema>;

const UaLookupResponseSchema = z
	.object({
		ua: z.string().nullish(),
		type: z.string().nullish(),
		name: z.string().nullish(),
		version: z.string().nullish(),
		// The spec and the live API send these as strings ("87"); a number is
		// accepted too so an older answer cannot fail a call.
		'version-major': z.union([z.string(), z.number()]).nullish(),
		'browser-engine': z.string().nullish(),
		'browser-release': z.string().nullish(),
		os: z.string().nullish(),
		'os-family': z.string().nullish(),
		'os-version': z.string().nullish(),
		'os-version-major': z.union([z.string(), z.number()]).nullish(),
		'is-mobile': z.boolean().nullish(),
		'is-webview': z.boolean().nullish(),
		'device-brand': z.string().nullish(),
		'device-model': z.string().nullish(),
		'browser-name': z.string().nullish(),
		'browser-version': z.string().nullish(),
		'is-app': z.boolean().nullish(),
	})
	.loose();

export type UaLookupResponse = z.infer<typeof UaLookupResponseSchema>;

// ── web.domainLookup ──────────────────────────────────────────────────────

const DomainLookupInputSchema = z.object({
	host: z.string().min(1).describe('The host or domain name to look up.'),
});

export type DomainLookupInput = z.input<typeof DomainLookupInputSchema>;

const DomainLookupResponseSchema = z
	.object({
		domain: z.string().nullish(),
		'is-malicious': z.boolean().nullish(),
		blocklists: z.array(z.string()).nullish(),
		sensors: z.array(BlocklistSensorSchema).nullish(),
		valid: z.boolean().nullish(),
		fqdn: z.string().nullish(),
		'is-subdomain': z.boolean().nullish(),
		tld: z.string().nullish(),
		// The ISO country code of a country-code TLD, or "" for any other TLD.
		'tld-cc': z.string().nullish(),
		rank: z.number().nullish(),
		'is-gov': z.boolean().nullish(),
		'is-opennic': z.boolean().nullish(),
		'is-pending': z.boolean().nullish(),
		'is-adult': z.boolean().nullish(),
	})
	.loose();

export type DomainLookupResponse = z.infer<typeof DomainLookupResponseSchema>;

// ── web.hostReputation ────────────────────────────────────────────────────

const HostReputationInputSchema = z.object({
	host: z
		.string()
		.min(1)
		.describe('The host name or IPv4 address to check against DNSBLs.'),
});

export type HostReputationInput = z.input<typeof HostReputationInputSchema>;

const HostReputationResponseSchema = z
	.object({
		'is-listed': z.boolean().nullish(),
		lists: z.array(BlacklistSchema).nullish(),
		'list-count': z.number().nullish(),
		host: z.string().nullish(),
	})
	.loose();

export type HostReputationResponse = z.infer<
	typeof HostReputationResponseSchema
>;

// ── web.urlInfo ───────────────────────────────────────────────────────────

const UrlInfoInputSchema = z.object({
	url: z.string().min(1).describe('The URL to inspect.'),
	fetchContent: z
		.boolean()
		.optional()
		.describe('Fetch and analyse the page body as well as the headers.'),
});

export type UrlInfoInput = z.input<typeof UrlInfoInputSchema>;

const UrlInfoResponseSchema = z
	.object({
		'http-status-message': z.string().nullish(),
		'server-region': z.string().nullish(),
		query: z.record(z.string(), z.string()).nullish(),
		'server-name': z.string().nullish(),
		'url-port': z.number().nullish(),
		'server-country': z.string().nullish(),
		real: z.boolean().nullish(),
		'server-city': z.string().nullish(),
		'url-path': z.string().nullish(),
		url: z.string().nullish(),
		valid: z.boolean().nullish(),
		'server-hostname': z.string().nullish(),
		'load-time': z.number().nullish(),
		'http-ok': z.boolean().nullish(),
	})
	.loose();

export type UrlInfoResponse = z.infer<typeof UrlInfoResponseSchema>;

// ── geocode.address ───────────────────────────────────────────────────────

const GeocodeAddressInputSchema = z
	.object({
		address: z.string().min(1).optional().describe('A full street address.'),
		houseNumber: z.string().min(1).optional(),
		street: z.string().min(1).optional(),
		city: z.string().min(1).optional(),
		state: z.string().min(1).optional(),
		postalCode: z.string().min(1).optional(),
		country: z
			.string()
			.min(2)
			.max(2)
			.optional()
			.describe('The ISO two-letter country code.'),
		languageCode: z.string().min(2).max(2).optional(),
	})
	.superRefine((value, ctx) => {
		// Neutrino needs either a full address or the structured parts.
		const hasAddress = Boolean(value.address);
		const hasParts = Boolean(
			value.city || value.street || value.postalCode || value.houseNumber,
		);
		if (!hasAddress && !hasParts) {
			ctx.addIssue({
				code: 'custom',
				message: 'Either address or at least one address part is required.',
			});
		}
	});

export type GeocodeAddressInput = z.input<typeof GeocodeAddressInputSchema>;

const GeocodeAddressResponseSchema = z
	.object({
		// A match count here, unlike geocode-reverse where it is a boolean.
		found: z.number().nullish(),
		locations: z.array(LocationSchema).nullish(),
	})
	.loose();

export type GeocodeAddressResponse = z.infer<
	typeof GeocodeAddressResponseSchema
>;

// ── geocode.reverse ───────────────────────────────────────────────────────

const GeocodeReverseInputSchema = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	languageCode: z.string().min(2).max(2).optional(),
});

export type GeocodeReverseInput = z.input<typeof GeocodeReverseInputSchema>;

const GeocodeReverseResponseSchema = z
	.object({
		country: z.string().nullish(),
		found: z.boolean().nullish(),
		address: z.string().nullish(),
		city: z.string().nullish(),
		'country-code': z.string().nullish(),
		'postal-code': z.string().nullish(),
		state: z.string().nullish(),
		'address-structured': AddressStructuredSchema.nullish(),
		'address-components': z.record(z.string(), z.string()).nullish(),
		'country-code3': z.string().nullish(),
		'currency-code': z.string().nullish(),
		'location-type': z.string().nullish(),
		'location-tags': z.array(z.string()).nullish(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
		'region-code': z.string().nullish(),
		'language-code': z.string().nullish(),
		timezone: TimezoneSchema.nullish(),
		'location-profile': z.record(z.string(), z.string()).nullish(),
	})
	.loose();

export type GeocodeReverseResponse = z.infer<
	typeof GeocodeReverseResponseSchema
>;

// ── commerce.binLookup ────────────────────────────────────────────────────

const BinLookupInputSchema = z.object({
	binNumber: z
		.string()
		.min(6)
		.describe('The card BIN or first six digits of the card number.'),
});

export type BinLookupInput = z.input<typeof BinLookupInputSchema>;

const BinLookupResponseSchema = z
	.object({
		country: z.string().nullish(),
		'ip-city': z.string().nullish(),
		'ip-matches-bin': z.boolean().nullish(),
		'card-type': z.string().nullish(),
		'card-category': z.string().nullish(),
		'ip-country-code': z.string().nullish(),
		'ip-country': z.string().nullish(),
		issuer: z.string().nullish(),
		'ip-blocklisted': z.boolean().nullish(),
		valid: z.boolean().nullish(),
		'ip-blocklists': z.array(z.string()).nullish(),
		'issuer-website': z.string().nullish(),
		'country-code': z.string().nullish(),
		'ip-region': z.string().nullish(),
	})
	.loose();

export type BinLookupResponse = z.infer<typeof BinLookupResponseSchema>;

// ── commerce.convert ──────────────────────────────────────────────────────

const ConvertInputSchema = z.object({
	fromValue: z.number().describe('The value to convert.'),
	fromType: z
		.string()
		.min(1)
		.describe(
			'The unit or currency to convert from, e.g. USD, kg, km, c. Neutrino publishes the full list in its docs.',
		),
	toType: z.string().min(1).describe('The unit or currency to convert to.'),
});

export type ConvertInput = z.input<typeof ConvertInputSchema>;

const ConvertResponseSchema = z
	.object({
		valid: z.boolean().nullish(),
		result: z.string().nullish(),
		'from-value': z.string().nullish(),
		'to-type': z.string().nullish(),
		'from-type': z.string().nullish(),
		'result-float': z.number().nullish(),
		'from-name': z.string().nullish(),
		'from-symbol': z.string().nullish(),
		'to-name': z.string().nullish(),
		'to-symbol': z.string().nullish(),
		'historical-date': z.string().nullish(),
	})
	.loose();

export type ConvertResponse = z.infer<typeof ConvertResponseSchema>;

// ── messaging.smsVerify ───────────────────────────────────────────────────

const SmsVerifyInputSchema = z.object({
	number: z.string().min(1).describe('The phone number to message.'),
	codeLength: z
		.number()
		.int()
		.min(4)
		.max(12)
		.optional()
		.describe('How many digits the generated security code has (4 to 12).'),
	countryCode: z.string().min(2).max(2).optional(),
	languageCode: z.string().min(2).max(2).optional(),
	brandName: z.string().min(1).optional(),
});

export type SmsVerifyInput = z.input<typeof SmsVerifyInputSchema>;

const SmsVerifyResponseSchema = z
	.object({
		'number-valid': z.boolean().nullish(),
		'security-code': z.string().nullish(),
		sent: z.boolean().nullish(),
	})
	.loose();

export type SmsVerifyResponse = z.infer<typeof SmsVerifyResponseSchema>;

// ── messaging.verifySecurityCode ──────────────────────────────────────────

const VerifySecurityCodeInputSchema = z.object({
	securityCode: z
		.string()
		.min(1)
		.describe('The code the person typed in, from smsVerify or phoneVerify.'),
	limitBy: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Any id for the person (user id, IP) to cap failed attempts per value against brute force.',
		),
});

export type VerifySecurityCodeInput = z.input<
	typeof VerifySecurityCodeInputSchema
>;

const VerifySecurityCodeResponseSchema = z
	.object({
		verified: z.boolean().nullish(),
	})
	.loose();

export type VerifySecurityCodeResponse = z.infer<
	typeof VerifySecurityCodeResponseSchema
>;

// ── messaging.phoneVerify ─────────────────────────────────────────────────

const PhoneVerifyInputSchema = z.object({
	number: z.string().min(1).describe('The phone number to call.'),
	codeLength: z
		.number()
		.int()
		.min(4)
		.max(12)
		.optional()
		.describe('How many digits the generated security code has (4 to 12).'),
	playbackDelay: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Milliseconds between each digit read out.'),
	countryCode: z.string().min(2).max(2).optional(),
	languageCode: z.string().min(2).max(2).optional(),
});

export type PhoneVerifyInput = z.input<typeof PhoneVerifyInputSchema>;

const PhoneVerifyResponseSchema = z
	.object({
		'number-valid': z.boolean().nullish(),
		calling: z.boolean().nullish(),
		'security-code': z.string().nullish(),
	})
	.loose();

export type PhoneVerifyResponse = z.infer<typeof PhoneVerifyResponseSchema>;

// ── text.badWordFilter ────────────────────────────────────────────────────

const BadWordFilterInputSchema = z.object({
	content: z
		.string()
		.min(1)
		.describe('The text to scan, or a URL whose page text Neutrino scans.'),
	censorCharacter: z
		.string()
		.min(1)
		.max(1)
		.optional()
		.describe('Replace each letter of a bad word with this character.'),
	catalog: z
		.string()
		.min(1)
		.optional()
		.describe('Which word list to use: "strict" (the default) or "obscene".'),
});

export type BadWordFilterInput = z.input<typeof BadWordFilterInputSchema>;

const BadWordFilterResponseSchema = z
	.object({
		'bad-words-list': z.array(z.string()).nullish(),
		'bad-words-total': z.number().nullish(),
		'censored-content': z.string().nullish(),
		'is-bad': z.boolean().nullish(),
	})
	.loose();

export type BadWordFilterResponse = z.infer<typeof BadWordFilterResponseSchema>;

// ── web.browserBot ────────────────────────────────────────────────────────

const BrowserBotInputSchema = z.object({
	url: z.string().min(1).describe('The page to load in a real browser.'),
	timeout: z
		.number()
		.int()
		.min(1)
		.max(120)
		.optional()
		.describe(
			'Seconds to wait for the page to load (Neutrino defaults to 30).',
		),
	delay: z
		.number()
		.int()
		.min(0)
		.max(10)
		.optional()
		.describe('Seconds to wait after the page loads, for scripts to finish.'),
	selector: z
		.string()
		.min(1)
		.optional()
		.describe('A CSS selector; the matching elements come back in `elements`.'),
	exec: z
		.array(z.string().min(1))
		.optional()
		.describe(
			'JavaScript statements to run on the page in order, e.g. click or fill a field; their values come back in `exec-results`.',
		),
	userAgent: z.string().min(1).optional(),
	ignoreCertificateErrors: z.boolean().optional(),
});

export type BrowserBotInput = z.input<typeof BrowserBotInputSchema>;

const BrowserBotResponseSchema = z
	.object({
		url: z.string().nullish(),
		content: z.string().nullish(),
		'mime-type': z.string().nullish(),
		title: z.string().nullish(),
		'is-error': z.boolean().nullish(),
		'is-timeout': z.boolean().nullish(),
		'error-message': z.string().nullish(),
		'http-status-code': z.number().nullish(),
		'http-status-message': z.string().nullish(),
		'is-http-ok': z.boolean().nullish(),
		'is-http-redirect': z.boolean().nullish(),
		'http-redirect-url': z.string().nullish(),
		'server-ip': z.string().nullish(),
		'load-time': z.number().nullish(),
		// unknown: header names and values are whatever the page's server sent.
		'response-headers': z.record(z.string(), z.unknown()).nullish(),
		'is-secure': z.boolean().nullish(),
		// unknown: TLS details are a provider object we pass through untouched.
		'security-details': z.record(z.string(), z.unknown()).nullish(),
		// unknown: each element is the provider's own shape (tag, attributes,
		// text, html); callers read the fields they asked for with `selector`.
		elements: z.array(z.record(z.string(), z.unknown())).nullish(),
		// unknown: each entry holds the return value of one `exec` statement.
		'exec-results': z.array(z.record(z.string(), z.unknown())).nullish(),
		'language-code': z.string().nullish(),
		'url-valid': z.boolean().nullish(),
		'content-size': z.number().nullish(),
		'server-hostname': z.string().nullish(),
	})
	.loose();

export type BrowserBotResponse = z.infer<typeof BrowserBotResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type NeutrinoEndpointInputs = {
	ipInfo: IpInfoInput;
	ipBlocklist: IpBlocklistInput;
	ipProbe: IpProbeInput;
	emailValidate: EmailInput;
	emailVerify: EmailInput;
	phoneValidate: PhoneInput;
	phoneHlrLookup: PhoneInput;
	uaLookup: UaLookupInput;
	domainLookup: DomainLookupInput;
	hostReputation: HostReputationInput;
	urlInfo: UrlInfoInput;
	geocodeAddress: GeocodeAddressInput;
	geocodeReverse: GeocodeReverseInput;
	binLookup: BinLookupInput;
	convert: ConvertInput;
	smsVerify: SmsVerifyInput;
	verifySecurityCode: VerifySecurityCodeInput;
	phoneVerify: PhoneVerifyInput;
	badWordFilter: BadWordFilterInput;
	browserBot: BrowserBotInput;
};

export type NeutrinoEndpointOutputs = {
	ipInfo: IpInfoResponse;
	ipBlocklist: IpBlocklistResponse;
	ipProbe: IpProbeResponse;
	emailValidate: EmailValidateResponse;
	emailVerify: EmailVerifyResponse;
	phoneValidate: PhoneValidateResponse;
	phoneHlrLookup: HlrLookupResponse;
	uaLookup: UaLookupResponse;
	domainLookup: DomainLookupResponse;
	hostReputation: HostReputationResponse;
	urlInfo: UrlInfoResponse;
	geocodeAddress: GeocodeAddressResponse;
	geocodeReverse: GeocodeReverseResponse;
	binLookup: BinLookupResponse;
	convert: ConvertResponse;
	smsVerify: SmsVerifyResponse;
	verifySecurityCode: VerifySecurityCodeResponse;
	phoneVerify: PhoneVerifyResponse;
	badWordFilter: BadWordFilterResponse;
	browserBot: BrowserBotResponse;
};

export const NeutrinoEndpointInputSchemas = {
	ipInfo: IpInfoInputSchema,
	ipBlocklist: IpBlocklistInputSchema,
	ipProbe: IpProbeInputSchema,
	emailValidate: EmailInputSchema,
	emailVerify: EmailInputSchema,
	phoneValidate: PhoneInputSchema,
	phoneHlrLookup: PhoneInputSchema,
	uaLookup: UaLookupInputSchema,
	domainLookup: DomainLookupInputSchema,
	hostReputation: HostReputationInputSchema,
	urlInfo: UrlInfoInputSchema,
	geocodeAddress: GeocodeAddressInputSchema,
	geocodeReverse: GeocodeReverseInputSchema,
	binLookup: BinLookupInputSchema,
	convert: ConvertInputSchema,
	smsVerify: SmsVerifyInputSchema,
	verifySecurityCode: VerifySecurityCodeInputSchema,
	phoneVerify: PhoneVerifyInputSchema,
	badWordFilter: BadWordFilterInputSchema,
	browserBot: BrowserBotInputSchema,
} as const;

export const NeutrinoEndpointOutputSchemas = {
	ipInfo: IpInfoResponseSchema,
	ipBlocklist: IpBlocklistResponseSchema,
	ipProbe: IpProbeResponseSchema,
	emailValidate: EmailValidateResponseSchema,
	emailVerify: EmailVerifyResponseSchema,
	phoneValidate: PhoneValidateResponseSchema,
	phoneHlrLookup: HlrLookupResponseSchema,
	uaLookup: UaLookupResponseSchema,
	domainLookup: DomainLookupResponseSchema,
	hostReputation: HostReputationResponseSchema,
	urlInfo: UrlInfoResponseSchema,
	geocodeAddress: GeocodeAddressResponseSchema,
	geocodeReverse: GeocodeReverseResponseSchema,
	binLookup: BinLookupResponseSchema,
	convert: ConvertResponseSchema,
	smsVerify: SmsVerifyResponseSchema,
	verifySecurityCode: VerifySecurityCodeResponseSchema,
	phoneVerify: PhoneVerifyResponseSchema,
	badWordFilter: BadWordFilterResponseSchema,
	browserBot: BrowserBotResponseSchema,
} as const;
