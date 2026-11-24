import {
	comparisonMetadata,
	GatewayComparisonPage,
} from '@/components/compare/gateway-comparison';

export const metadata = comparisonMetadata('monid');

export default function CompareMonidPage() {
	return <GatewayComparisonPage slug="monid" />;
}
