import { makeKlipfolioRequest } from './client';
import {
	addGroupDefaultTabs,
	createClient,
	createClientSettings,
	createDashboardPublishedLinks,
	createDatasource,
	createDatasourceInstances,
	createGroup,
	createKlip,
	createKlipAnnotations,
	createRole,
	createTab,
	createUser,
	deleteClient,
	deleteClientProperties,
	deleteClientShareRight,
	deleteDashboardPublishedLinks,
	deleteDatasource,
	deleteDatasourceInstances,
	deleteDatasourceInstancesProperties,
	deleteDatasourceProperties,
	deleteDatasourceShareRight,
	deleteGroup,
	deleteGroupDefaultTab,
	deleteGroupUser,
	deleteInstancesDatasource,
	deleteKlip,
	deleteKlipAnnotation,
	deleteKlipShareRights,
	deleteRole,
	deleteRolePermissions,
	deleteRoleUser,
	deleteTab,
	deleteTabKlipInstance,
	deleteTabShareRight,
	deleteUser,
	deleteUserGroup,
	deleteUserProperties,
	deleteUserRole,
	deleteUserTabInstance,
	disableDatasource,
	enableDatasource,
	enableDirectBillingClient,
	extendTrialClient,
	importDatasource,
	importKlip,
	importTab,
	listClients,
	listDashboardPublishedLinks,
	listDatasourceInstances,
	listDatasources,
	listGroups,
	listKlips,
	listRoles,
	listTabs,
	listUsers,
	refreshDatasource,
	refreshDatasourceInstances,
	resendInviteUser,
	resetPasswordUser,
	retrieveClient,
	retrieveClientFeatures,
	retrieveClientProperties,
	retrieveClientResources,
	retrieveClientSettings,
	retrieveClientShareRights,
	retrieveDatasource,
	retrieveDatasourceInstances,
	retrieveDatasourceInstancesData,
	retrieveDatasourceInstancesProperties,
	retrieveDatasourceProperties,
	retrieveDatasourceShareRights,
	retrieveGroup,
	retrieveGroupDefaultTab,
	retrieveGroupDefaultTabs,
	retrieveGroupUsers,
	retrieveKlip,
	retrieveKlipAnnotation,
	retrieveKlipAnnotations,
	retrieveKlipClientInstances,
	retrieveKlipSchema,
	retrieveKlipShareRights,
	retrieveProfile,
	retrieveRole,
	retrieveRolePermissions,
	retrieveRoleUsers,
	retrieveTab,
	retrieveTabKlipInstances,
	retrieveTabLayout,
	retrieveTabShareRights,
	retrieveUser,
	retrieveUserGroups,
	retrieveUserProperties,
	retrieveUserRoles,
	retrieveUserTabInstances,
	setClientShareRights,
	setDatasourceShareRights,
	setKlipShareRights,
	setTabShareRights,
	updateClient,
	updateClientFeatures,
	updateClientProperties,
	updateClientResources,
	updateDashboardPublishedLinks,
	updateDatasource,
	updateDatasourceInstancesData,
	updateDatasourceInstancesProperties,
	updateDatasourceProperties,
	updateFromParentKlip,
	updateGroup,
	updateGroupDefaultTab,
	updateGroupUser,
	updateKlip,
	updateKlipAnnotation,
	updateKlipSchema,
	updateRole,
	updateRolePermissions,
	updateRoleUser,
	updateTab,
	updateTabKlipInstances,
	updateTabLayout,
	updateUser,
	updateUserGroup,
	updateUserProperties,
	updateUserRole,
	updateUserTabInstances,
} from './endpoints';

jest.mock('./client', () => ({
	makeKlipfolioRequest: jest.fn(),
}));
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

const request = jest.mocked(makeKlipfolioRequest);

describe('Klipfolio endpoint request seams', () => {
	beforeEach(() => {
		request.mockClear();
		request.mockResolvedValue({});
	});

	it('covers every registered operation route', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		await listClients(ctx, {
			external_id: 'external_id-1',
			status: 'active',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients', {
			method: 'GET',
			query: { external_id: 'external_id-1', status: 'active' },
		});
		await retrieveClient(ctx, { id: 'id-1', full: true } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1', {
			method: 'GET',
			query: { full: true },
		});
		await createClient(ctx, {
			name: 'name-1',
			description: 'description-1',
			status: 'active',
			seats: 1,
			custom_theme: true,
			external_id: 'external_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients', {
			method: 'POST',
			body: {
				name: 'name-1',
				description: 'description-1',
				status: 'active',
				seats: 1,
				custom_theme: true,
				external_id: 'external_id-1',
			},
		});
		await updateClient(ctx, {
			id: 'id-1',
			name: 'name-1',
			description: 'description-1',
			status: 'active',
			seats: 1,
			custom_theme: true,
			external_id: 'external_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1', {
			method: 'PUT',
			body: {
				name: 'name-1',
				description: 'description-1',
				status: 'active',
				seats: 1,
				custom_theme: true,
				external_id: 'external_id-1',
			},
		});
		await deleteClient(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1', {
			method: 'DELETE',
		});
		await enableDirectBillingClient(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/clients/id-1/@/enable_direct_billing',
			{ method: 'POST', body: {} },
		);
		await extendTrialClient(ctx, { id: 'id-1', days: 'days-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1/@/extend_trial', {
			method: 'POST',
			body: { days: 'days-1' },
		});
		await retrieveClientFeatures(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1/features', {
			method: 'GET',
		});
		await updateClientFeatures(ctx, {
			id: 'id-1',
			features: ['features-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1/features', {
			method: 'PUT',
			body: { features: ['features-1'] },
		});
		await retrieveClientProperties(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1/properties', {
			method: 'GET',
		});
		await updateClientProperties(ctx, {
			id: 'id-1',
			properties: { value: 'properties-1' },
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1/properties', {
			method: 'PUT',
			body: { properties: { value: 'properties-1' } },
		});
		await deleteClientProperties(ctx, {
			id: 'id-1',
			name: 'name-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1/properties', {
			method: 'DELETE',
			query: { name: 'name-1', client_id: 'client_id-1' },
		});
		await retrieveClientResources(ctx, { id: 'id-1', full: true } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1/resources', {
			method: 'GET',
			query: { full: true },
		});
		await updateClientResources(ctx, {
			id: 'id-1',
			resources: ['resources-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1/resources', {
			method: 'PUT',
			body: { resources: ['resources-1'] },
		});
		await retrieveClientSettings(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1/settings', {
			method: 'GET',
		});
		await createClientSettings(ctx, {
			id: 'id-1',
			'dpn.env.date.language.tag': 'dpn.env.date.language.tag-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1/settings', {
			method: 'POST',
			body: { 'dpn.env.date.language.tag': 'dpn.env.date.language.tag-1' },
		});
		await retrieveClientShareRights(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1/share-rights', {
			method: 'GET',
		});
		await setClientShareRights(ctx, {
			id: 'id-1',
			groups: ['groups-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/clients/id-1/share-rights', {
			method: 'PUT',
			body: { groups: ['groups-1'] },
		});
		await deleteClientShareRight(ctx, {
			id: 'id-1',
			groupId: 'groupId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/clients/id-1/share-rights/groupId-1',
			{ method: 'DELETE' },
		);
		await listDatasources(ctx, { client_id: 'client_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await retrieveDatasource(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources/id-1', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await createDatasource(ctx, {
			name: 'name-1',
			description: 'description-1',
			format: 'format-1',
			connector: 'connector-1',
			refresh_interval: 1,
			properties: { value: 'properties-1' },
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources', {
			method: 'POST',
			body: {
				name: 'name-1',
				description: 'description-1',
				format: 'format-1',
				connector: 'connector-1',
				refresh_interval: 1,
				properties: { value: 'properties-1' },
			},
		});
		await updateDatasource(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			name: 'name-1',
			description: 'description-1',
			refresh_interval: 1,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources/id-1', {
			method: 'PUT',
			body: {
				client_id: 'client_id-1',
				name: 'name-1',
				description: 'description-1',
				refresh_interval: 1,
			},
		});
		await deleteDatasource(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources/id-1', {
			method: 'DELETE',
		});
		await enableDatasource(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources/id-1/@/enable', {
			method: 'POST',
			body: {},
		});
		await disableDatasource(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources/id-1/@/disable', {
			method: 'POST',
			body: {},
		});
		await importDatasource(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources/id-1/@/import', {
			method: 'POST',
			body: { client_id: 'client_id-1' },
		});
		await deleteInstancesDatasource(ctx, {
			id: 'id-1',
			last_access: 1,
			keep_latest_instance: true,
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/datasources/id-1/@/delete_instances',
			{ method: 'POST', body: { last_access: 1, keep_latest_instance: true } },
		);
		await retrieveDatasourceProperties(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources/id-1/properties', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await updateDatasourceProperties(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			properties: { value: 'properties-1' },
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources/id-1/properties', {
			method: 'PUT',
			body: { client_id: 'client_id-1', properties: { value: 'properties-1' } },
		});
		await deleteDatasourceProperties(ctx, {
			id: 'id-1',
			name: 'name-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources/id-1/properties', {
			method: 'DELETE',
			query: { name: 'name-1', client_id: 'client_id-1' },
		});
		await retrieveDatasourceShareRights(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/datasources/id-1/share-rights',
			{ method: 'GET', query: { client_id: 'client_id-1' } },
		);
		await setDatasourceShareRights(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			users: ['users-1'],
			groups: ['groups-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/datasources/id-1/share-rights',
			{
				method: 'PUT',
				body: {
					client_id: 'client_id-1',
					users: ['users-1'],
					groups: ['groups-1'],
				},
			},
		);
		await deleteDatasourceShareRight(ctx, {
			id: 'id-1',
			groupId: 'groupId-1',
			client_id: 'client_id-1',
			type: 'type-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/datasources/id-1/share-rights/groupId-1',
			{ method: 'DELETE' },
		);
		await listDatasourceInstances(ctx, {
			datasource_id: 'datasource_id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasource-instances', {
			method: 'GET',
			query: { datasource_id: 'datasource_id-1', client_id: 'client_id-1' },
		});
		await retrieveDatasourceInstances(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasource-instances/id-1', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await createDatasourceInstances(ctx, {
			client_id: 'client_id-1',
			datasource_id: 'datasource_id-1',
			properties: { value: 'properties-1' },
			no_refresh: true,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasource-instances', {
			method: 'POST',
			body: {
				client_id: 'client_id-1',
				datasource_id: 'datasource_id-1',
				properties: { value: 'properties-1' },
				no_refresh: true,
			},
		});
		await deleteDatasourceInstances(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasource-instances/id-1', {
			method: 'DELETE',
		});
		await retrieveDatasourceInstancesData(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/datasource-instances/id-1/data',
			{ method: 'GET', query: { client_id: 'client_id-1' } },
		);
		await updateDatasourceInstancesData(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			rawContent: 'raw-content-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/datasource-instances/id-1/data',
			{
				method: 'PUT',
				body: 'raw-content-1',
				mediaType: 'text/plain; charset=utf-8',
				query: { client_id: 'client_id-1' },
			},
		);
		await refreshDatasourceInstances(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/datasource-instances/id-1/@/refresh',
			{ method: 'POST', body: { client_id: 'client_id-1' } },
		);
		await refreshDatasource(ctx, {
			client_id: 'client_id-1',
			datasources: ['datasources-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources/@/refresh', {
			method: 'POST',
			body: { client_id: 'client_id-1', datasources: ['datasources-1'] },
		});
		await retrieveDatasourceInstancesProperties(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/datasource-instances/id-1/properties',
			{ method: 'GET', query: { client_id: 'client_id-1' } },
		);
		await updateDatasourceInstancesProperties(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			properties: { value: 'properties-1' },
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/datasource-instances/id-1/properties',
			{
				method: 'PUT',
				body: {
					client_id: 'client_id-1',
					properties: { value: 'properties-1' },
				},
			},
		);
		await deleteDatasourceInstancesProperties(ctx, {
			id: 'id-1',
			name: 'name-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/datasource-instances/id-1/properties',
			{ method: 'DELETE', query: { name: 'name-1', client_id: 'client_id-1' } },
		);
		await listGroups(ctx, { client_id: 'client_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/groups', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await retrieveGroup(ctx, {
			id: 'id-1',
			full: true,
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/groups/id-1', {
			method: 'GET',
			query: { full: true, client_id: 'client_id-1' },
		});
		await createGroup(ctx, {
			name: 'name-1',
			description: 'description-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/groups', {
			method: 'POST',
			body: {
				name: 'name-1',
				description: 'description-1',
				client_id: 'client_id-1',
			},
		});
		await updateGroup(ctx, {
			id: 'id-1',
			name: 'name-1',
			description: 'description-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/groups/id-1', {
			method: 'PUT',
			body: {
				name: 'name-1',
				description: 'description-1',
				client_id: 'client_id-1',
			},
		});
		await deleteGroup(ctx, { id: 'id-1', client_id: 'client_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/groups/id-1', {
			method: 'DELETE',
		});
		await retrieveGroupDefaultTabs(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/groups/id-1/default-tabs', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await retrieveGroupDefaultTab(ctx, {
			id: 'id-1',
			id2: 'id2-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/groups/id-1/default-tabs/id2-1',
			{ method: 'GET', query: { client_id: 'client_id-1' } },
		);
		await addGroupDefaultTabs(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			tab_id: 'tab_id-1',
			can_edit: true,
			visibility: 'visibility-1',
			index: 1,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/groups/id-1/default-tabs', {
			method: 'POST',
			body: {
				client_id: 'client_id-1',
				tab_id: 'tab_id-1',
				can_edit: true,
				visibility: 'visibility-1',
				index: 1,
			},
		});
		await updateGroupDefaultTab(ctx, {
			id: 'id-1',
			id2: 'id2-1',
			client_id: 'client_id-1',
			can_edit: true,
			visibility: 'visibility-1',
			index: 1,
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/groups/id-1/default-tabs/id2-1',
			{
				method: 'PUT',
				body: {
					client_id: 'client_id-1',
					can_edit: true,
					visibility: 'visibility-1',
					index: 1,
				},
			},
		);
		await deleteGroupDefaultTab(ctx, {
			id: 'id-1',
			id2: 'id2-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/groups/id-1/default-tabs/id2-1',
			{ method: 'DELETE' },
		);
		await retrieveGroupUsers(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/groups/id-1/users', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await updateGroupUser(ctx, {
			id: 'id-1',
			userid: 'userid-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/groups/id-1/users/userid-1', {
			method: 'PUT',
			body: { client_id: 'client_id-1' },
		});
		await deleteGroupUser(ctx, {
			id: 'id-1',
			id2: 'id2-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/groups/id-1/users/id2-1', {
			method: 'DELETE',
		});
		await listKlips(ctx, {
			datasource_id: 'datasource_id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips', {
			method: 'GET',
			query: { datasource_id: 'datasource_id-1', client_id: 'client_id-1' },
		});
		await retrieveKlip(ctx, {
			id: 'id-1',
			full: true,
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips/id-1', {
			method: 'GET',
			query: { full: true, client_id: 'client_id-1' },
		});
		await retrieveKlipClientInstances(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips/id-1/client-instances', {
			method: 'GET',
		});
		await createKlip(ctx, {
			name: 'name-1',
			description: 'description-1',
			client_id: 'client_id-1',
			schema: { value: 'schema-1' },
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips', {
			method: 'POST',
			body: {
				name: 'name-1',
				description: 'description-1',
				client_id: 'client_id-1',
				schema: { value: 'schema-1' },
			},
		});
		await updateKlip(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			klip_id: 'klip_id-1',
			name: 'name-1',
			description: 'description-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips/id-1', {
			method: 'PUT',
			body: {
				client_id: 'client_id-1',
				klip_id: 'klip_id-1',
				name: 'name-1',
				description: 'description-1',
			},
		});
		await deleteKlip(ctx, { id: 'id-1', client_id: 'client_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips/id-1', {
			method: 'DELETE',
		});
		await retrieveKlipAnnotations(ctx, {
			id: 'id-1',
			start_date: 'start_date-1',
			end_date: 'end_date-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips/id-1/annotations', {
			method: 'GET',
			query: {
				start_date: 'start_date-1',
				end_date: 'end_date-1',
				client_id: 'client_id-1',
			},
		});
		await retrieveKlipAnnotation(ctx, {
			id: 'id-1',
			annotationId: 'annotationId-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/klips/id-1/annotations/annotationId-1',
			{ method: 'GET', query: { client_id: 'client_id-1' } },
		);
		await createKlipAnnotations(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			body: 'body-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips/id-1/annotations', {
			method: 'POST',
			body: { client_id: 'client_id-1', body: 'body-1' },
		});
		await updateKlipAnnotation(ctx, {
			id: 'id-1',
			annotationId: 'annotationId-1',
			client_id: 'client_id-1',
			'annotation id': 'annotation id-1',
			body: 'body-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/klips/id-1/annotations/annotationId-1',
			{
				method: 'PUT',
				body: {
					client_id: 'client_id-1',
					'annotation id': 'annotation id-1',
					body: 'body-1',
				},
			},
		);
		await deleteKlipAnnotation(ctx, {
			id: 'id-1',
			annotationId: 'annotationId-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/klips/id-1/annotations/annotationId-1',
			{ method: 'DELETE' },
		);
		await updateFromParentKlip(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/klips/id-1/@/update_from_parent',
			{ method: 'POST', body: {} },
		);
		await retrieveKlipSchema(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips/id-1/schema', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await updateKlipSchema(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			title: 'title-1',
			wire_id: 'wire_id-1',
			'workspace.datasources': ['workspace.datasources-1'],
			components: ['components-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips/id-1/schema', {
			method: 'PUT',
			body: {
				client_id: 'client_id-1',
				title: 'title-1',
				'workspace.datasources': ['workspace.datasources-1'],
				components: ['components-1'],
				id: 'wire_id-1',
			},
		});
		await retrieveKlipShareRights(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips/id-1/share-rights', {
			method: 'GET',
		});
		await setKlipShareRights(ctx, {
			id: 'id-1',
			groups: ['groups-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips/id-1/share-rights', {
			method: 'PUT',
			body: { groups: ['groups-1'] },
		});
		await deleteKlipShareRights(ctx, {
			id: 'id-1',
			groups: ['groups-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips/id-1/share-rights', {
			method: 'DELETE',
			body: { groups: ['groups-1'] },
		});
		await importKlip(ctx, { id: 'id-1', client_id: 'client_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/klips/id-1/@/import', {
			method: 'POST',
			body: { client_id: 'client_id-1' },
		});
		await retrieveProfile(ctx, { full: true } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/profile', {
			method: 'GET',
			query: { full: true },
		});
		await createDashboardPublishedLinks(ctx, {
			dashboardId: 'dashboardId-1',
			client_id: 'client_id-1',
			name: 'name-1',
			password: 'password-1',
			isPublic: true,
			theme: 'theme-1',
			logo: 'logo-1',
			social: true,
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/dashboard-published-links/dashboardId-1',
			{
				method: 'POST',
				body: {
					client_id: 'client_id-1',
					name: 'name-1',
					password: 'password-1',
					isPublic: true,
					theme: 'theme-1',
					logo: 'logo-1',
					social: true,
				},
			},
		);
		await listDashboardPublishedLinks(ctx, {
			dashboard_id: 'dashboard_id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/dashboard-published-links', {
			method: 'GET',
			query: { dashboard_id: 'dashboard_id-1', client_id: 'client_id-1' },
		});
		await updateDashboardPublishedLinks(ctx, {
			publishedLinkId: 'publishedLinkId-1',
			client_id: 'client_id-1',
			name: 'name-1',
			password: 'password-1',
			isPublic: true,
			theme: 'theme-1',
			logo: 'logo-1',
			social: true,
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/dashboard-published-links/publishedLinkId-1',
			{
				method: 'PUT',
				body: {
					client_id: 'client_id-1',
					name: 'name-1',
					password: 'password-1',
					isPublic: true,
					theme: 'theme-1',
					logo: 'logo-1',
					social: true,
				},
			},
		);
		await deleteDashboardPublishedLinks(ctx, {
			publishedLinkId: 'publishedLinkId-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/dashboard-published-links/publishedLinkId-1',
			{ method: 'DELETE' },
		);
		await listRoles(ctx, { client_id: 'client_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/roles', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await retrieveRole(ctx, {
			id: 'id-1',
			full: true,
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/roles/id-1', {
			method: 'GET',
			query: { full: true, client_id: 'client_id-1' },
		});
		await updateRole(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			name: 'name-1',
			description: 'description-1',
			permissions: ['permissions-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/roles/id-1', {
			method: 'PUT',
			body: {
				client_id: 'client_id-1',
				name: 'name-1',
				description: 'description-1',
				permissions: ['permissions-1'],
			},
		});
		await createRole(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			name: 'name-1',
			description: 'description-1',
			permissions: ['permissions-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/roles/id-1', {
			method: 'POST',
			body: {
				client_id: 'client_id-1',
				name: 'name-1',
				description: 'description-1',
				permissions: ['permissions-1'],
			},
		});
		await deleteRole(ctx, { id: 'id-1', client_id: 'client_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/roles/id-1', {
			method: 'DELETE',
		});
		await retrieveRoleUsers(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/roles/id-1/users', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await updateRoleUser(ctx, {
			id: 'id-1',
			userId: 'userId-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/roles/id-1/users/userId-1', {
			method: 'PUT',
			body: { client_id: 'client_id-1' },
		});
		await deleteRoleUser(ctx, {
			id: 'id-1',
			userid: 'userid-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/roles/id-1/users/userid-1', {
			method: 'DELETE',
		});
		await retrieveRolePermissions(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/roles/id-1/permissions', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await updateRolePermissions(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			permissions: ['permissions-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/roles/id-1/permissions', {
			method: 'PUT',
			body: { client_id: 'client_id-1', permissions: ['permissions-1'] },
		});
		await deleteRolePermissions(ctx, {
			id: 'id-1',
			name: 'name-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/roles/id-1/permissions', {
			method: 'DELETE',
		});
		await listTabs(ctx, { client_id: 'client_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tabs', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await retrieveTab(ctx, {
			id: 'id-1',
			full: true,
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tabs/id-1', {
			method: 'GET',
			query: { full: true, client_id: 'client_id-1' },
		});
		await createTab(ctx, {
			client_id: 'client_id-1',
			name: 'name-1',
			description: 'description-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tabs', {
			method: 'POST',
			body: {
				client_id: 'client_id-1',
				name: 'name-1',
				description: 'description-1',
			},
		});
		await updateTab(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			name: 'name-1',
			description: 'description-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tabs/id-1', {
			method: 'PUT',
			body: {
				client_id: 'client_id-1',
				name: 'name-1',
				description: 'description-1',
			},
		});
		await deleteTab(ctx, { id: 'id-1', client_id: 'client_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tabs/id-1', {
			method: 'DELETE',
		});
		await retrieveTabKlipInstances(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tabs/id-1/klip-instances', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await updateTabKlipInstances(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			klips: ['klips-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tabs/id-1/klip-instances', {
			method: 'PUT',
			body: { client_id: 'client_id-1', klips: ['klips-1'] },
		});
		await deleteTabKlipInstance(ctx, {
			id: 'id-1',
			klipInstanceId: 'klipInstanceId-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/tabs/id-1/klip-instances/klipInstanceId-1',
			{ method: 'DELETE' },
		);
		await retrieveTabLayout(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tabs/id-1/layout', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await updateTabLayout(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			type: 'type-1',
			state: 'state-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tabs/id-1/layout', {
			method: 'PUT',
			body: { client_id: 'client_id-1', type: 'type-1', state: 'state-1' },
		});
		await retrieveTabShareRights(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tabs/id-1/share-rights', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await setTabShareRights(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			groups: ['groups-1'],
			users: ['users-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tabs/id-1/share-rights', {
			method: 'PUT',
			body: {
				client_id: 'client_id-1',
				groups: ['groups-1'],
				users: ['users-1'],
			},
		});
		await deleteTabShareRight(ctx, {
			id: 'id-1',
			groupId: 'groupId-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/tabs/id-1/share-rights/groupId-1',
			{ method: 'DELETE' },
		);
		await importTab(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			tab_id: 'tab_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tabs/id-1/@/import', {
			method: 'POST',
			body: { client_id: 'client_id-1', tab_id: 'tab_id-1' },
		});
		await listUsers(ctx, {
			client_id: 'client_id-1',
			email: 'email-1',
			external_id: 'external_id-1',
			full: true,
			include_roles: true,
			include_groups: true,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users', {
			method: 'GET',
			query: {
				client_id: 'client_id-1',
				email: 'email-1',
				external_id: 'external_id-1',
				full: true,
				include_roles: true,
				include_groups: true,
			},
		});
		await retrieveUser(ctx, {
			id: 'id-1',
			full: true,
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1', {
			method: 'GET',
			query: { full: true, client_id: 'client_id-1' },
		});
		await createUser(ctx, {
			send_email: true,
			first_name: 'first_name-1',
			last_name: 'last_name-1',
			roles: ['roles-1'],
			email: 'email-1',
			password: 'password-1',
			external_id: 'external_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users', {
			method: 'POST',
			body: {
				send_email: true,
				first_name: 'first_name-1',
				last_name: 'last_name-1',
				roles: ['roles-1'],
				email: 'email-1',
				password: 'password-1',
				external_id: 'external_id-1',
			},
		});
		await updateUser(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			first_name: 'first_name-1',
			last_name: 'last_name-1',
			external_id: 'external_id-1',
			email: 'email-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1', {
			method: 'PUT',
			body: {
				client_id: 'client_id-1',
				first_name: 'first_name-1',
				last_name: 'last_name-1',
				external_id: 'external_id-1',
				email: 'email-1',
			},
		});
		await deleteUser(ctx, { id: 'id-1', client_id: 'client_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1', {
			method: 'DELETE',
		});
		await retrieveUserGroups(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/groups', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await updateUserGroup(ctx, {
			id: 'id-1',
			groupId: 'groupId-1',
			client_id: 'client_id-1',
			'user id': 'user id-1',
			group_id: 'group_id-1',
			can_edit: true,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/groups/groupId-1', {
			method: 'PUT',
			body: {
				client_id: 'client_id-1',
				'user id': 'user id-1',
				group_id: 'group_id-1',
				can_edit: true,
			},
		});
		await deleteUserGroup(ctx, {
			id: 'id-1',
			groupId: 'groupId-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/groups/groupId-1', {
			method: 'DELETE',
		});
		await resendInviteUser(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/@/resend-invite', {
			method: 'POST',
			body: {},
		});
		await resetPasswordUser(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/@/reset-password', {
			method: 'POST',
			body: {},
		});
		await retrieveUserProperties(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/properties', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await updateUserProperties(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			properties: { key: 'value-1' },
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/properties', {
			method: 'PUT',
			body: { client_id: 'client_id-1', properties: { key: 'value-1' } },
		});
		await deleteUserProperties(ctx, { id: 'id-1', name: 'name-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/properties', {
			method: 'DELETE',
			query: { name: 'name-1' },
		});
		await retrieveUserRoles(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/roles', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await updateUserRole(ctx, {
			id: 'id-1',
			roleId: 'roleId-1',
			client_id: 'client_id-1',
			wire_id: ['wire_id-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/roles/roleId-1', {
			method: 'PUT',
			body: { client_id: 'client_id-1', id: ['wire_id-1'] },
		});
		await deleteUserRole(ctx, {
			id: 'id-1',
			roleid: 'roleid-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/roles/roleid-1', {
			method: 'DELETE',
		});
		await retrieveUserTabInstances(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/tab-instances', {
			method: 'GET',
			query: { client_id: 'client_id-1' },
		});
		await updateUserTabInstances(ctx, {
			id: 'id-1',
			client_id: 'client_id-1',
			tab_ids: ['tab_ids-1'],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1/tab-instances', {
			method: 'PUT',
			body: { client_id: 'client_id-1', tab_ids: ['tab_ids-1'] },
		});
		await deleteUserTabInstance(ctx, {
			id: 'id-1',
			tabInstanceId: 'tabInstanceId-1',
			client_id: 'client_id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/users/id-1/tab-instances/tabInstanceId-1',
			{ method: 'DELETE' },
		);
	});

	it('redacts credentials from the endpoint event log', async () => {
		const logMock = jest.requireMock('corsair/core')
			.logEventFromContext as jest.Mock;
		logMock.mockClear();
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		await createUser(ctx, {
			first_name: 'Jane',
			last_name: 'Doe',
			email: 'jane@example.com',
			roles: ['role-1'],
			password: 'tempPassword',
		} as never);
		// unknown: the event-writer mock records the runtime context and provider
		// payload, which the endpoint signature does not expose; only the logged
		// payload is asserted.
		const calls = logMock.mock.calls as Array<
			[unknown, string, unknown, string]
		>;
		expect(calls[calls.length - 1]?.[2]).toEqual({ redacted: true });
		await retrieveUser(ctx, { id: 'user-1' } as never);
		// unknown: the event-writer mock records the runtime context and provider
		// payload, which the endpoint signature does not expose; only the logged
		// payload is asserted.
		const readCalls = logMock.mock.calls as Array<
			[unknown, string, Record<string, unknown>, string]
		>;
		expect(readCalls[readCalls.length - 1]?.[2]).toEqual({ id: 'user-1' });
	});
});
