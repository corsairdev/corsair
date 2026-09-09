import { processWebhook } from 'corsair'
import { createCorsair } from 'corsair/core'
import type { OpenAPIConfig } from 'corsair/http'
import { request } from 'corsair/http'
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests'
import { waboxapp } from './index'
import { parseWaboxappWebhookBody } from './webhooks/types'

jest.mock('corsair/http', () => {
  const original = jest.requireActual('corsair/http')
  return {
    ...original,
    request: jest.fn(),
  }
})

const mockRequest = request as jest.Mock

const MESSAGE_BODY =
  'event=message&token=tok12345&uid=34666123456' +
  '&contact%5Buid%5D=34666789123&contact%5Bname%5D=Peter&contact%5Btype%5D=user' +
  '&message%5Bdtm%5D=1487082303&message%5Buid%5D=62397B58E3E0B' +
  '&message%5Bdir%5D=i&message%5Btype%5D=chat' +
  '&message%5Bbody%5D%5Btext%5D=Hey&message%5Back%5D=3'

describe('Waboxapp plugin', () => {
  beforeEach(() => {
    mockRequest.mockReset()
  })

  it('sends chat, image, link, media, and reads status', async () => {
    mockRequest.mockImplementation(
      (_config: OpenAPIConfig, options: { url: string; method?: string }) => {
        if (options.url.startsWith('status/')) {
          return Promise.resolve({
            success: true,
            uid: '34666123456',
            alias: 'desk',
          })
        }
        return Promise.resolve({ success: true, custom_uid: 'msg-1' })
      }
    )

    const testDb = createTestDatabase()
    const corsair = createCorsair({
      database: testDb.db,
      kek: 'mock-kek-32-chars-long-mock-kek-3',
      plugins: [
        waboxapp({
          key: 'tok12345',
          uid: '34666123456',
        }),
      ],
    })
    await createIntegrationAndAccount(testDb.db, 'waboxapp')

    await expect(
      corsair.waboxapp.api.messages.sendChat({
        to: '34666789123',
        text: 'Hello from Corsair',
        custom_uid: 'msg-1',
      })
    ).resolves.toEqual({ success: true, custom_uid: 'msg-1' })

    await expect(
      corsair.waboxapp.api.messages.sendImage({
        to: '34666789123',
        url: 'https://example.com/pic.png',
        custom_uid: 'msg-2',
      })
    ).resolves.toEqual({ success: true, custom_uid: 'msg-1' })

    await expect(
      corsair.waboxapp.api.messages.sendLink({
        to: '34666789123',
        url: 'https://example.com',
        custom_uid: 'msg-3',
      })
    ).resolves.toEqual({ success: true, custom_uid: 'msg-1' })

    await expect(
      corsair.waboxapp.api.messages.sendMedia({
        to: '34666789123',
        url: 'https://example.com/file.pdf',
        custom_uid: 'msg-4',
      })
    ).resolves.toEqual({ success: true, custom_uid: 'msg-1' })

    await expect(corsair.waboxapp.api.accounts.getStatus({})).resolves.toEqual({
      success: true,
      uid: '34666123456',
      alias: 'desk',
    })

    const chatCall = mockRequest.mock.calls.find(
      (call: [{}, { url: string }]) => call[1].url === 'send/chat'
    )
    expect(chatCall?.[1].body).toMatchObject({
      token: 'tok12345',
      uid: '34666123456',
      to: '34666789123',
      text: 'Hello from Corsair',
    })
  })

  it('handles an incoming form-encoded message webhook', async () => {
    const testDb = createTestDatabase()
    const corsair = createCorsair({
      database: testDb.db,
      kek: 'mock-kek-32-chars-long-mock-kek-3',
      plugins: [
        waboxapp({
          key: 'tok12345',
          uid: '34666123456',
        }),
      ],
    })
    await createIntegrationAndAccount(testDb.db, 'waboxapp')

    const parsedBody = parseWaboxappWebhookBody(MESSAGE_BODY)
    expect(parsedBody).not.toBeNull()

    const result = await processWebhook(
      corsair,
      { 'content-type': 'application/x-www-form-urlencoded' },
      parsedBody as Record<string, unknown>
    )

    expect(result.plugin).toBe('waboxapp')
    expect(result.action).toBe('message.received')
    expect(result.response?.success).toBe(true)
    expect(result.body).toMatchObject({
      event: 'message',
      uid: '34666123456',
      token: 'tok12345',
    })
  })
})
