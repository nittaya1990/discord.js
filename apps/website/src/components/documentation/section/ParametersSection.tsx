import type { ApiDocumentedItem, ApiParameterListMixin } from '@discordjs/api-extractor-model';
import { VscSymbolParameter } from '@react-icons/all-files/vsc/VscSymbolParameter';
import { ParameterTable } from '../../ParameterTable';
import { DocumentationSection } from './DocumentationSection';

export function ParameterSection({ item }: { readonly item: ApiDocumentedItem & ApiParameterListMixin }) {
	return (
		<DocumentationSection icon={<VscSymbolParameter size={20} />} padded title="Parameters">
			<ParameterTable item={item} />
		</DocumentationSection>
	);
}
