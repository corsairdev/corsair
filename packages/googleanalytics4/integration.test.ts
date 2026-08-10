import { googleanalytics4 } from './index';

describe('GA4 Plugin', () => {
  it('should initialize the GA4 plugin', () => {
    const plugin = googleanalytics4({
      authType: 'oauth_2',
    });

    expect(plugin.id).toBe('googleanalytics4');
    expect(plugin.authConfig).toBeDefined();
    expect(plugin.schema).toBeDefined();
    expect(plugin.endpoints).toBeDefined();
    expect(plugin.oauthConfig).toBeDefined();
  });

  it('should have OAuth2 configuration', () => {
    const plugin = googleanalytics4();

    const oauth = plugin.oauthConfig;
    expect(oauth?.providerName).toBe('Google Analytics');
    expect(oauth?.authUrl).toBe('https://accounts.google.com/o/oauth2/v2/auth');
    expect(oauth?.tokenUrl).toBe('https://oauth2.googleapis.com/token');
    expect(oauth?.scopes).toContain('https://www.googleapis.com/auth/analytics');
  });

  it('should have Admin API endpoints', () => {
    const plugin = googleanalytics4();

    expect(plugin.endpoints.accounts).toBeDefined();
    expect(plugin.endpoints.properties).toBeDefined();
    expect(plugin.endpoints.customDimensions).toBeDefined();
    expect(plugin.endpoints.customMetrics).toBeDefined();
    expect(plugin.endpoints.dataStreams).toBeDefined();
    expect(plugin.endpoints.audiences).toBeDefined();
  });

  it('should have Data API endpoints', () => {
    const plugin = googleanalytics4();

    expect(plugin.endpoints.reporting).toBeDefined();
    expect(plugin.endpoints.reporting.runReport).toBeDefined();
    expect(plugin.endpoints.reporting.runRealtimeReport).toBeDefined();
  });

  it('should have Measurement Protocol endpoints', () => {
    const plugin = googleanalytics4();

    expect(plugin.endpoints.measurementProtocol).toBeDefined();
    expect(plugin.endpoints.measurementProtocol.sendEvent).toBeDefined();
    expect(plugin.endpoints.measurementProtocol.validate).toBeDefined();
  });

  it('should have proper endpoint metadata', () => {
    const plugin = googleanalytics4();

    expect(plugin.endpointMeta['accounts.get'].riskLevel).toBe('read');
    expect(plugin.endpointMeta['properties.create'].riskLevel).toBe('write');
    expect(plugin.endpointMeta['measurementProtocol.sendEvent'].riskLevel).toBe(
      'write',
    );
  });

  it('should support permissions configuration', () => {
    const plugin = googleanalytics4({
      permissions: {
        'properties.update': false,
        'customDimensions.create': false,
      },
    });

    expect(plugin.options.permissions).toBeDefined();
  });
});
