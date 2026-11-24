import {
	comparisonMetadata,
	GatewayComparisonPage,
} from '@/components/compare/gateway-comparison';

export const metadata = comparisonMetadata('smithery');

export default function CompareSmitheryPage() {
	return <GatewayComparisonPage slug="smithery" />;
}
