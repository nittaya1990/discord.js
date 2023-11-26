'use client';

import { useMemo, type ReactNode } from 'react';

export function Table({
	rows,
	columns,
	columnStyles,
}: {
	readonly columnStyles?: Record<string, string>;
	readonly columns: string[];
	readonly rows: Record<string, ReactNode>[];
}) {
	const cols = useMemo(
		() =>
			columns.map((column, idx) => (
				<th
					className="break-normal border-b border-light-900 px-3 py-2 text-left text-sm dark:border-dark-100"
					key={`${column}-${idx}`}
				>
					{column}
				</th>
			)),
		[columns],
	);

	const data = useMemo(
		() =>
			rows.map((row, idx) => (
				<tr className="[&>td]:last-of-type:border-0" key={idx}>
					{Object.entries(row).map(([colName, val], index) => (
						<td
							className={`border-light-900 dark:border-dark-100 border-b px-3 py-2 text-left text-sm ${
								columnStyles?.[colName] ?? ''
							}`}
							key={`${colName}-${index}`}
						>
							{val}
						</td>
					))}
				</tr>
			)),
		[columnStyles, rows],
	);

	return (
		<table className="w-full border-collapse">
			<thead>
				<tr>{cols}</tr>
			</thead>
			<tbody>{data}</tbody>
		</table>
	);
}
