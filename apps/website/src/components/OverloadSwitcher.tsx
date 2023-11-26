'use client';

import { VscChevronDown } from '@react-icons/all-files/vsc/VscChevronDown';
import { VscVersions } from '@react-icons/all-files/vsc/VscVersions';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit/menu';
import type { PropsWithChildren, ReactNode } from 'react';
import { useCallback, useMemo, useState, useEffect } from 'react';

export interface OverloadSwitcherProps {
	methodName: string;
	overloads: ReactNode[];
}

export default function OverloadSwitcher({
	methodName,
	overloads,
	children,
}: PropsWithChildren<{
	readonly methodName: string;
	readonly overloads: ReactNode[];
}>) {
	const [hash, setHash] = useState(() => (typeof window === 'undefined' ? '' : window.location.hash));
	const hashChangeHandler = useCallback(() => {
		setHash(window.location.hash);
	}, []);
	const [overloadIndex, setOverloadIndex] = useState(1);
	const overloadedNode = overloads[overloadIndex - 1]!;
	const menu = useMenuState({ gutter: 8, sameWidth: true, fitViewport: true });

	useEffect(() => {
		window.addEventListener('hashchange', hashChangeHandler);
		return () => {
			window.removeEventListener('hashchange', hashChangeHandler);
		};
	});

	useEffect(() => {
		if (hash) {
			const elementId = hash.replace('#', '');
			const [name, idx] = elementId.split(':');
			if (name && methodName === name) {
				if (idx) {
					const hashOverload = Number.parseInt(idx, 10);
					const resolvedOverload = Math.max(Math.min(hashOverload, overloads.length), 1);
					setOverloadIndex(Number.isNaN(resolvedOverload) ? 1 : resolvedOverload);
				}

				const element = document.querySelector(`[id^='${name}']`);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}
		}
	}, [hash, methodName, overloads.length]);

	const menuItems = useMemo(
		() =>
			overloads.map((_, idx) => (
				<MenuItem
					className="my-0.5 cursor-pointer rounded bg-white p-3 text-sm outline-none active:bg-light-800 dark:bg-dark-600 hover:bg-light-700 focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-400 dark:hover:bg-dark-500"
					key={idx}
					onClick={() => setOverloadIndex(idx + 1)}
				>
					{`Overload ${idx + 1}`}
				</MenuItem>
			)),
		[overloads],
	);

	return (
		<div className="flex flex-col place-items-start gap-2">
			<MenuButton
				className="mb-2 rounded bg-white p-3 outline-none active:bg-light-900 dark:bg-dark-400 hover:bg-light-800 focus:ring focus:ring-width-2 focus:ring-blurple md:-ml-2 dark:active:bg-dark-200 dark:hover:bg-dark-300"
				state={menu}
			>
				<div className="flex flex-row place-content-between place-items-center gap-2">
					<VscVersions size={20} />
					<div>
						<span className="font-semibold">{`Overload ${overloadIndex}`}</span>
						{` of ${overloads.length}`}
					</div>
					<VscChevronDown
						className={`transform transition duration-150 ease-in-out ${menu.open ? 'rotate-180' : 'rotate-0'}`}
						size={20}
					/>
				</div>
			</MenuButton>
			<Menu
				className="z-20 flex flex-col border border-light-800 rounded bg-white p-1 outline-none dark:border-dark-100 dark:bg-dark-600 focus:ring focus:ring-width-2 focus:ring-blurple"
				state={menu}
			>
				{menuItems}
			</Menu>
			{children}
			{overloadedNode}
		</div>
	);
}
