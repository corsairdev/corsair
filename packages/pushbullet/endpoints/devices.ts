import { logEventFromContext } from 'corsair/core'
import { makePushbulletRequest } from '../client'
import type { PushbulletEndpoints } from '../index'
import type { PushbulletEndpointOutputs } from './types'
import {
  PushbulletEndpointInputSchemas,
  PushbulletEndpointOutputSchemas,
} from './types'

async function cacheDevice(
  ctx: Parameters<PushbulletEndpoints['devicesRegister']>[0],
  device: PushbulletEndpointOutputs['devicesRegister']
) {
  if (!device.iden || !ctx.db.devices) return
  try {
    await ctx.db.devices.upsertByEntityId(device.iden, {
      id: device.iden,
      nickname: device.nickname,
      manufacturer: device.manufacturer,
      model: device.model,
      icon: device.icon,
      active: device.active,
      has_sms: device.has_sms,
      created: device.created,
    })
  } catch (error) {
    console.warn('Failed to cache device:', error)
  }
}

export const register: PushbulletEndpoints['devicesRegister'] = async (
  ctx,
  input
) => {
  const parsed = PushbulletEndpointInputSchemas.devicesRegister.parse(input)
  const result = await makePushbulletRequest<
    PushbulletEndpointOutputs['devicesRegister']
  >('devices', ctx.key, {
    method: 'POST',
    body: { ...parsed },
    schema: PushbulletEndpointOutputSchemas.devicesRegister,
  })

  await cacheDevice(ctx, result)
  await logEventFromContext(
    ctx,
    'pushbullet.devices.register',
    { ...parsed },
    'completed'
  )
  return result
}

export const list: PushbulletEndpoints['devicesList'] = async (ctx, input) => {
  const parsed = PushbulletEndpointInputSchemas.devicesList.parse(input)
  const result = await makePushbulletRequest<
    PushbulletEndpointOutputs['devicesList']
  >('devices', ctx.key, {
    method: 'GET',
    query: parsed,
    schema: PushbulletEndpointOutputSchemas.devicesList,
  })

  await logEventFromContext(
    ctx,
    'pushbullet.devices.list',
    { ...parsed },
    'completed'
  )
  return result
}

export const update: PushbulletEndpoints['devicesUpdate'] = async (
  ctx,
  input
) => {
  const parsed = PushbulletEndpointInputSchemas.devicesUpdate.parse(input)
  const { iden, ...body } = parsed
  const result = await makePushbulletRequest<
    PushbulletEndpointOutputs['devicesUpdate']
  >(`devices/${encodeURIComponent(iden)}`, ctx.key, {
    method: 'POST',
    body,
    schema: PushbulletEndpointOutputSchemas.devicesUpdate,
  })

  await cacheDevice(ctx, result)
  await logEventFromContext(
    ctx,
    'pushbullet.devices.update',
    { ...parsed },
    'completed'
  )
  return result
}

export const remove: PushbulletEndpoints['devicesDelete'] = async (
  ctx,
  input
) => {
  const parsed = PushbulletEndpointInputSchemas.devicesDelete.parse(input)
  const result = await makePushbulletRequest<
    PushbulletEndpointOutputs['devicesDelete']
  >(`devices/${encodeURIComponent(parsed.iden)}`, ctx.key, {
    method: 'DELETE',
    schema: PushbulletEndpointOutputSchemas.devicesDelete,
  })

  if (ctx.db.devices) {
    try {
      await ctx.db.devices.deleteByEntityId(parsed.iden)
    } catch (error) {
      console.warn('Failed to evict deleted device from cache:', error)
    }
  }

  await logEventFromContext(
    ctx,
    'pushbullet.devices.delete',
    { ...parsed },
    'completed'
  )
  return result
}
