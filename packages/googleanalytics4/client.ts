export class GA4APIError extends Error {
  constructor(
    public statusCode: number,
    public responseBody: string,
    message?: string,
  ) {
    super(
      message || `GA4 API error: ${statusCode} - ${responseBody}`,
    );
  }
}

export interface GA4TokenInfo {
  accessToken: string;
  expiresAt: number;
  refreshToken?: string;
}

export async function getValidGA4AccessToken({
  accessToken,
  expiresAt,
  refreshToken,
  clientSecret,
  forceRefresh = false,
}: {
  accessToken: string | null;
  expiresAt: number | null;
  refreshToken: string;
  clientSecret: string;
  forceRefresh?: boolean;
}): Promise<GA4TokenInfo & { refreshed: boolean }> {
  // Check if token is still valid (with 5 min buffer)
  if (
    !forceRefresh &&
    accessToken &&
    expiresAt &&
    expiresAt > Date.now() + 5 * 60 * 1000
  ) {
    return {
      accessToken,
      expiresAt,
      refreshToken,
      refreshed: false,
    };
  }

  // Refresh the token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: '', // Will be set by Corsair auth handler
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString(),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new GA4APIError(
      response.status,
      body,
      'Failed to refresh GA4 access token',
    );
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };

  const newExpiresAt = Date.now() + data.expires_in * 1000;
  const newRefreshToken = data.refresh_token || refreshToken;

  return {
    accessToken: data.access_token,
    expiresAt: newExpiresAt,
    refreshToken: newRefreshToken,
    refreshed: true,
  };
}

export async function makeGA4Request<T>({
  method,
  endpoint,
  accessToken,
  body,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  accessToken: string;
  body?: Record<string, unknown>;
}): Promise<T> {
  const response = await fetch(endpoint, {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    throw new GA4APIError(401, 'Unauthorized', 'GA4 token expired or invalid');
  }

  if (!response.ok) {
    const text = await response.text();
    throw new GA4APIError(response.status, text);
  }

  const data = await response.json();
  return data as T;
}
