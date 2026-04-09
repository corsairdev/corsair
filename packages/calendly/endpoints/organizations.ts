import { logEventFromContext } from 'corsair/core';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['organizationsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['organizationsGet']
	>(`organizations/${input.uuid}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'calendly.organizations.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getInvitation: CalendlyEndpoints['organizationsGetInvitation'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsGetInvitation']
		>(`organizations/${input.org_uuid}/invitations/${input.uuid}`, ctx.key, {
			method: 'GET',
		});

		if (result.resource && ctx.db.orgInvitations) {
			try {
				const uriParts = result.resource.uri.split('/');
				const id = uriParts[uriParts.length - 1]!;
				await ctx.db.orgInvitations.upsertByEntityId(id, {
					id,
					...result.resource,
					user: result.resource.user ?? undefined,
					created_at: result.resource.created_at
						? new Date(result.resource.created_at)
						: null,
					updated_at: result.resource.updated_at
						? new Date(result.resource.updated_at)
						: null,
				});
			} catch (error) {
				console.warn('Failed to save org invitation to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.organizations.getInvitation',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getMembership: CalendlyEndpoints['organizationsGetMembership'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsGetMembership']
		>(`organization_memberships/${input.uuid}`, ctx.key, {
			method: 'GET',
		});

		if (result.resource) {
			const membership = result.resource;
			if (ctx.db.orgMemberships) {
				try {
					const uriParts = membership.uri.split('/');
					const id = uriParts[uriParts.length - 1]!;
					await ctx.db.orgMemberships.upsertByEntityId(id, {
						id,
						...membership,
						created_at: membership.created_at
							? new Date(membership.created_at)
							: null,
						updated_at: membership.updated_at
							? new Date(membership.updated_at)
							: null,
					});
				} catch (error) {
					console.warn('Failed to save org membership to database:', error);
				}
			}

			if (ctx.db.users && membership.user?.uri) {
				try {
					const uriParts = membership.user.uri.split('/');
					const id = uriParts[uriParts.length - 1]!;
					await ctx.db.users.upsertByEntityId(id, {
						id,
						uri: membership.user.uri,
						name: membership.user.name,
						slug: membership.user.slug,
						email: membership.user.email,
						scheduling_url: membership.user.scheduling_url,
						timezone: membership.user.timezone,
						avatar_url: membership.user.avatar_url ?? undefined,
						created_at: membership.user.created_at
							? new Date(membership.user.created_at)
							: null,
						updated_at: membership.user.updated_at
							? new Date(membership.user.updated_at)
							: null,
					});
				} catch (error) {
					console.warn(
						'Failed to save user from org membership to database:',
						error,
					);
				}
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.organizations.getMembership',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listInvitations: CalendlyEndpoints['organizationsListInvitations'] =
	async (ctx, input) => {
		const { org_uuid: _, ...query } = input;
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsListInvitations']
		>(`organizations/${input.org_uuid}/invitations`, ctx.key, {
			method: 'GET',
			query,
		});

		if (result.collection && ctx.db.orgInvitations) {
			try {
				for (const invitation of result.collection) {
					const uriParts = invitation.uri.split('/');
					const id = uriParts[uriParts.length - 1]!;
					await ctx.db.orgInvitations.upsertByEntityId(id, {
						id,
						...invitation,
						user: invitation.user ?? undefined,
						created_at: invitation.created_at
							? new Date(invitation.created_at)
							: null,
						updated_at: invitation.updated_at
							? new Date(invitation.updated_at)
							: null,
					});
				}
			} catch (error) {
				console.warn('Failed to save org invitations to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.organizations.listInvitations',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listMemberships: CalendlyEndpoints['organizationsListMemberships'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsListMemberships']
		>('organization_memberships', ctx.key, {
			method: 'GET',
			query: input,
		});

		if (result.collection) {
			for (const membership of result.collection) {
				if (ctx.db.orgMemberships) {
					try {
						const uriParts = membership.uri.split('/');
						const id = uriParts[uriParts.length - 1]!;
						await ctx.db.orgMemberships.upsertByEntityId(id, {
							id,
							...membership,
							created_at: membership.created_at
								? new Date(membership.created_at)
								: null,
							updated_at: membership.updated_at
								? new Date(membership.updated_at)
								: null,
						});
					} catch (error) {
						console.warn('Failed to save org membership to database:', error);
					}
				}

				if (ctx.db.users && membership.user?.uri) {
					try {
						const uriParts = membership.user.uri.split('/');
						const id = uriParts[uriParts.length - 1]!;
						await ctx.db.users.upsertByEntityId(id, {
							id,
							...membership.user,
							avatar_url: membership.user.avatar_url ?? undefined,
							created_at: membership.user.created_at
								? new Date(membership.user.created_at)
								: null,
							updated_at: membership.user.updated_at
								? new Date(membership.user.updated_at)
								: null,
						});
					} catch (error) {
						console.warn(
							'Failed to save user from org membership to database:',
							error,
						);
					}
				}
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.organizations.listMemberships',
			{ ...input },
			'completed',
		);
		return result;
	};

export const deleteMembership: CalendlyEndpoints['organizationsDeleteMembership'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsDeleteMembership']
		>(`organization_memberships/${input.uuid}`, ctx.key, {
			method: 'DELETE',
		});

		if (ctx.db.orgMemberships) {
			try {
				await ctx.db.orgMemberships.deleteByEntityId(input.uuid);
			} catch (error) {
				console.warn('Failed to delete org membership from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.organizations.deleteMembership',
			{ ...input },
			'completed',
		);
		return result;
	};

export const invite: CalendlyEndpoints['organizationsInvite'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['organizationsInvite']
	>(`organizations/${input.org_uuid}/invitations`, ctx.key, {
		method: 'POST',
		body: {
			email: input.email,
		},
	});

	if (result.resource && ctx.db.orgInvitations) {
		try {
			const uriParts = result.resource.uri.split('/');
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.orgInvitations.upsertByEntityId(id, {
				id,
				...result.resource,
				user: result.resource.user ?? undefined,
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save org invitation to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.organizations.invite',
		{ ...input },
		'completed',
	);
	return result;
};

// removeMember and deleteMembership are identical operations (DELETE /organization_memberships/{uuid});
// delegate to avoid duplicating the implementation.
export const removeMember: CalendlyEndpoints['organizationsRemoveMember'] = (
	ctx,
	input,
) => deleteMembership(ctx, input);

export const revokeInvitation: CalendlyEndpoints['organizationsRevokeInvitation'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsRevokeInvitation']
		>(`organizations/${input.org_uuid}/invitations/${input.uuid}`, ctx.key, {
			method: 'DELETE',
		});

		if (ctx.db.orgInvitations) {
			try {
				await ctx.db.orgInvitations.deleteByEntityId(input.uuid);
			} catch (error) {
				console.warn('Failed to delete org invitation from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.organizations.revokeInvitation',
			{ ...input },
			'completed',
		);
		return result;
	};
