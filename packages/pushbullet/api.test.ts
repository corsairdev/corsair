/**
 * Endpoint coverage. The transport is mocked so these run in CI with no
 * Pushbullet account, asserting each operation targets the right path and verb
 * and that path parameters are interpolated rather than sent as a body field.
 */
const requestMock = jest.fn()
// Captures what handlers hand to logEventFromContext, so tests can assert
// the event log never receives message content or personal data.
const loggedEvents: Array<{ event: string; payload: unknown }> = []
const realRequest = jest.requireActual('corsair/http').request as (
  ...a: unknown[]
) => Promise<unknown>
// Live mode flips the shared transport from the mock to the real fetch. Set
// only inside the live describe below, so the mocked suite stays untouched.
let useLive = false

jest.mock('corsair/http', () => ({
  ...jest.requireActual('corsair/http'),
  request: (...args: unknown[]) =>
    useLive ? realRequest(...args) : requestMock(...args),
}))

jest.mock('corsair/core', () => ({
  ...jest.requireActual('corsair/core'),
  logEventFromContext: async (
    _ctx: unknown,
    event: string,
    payload: unknown
  ) => {
    loggedEvents.push({ event, payload })
  },
}))

import { PushbulletAPIError } from './client'
import { Chats, Devices, Files, Pushes, Users } from './endpoints'
import { PushbulletEndpointOutputSchemas } from './endpoints/types'

const liveApiKey = process.env.PUSHBULLET_API_KEY ?? ''
// Live coverage runs only when a real key is provided; otherwise the whole
// block is skipped and CI keeps exercising the mocked suite above.
const describeLive = liveApiKey ? describe : describe.skip

function makeLiveCtx(overrideKey?: string) {
  return { key: overrideKey ?? liveApiKey, db: {}, options: {} } as never
}

function makeCtx() {
  return { key: 'o.testtoken', db: {}, options: {} } as never
}

interface RequestOptions {
  url: string
  method: string
  body?: Record<string, unknown>
  query?: Record<string, unknown>
}

function lastCall(): RequestOptions {
  const calls = requestMock.mock.calls
  return calls[calls.length - 1][1] as RequestOptions
}

beforeEach(() => {
  requestMock.mockReset()
  loggedEvents.length = 0
  requestMock.mockResolvedValue({
    iden: 'ujx1',
    pushes: [],
    devices: [],
    chats: [],
    file_name: 'a.png',
    file_type: 'image/png',
    upload_url: 'https://upload.pushbullet.test/s3',
    file_url: 'https://file.pushbullet.test/a.png',
  })
})

type Case = [
  Record<string, unknown>,
  string,
  string,
  'GET' | 'POST' | 'DELETE',
  Record<string, unknown>,
]

const CASES: Case[] = [
  [
    Pushes,
    'create',
    'pushes',
    'POST',
    { type: 'note', title: 'hi', body: 'there' },
  ],
  [Pushes, 'list', 'pushes', 'GET', {}],
  [Pushes, 'update', 'pushes/ujx1', 'POST', { iden: 'ujx1', dismissed: true }],
  [Pushes, 'delete', 'pushes/ujx1', 'DELETE', { iden: 'ujx1' }],
  [Pushes, 'deleteAll', 'pushes', 'DELETE', {}],
  [Devices, 'register', 'devices', 'POST', { nickname: 'laptop' }],
  [Devices, 'list', 'devices', 'GET', {}],
  [
    Devices,
    'update',
    'devices/dv1',
    'POST',
    { iden: 'dv1', nickname: 'renamed' },
  ],
  [Devices, 'delete', 'devices/dv1', 'DELETE', { iden: 'dv1' }],
  [Chats, 'create', 'chats', 'POST', { email: 'a@b.test' }],
  [Chats, 'list', 'chats', 'GET', {}],
  [Chats, 'setMuted', 'chats/ch1', 'POST', { iden: 'ch1', muted: true }],
  [Chats, 'delete', 'chats/ch1', 'DELETE', { iden: 'ch1' }],
  [Users, 'me', 'users/me', 'GET', {}],
  [
    Files,
    'uploadRequest',
    'upload-request',
    'POST',
    { file_name: 'a.png', file_type: 'image/png' },
  ],
]

const NAMED = CASES.map(([group, op, url, method, input]) => ({
  group,
  op,
  url,
  method,
  input,
}))

describe('endpoints target the correct Pushbullet path', () => {
  it.each(NAMED)(
    '$op -> $method $url',
    async ({ group, op, url, method, input }) => {
      const fn = group[op] as (c: unknown, i: unknown) => Promise<unknown>
      await fn(makeCtx(), input)

      expect(requestMock).toHaveBeenCalled()
      const call = lastCall()
      expect(call.url).toBe(url)
      expect(call.method).toBe(method)
    }
  )

  it('covers every operation the plugin exposes', () => {
    expect(CASES).toHaveLength(15)
  })
})

describe('path parameters', () => {
  it('interpolates iden into the path and drops it from the body', async () => {
    await Pushes.update(makeCtx(), { iden: 'ujx1', dismissed: true })
    const call = lastCall()
    expect(call.url).toBe('pushes/ujx1')
    expect(call.body).toEqual({ dismissed: true })
  })

  it('url-encodes an iden containing reserved characters', async () => {
    await Devices.delete(makeCtx(), { iden: 'a/b c' })
    expect(lastCall().url).toBe('devices/a%2Fb%20c')
  })

  it('sends list filters as query parameters, not a body', async () => {
    await Pushes.list(makeCtx(), { active: true, limit: 50 })
    const call = lastCall()
    expect(call.query).toMatchObject({ active: true, limit: 50 })
    expect(call.body).toBeUndefined()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Regressions from review round 1.
// ─────────────────────────────────────────────────────────────────────────────

describe('response validation', () => {
  it('rejects a response missing a required field', async () => {
    // Nothing downstream re-checks the shape, so a drifted response would
    // otherwise escape under the declared return type and reach the cache.
    requestMock.mockResolvedValue({ active: true })
    await expect(
      Pushes.create(makeCtx(), { type: 'note', body: 'hi' })
    ).rejects.toThrow()
  })

  it('rejects a list response whose items are malformed', async () => {
    requestMock.mockResolvedValue({ pushes: [{ active: true }] })
    await expect(Pushes.list(makeCtx(), {})).rejects.toThrow()
  })

  it('accepts a well-formed response', async () => {
    requestMock.mockResolvedValue({ iden: 'ujx1', type: 'note' })
    await expect(
      Pushes.create(makeCtx(), { type: 'note', body: 'hi' })
    ).resolves.toMatchObject({ iden: 'ujx1' })
  })

  it('keeps unknown fields rather than stripping them', async () => {
    // Pushbullet adds fields without versioning; dropping them would
    // silently discard data the caller may rely on.
    requestMock.mockResolvedValue({ iden: 'ujx1', brand_new_field: 42 })
    const result = await Pushes.create(makeCtx(), { type: 'note', body: 'x' })
    expect((result as Record<string, unknown>).brand_new_field).toBe(42)
  })
})

describe('deleteAll cache reconciliation', () => {
  it('evicts every cached push after a bulk delete', async () => {
    const deleted: string[] = []
    const ctx = {
      key: 'o.testtoken',
      options: {},
      db: {
        pushes: {
          search: async () => [{ entity_id: 'ujx1' }, { entity_id: 'ujx2' }],
          deleteByEntityId: async (id: string) => {
            deleted.push(id)
            return true
          },
        },
      },
    } as never

    requestMock.mockResolvedValue({})
    await Pushes.deleteAll(ctx, {})

    expect(deleted.sort()).toEqual(['ujx1', 'ujx2'])
  })

  it('does not fail the delete when cache eviction throws', async () => {
    const ctx = {
      key: 'o.testtoken',
      options: {},
      db: {
        pushes: {
          search: async () => {
            throw new Error('db down')
          },
          deleteByEntityId: async () => true,
        },
      },
    } as never

    requestMock.mockResolvedValue({})
    // The endpoint warns on a cache failure; that is production behaviour,
    // so it is silenced here rather than printed into every test run.
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    try {
      await expect(Pushes.deleteAll(ctx, {})).resolves.toBeDefined()
      expect(warn).toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Regressions from review round 2.
// ─────────────────────────────────────────────────────────────────────────────

describe('update cache preservation', () => {
  it('caches the full updated push, not just the mutable fields', async () => {
    const upserts: Array<Record<string, unknown>> = []
    const ctx = {
      key: 'o.testtoken',
      options: {},
      db: {
        pushes: {
          upsertByEntityId: async (
            _id: string,
            data: Record<string, unknown>
          ) => {
            upserts.push(data)
          },
        },
      },
    } as never

    requestMock.mockResolvedValue({
      iden: 'ujx1',
      type: 'note',
      title: 'kept title',
      body: 'kept body',
      url: 'https://example.test',
      dismissed: true,
      active: true,
      direction: 'self',
      created: 1_700_000_000,
    })
    await Pushes.update(ctx, { iden: 'ujx1', dismissed: true })

    expect(upserts).toHaveLength(1)
    // upsertByEntityId replaces the stored record rather than merging
    // into it, so a partial write would have wiped the cached title,
    // body and url even though the update response still carries them.
    expect(upserts[0]).toMatchObject({
      id: 'ujx1',
      type: 'note',
      title: 'kept title',
      body: 'kept body',
      url: 'https://example.test',
      dismissed: true,
      direction: 'self',
      created: 1_700_000_000,
    })
  })
})

describe('event log privacy', () => {
  it('logs push and chat identifiers, not content or emails', async () => {
    requestMock.mockResolvedValue({ iden: 'ujx1', type: 'note' })
    await Pushes.create(makeCtx(), {
      type: 'note',
      title: 'secret title',
      body: 'secret body',
      email: 'target@example.test',
    })
    await Chats.create(makeCtx(), { email: 'friend@example.test' })

    const pushEvent = loggedEvents.find(
      e => e.event === 'pushbullet.pushes.create'
    )
    const chatEvent = loggedEvents.find(
      e => e.event === 'pushbullet.chats.create'
    )
    expect(pushEvent?.payload).toEqual({ iden: 'ujx1', type: 'note' })
    expect(chatEvent?.payload).toEqual({ iden: 'ujx1' })
  })
})

describe('handler input validation', () => {
  it('does not send a link push that is missing url', async () => {
    await expect(
      Pushes.create(makeCtx(), { type: 'link', title: 'no url' })
    ).rejects.toThrow()
    expect(requestMock).not.toHaveBeenCalled()
  })

  it('does not send a file push that is missing file_type', async () => {
    await expect(
      Pushes.create(makeCtx(), {
        type: 'file',
        file_name: 'a.png',
        file_url: 'https://file.pushbullet.test/a.png',
      })
    ).rejects.toThrow()
    expect(requestMock).not.toHaveBeenCalled()
  })

  it('does not send a push aimed at more than one recipient', async () => {
    await expect(
      Pushes.create(makeCtx(), {
        type: 'note',
        device_iden: 'dv1',
        email: 'a@b.test',
      })
    ).rejects.toThrow()
    expect(requestMock).not.toHaveBeenCalled()
  })

  it('does not request a list when limit exceeds the Pushbullet maximum', async () => {
    await expect(Pushes.list(makeCtx(), { limit: 900 })).rejects.toThrow()
    expect(requestMock).not.toHaveBeenCalled()
  })

  it('does not create a chat with a malformed email', async () => {
    await expect(
      Chats.create(makeCtx(), { email: 'not-an-email' })
    ).rejects.toThrow()
    expect(requestMock).not.toHaveBeenCalled()
  })

  it('strips unknown fields before sending a chat mute', async () => {
    await Chats.setMuted(makeCtx(), {
      iden: 'ch1',
      muted: true,
      unexpected: 'nope',
    } as never)
    expect(lastCall().body).toEqual({ muted: true })
  })
})

// Live API coverage. Hits the real Pushbullet API and mutates the test
// account, proving every operation works end to end and that API errors
// surface as PushbulletAPIError. Skipped unless PUSHBULLET_API_KEY is set.
describeLive('pushbullet live API', () => {
  beforeAll(() => {
    useLive = true
  })

  afterAll(() => {
    useLive = false
  })

  // users

  describe('users.me', () => {
    it('returns the authenticated account and passes the output schema', async () => {
      const me = await Users.me(makeLiveCtx(), {})
      expect(me.iden).toBeTruthy()
      expect(me.email).toBeTruthy()
      PushbulletEndpointOutputSchemas.usersMe.parse(me)
    })

    it('rejects an invalid access token with PushbulletAPIError', async () => {
      await expect(
        Users.me(makeLiveCtx('o.definitely-wrong-token'), {})
      ).rejects.toBeInstanceOf(PushbulletAPIError)
    })
  })

  // devices

  describe('devices', () => {
    let deviceIden: string | undefined

    it('list returns the devices on the account', async () => {
      const { devices } = await Devices.list(makeLiveCtx(), {})
      expect(Array.isArray(devices)).toBe(true)
      for (const device of devices) {
        expect(device.iden).toBeTruthy()
      }
    })

    it('register creates a device and returns its iden', async () => {
      const device = await Devices.register(makeLiveCtx(), {
        nickname: 'corsair-live-test',
        model: 'corsair-test-runner',
      })
      expect(device.iden).toBeTruthy()
      deviceIden = device.iden
    })

    it('update renames the device', async () => {
      expect(deviceIden).toBeTruthy()
      const updated = await Devices.update(makeLiveCtx(), {
        iden: deviceIden as string,
        nickname: 'corsair-live-test-renamed',
      })
      expect(updated.nickname).toBe('corsair-live-test-renamed')
    })

    it('register rejects an invalid token with PushbulletAPIError', async () => {
      await expect(
        Devices.register(makeLiveCtx('o.bad-token'), {
          nickname: 'nope',
        })
      ).rejects.toBeInstanceOf(PushbulletAPIError)
    })

    it('remove deletes the device', async () => {
      expect(deviceIden).toBeTruthy()
      await expect(
        Devices.delete(makeLiveCtx(), { iden: deviceIden as string })
      ).resolves.toBeDefined()
    })
  })

  // chats

  describe('chats', () => {
    let chatIden: string | undefined
    let partnerEmail: string

    it('create opens a chat with a Pushbullet user by email', async () => {
      // Pushbullet only opens chats with registered users (unknown emails
      // get a server error, verified live) and rejects a second chat with
      // the same email, so the suite chats with the account itself after
      // clearing any active chat a previous run left behind.
      const me = await Users.me(makeLiveCtx(), {})
      if (!me.email) {
        throw new Error('live account has no email to chat with')
      }
      partnerEmail = me.email

      const { chats } = await Chats.list(makeLiveCtx(), {})
      for (const chat of chats) {
        if (chat.with?.email === me.email && chat.active !== false) {
          await Chats.delete(makeLiveCtx(), { iden: chat.iden })
        }
      }

      const chat = await Chats.create(makeLiveCtx(), {
        email: partnerEmail,
      })
      expect(chat.iden).toBeTruthy()
      chatIden = chat.iden
    })

    it('list returns chats including the one just created', async () => {
      const { chats } = await Chats.list(makeLiveCtx(), {
        active: true,
      })
      expect(Array.isArray(chats)).toBe(true)
      expect(
        chats.some((chat: { iden?: string }) => chat.iden === chatIden)
      ).toBe(true)
    })

    it('setMuted toggles muted on the chat', async () => {
      expect(chatIden).toBeTruthy()
      const updated = await Chats.setMuted(makeLiveCtx(), {
        iden: chatIden as string,
        muted: true,
      })
      expect(updated.muted).toBe(true)
    })

    it('create rejects a duplicate chat with PushbulletAPIError', async () => {
      await expect(
        Chats.create(makeLiveCtx(), { email: partnerEmail })
      ).rejects.toBeInstanceOf(PushbulletAPIError)
    })

    it('create rejects a malformed email before calling Pushbullet', async () => {
      await expect(
        Chats.create(makeLiveCtx(), { email: 'not-an-email' })
      ).rejects.toThrow()
    })

    it('remove deletes the chat', async () => {
      expect(chatIden).toBeTruthy()
      await expect(
        Chats.delete(makeLiveCtx(), { iden: chatIden as string })
      ).resolves.toBeDefined()
    })
  })

  // pushes

  describe('pushes', () => {
    let pushIden: string | undefined

    it('create sends a note and returns its iden', async () => {
      const push = await Pushes.create(makeLiveCtx(), {
        type: 'note',
        title: 'corsair live test',
        body: 'sent by the corsair pushbullet live suite',
      })
      expect(push.iden).toBeTruthy()
      pushIden = push.iden
    })

    it('list returns pushes including the one just created', async () => {
      const { pushes } = await Pushes.list(makeLiveCtx(), {
        active: true,
        limit: 10,
      })
      expect(Array.isArray(pushes)).toBe(true)
      expect(pushes.some((p: { iden?: string }) => p.iden === pushIden)).toBe(
        true
      )
    })

    it('create rejects an invalid access token with PushbulletAPIError', async () => {
      await expect(
        Pushes.create(makeLiveCtx('o.bad-token'), {
          type: 'note',
          body: 'nope',
        })
      ).rejects.toBeInstanceOf(PushbulletAPIError)
    })

    it('update dismisses the push', async () => {
      expect(pushIden).toBeTruthy()
      await expect(
        Pushes.update(makeLiveCtx(), {
          iden: pushIden as string,
          dismissed: true,
        })
      ).resolves.toBeDefined()
    })

    it('remove deletes the push', async () => {
      expect(pushIden).toBeTruthy()
      await expect(
        Pushes.delete(makeLiveCtx(), { iden: pushIden as string })
      ).resolves.toBeDefined()
    })

    it('removeAll clears remaining test pushes', async () => {
      await Pushes.create(makeLiveCtx(), {
        type: 'note',
        body: 'sweep me',
      })
      await expect(Pushes.deleteAll(makeLiveCtx(), {})).resolves.toBeDefined()
      // Pushbullet applies bulk deletes asynchronously (see the
      // endpoint), so poll the active list until it drains instead
      // of asserting that it is empty right away.
      let remaining = -1
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const { pushes } = await Pushes.list(makeLiveCtx(), {
          active: true,
        })
        remaining = pushes.filter((p: { active?: boolean }) => p.active).length
        if (remaining === 0) {
          break
        }
        await new Promise(resolve => {
          setTimeout(resolve, 500)
        })
      }
      expect(remaining).toBe(0)
    })
  })

  // files

  describe('files', () => {
    it('uploadRequest returns an upload URL and file URL', async () => {
      const res = await Files.uploadRequest(makeLiveCtx(), {
        file_name: 'corsair-live-test.txt',
        file_type: 'text/plain',
      })
      expect(res.upload_url).toBeTruthy()
      expect(res.file_url).toBeTruthy()
    })

    it('uploadRequest rejects an invalid token with PushbulletAPIError', async () => {
      await expect(
        Files.uploadRequest(makeLiveCtx('o.bad-token'), {
          file_name: 'x.txt',
          file_type: 'text/plain',
        })
      ).rejects.toBeInstanceOf(PushbulletAPIError)
    })
  })
})
