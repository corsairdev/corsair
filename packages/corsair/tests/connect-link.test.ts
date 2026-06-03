import { AuthMissingError } from '../core/auth/errors/auth-missing'
import {
  encodeOAuthState,
  signState,
  decodeOAuthState,
  verifyAndDecodeState,
} from '../core/auth/state'
import { bindEndpointsRecursively } from '../core/endpoints/bind'

describe('AuthMissingError', () => {
  it('sets name, pluginId, and default message', () => {
    const err = new AuthMissingError('gmail')
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(AuthMissingError)
    expect(err.name).toBe('AuthMissingError')
    expect(err.pluginId).toBe('gmail')
    expect(err.message).toBe('[auth-missing:gmail]')
  })

  it('accepts a custom message', () => {
    const err = new AuthMissingError('gmail', 'custom message')
    expect(err.message).toBe('custom message')
    expect(err.pluginId).toBe('gmail')
  })
})

describe('OAuth state utilities', () => {
  const kek = 'test-kek-value-for-signing'

  it('round-trips encode/decode', () => {
    const encoded = encodeOAuthState('gmail', 'tenant-1')
    const decoded = decodeOAuthState(encoded)
    expect(decoded).toEqual({ plugin: 'gmail', tenantId: 'tenant-1' })
  })

  it('signs and verifies state', () => {
    const payload = encodeOAuthState('slack', 'tenant-2')
    const signed = signState(payload, kek)
    const decoded = verifyAndDecodeState(signed, kek)
    expect(decoded).toEqual({ plugin: 'slack', tenantId: 'tenant-2' })
  })

  it('rejects tampered state', () => {
    const payload = encodeOAuthState('slack', 'tenant-2')
    const signed = signState(payload, kek)
    const tampered = signed.slice(0, -5) + 'XXXXX'
    const decoded = verifyAndDecodeState(tampered, kek)
    expect(decoded).toBeNull()
  })

  it('returns null for invalid state', () => {
    expect(decodeOAuthState('not-valid-base64!!!')).toBeNull()
    expect(verifyAndDecodeState('', kek)).toBeNull()
  })
})

describe('connect-link generation in endpoint binding', () => {
  const kek = 'test-kek-for-connect-link'

  function createBoundEndpoint(opts: {
    keyBuilder?: (ctx: any, source: string) => Promise<string>
    connectConfig?: any
  }) {
    const endpoints = {
      sendEmail: async (_ctx: any, _args: any) => 'sent',
    }

    const tree: Record<string, unknown> = {}
    bindEndpointsRecursively({
      endpoints,
      hooks: undefined,
      ctx: {},
      tree,
      pluginId: 'gmail',
      errorHandlers: {},
      currentPath: [],
      keyBuilder: opts.keyBuilder,
      connectConfig: opts.connectConfig,
    })

    return tree.sendEmail as (args?: unknown) => Promise<unknown>
  }

  it('generates connect link when keyBuilder returns empty string', async () => {
    const boundFn = createBoundEndpoint({
      keyBuilder: async () => '',
      connectConfig: {
        baseUrl: 'https://myapp.com/connect',
        redirectUri: 'https://myapp.com/api/callback',
        oauthConfig: {
          providerName: 'Google',
          authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        },
        kek,
        tenantId: 'tenant-1',
      },
    })

    try {
      await boundFn({ to: 'user@example.com' })
      fail('Expected error to be thrown')
    } catch (err: any) {
      expect(err.message).toContain('[auth-missing:gmail]')
      expect(err.message).toContain('https://myapp.com/connect')
      expect(err.message).toContain('Authentication required')

      // Verify the state parameter in the connect URL is valid
      const stateMatch = err.message.match(/state=([^&\s]+)/)
      expect(stateMatch).not.toBeNull()
      const state = decodeURIComponent(stateMatch![1])
      const decoded = verifyAndDecodeState(state, kek)
      expect(decoded).toEqual({ plugin: 'gmail', tenantId: 'tenant-1' })
    }
  })

  it('generates connect link when keyBuilder throws AuthMissingError', async () => {
    const boundFn = createBoundEndpoint({
      keyBuilder: async () => {
        throw new AuthMissingError('gmail')
      },
      connectConfig: {
        baseUrl: 'https://myapp.com/connect',
        redirectUri: 'https://myapp.com/api/callback',
        oauthConfig: {
          providerName: 'Google',
          authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        },
        kek,
        tenantId: 'tenant-1',
      },
    })

    try {
      await boundFn()
      fail('Expected error to be thrown')
    } catch (err: any) {
      expect(err.message).toContain('[auth-missing:gmail]')
      expect(err.message).toContain('https://myapp.com/connect')
    }
  })

  it('propagates non-AuthMissingError from keyBuilder even with connectConfig', async () => {
    const boundFn = createBoundEndpoint({
      keyBuilder: async () => {
        throw new Error('Account not found for tenant "tenant-1"')
      },
      connectConfig: {
        baseUrl: 'https://myapp.com/connect',
        redirectUri: 'https://myapp.com/api/callback',
        oauthConfig: {
          providerName: 'Google',
          authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        },
        kek,
        tenantId: 'tenant-1',
      },
    })

    await expect(boundFn()).rejects.toThrow('Account not found')
  })

  it('uses custom onAuthMissing callback', async () => {
    const boundFn = createBoundEndpoint({
      keyBuilder: async () => '',
      connectConfig: {
        baseUrl: 'https://myapp.com/connect',
        redirectUri: 'https://myapp.com/api/callback',
        oauthConfig: {
          providerName: 'Google',
          authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        },
        kek,
        tenantId: 'tenant-1',
        onAuthMissing: ({
          plugin,
          connectUrl,
        }: {
          plugin: string
          connectUrl: string
          state: string
        }) => `Please connect ${plugin}: ${connectUrl}`,
      },
    })

    try {
      await boundFn()
      fail('Expected error to be thrown')
    } catch (err: any) {
      expect(err.message).toBe(
        'Please connect gmail: https://myapp.com/connect?plugin=gmail&state=' +
          err.message.split('state=')[1]
      )
      expect(err.message).toContain('Please connect gmail')
      expect(err.message).toContain('https://myapp.com/connect')
    }
  })

  it('does not intercept errors when connectConfig is not set', async () => {
    const boundFn = createBoundEndpoint({
      keyBuilder: async () => {
        throw new Error('Account not found')
      },
    })

    await expect(boundFn()).rejects.toThrow('Account not found')
  })

  it('does not intercept errors when plugin has no oauthConfig', async () => {
    const boundFn = createBoundEndpoint({
      keyBuilder: async () => {
        throw new Error('Account not found')
      },
      connectConfig: {
        baseUrl: 'https://myapp.com/connect',
        redirectUri: 'https://myapp.com/api/callback',
        oauthConfig: undefined,
        kek,
        tenantId: 'tenant-1',
      },
    })

    await expect(boundFn()).rejects.toThrow('Account not found')
  })

  it('does not intercept unrelated errors when connectConfig is set', async () => {
    const boundFn = createBoundEndpoint({
      keyBuilder: async () => {
        throw new Error('Network timeout')
      },
      connectConfig: {
        baseUrl: 'https://myapp.com/connect',
        redirectUri: 'https://myapp.com/api/callback',
        oauthConfig: {
          providerName: 'Google',
          authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        },
        kek,
        tenantId: 'tenant-1',
      },
    })

    await expect(boundFn()).rejects.toThrow('Network timeout')
  })
})
