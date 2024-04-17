<script lang="ts">
    import { resourceData } from "../../config";
    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import type { TableSource, PaginationSettings } from '@skeletonlabs/skeleton';
	import { Paginator } from '@skeletonlabs/skeleton';
	// export let sourceData: any = {
	// 	vitalsign: { bp: [], temp: [], weight: [], pr: [], all: [] },
	// 	med: [],
	// 	lab: []
	// };
	export let lab: any = [];

	let paginationSettings = {
	page: 0,
	limit: 5,
	// size: sourceData.lab.length,
	size: lab.length,
	amounts: [5,10,15],
} satisfies PaginationSettings;

// $: paginationSettings.size = sourceData.lab.length;
$: paginationSettings.size = lab.length;

$: paginatedSource = tableMapperValues(lab, ['DateTime', 'LabName', 'Value']).slice(
	paginationSettings.page * paginationSettings.limit,
	paginationSettings.page * paginationSettings.limit + paginationSettings.limit);

    let tableHeaders: string[] = ['DateTime', 'LabName', 'Value'];

//     function setVSTableSource(): TableSource {
// 	return {
// 		head: ['DateTime', 'LabName', 'Value'],
// 		body: tableMapperValues($resourceData.lab, ['DateTime', 'LabName', 'Value']),
// 		// meta: tableMapperValues(sourceData, ['name', 'symbol', 'weight']),
// 		// foot: ['Total Elements', '', `<span class="badge variant-soft-primary">5 Elements</span>`]
// 	};
// }

// // If sourceData updates, set the new TableSource values
// $: labTable = $resourceData ? setVSTableSource() : undefined;
	
</script>

<div class="card m-2">
	<Table source={{ head: tableHeaders, body: paginatedSource }} />
	{#if paginationSettings.size > 5}
	<Paginator
		bind:settings={paginationSettings}
		showFirstLastButtons="{true}"
		showPreviousNextButtons="{true}"
	/>
	{/if}
</div>
