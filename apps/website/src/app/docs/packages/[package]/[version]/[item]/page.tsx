import type {
	ApiClass,
	ApiDeclaredItem,
	ApiEnum,
	ApiInterface,
	ApiItem,
	ApiItemContainerMixin,
	ApiMethod,
	ApiMethodSignature,
	ApiProperty,
	ApiPropertySignature,
	ApiTypeAlias,
	ApiVariable,
	ApiFunction,
} from '@discordjs/api-extractor-model';
import { ApiItemKind, ApiModel, ApiPackage } from '@discordjs/api-extractor-model';
import { tryResolveSummaryText } from '@discordjs/scripts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchModelJSON } from '~/app/docAPI';
import { Class } from '~/components/model/Class';
import { Interface } from '~/components/model/Interface';
import { TypeAlias } from '~/components/model/TypeAlias';
import { Variable } from '~/components/model/Variable';
import { Enum } from '~/components/model/enum/Enum';
import { Function } from '~/components/model/function/Function';
import { OVERLOAD_SEPARATOR } from '~/util/constants';
import { fetchMember } from '~/util/fetchMember';
import { findMember } from '~/util/model';

export const revalidate = 3_600;

export interface ItemRouteParams {
	item: string;
	package: string;
	version: string;
}

async function fetchHeadMember({ package: packageName, version, item }: ItemRouteParams) {
	const modelJSON = await fetchModelJSON(packageName, version);

	if (!modelJSON) {
		return undefined;
	}

	const model = new ApiModel();
	model.addMember(ApiPackage.loadFromJson(modelJSON));
	const pkg = model.tryGetPackageByName(packageName);
	const entry = pkg?.entryPoints[0];

	if (!entry) {
		return undefined;
	}

	const [memberName] = decodeURIComponent(item).split(OVERLOAD_SEPARATOR);
	return findMember(model, packageName, memberName);
}

function resolveMemberSearchParams(packageName: string, member?: ApiItem) {
	const params = new URLSearchParams({
		pkg: packageName,
		kind: member?.kind ?? '',
		name: member?.displayName ?? '',
	});

	switch (member?.kind) {
		case ApiItemKind.Interface:
		case ApiItemKind.Class: {
			const typedMember = member as ApiItemContainerMixin;

			const properties = typedMember.members.filter((member) =>
				[ApiItemKind.Property, ApiItemKind.PropertySignature].includes(member.kind),
			) as (ApiProperty | ApiPropertySignature)[];
			const methods = typedMember.members.filter((member) =>
				[ApiItemKind.Method, ApiItemKind.Method].includes(member.kind),
			) as (ApiMethod | ApiMethodSignature)[];

			params.append('methods', methods.length.toString());
			params.append('props', properties.length.toString());
			break;
		}

		case ApiItemKind.Enum: {
			const typedMember = member as ApiEnum;
			params.append('members', typedMember.members.length.toString());
			break;
		}

		default:
			break;
	}

	return params;
}

export async function generateMetadata({ params }: { params: ItemRouteParams }) {
	const member = await fetchHeadMember(params);
	const name = `discord.js${member?.displayName ? ` | ${member.displayName}` : ''}`;
	const ogTitle = `${params.package ?? 'discord.js'}${member?.displayName ? ` | ${member.displayName}` : ''}`;
	const url = new URL('https://discordjs.dev/api/dynamic-open-graph.png');
	const searchParams = resolveMemberSearchParams(params.package, member);
	url.search = searchParams.toString();
	const ogImage = url.toString();
	let description;

	if (member) {
		description = tryResolveSummaryText(member as ApiDeclaredItem);
	}

	return {
		title: name,
		description: description ?? 'Discord.js API Documentation',
		openGraph: {
			title: ogTitle,
			description: description ?? 'Discord.js API Documentation',
			images: ogImage,
		},
	} satisfies Metadata;
}

export async function generateStaticParams({ params: { package: packageName, version } }: { params: ItemRouteParams }) {
	if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
		return [];
	}

	const modelJSON = await fetchModelJSON(packageName, version);

	if (!modelJSON) {
		return [];
	}

	const model = new ApiModel();
	model.addMember(ApiPackage.loadFromJson(modelJSON));

	const pkg = model.tryGetPackageByName(packageName);
	const entry = pkg?.entryPoints[0];

	if (!entry) {
		return [];
	}

	return entry.members.map((member: ApiItem) => ({
		package: packageName,
		version,
		item: `${member.displayName}${OVERLOAD_SEPARATOR}${member.kind}`,
	}));
}

function Member({ member }: { readonly member?: ApiItem }) {
	switch (member?.kind) {
		case 'Class':
			return <Class clazz={member as ApiClass} />;
		case 'Function':
			return <Function item={member as ApiFunction} />;
		case 'Interface':
			return <Interface item={member as ApiInterface} />;
		case 'TypeAlias':
			return <TypeAlias item={member as ApiTypeAlias} />;
		case 'Variable':
			return <Variable item={member as ApiVariable} />;
		case 'Enum':
			return <Enum item={member as ApiEnum} />;
		default:
			return <div>Cannot render that item type</div>;
	}
}

export default async function Page({ params }: { params: ItemRouteParams }) {
	const member = await fetchMember(params.package, params.version ?? 'main', params.item);

	if (!member) {
		notFound();
	}

	return (
		<div className="relative">
			<Member member={member} />
		</div>
	);
}
