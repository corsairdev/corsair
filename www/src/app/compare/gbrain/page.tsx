import {
	comparisonMetadata,
	GatewayComparisonPage,
} from '@/components/compare/gateway-comparison';

export const metadata = comparisonMetadata('gbrain');

export default function CompareGbrainPage() {
	return <GatewayComparisonPage slug="gbrain" />;
}
