<script lang="ts">
    import { resourceData } from "../../config";
    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import type { TableSource,PaginationSettings } from '@skeletonlabs/skeleton';
    import { Paginator } from '@skeletonlabs/skeleton';
	export let vitalsign: any = [];
// $: bpData = $resourceData.vitalsign.filter((element: any) => element.resource.code.text === 'Blood Pressure');    

let paginationSettings = {
	page: 0,
	limit: 5,
	size: vitalsign.length,
    // size: bpData.length,
	amounts: [5,10,15],
} satisfies PaginationSettings;

$: paginationSettings.size = vitalsign.length;
// $: paginationSettings.size = bpData.length;
// const formatedData = $resourceData.vitalsign.all.map((element: any) => {
//     return {
//         NewDateTime: formatDateTime(element.resource.effectiveDateTime),
//         ...$resourceData.vitalsign.all
//     }
// });
function formatDateTime(dateTimeString: string) {
    const date = new Date(dateTimeString);
    return date.toLocaleString(); // You can customize the format as needed
  }

$: sData = tableMapperValues(vitalsign, ['DateTime', 'BP', 'Temperature', 'Weight', 'Pulse'])

$: paginatedSource = sData.slice(
	paginationSettings.page * paginationSettings.limit,
	paginationSettings.page * paginationSettings.limit + paginationSettings.limit);

    let tableHeaders: string[] = ['DateTime', 'BP', 'Temperature(c)', 'Weight(kg)', 'PR(bpm)'];

//     function setVSTableSource(): TableSource {
// 	return {
// 		head: ['DateTime', 'Systolic', 'Diastolic'],
// 		// body: tableMapperValues($resourceData.vitalsign, ['DateTime', 'Systolic', 'Diastolic']),
//         body: paginatedSource,
// 		// meta: tableMapperValues(sourceData, ['name', 'symbol', 'weight']),
// 		// foot: ['Total Elements', '', `<span class="badge variant-soft-primary">5 Elements</span>`]
// 	};
// }

// If sourceData updates, set the new TableSource values
// $: vsTable = $resourceData ? setVSTableSource() : undefined;
// console.log($resourceData.vitalsign.filter((element: any) => element.resource.code.text === 'Blood Pressure'));
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