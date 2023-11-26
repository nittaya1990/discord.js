'use client';

import { FiCommand } from '@react-icons/all-files/fi/FiCommand';
import { VscGithubInverted } from '@react-icons/all-files/vsc/VscGithubInverted';
import { VscMenu } from '@react-icons/all-files/vsc/VscMenu';
import { VscSearch } from '@react-icons/all-files/vsc/VscSearch';
import { Button } from 'ariakit/button';
import type { Route } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useMemo } from 'react';
import { useCmdK } from '~/contexts/cmdK';
import { useNav } from '~/contexts/nav';

const ThemeSwitcher = dynamic(async () => import('./ThemeSwitcher'));

export default function Header() {
	const pathname = usePathname();
	const { setOpened } = useNav();
	const dialog = useCmdK();

	const pathElements = useMemo(
		() =>
			pathname
				.split('/')
				.slice(1)
				.map((path, idx, original) => (
					<Link
						className="rounded outline-none hover:underline focus:ring focus:ring-width-2 focus:ring-blurple"
						href={`/${original.slice(0, idx + 1).join('/')}` as Route}
						key={`${path}-${idx}`}
					>
						{path}
					</Link>
				)),
		[pathname],
	);

	const breadcrumbs = useMemo(
		() =>
			pathElements.flatMap((el, idx, array) => {
				if (idx === 0) {
					return (
						<Fragment key={`${el.key}-${idx}`}>
							<div className="mx-2">/</div>
							<div>{el}</div>
							<div className="mx-2">/</div>
						</Fragment>
					);
				}

				if (idx !== array.length - 1) {
					return (
						<Fragment key={`${el.key}-${idx}`}>
							<div>{el}</div>
							<div className="mx-2">/</div>
						</Fragment>
					);
				}

				return <div key={`${el.key}-${idx}`}>{el}</div>;
			}),
		[pathElements],
	);

	return (
		<header className="sticky top-4 z-20 border border-light-900 rounded-md bg-white/75 shadow backdrop-blur-md dark:border-dark-100 dark:bg-dark-600/75">
			<div className="block h-16 px-6">
				<div className="h-full flex flex-row place-content-between place-items-center gap-8">
					<Button
						aria-label="Menu"
						className="h-6 w-6 flex flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center border-0 rounded bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-none lg:hidden active:translate-y-px focus:ring focus:ring-width-2 focus:ring-blurple"
						onClick={() => setOpened((open) => !open)}
					>
						<VscMenu size={24} />
					</Button>
					<div className="hidden lg:flex lg:grow lg:flex-row lg:overflow-hidden">{breadcrumbs}</div>
					<Button
						as="div"
						className="hidden w-56 grow rounded bg-white px-4 py-2.5 outline-none md:block sm:grow-0 dark:bg-dark-800 focus:ring focus:ring-width-2 focus:ring-blurple"
						onClick={() => dialog?.toggle()}
					>
						<div className="flex flex-row place-items-center gap-4 md:justify-between">
							<VscSearch size={18} />
							<span className="opacity-65">Search...</span>
							<div className="hidden md:flex md:flex-row md:place-items-center md:gap-2 md:opacity-65">
								<FiCommand size={18} /> K
							</div>
						</div>
					</Button>
					<div className="flex flex-row place-items-center gap-4">
						<Button
							as="div"
							className="h-6 w-6 flex flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center border-0 rounded bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-none md:hidden active:translate-y-px focus:ring focus:ring-width-2 focus:ring-blurple"
							onClick={() => dialog?.toggle()}
						>
							<VscSearch size={24} />
						</Button>
						<Button
							aria-label="GitHub"
							as="a"
							className="h-6 w-6 flex flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center border-0 rounded rounded-full bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-none active:translate-y-px focus:ring focus:ring-width-2 focus:ring-blurple"
							href="https://github.com/discordjs/discord.js"
							rel="external noopener noreferrer"
							target="_blank"
						>
							<VscGithubInverted size={24} />
						</Button>
						<ThemeSwitcher />
					</div>
				</div>
			</div>
		</header>
	);
}
