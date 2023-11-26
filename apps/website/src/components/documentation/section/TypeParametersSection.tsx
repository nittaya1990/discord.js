import type { ApiTypeParameterListMixin } from '@discordjs/api-extractor-model';
import { VscSymbolParameter } from '@react-icons/all-files/vsc/VscSymbolParameter';
import { TypeParamTable } from '../../TypeParamTable';
import { DocumentationSection } from './DocumentationSection';

export function TypeParameterSection({ item }: { readonly item: ApiTypeParameterListMixin }) {
	return (
		<DocumentationSection icon={<VscSymbolParameter size={20} />} padded title="Type Parameters">
			<TypeParamTable item={item} />
		</DocumentationSection>
	);
}
