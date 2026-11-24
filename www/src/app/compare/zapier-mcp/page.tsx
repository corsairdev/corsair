import {
	comparisonMetadata,
	GatewayComparisonPage,
} from '@/components/compare/gateway-comparison';

export const metadata = comparisonMetadata('zapier-mcp');

export default function CompareZapierMcpPage() {
	return <GatewayComparisonPage slug="zapier-mcp" />;
}
