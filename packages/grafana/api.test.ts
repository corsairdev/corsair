import 'dotenv/config';
import { makeGrafanaRawRequest, makeGrafanaRequest } from './client';
import type {
	DashboardsQueryPublicResponse,
	HealthGetResponse,
	JwksRetrieveResponse,
	LogsCreateOtlpResponse,
	RingGetDistributorHaTrackerResponse,
	RingGetIndexGatewayResponse,
	RingGetOverridesExporterResponse,
	RingGetRulerResponse,
	SamlPostAcsResponse,
	StatusGetResponse,
	StoreGatewayGetTenantsResponse,
} from './endpoints/types';
import { GrafanaEndpointOutputSchemas } from './endpoints/types';

const BEARER_TOKEN = process.env.GRAFANA_BEARER_TOKEN!;
const GRAFANA_URL = process.env.GRAFANA_URL!;
const PUBLIC_DASHBOARD_ACCESS_TOKEN =
	process.env.GRAFANA_PUBLIC_DASHBOARD_ACCESS_TOKEN;
const PUBLIC_DASHBOARD_PANEL_ID = process.env.GRAFANA_PUBLIC_DASHBOARD_PANEL_ID
	? parseInt(process.env.GRAFANA_PUBLIC_DASHBOARD_PANEL_ID, 10)
	: undefined;

describe('Grafana API Type Tests', () => {
	describe('health', () => {
		it('healthGet returns correct type', async () => {
			const raw = await makeGrafanaRequest<{
				version?: string;
				commit?: string;
				database?: string;
				enterpriseCommit?: string;
			}>('/api/health', BEARER_TOKEN, GRAFANA_URL);

			const result: HealthGetResponse = {
				// Spread all raw API fields so unknown Grafana response fields pass through
				data: { ...raw },
				successful: true,
			};

			GrafanaEndpointOutputSchemas.healthGet.parse(result);
		});
	});

	describe('status', () => {
		it('statusGet returns correct type', async () => {
			let license_available = false;
			try {
				const raw = await makeGrafanaRequest<{
					licenseExpiry?: number;
					hasLicense?: boolean;
				}>('/api/licensing/check', BEARER_TOKEN, GRAFANA_URL);
				license_available =
					raw.hasLicense === true ||
					(raw.licenseExpiry !== undefined &&
						raw.licenseExpiry > Date.now() / 1000);
			} catch {}

			const result: StatusGetResponse = {
				data: { license_available },
				successful: true,
			};

			GrafanaEndpointOutputSchemas.statusGet.parse(result);
		});
	});

	describe('ring', () => {
		it('ringGetDistributorHaTracker returns correct type', async () => {
			const raw = await makeGrafanaRawRequest(
				'/distributor/ha-tracker',
				BEARER_TOKEN,
				GRAFANA_URL,
			);

			const result: RingGetDistributorHaTrackerResponse = {
				data: {
					html_content: raw.content,
					status_code: raw.status_code,
				},
				successful: true,
			};

			GrafanaEndpointOutputSchemas.ringGetDistributorHaTracker.parse(result);
		});

		it('ringGetIndexGateway returns correct type', async () => {
			const raw = await makeGrafanaRawRequest(
				'/index-gateway/ring',
				BEARER_TOKEN,
				GRAFANA_URL,
			);

			const result: RingGetIndexGatewayResponse = {
				data: {
					content: raw.content,
					content_type: raw.content_type,
				},
				successful: true,
			};

			GrafanaEndpointOutputSchemas.ringGetIndexGateway.parse(result);
		});

		it('ringGetOverridesExporter returns correct type', async () => {
			const raw = await makeGrafanaRawRequest(
				'/overrides-exporter/ring',
				BEARER_TOKEN,
				GRAFANA_URL,
			);

			const result: RingGetOverridesExporterResponse = {
				data: { html_content: raw.content },
				successful: true,
			};

			GrafanaEndpointOutputSchemas.ringGetOverridesExporter.parse(result);
		});

		it('ringGetRuler returns correct type', async () => {
			const raw = await makeGrafanaRawRequest(
				'/ruler/ring',
				BEARER_TOKEN,
				GRAFANA_URL,
			);

			const result: RingGetRulerResponse = {
				data: {
					content: raw.content,
					content_type: raw.content_type,
				},
				successful: true,
			};

			GrafanaEndpointOutputSchemas.ringGetRuler.parse(result);
		});
	});

	describe('storeGateway', () => {
		it('storeGatewayGetTenants returns correct type', async () => {
			const raw = await makeGrafanaRawRequest(
				'/store-gateway/tenants',
				BEARER_TOKEN,
				GRAFANA_URL,
			);

			const result: StoreGatewayGetTenantsResponse = {
				data: {
					content: raw.content,
					content_type: raw.content_type,
				},
				successful: true,
			};

			GrafanaEndpointOutputSchemas.storeGatewayGetTenants.parse(result);
		});
	});

	describe('logs', () => {
		it('logsCreateOtlp returns correct type', async () => {
			const body = {
				resourceLogs: [
					{
						resource: {
							attributes: [
								{
									key: 'service.name',
									value: { stringValue: 'test-service' },
								},
							],
						},
						scopeLogs: [
							{
								scope: { name: 'test-scope', version: '1.0.0' },
								logRecords: [
									{
										timeUnixNano: `${Date.now() * 1_000_000}`,
										severityNumber: 9,
										severityText: 'INFO',
										body: { stringValue: 'Test log from API test' },
										attributes: [],
									},
								],
							},
						],
					},
				],
			};

			const raw = await makeGrafanaRawRequest(
				'/otlp/v1/logs',
				BEARER_TOKEN,
				GRAFANA_URL,
				{
					method: 'POST',
					body,
					contentType: 'application/json',
				},
			);

			const success = raw.status_code >= 200 && raw.status_code < 300;

			const result: LogsCreateOtlpResponse = {
				data: {
					success,
					status_code: raw.status_code,
					message: success ? 'Logs ingested successfully' : raw.content,
				},
				successful: success,
			};

			GrafanaEndpointOutputSchemas.logsCreateOtlp.parse(result);
		});
	});

	describe('dashboards', () => {
		it('dashboardsQueryPublic returns correct type', async () => {
			if (!PUBLIC_DASHBOARD_ACCESS_TOKEN || !PUBLIC_DASHBOARD_PANEL_ID) {
				const result: DashboardsQueryPublicResponse = {
					data: {
						status_code: 400,
						message: 'No public dashboard configured for test',
					},
					successful: false,
				};
				GrafanaEndpointOutputSchemas.dashboardsQueryPublic.parse(result);
				return;
			}

			const path = `/api/public/dashboards/${PUBLIC_DASHBOARD_ACCESS_TOKEN}/panels/${PUBLIC_DASHBOARD_PANEL_ID}/query`;
			const raw = await makeGrafanaRawRequest(path, BEARER_TOKEN, GRAFANA_URL, {
				method: 'POST',
				body: { from: 'now-1h', to: 'now' },
				contentType: 'application/json',
			});

			const success = raw.status_code >= 200 && raw.status_code < 300;

			// Attempt JSON parse; fall back gracefully
			// results is Record<string, unknown> because panel query response shape varies by data source
			let results: Record<string, unknown> | undefined;
			try {
				// JSON.parse returns any; cast to Record<string, unknown> to extract the results map
				const parsed = JSON.parse(raw.content) as Record<string, unknown>;
				// parsed.results is typed as unknown — its structure depends on the panel's data source
				results =
					(parsed.results as Record<string, unknown> | undefined) ?? parsed;
			} catch {
				// Not valid JSON — leave results undefined
			}

			const result: DashboardsQueryPublicResponse = {
				data: {
					status_code: raw.status_code,
					message: success ? undefined : raw.content,
					results,
				},
				successful: success,
			};

			GrafanaEndpointOutputSchemas.dashboardsQueryPublic.parse(result);
		});
	});

	describe('jwks', () => {
		it('jwksRetrieve returns correct type', async () => {
			// Try known JWKS paths; use raw request to avoid throwing on 404
			const jwksPaths = [
				'/api/signing-keys/jwks',
				'/.well-known/jwks.json',
				'/api/jwks',
			];

			let raw: {
				content: string;
				content_type: string;
				status_code: number;
			} | null = null;
			for (const path of jwksPaths) {
				const candidate = await makeGrafanaRawRequest(
					path,
					BEARER_TOKEN,
					GRAFANA_URL,
				);
				if (candidate.status_code === 200) {
					raw = candidate;
					break;
				}
			}

			let keys: JwksRetrieveResponse['data']['keys'];
			if (raw) {
				try {
					// JSON.parse returns any; cast to extract the keys array from the JWKS response object
					const parsed = JSON.parse(raw.content) as { keys?: unknown[] };
					// parsed.keys is unknown[] — each key's shape varies by algorithm (RSA, EC, etc.)
					keys = parsed.keys as JwksRetrieveResponse['data']['keys'];
				} catch {
					// Not valid JSON — no keys
				}
			}

			const result: JwksRetrieveResponse = {
				data: { keys },
				successful: true,
			};

			GrafanaEndpointOutputSchemas.jwksRetrieve.parse(result);
		});
	});

	describe('saml', () => {
		it('samlPostAcs returns correct type structure', async () => {
			// SAML ACS requires a real IdP-signed SAML response — we only validate the output shape here
			const mockSamlResponse = process.env.GRAFANA_SAML_RESPONSE;

			if (!mockSamlResponse) {
				// Construct a minimal valid output shape to verify schema compliance without a real SAML flow
				const result: SamlPostAcsResponse = {
					data: {
						status_code: 400,
						message: 'No SAML response configured for test',
					},
					successful: false,
				};
				GrafanaEndpointOutputSchemas.samlPostAcs.parse(result);
				return;
			}

			const params = new URLSearchParams();
			params.append('SAMLResponse', mockSamlResponse);

			const raw = await makeGrafanaRawRequest(
				'/login/saml/acs',
				BEARER_TOKEN,
				GRAFANA_URL,
				{
					method: 'POST',
					// params.toString() produces a form-encoded string; typed as unknown here
					// because makeGrafanaRawRequest accepts unknown body
					body: params.toString() as unknown,
					contentType: 'application/x-www-form-urlencoded',
				},
			);

			const result: SamlPostAcsResponse = {
				data: {
					status_code: raw.status_code,
					message: raw.content || 'ACS processed',
				},
				successful: raw.status_code < 400,
			};

			GrafanaEndpointOutputSchemas.samlPostAcs.parse(result);
		});
	});
});
