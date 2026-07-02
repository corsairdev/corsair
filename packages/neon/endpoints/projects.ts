import { projectsOperations } from '../operations/projects'
import type { NeonEndpoint } from './factory'
import {
  logNeonOperation,
  requestNeonOperation,
  syncNeonOperationResult,
} from './factory'

function getOperation(name: (typeof projectsOperations)[number]['name']) {
  const operation = projectsOperations.find(
    candidate => candidate.name === name
  )
  if (!operation) {
    throw new Error(`[neon] missing operation: ${name}`)
  }
  return operation
}

const listProjectsDefinition = getOperation('listProjects')
export const listProjects: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(ctx, input, listProjectsDefinition)
  await syncNeonOperationResult(ctx, listProjectsDefinition, input, result)
  await logNeonOperation(ctx, input, listProjectsDefinition)
  return result
}

const createProjectDefinition = getOperation('createProject')
export const createProject: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(ctx, input, createProjectDefinition)
  await syncNeonOperationResult(ctx, createProjectDefinition, input, result)
  await logNeonOperation(ctx, input, createProjectDefinition)
  return result
}

const listSharedProjectsDefinition = getOperation('listSharedProjects')
export const listSharedProjects: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    listSharedProjectsDefinition
  )
  await syncNeonOperationResult(
    ctx,
    listSharedProjectsDefinition,
    input,
    result
  )
  await logNeonOperation(ctx, input, listSharedProjectsDefinition)
  return result
}

const getProjectDefinition = getOperation('getProject')
export const getProject: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(ctx, input, getProjectDefinition)
  await syncNeonOperationResult(ctx, getProjectDefinition, input, result)
  await logNeonOperation(ctx, input, getProjectDefinition)
  return result
}

const updateProjectDefinition = getOperation('updateProject')
export const updateProject: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(ctx, input, updateProjectDefinition)
  await syncNeonOperationResult(ctx, updateProjectDefinition, input, result)
  await logNeonOperation(ctx, input, updateProjectDefinition)
  return result
}

const deleteProjectDefinition = getOperation('deleteProject')
export const deleteProject: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(ctx, input, deleteProjectDefinition)
  await syncNeonOperationResult(ctx, deleteProjectDefinition, input, result)
  await logNeonOperation(ctx, input, deleteProjectDefinition)
  return result
}

const listProjectOperationsDefinition = getOperation('listProjectOperations')
export const listProjectOperations: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    listProjectOperationsDefinition
  )
  await syncNeonOperationResult(
    ctx,
    listProjectOperationsDefinition,
    input,
    result
  )
  await logNeonOperation(ctx, input, listProjectOperationsDefinition)
  return result
}

const getProjectOperationDefinition = getOperation('getProjectOperation')
export const getProjectOperation: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    getProjectOperationDefinition
  )
  await syncNeonOperationResult(
    ctx,
    getProjectOperationDefinition,
    input,
    result
  )
  await logNeonOperation(ctx, input, getProjectOperationDefinition)
  return result
}

const listProjectPermissionsDefinition = getOperation('listProjectPermissions')
export const listProjectPermissions: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    listProjectPermissionsDefinition
  )
  await syncNeonOperationResult(
    ctx,
    listProjectPermissionsDefinition,
    input,
    result
  )
  await logNeonOperation(ctx, input, listProjectPermissionsDefinition)
  return result
}

const grantPermissionToProjectDefinition = getOperation(
  'grantPermissionToProject'
)
export const grantPermissionToProject: NeonEndpoint = async (
  ctx,
  input = {}
) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    grantPermissionToProjectDefinition
  )
  await syncNeonOperationResult(
    ctx,
    grantPermissionToProjectDefinition,
    input,
    result
  )
  await logNeonOperation(ctx, input, grantPermissionToProjectDefinition)
  return result
}

const revokePermissionFromProjectDefinition = getOperation(
  'revokePermissionFromProject'
)
export const revokePermissionFromProject: NeonEndpoint = async (
  ctx,
  input = {}
) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    revokePermissionFromProjectDefinition
  )
  await syncNeonOperationResult(
    ctx,
    revokePermissionFromProjectDefinition,
    input,
    result
  )
  await logNeonOperation(ctx, input, revokePermissionFromProjectDefinition)
  return result
}

const getConnectionURIDefinition = getOperation('getConnectionURI')
export const getConnectionURI: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    getConnectionURIDefinition
  )
  await syncNeonOperationResult(ctx, getConnectionURIDefinition, input, result)
  await logNeonOperation(ctx, input, getConnectionURIDefinition)
  return result
}

const getAvailablePreloadLibrariesDefinition = getOperation(
  'getAvailablePreloadLibraries'
)
export const getAvailablePreloadLibraries: NeonEndpoint = async (
  ctx,
  input = {}
) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    getAvailablePreloadLibrariesDefinition
  )
  await syncNeonOperationResult(
    ctx,
    getAvailablePreloadLibrariesDefinition,
    input,
    result
  )
  await logNeonOperation(ctx, input, getAvailablePreloadLibrariesDefinition)
  return result
}

const createProjectTransferRequestDefinition = getOperation(
  'createProjectTransferRequest'
)
export const createProjectTransferRequest: NeonEndpoint = async (
  ctx,
  input = {}
) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    createProjectTransferRequestDefinition
  )
  await syncNeonOperationResult(
    ctx,
    createProjectTransferRequestDefinition,
    input,
    result
  )
  await logNeonOperation(ctx, input, createProjectTransferRequestDefinition)
  return result
}

const acceptProjectTransferRequestDefinition = getOperation(
  'acceptProjectTransferRequest'
)
export const acceptProjectTransferRequest: NeonEndpoint = async (
  ctx,
  input = {}
) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    acceptProjectTransferRequestDefinition
  )
  await syncNeonOperationResult(
    ctx,
    acceptProjectTransferRequestDefinition,
    input,
    result
  )
  await logNeonOperation(ctx, input, acceptProjectTransferRequestDefinition)
  return result
}

const getProjectJWKSDefinition = getOperation('getProjectJWKS')
export const getProjectJWKS: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    getProjectJWKSDefinition
  )
  await syncNeonOperationResult(ctx, getProjectJWKSDefinition, input, result)
  await logNeonOperation(ctx, input, getProjectJWKSDefinition)
  return result
}

const addProjectJWKSDefinition = getOperation('addProjectJWKS')
export const addProjectJWKS: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    addProjectJWKSDefinition
  )
  await syncNeonOperationResult(ctx, addProjectJWKSDefinition, input, result)
  await logNeonOperation(ctx, input, addProjectJWKSDefinition)
  return result
}

const deleteProjectJWKSDefinition = getOperation('deleteProjectJWKS')
export const deleteProjectJWKS: NeonEndpoint = async (ctx, input = {}) => {
  const result = await requestNeonOperation(
    ctx,
    input,
    deleteProjectJWKSDefinition
  )
  await syncNeonOperationResult(ctx, deleteProjectJWKSDefinition, input, result)
  await logNeonOperation(ctx, input, deleteProjectJWKSDefinition)
  return result
}

export const ProjectsEndpoints = {
  listProjects,
  createProject,
  listSharedProjects,
  getProject,
  updateProject,
  deleteProject,
  listProjectOperations,
  getProjectOperation,
  listProjectPermissions,
  grantPermissionToProject,
  revokePermissionFromProject,
  getConnectionURI,
  getAvailablePreloadLibraries,
  createProjectTransferRequest,
  acceptProjectTransferRequest,
  getProjectJWKS,
  addProjectJWKS,
  deleteProjectJWKS,
} as const
