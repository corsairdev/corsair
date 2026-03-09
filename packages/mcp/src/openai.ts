export type OpenAIMcpConfig = {
  serverLabel: string;
  serverUrl: string;
  headers?: Record<string, string>;
};

export function getOpenAIMcpConfig(baseUrl: string, headers?: Record<string, string>): OpenAIMcpConfig {
  return {
    serverLabel: 'corsair',
    serverUrl: baseUrl,
    headers,
  };
}
