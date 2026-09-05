import { request } from 'corsair/http';

const WIXMCP_API_BASE = 'https://mcp.wix.com/mcp';

export type WixMcpToolCall = {
  name: string;
  arguments?: Record<string, unknown>;
};

export async function callWixMcpTool<T>(
  tool: WixMcpToolCall,
  accessToken: string,
): Promise<T> {
  const response = await request<T>(
    {
      BASE: WIXMCP_API_BASE,
      VERSION: '1.0',
      WITH_CREDENTIALS: false,
      CREDENTIALS: 'omit',
      TOKEN: accessToken,
      HEADERS: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
    {
      method: 'POST',
      url: '',
      body: {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: tool.name,
          arguments: tool.arguments ?? {},
        },
      },
      mediaType: 'application/json',
    },
  );

  return response;
}