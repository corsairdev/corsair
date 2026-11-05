import type { ContactOutContext } from '..';
import type { Company, LinkedinProfile, SearchProfile } from './types';

// Responses omit fields that weren't requested (output_fields) or aren't known,
// so only the fields present here overwrite what an earlier call saved.
function present<T extends object>(fields: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	) as Partial<T>;
}

export async function saveProfile(
	ctx: ContactOutContext,
	linkedinUrl: string,
	profile: LinkedinProfile | SearchProfile,
) {
	if (!ctx.db.profiles) return;
	const contacts =
		'contact_availability' in profile
			? profile.contact_availability
			: undefined;
	try {
		const existing = await ctx.db.profiles.findByEntityId(linkedinUrl);
		await ctx.db.profiles.upsertByEntityId(linkedinUrl, {
			...existing?.data,
			...present({
				fullName: profile.full_name,
				headline: profile.headline,
				companyName: profile.company?.name,
				companyDomain: profile.company?.domain,
				location: profile.location,
				seniority: profile.seniority,
				hasWorkEmail:
					contacts?.work_email ??
					('work_email' in profile
						? Boolean(profile.work_email?.length)
						: undefined),
				hasPersonalEmail:
					contacts?.personal_email ??
					('personal_email' in profile
						? Boolean(profile.personal_email?.length)
						: undefined),
				hasPhone:
					contacts?.phone ??
					('phone' in profile ? Boolean(profile.phone?.length) : undefined),
			}),
			linkedinUrl,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save ContactOut profile to database:', error);
	}
}

export async function saveCompany(ctx: ContactOutContext, company: Company) {
	if (!ctx.db.companies || !company.domain) return;
	try {
		const existing = await ctx.db.companies.findByEntityId(company.domain);
		await ctx.db.companies.upsertByEntityId(company.domain, {
			...existing?.data,
			...present({
				name: company.name,
				linkedinUrl: company.url ?? company.li_vanity,
				industry: company.industry,
				size: company.size,
				country: company.country,
				foundedAt: company.founded_at,
			}),
			domain: company.domain,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save ContactOut company to database:', error);
	}
}
