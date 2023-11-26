import type { ApiTypeParameterListMixin } from '@discordjs/api-extractor-model';
import { useMemo } from 'react';
import { ExcerptText } from './ExcerptText';
import { Table } from './Table';
import { TSDoc } from './documentation/tsdoc/TSDoc';

const rowElements = {
	Name: 'font-mono whitespace-nowrap',
	Constraints: 'font-mono whitespace-pre break-normal',
	Default: 'font-mono whitespace-pre break-normal',
};

export function TypeParamTable({ item }: { readonly item: ApiTypeParameterListMixin }) {
	const rows = useMemo(
		() =>
			item.typeParameters.map((typeParam) => ({
				Name: typeParam.name,
				Constraints: <ExcerptText excerpt={typeParam.constraintExcerpt} apiPackage={item.getAssociatedPackage()!} />,
				Optional: typeParam.isOptional ? 'Yes' : 'No',
				Default: <ExcerptText excerpt={typeParam.defaultTypeExcerpt} apiPackage={item.getAssociatedPackage()!} />,
				Description: typeParam.tsdocTypeParamBlock ? (
					<TSDoc item={item} tsdoc={typeParam.tsdocTypeParamBlock.content} />
				) : (
					'None'
				),
			})),
		[item],
	);

	return (
		<div className="overflow-x-auto">
			<Table
				columnStyles={rowElements}
				columns={['Name', 'Constraints', 'Optional', 'Default', 'Description']}
				rows={rows}
			/>
		</div>
	);
}
