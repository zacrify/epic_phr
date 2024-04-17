<script lang="ts">
    import { resourceData } from "../../config";
    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import type { TableSource, PaginationSettings } from '@skeletonlabs/skeleton';
	import { Paginator } from '@skeletonlabs/skeleton';
	export let med: any = [];
// let data = {};
// $: data = sourceData
    
let paginationSettings = {
	page: 0,
	limit: 5,
	// size: $resourceData.med.length,
    size: med.length,
	amounts: [5,10,15],
} satisfies PaginationSettings;

// $: paginationSettings.size = $resourceData.med.length;
$: paginationSettings.size = med.length;


$: paginatedSource = tableMapperValues(med, ['DateTime', 'Medication', 'Instruction', 'Qty', 'Unit', 'Reason']).slice(
	paginationSettings.page * paginationSettings.limit,
	paginationSettings.page * paginationSettings.limit + paginationSettings.limit);

    let tableHeaders: string[] = ['DateTime', 'Medication', 'Instruction', 'Qty', 'Unit', 'Reason'];

//     function setVSTableSource(): TableSource {
// 	return {
// 		head: ['DateTime', 'LabName', 'Instruction', 'Qty', 'Unit', 'Reason'],
// 		body: tableMapperValues($resourceData.med, ['DateTime', 'LabName', 'Instruction', 'Qty', 'Unit', 'Reason']),
// 		// meta: tableMapperValues(sourceData, ['name', 'symbol', 'weight']),
// 		// foot: ['Total Elements', '', `<span class="badge variant-soft-primary">5 Elements</span>`]
// 	};
// }

// // If sourceData updates, set the new TableSource values
// $: medTable = $resourceData ? setVSTableSource() : undefined;
	
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
