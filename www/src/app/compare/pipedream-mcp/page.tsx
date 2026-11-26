import {
	comparisonMetadata,
	GatewayComparisonPage,
} from '@/components/compare/gateway-comparison';

export const metadata = comparisonMetadata('pipedream-mcp');

export default function ComparePipedreamMcpPage() {
	return <GatewayComparisonPage slug="pipedream-mcp" />;
}
