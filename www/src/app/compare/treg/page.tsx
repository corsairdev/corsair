import {
	comparisonMetadata,
	GatewayComparisonPage,
} from '@/components/compare/gateway-comparison';

export const metadata = comparisonMetadata('treg');

export default function CompareTregPage() {
	return <GatewayComparisonPage slug="treg" />;
}
