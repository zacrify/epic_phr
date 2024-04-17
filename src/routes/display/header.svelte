<script lang="ts">
    	import { AppBar } from '@skeletonlabs/skeleton';
        export let patient: any = {name: '', birthDate: '', age: null, id: '',gender:''};
</script>
<AppBar gridColumns="grid-cols-3" slotDefault="place-self-start" slotTrail="place-content-end">
	<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
	<h1>{patient.name}</h1>
    <h2>{patient.id}</h2>
	<svelte:fragment slot="trail">
        <h2>Age: {patient.age} year</h2>
        <h2>{patient.gender}</h2>
    </svelte:fragment>
</AppBar>