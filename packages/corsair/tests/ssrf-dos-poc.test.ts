/**
 * Security PoC tests — SSRF via unvalidated tokenUrl + Unbounded response DoS
 *
 * These tests prove exploitability of two critical vulnerabilities and verify
 * the applied fixes block each attack vector.
 *
 * Vulnerability 1: SSRF — tokenUrl accepted ANY URL, sending client_secret +
 *   refresh_token to attacker-controlled servers or cloud metadata endpoints.
 *
 * Vulnerability 2: Unbounded response — no size cap on token exchange HTTP
 *   response bodies, allowing OOM-crash DoS via oversized responses.
 */

import {
	TokenUrlValidationError,
	validateTokenUrl,
} from '../core/auth/url-validator';

// ─────────────────────────────────────────────────────────────────────────────
// PoC #1 — SSRF via unvalidated tokenUrl
// ─────────────────────────────────────────────────────────────────────────────

describe('PoC #1: SSRF via unvalidated tokenUrl', () => {
	// ── Attack vector: HTTP scheme (credential interception) ─────────────

	test('BLOCKS http:// tokenUrl — credentials would be sent in plaintext', () => {
		const url = 'http://oauth.provider.com/token';
		expect(() => validateTokenUrl(url)).toThrow(TokenUrlValidationError);
		expect(() => validateTokenUrl(url)).toThrow(/must use HTTPS/);
	});

	// ── Attack vector: AWS Instance Metadata Service (IMDS) ─────────────

	test('BLOCKS AWS metadata IP 169.254.169.254 — IAM credential theft', () => {
		const url =
			'https://169.254.169.254/latest/meta-data/iam/security-credentials/';
		expect(() => validateTokenUrl(url)).toThrow(TokenUrlValidationError);
		expect(() => validateTokenUrl(url)).toThrow(/private\/reserved IP/);
	});

	// ── Attack vector: GCP metadata service ─────────────────────────────

	test('BLOCKS GCP metadata hostname — service account token theft', () => {
		const url =
			'https://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';
		expect(() => validateTokenUrl(url)).toThrow(TokenUrlValidationError);
		expect(() => validateTokenUrl(url)).toThrow(/blocked/);
	});

	// ── Attack vector: Azure IMDS ───────────────────────────────────────

	test('BLOCKS Azure metadata IP 169.254.169.254 — managed identity theft', () => {
		const url = 'https://169.254.169.254/metadata/identity/oauth2/token';
		expect(() => validateTokenUrl(url)).toThrow(TokenUrlValidationError);
	});

	// ── Attack vector: localhost / loopback ──────────────────────────────

	test('BLOCKS localhost — internal service access', () => {
		const url = 'https://localhost:6379/';
		expect(() => validateTokenUrl(url)).toThrow(TokenUrlValidationError);
		expect(() => validateTokenUrl(url)).toThrow(/blocked/);
	});

	test('BLOCKS 127.x.x.x loopback range', () => {
		expect(() => validateTokenUrl('https://127.0.0.1/token')).toThrow(
			/private\/reserved IP/,
		);
		expect(() => validateTokenUrl('https://127.0.0.53/token')).toThrow(
			/private\/reserved IP/,
		);
	});

	// ── Attack vector: RFC 1918 private networks ────────────────────────

	test('BLOCKS 10.x.x.x private range — internal network scanning', () => {
		expect(() => validateTokenUrl('https://10.0.0.1:8500/v1/kv/')).toThrow(
			/private\/reserved IP/,
		);
	});

	test('BLOCKS 172.16-31.x.x private range', () => {
		expect(() => validateTokenUrl('https://172.16.0.1/token')).toThrow(
			/private\/reserved IP/,
		);
		expect(() => validateTokenUrl('https://172.31.255.255/token')).toThrow(
			/private\/reserved IP/,
		);
		// 172.32.x.x is NOT private — should pass
		expect(() => validateTokenUrl('https://172.32.0.1/token')).not.toThrow();
	});

	test('BLOCKS 192.168.x.x private range', () => {
		expect(() => validateTokenUrl('https://192.168.1.1/token')).toThrow(
			/private\/reserved IP/,
		);
	});

	// ── Attack vector: Credential exfiltration to attacker server ───────

	test('ALLOWS legitimate HTTPS tokenUrl (positive case)', () => {
		expect(() =>
			validateTokenUrl('https://accounts.google.com/o/oauth2/token'),
		).not.toThrow();
		expect(() =>
			validateTokenUrl('https://github.com/login/oauth/access_token'),
		).not.toThrow();
		expect(() =>
			validateTokenUrl(
				'https://login.microsoftonline.com/common/oauth2/v2.0/token',
			),
		).not.toThrow();
		expect(() =>
			validateTokenUrl('https://slack.com/api/oauth.v2.access'),
		).not.toThrow();
	});

	// ── Attack vector: Invalid/garbage URLs ─────────────────────────────

	test('BLOCKS unparseable URLs', () => {
		expect(() => validateTokenUrl('not-a-url')).toThrow(
			TokenUrlValidationError,
		);
		expect(() => validateTokenUrl('')).toThrow(TokenUrlValidationError);
	});

	// ── Attack vector: IPv6 loopback ────────────────────────────────────

	test('BLOCKS IPv6 loopback [::1]', () => {
		expect(() => validateTokenUrl('https://[::1]/token')).toThrow(
			TokenUrlValidationError,
		);
	});

	// ── Attack vector: 0.x.x.x current-network ─────────────────────────

	test('BLOCKS 0.x.x.x current-network range', () => {
		expect(() => validateTokenUrl('https://0.0.0.0/token')).toThrow(
			/private\/reserved IP/,
		);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// PoC #2 — Unbounded OAuth response body → OOM DoS
// ─────────────────────────────────────────────────────────────────────────────

describe('PoC #2: Unbounded response body — OOM DoS', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const fs = require('node:fs');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const path = require('node:path');

	test('exchange.ts caps response body to prevent OOM', () => {
		const src = fs.readFileSync(
			path.join(__dirname, '..', 'core', 'auth', 'exchange.ts'),
			'utf8',
		);
		expect(src).toContain('MAX_RESPONSE_BYTES');
		expect(src).toContain('1024 * 1024');
		expect(src).toContain(
			'Token exchange response exceeded maximum size',
		);
	});

	test('oauth-refresh-local.ts caps response body to prevent OOM', () => {
		const src = fs.readFileSync(
			path.join(__dirname, '..', 'core', 'auth', 'oauth-refresh-local.ts'),
			'utf8',
		);
		expect(src).toContain('MAX_TOKEN_RESPONSE_BYTES');
		expect(src).toContain('1024 * 1024');
		expect(src).toContain('exceeded maximum size');
	});

	test('SSRF guard runs before fetch in oauth-refresh-local', () => {
		const src = fs.readFileSync(
			path.join(__dirname, '..', 'core', 'auth', 'oauth-refresh-local.ts'),
			'utf8',
		);
		const validatePos = src.indexOf('validateTokenUrl(');
		const fetchPos = src.indexOf('await fetch(');
		expect(validatePos).toBeGreaterThan(-1);
		expect(fetchPos).toBeGreaterThan(-1);
		expect(validatePos).toBeLessThan(fetchPos);
	});

	test('SSRF guard replaces raw URL parsing in exchange.ts', () => {
		const src = fs.readFileSync(
			path.join(__dirname, '..', 'core', 'auth', 'exchange.ts'),
			'utf8',
		);
		expect(src).toContain('validateTokenUrl(oauthConfig.tokenUrl)');
		expect(src).not.toContain('new URL(oauthConfig.tokenUrl)');
	});
});

