<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import type { Bundle, Patient, MedicationRequest } from 'fhir/r4';
	import {
		Table,
		tableMapperValues,
		Paginator,
		Modal,
		initializeStores,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import type { TableSource, PaginationSettings } from '@skeletonlabs/skeleton';
	import { patientData, resourceData } from '../../config';
	import Vitalsign from './vitalsign.svelte';
	import Lab from './lab.svelte';
	import Med from './med.svelte';
	import Header from './header.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import {
		ACCESS_TOKEN_LOCAL_STORAGE_KEY,
		PATIENT_ID_LOCAL_STORAGE_KEY,
		calculateAge,
		patient
	} from '../../config';
	initializeStores();
	const modalStore = getModalStore();

	let sourceData: any = {
		patient: { name: '', birthDate: '', age: null, id: '', gender: '' },
		vitalsign: { bp: [], temp: [], weight: [], pr: [], all: [] },
		med: [],
		lab: []
	};
	const modalWelcome = {
		type: 'confirm',
		// Data
		title: 'Welcome to your Patient Portal',
		body: `Hi! ${$patient.name} ID:${$patient.id} Gender:${$patient.gender} DOB:${$patient.birthDate} Are you sure you wish to proceed?`,
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: (r: boolean) => console.log('response:', r)
	};

	function modalExpired(r) {
		if (r) {
			localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
			localStorage.removeItem(PATIENT_ID_LOCAL_STORAGE_KEY);
            console.log('Redirecting to login page');
			window.location.href = '/';
		}
	}

	onMount(async () => {
		const tokenExpiredAt =
			JSON.parse(localStorage.getItem('tokenExpired')).generated +
			JSON.parse(localStorage.getItem('tokenExpired')).expiredin;
		console.log('tokenExpiredAt:', tokenExpiredAt);
		const refreshedTime: Number = Math.round(new Date().getTime() / 1000);
		console.log('refreshedTime:', refreshedTime);
		if (refreshedTime > tokenExpiredAt) {
			new Promise<boolean>((resolve) => {
				const modalAccessExpired = {
					type: 'confirm',
					// Data
					title: 'The session has expired',
					body: `We are sorry, but your session has expired. Please log in again.`,
					// TRUE if confirm pressed, FALSE if cancel pressed
					response: (r) => {
					resolve(r);
				}
				};
				modalStore.trigger(modalAccessExpired);
			}).then((r: any) => {

				modalExpired(r);
			});
		} else {
			modalStore.trigger(modalWelcome);
			await fetchPatientWithToken();
			await fetchLabWithToken();
			await fetchVSWithToken();
			await fetchMedicationWithToken();
		}
	});

	async function fetchPatientWithToken() {
		try {
			const response = await axios.get(
				`https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/${localStorage.getItem(PATIENT_ID_LOCAL_STORAGE_KEY)}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)}`
					}
				}
			);
			console.log('Patient Data:', response.data.name[0].text);
			// localStorage.setItem('responsePatient', JSON.stringify(response.data)); // delete this line
			// $patientData = response.data; // delete this line
			sourceData.patient = {
				name: response.data.name[0].text,
				birthDate: response.data.birthDate,
				age: calculateAge(response.data.birthDate),
				id: response.data.identifier[0].value,
				gender: response.data.gender
			};
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	async function fetchLabWithToken() {
		try {
			const response = await axios.get(
				`https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Observation`,
				{
					params: {
						// Add your query parameters here
						patient: `${localStorage.getItem(PATIENT_ID_LOCAL_STORAGE_KEY)}`,
						category: 'laboratory'
					},
					headers: {
						Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)}`
					}
				}
			);
			const filteredData = response.data.entry.filter(
				(entry) => entry.resource.resourceType !== 'OperationOutcome'
			);
			console.log('Lab Data:', filteredData);
			// localStorage.setItem('responseLab', JSON.stringify(filteredData));
			filteredData.forEach((element: any) => {
				sourceData.lab = [
					...sourceData.lab,
					{
						DateTime: element.resource?.effectiveDateTime,
						LabName: element.resource?.code.text,
						Value: element.resource?.valueQuantity?.value
					}
				];
			});

			// console.log('Data:', localStorage.getItem('responseData'));
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	async function fetchVSWithToken() {
		try {
			const response = await axios.get(
				`https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Observation`,
				{
					params: {
						// Add your query parameters here
						patient: `${localStorage.getItem(PATIENT_ID_LOCAL_STORAGE_KEY)}`,
						category: 'vital-signs'
					},
					headers: {
						Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)}`
					}
				}
			);
			const filteredData = response.data.entry.filter(
				(entry) => entry.resource.resourceType !== 'OperationOutcome'
			);
			console.log('VitalSign Data:', filteredData);
			// localStorage.setItem('responseVitalSign', JSON.stringify(filteredData));
			filteredData.forEach((element: any) => {
				if (element.resource.code.text === 'Blood Pressure') {
					sourceData.vitalsign.bp = [
						...sourceData.vitalsign.bp,
						{
							DateTime: element.resource?.effectiveDateTime,
							BP: `${element.resource?.component?.[0]?.valueQuantity?.value}/${element.resource?.component?.[1]?.valueQuantity?.value}`
						}
					];
				}
			});
			filteredData.forEach((element: any) => {
				if (element.resource.code.text === 'Temperature') {
					sourceData.vitalsign.temp = [
						...sourceData.vitalsign.temp,
						{
							DateTime: element.resource?.effectiveDateTime,
							Temperature: element.resource?.valueQuantity?.value,
							temp_Unit: element.resource?.valueQuantity?.unit
						}
					];
				}
			});
			filteredData.forEach((element: any) => {
				if (element.resource.code.text === 'Weight') {
					sourceData.vitalsign.weight = [
						...sourceData.vitalsign.weight,
						{
							DateTime: element.resource?.effectiveDateTime,
							Weight: element.resource?.valueQuantity?.value,
							wt_Unit: element.resource?.valueQuantity?.unit
						}
					];
				}
			});
			filteredData.forEach((element: any) => {
				if (element.resource.code.text === 'Pulse') {
					sourceData.vitalsign.pr = [
						...sourceData.vitalsign.pr,
						{
							DateTime: element.resource?.effectiveDateTime,
							Pulse: element.resource?.valueQuantity?.value
						}
					];
				}
			});
			sourceData.vitalsign.all = combineArrays(
				sourceData.vitalsign.bp,
				sourceData.vitalsign.temp,
				sourceData.vitalsign.weight,
				sourceData.vitalsign.pr
			);
			// console.log('Data:', localStorage.getItem('responseData'));
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	async function fetchMedicationWithToken() {
		try {
			const response = await axios.get(
				`https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/MedicationRequest`,
				{
					params: {
						// Add your query parameters here
						patient: `${localStorage.getItem(PATIENT_ID_LOCAL_STORAGE_KEY)}`
					},
					headers: {
						Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)}`
					}
				}
			);
			const filteredData = response.data.entry.filter(
				(entry) => entry.resource.resourceType !== 'OperationOutcome'
			);
			console.log('Medication Data:', filteredData);
			// localStorage.setItem('responseMedication', JSON.stringify(filteredData));
			filteredData.forEach((element: any) => {
				sourceData.med = [
					...sourceData.med,
					{
						DateTime: element.resource?.authoredOn,
						Medication: element.resource?.medicationReference?.display,
						Instruction: element.resource?.dosageInstruction?.[0]?.text,
						Qty: element.resource?.dispenseRequest?.quantity?.value,
						Unit: element.resource?.dispenseRequest?.quantity?.unit,
						Reason: element.resource?.reasonCode?.[0]?.text
					}
				];
			});
			// console.log('Data:', localStorage.getItem('responseData'));
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	function combineArrays(...arrays: any[]) {
		let combined: any = [];

		arrays.forEach((array) => {
			array.forEach((obj) => {
				let existing = combined.find((item) => item.DateTime === obj.DateTime);
				if (existing) {
					Object.assign(existing, obj);
				} else {
					combined.push({ ...obj });
				}
			});
		});

		return combined;
	}
</script>

<Modal />
<Header patient={sourceData.patient} />
<Lab lab={sourceData.lab} />
<Med med={sourceData.med} />
<Vitalsign vitalsign={sourceData.vitalsign.all} />
