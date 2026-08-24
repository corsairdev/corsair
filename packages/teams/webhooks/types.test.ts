import type { TeamsNotification, TeamsWebhookPayload } from './types'
import { createTeamsNotificationMatch, verifyTeamsClientState } from './types'

const CLIENT_STATE = 'teams-client-state'

function notification(
  overrides: Partial<TeamsNotification> = {}
): TeamsNotification {
  return {
    subscriptionId: 'sub-1',
    clientState: CLIENT_STATE,
    changeType: 'created',
    resource: "teams('t1')/channels('c1')",
    resourceData: { id: 'c1' },
    ...overrides,
  } as TeamsNotification
}

function payload(
  notifications: TeamsNotification[]
): TeamsWebhookPayload<TeamsNotification> {
  return { value: notifications }
}

describe('verifyTeamsClientState', () => {
  it('should fail closed when the expected client state is missing', () => {
    const result = verifyTeamsClientState(payload([notification()]), '')
    expect(result).toEqual({ valid: false, error: 'clientState is required' })
  })

  it('should reject an empty value array', () => {
    // The regression: [].every(...) is true, so a request carrying no
    // notification -- and therefore no clientState at all -- was reported as
    // verified. Routing already drops empty value arrays; this is defense in depth.
    const result = verifyTeamsClientState(payload([]), CLIENT_STATE)
    expect(result).toEqual({
      valid: false,
      error: 'Invalid payload: missing value array',
    })
  })

  it('should reject a payload with no value key', () => {
    const result = verifyTeamsClientState(
      {} as TeamsWebhookPayload<TeamsNotification>,
      CLIENT_STATE
    )
    expect(result).toEqual({
      valid: false,
      error: 'Invalid payload: missing value array',
    })
  })

  it('should reject a non-array value', () => {
    const result = verifyTeamsClientState(
      {
        value: 'not-an-array',
      } as unknown as TeamsWebhookPayload<TeamsNotification>,
      CLIENT_STATE
    )
    expect(result).toEqual({
      valid: false,
      error: 'Invalid payload: missing value array',
    })
  })

  it('should reject when the client state does not match', () => {
    const result = verifyTeamsClientState(
      payload([notification({ clientState: 'wrong' })]),
      CLIENT_STATE
    )
    expect(result).toEqual({ valid: false, error: 'clientState mismatch' })
  })

  it('should reject a batch where a later notification is forged', () => {
    const result = verifyTeamsClientState(
      payload([notification(), notification({ clientState: 'forged' })]),
      CLIENT_STATE
    )
    expect(result).toEqual({ valid: false, error: 'clientState mismatch' })
  })

  it('should reject a notification carrying no client state of its own', () => {
    const result = verifyTeamsClientState(
      payload([notification({ clientState: undefined })]),
      CLIENT_STATE
    )
    expect(result).toEqual({ valid: false, error: 'clientState mismatch' })
  })

  it('should reject a non-string clientState without throwing', () => {
    const malformed = {
      value: [{ ...notification(), clientState: 123 }],
    } as unknown as TeamsWebhookPayload<TeamsNotification>
    expect(() => verifyTeamsClientState(malformed, CLIENT_STATE)).not.toThrow()
    expect(verifyTeamsClientState(malformed, CLIENT_STATE)).toEqual({
      valid: false,
      error: 'clientState mismatch',
    })
  })

  it('should accept when every notification carries the expected client state', () => {
    const result = verifyTeamsClientState(
      payload([notification(), notification({ subscriptionId: 'sub-2' })]),
      CLIENT_STATE
    )
    expect(result).toEqual({ valid: true })
  })

  it('should reject a value array that contains null without throwing', () => {
    const malformed = {
      value: [null],
    } as unknown as TeamsWebhookPayload<TeamsNotification>
    expect(() => verifyTeamsClientState(malformed, CLIENT_STATE)).not.toThrow()
    expect(verifyTeamsClientState(malformed, CLIENT_STATE)).toEqual({
      valid: false,
      error: 'clientState mismatch',
    })
  })

  it('should reject a mixed batch that contains null without throwing', () => {
    const malformed = {
      value: [notification(), null],
    } as unknown as TeamsWebhookPayload<TeamsNotification>
    expect(() => verifyTeamsClientState(malformed, CLIENT_STATE)).not.toThrow()
    expect(verifyTeamsClientState(malformed, CLIENT_STATE)).toEqual({
      valid: false,
      error: 'clientState mismatch',
    })
  })
})

describe('createTeamsNotificationMatch', () => {
  const matchChannels = createTeamsNotificationMatch(/teams\([^)]+\)\/channels/)

  it('should not throw when value contains null', () => {
    const request = {
      body: { value: [null] },
      headers: {},
    } as never
    expect(() => matchChannels(request)).not.toThrow()
    expect(matchChannels(request)).toBe(false)
  })

  it('should match a valid notification even when the batch also contains null', () => {
    expect(
      matchChannels({
        body: { value: [null, notification()] },
        headers: {},
      } as never)
    ).toBe(true)
  })

  it('should not match invalid JSON', () => {
    const request = { body: '{', headers: {} } as never
    expect(() => matchChannels(request)).not.toThrow()
    expect(matchChannels(request)).toBe(false)
  })
})
