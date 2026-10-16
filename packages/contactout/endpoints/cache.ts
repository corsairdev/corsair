import type { ContactOutContext } from '..';
import type { Company, LinkedinProfile, SearchProfile } from './types';

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
		await ctx.db.profiles.upsertByEntityId(linkedinUrl, {
			linkedinUrl,
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
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save ContactOut profile to database:', error);
	}
}

export async function saveCompany(ctx: ContactOutContext, company: Company) {
	if (!ctx.db.companies || !company.domain) return;
	try {
		await ctx.db.companies.upsertByEntityId(company.domain, {
			domain: company.domain,
			name: company.name,
			linkedinUrl: company.url ?? company.li_vanity,
			industry: company.industry,
			size: company.size,
			country: company.country,
			foundedAt: company.founded_at,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save ContactOut company to database:', error);
	}
}
