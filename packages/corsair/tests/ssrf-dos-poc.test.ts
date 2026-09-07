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

import { describe, expect, test } from 'vitest';
import {
	TokenUrlValidationError,
	validateTokenUrl,
} from '../core/auth/url-validator';

// ─────────────────────────────────────────────────────────────────────────────
// PoC #1 — SSRF via unvalidated tokenUrl
//
// BEFORE fix: refreshOAuthTokensLocal() and exchangeCodeForTokens() called
//   fetch(tokenUrl) / https.request(tokenUrl) with ZERO validation.
//   An attacker could set tokenUrl to any URL and steal client credentials.
//
// AFTER fix: validateTokenUrl() rejects non-HTTPS, private IPs, cloud
//   metadata hostnames before any credential material leaves the process.
// ─────────────────────────────────────────────────────────────────────────────

describe('PoC #1: SSRF via unvalidated tokenUrl', () => {
	// ── Attack vector: HTTP scheme (credential interception) ─────────────

	test('BLOCKS http:// tokenUrl — credentials would be sent in plaintext', () => {
		expect(() => validateTokenUrl('http://oauth.provider.com/token')).toThrow(
			TokenUrlValidationError,
		);
		expect(() => validateTokenUrl('http://oauth.provider.com/token')).toThrow(
			/must use HTTPS/,
		);
	});

	// ── Attack vector: AWS Instance Metadata Service (IMDS) ─────────────

	test('BLOCKS AWS metadata IP 169.254.169.254 — IAM credential theft', () => {
		// An attacker sets tokenUrl to the AWS IMDS endpoint.
		// The SDK would POST client_secret + refresh_token to 169.254.169.254
		// and the response contains IAM temporary credentials (AccessKeyId,
		// SecretAccessKey, SessionToken) → full AWS account compromise.
		expect(() =>
			validateTokenUrl(
				'https://169.254.169.254/latest/meta-data/iam/security-credentials/',
			),
		).toThrow(TokenUrlValidationError);
		expect(() =>
			validateTokenUrl(
				'https://169.254.169.254/latest/meta-data/iam/security-credentials/',
			),
		).toThrow(/private\/reserved IP/);
	});

	// ── Attack vector: GCP metadata service ─────────────────────────────

	test('BLOCKS GCP metadata hostname — service account token theft', () => {
		// GCP metadata endpoint uses a hostname instead of an IP.
		// Without validation, the SDK would POST credentials to Google's
		// metadata service, potentially leaking service account tokens.
		expect(() =>
			validateTokenUrl(
				'https://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
			),
		).toThrow(TokenUrlValidationError);
		expect(() =>
			validateTokenUrl(
				'https://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
			),
		).toThrow(/blocked/);
	});

	// ── Attack vector: Azure IMDS ───────────────────────────────────────

	test('BLOCKS Azure metadata IP 169.254.169.254 — managed identity theft', () => {
		expect(() =>
			validateTokenUrl(
				'https://169.254.169.254/metadata/identity/oauth2/token',
			),
		).toThrow(TokenUrlValidationError);
	});

	// ── Attack vector: localhost / loopback ──────────────────────────────

	test('BLOCKS localhost — internal service access', () => {
		expect(() =>
			validateTokenUrl('https://localhost:6379/'),
		).toThrow(TokenUrlValidationError);
		expect(() =>
			validateTokenUrl('https://localhost:6379/'),
		).toThrow(/blocked/);
	});

	test('BLOCKS 127.x.x.x loopback range', () => {
		expect(() =>
			validateTokenUrl('https://127.0.0.1/token'),
		).toThrow(/private\/reserved IP/);
		expect(() =>
			validateTokenUrl('https://127.0.0.53/token'),
		).toThrow(/private\/reserved IP/);
	});

	// ── Attack vector: RFC 1918 private networks ────────────────────────

	test('BLOCKS 10.x.x.x private range — internal network scanning', () => {
		expect(() =>
			validateTokenUrl('https://10.0.0.1:8500/v1/kv/'),
		).toThrow(/private\/reserved IP/);
	});

	test('BLOCKS 172.16-31.x.x private range', () => {
		expect(() =>
			validateTokenUrl('https://172.16.0.1/token'),
		).toThrow(/private\/reserved IP/);
		expect(() =>
			validateTokenUrl('https://172.31.255.255/token'),
		).toThrow(/private\/reserved IP/);
		// 172.32.x.x is NOT private — should pass
		expect(() =>
			validateTokenUrl('https://172.32.0.1/token'),
		).not.toThrow();
	});

	test('BLOCKS 192.168.x.x private range', () => {
		expect(() =>
			validateTokenUrl('https://192.168.1.1/token'),
		).toThrow(/private\/reserved IP/);
	});

	// ── Attack vector: Credential exfiltration to attacker server ───────

	test('ALLOWS legitimate HTTPS tokenUrl (positive case)', () => {
		// Real OAuth providers must pass validation
		expect(() =>
			validateTokenUrl('https://accounts.google.com/o/oauth2/token'),
		).not.toThrow();
		expect(() =>
			validateTokenUrl('https://github.com/login/oauth/access_token'),
		).not.toThrow();
		expect(() =>
			validateTokenUrl('https://login.microsoftonline.com/common/oauth2/v2.0/token'),
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
		expect(() =>
			validateTokenUrl('https://[::1]/token'),
		).toThrow(TokenUrlValidationError);
	});

	// ── Attack vector: 0.x.x.x current-network ─────────────────────────

	test('BLOCKS 0.x.x.x current-network range', () => {
		expect(() =>
			validateTokenUrl('https://0.0.0.0/token'),
		).toThrow(/private\/reserved IP/);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// PoC #2 — Unbounded OAuth response body → OOM DoS
//
// BEFORE fix: exchange.ts accumulated `data += chunk` with no limit.
//   oauth-refresh-local.ts called `response.text()` with no limit.
//   A malicious tokenUrl server could send a multi-GB response, crashing
//   the Node.js process with: FATAL ERROR: Reached heap limit
//
// AFTER fix: Both paths cap response at 1 MB.
// ─────────────────────────────────────────────────────────────────────────────

describe('PoC #2: Unbounded response body — OOM DoS', () => {
	test('oauth-refresh-local rejects oversized responses', async () => {
		// Dynamic import to avoid module-level side effects
		const { refreshOAuthTokensLocal } = await import(
			'../core/auth/oauth-refresh-local'
		);

		// Mock fetch to return a 2MB response body
		const oversizedBody = JSON.stringify({
			access_token: 'tok_test',
			padding: 'X'.repeat(2 * 1024 * 1024), // 2MB
		});

		const originalFetch = globalThis.fetch;
		globalThis.fetch = (async () =>
			new Response(oversizedBody, {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})) as typeof fetch;

		try {
			await expect(
				refreshOAuthTokensLocal({
					tokenUrl: 'https://oauth.provider.com/token',
					refreshToken: 'rt_test',
					clientSecret: 'cs_test',
				}),
			).rejects.toThrow(/exceeded maximum size/);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	test('oauth-refresh-local accepts normal-sized responses', async () => {
		const { refreshOAuthTokensLocal } = await import(
			'../core/auth/oauth-refresh-local'
		);

		// Normal token response (~200 bytes)
		const normalBody = JSON.stringify({
			access_token: 'at_fresh_token_12345',
			refresh_token: 'rt_rotated_67890',
			expires_in: 3600,
			token_type: 'bearer',
		});

		const originalFetch = globalThis.fetch;
		globalThis.fetch = (async () =>
			new Response(normalBody, {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})) as typeof fetch;

		try {
			const result = await refreshOAuthTokensLocal({
				tokenUrl: 'https://oauth.provider.com/token',
				refreshToken: 'rt_test',
				clientSecret: 'cs_test',
			});
			expect(result.access_token).toBe('at_fresh_token_12345');
			expect(result.refresh_token).toBe('rt_rotated_67890');
			expect(result.expires_in).toBe(3600);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
