import type { ReactNode } from 'react';
import type { IDiscordMessageAuthorReply } from './MessageAuthorReply.js';
import { DiscordMessageBaseReply } from './MessageBaseReply.js';

export interface IDiscordMessageInteraction {
	readonly author?: IDiscordMessageAuthorReply | undefined;
	readonly authorNode?: ReactNode | undefined;
	readonly command?: string;
}

export function DiscordMessageInteraction({ author, authorNode, command }: IDiscordMessageInteraction) {
	return (
		<DiscordMessageBaseReply author={author} authorNode={authorNode}>
			<span className="mr-1 select-none text-sm leading-snug text-white">used</span>
			<div className="cursor-pointer text-sm leading-snug text-blurple hover:underline">{command}</div>
		</DiscordMessageBaseReply>
	);
}
