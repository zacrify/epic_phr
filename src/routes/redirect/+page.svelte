<script lang="ts">
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { goto } from '$app/navigation';


	import {
		SMART_AUTH_URL,
		CLIENT_ID,
		Redirect_URI,
		FHIR_BASE_URL,
		SMART_TOKEN_URL,
		CODE_VERIFIER_LOCAL_STORAGE_KEY,
		ACCESS_TOKEN_LOCAL_STORAGE_KEY,
		PATIENT_ID_LOCAL_STORAGE_KEY,
		LAB_DATA_LOCAL_STORAGE_KEY,
		// fetchDataWithToken,
		calculateAge,
		// patientData,
        patient
		// sourceData
		// formatDateTime
	} from '../../config.ts';

	// import Main from '../display/+page.svelte';
	// import Header from '../display/header.svelte';
	// import Lab from '../display/lab.svelte';
	// import Vitalsign from '../display/vitalsign.svelte';

	// let patient: any = { name: '', birthDate: '', age: null, id: '', gender: '' }
	

	let displayPage: boolean = false;

	// Function to parse query parameters from URL
	function parseQueryParams() {
		return new URLSearchParams(window.location.search);
	}
	onMount(async () => {
		const queryParams = parseQueryParams();
		console.log('queryParams: ' + queryParams);
		const authorizationCode = queryParams.get('code');
		const codeVerifier = localStorage.getItem(CODE_VERIFIER_LOCAL_STORAGE_KEY);
		console.log('code: ' + authorizationCode);
		if (authorizationCode && codeVerifier) {
			console.log('code and codeVerifier exist');
			await exchangeAuthorizationCodeForToken(authorizationCode, codeVerifier);
			localStorage.removeItem(CODE_VERIFIER_LOCAL_STORAGE_KEY); //turn it back on
			await fetchPatientWithToken();
            goto('/display');
		}
	});

	async function exchangeAuthorizationCodeForToken(
		authorizationCode: string,
		codeVerifier: string
	) {
		const form = new FormData();
		form.set('grant_type', 'authorization_code');
		form.set('code', authorizationCode);
		form.set('client_id', CLIENT_ID);
		form.set('redirect_uri', Redirect_URI);
		form.set('code_verifier', codeVerifier);
        const tokenGeneratedAt: Number = Math.round(new Date().getTime() / 1000);
		try {
			const response = await axios.postForm(SMART_TOKEN_URL, form);
			console.log('exchangeToken Response: ' + response.data);
			localStorage.setItem(PATIENT_ID_LOCAL_STORAGE_KEY, response.data.patient);
			localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, response.data.access_token);

            localStorage.setItem('tokenExpired', JSON.stringify({generated:tokenGeneratedAt ,expiredin:response.data.expires_in}));
			console.log(localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY));
			// await fetchData();
		} catch (error) {
			console.error('Error exchanging authorization code for token:', error);
		}
	}

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
			localStorage.setItem('responsePatient', JSON.stringify(response.data)); // delete this line
			// $patientData = response.data; // delete this line
			$patient = {
				name: response.data.name[0].text,
				birthDate: response.data.birthDate,
				age: calculateAge(response.data.birthDate),
				id: response.data.identifier[0].value,
				gender: response.data.gender
			};

			// console.log('Data:', sourceData);
		} catch (error) {
			console.error('Error fetching data:', error);

		}
	}



</script>

<p>Loading...</p>
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<a href="/" class="btn variant-filled">Home</a>
	</div>
</div>
