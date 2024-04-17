<script lang="ts">

import axios from 'axios';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from '../../config.ts';
	import { onMount } from 'svelte';
	import Header from './header.svelte';
	import type { Patient } from 'fhir/r4';


async function fetchPatientDataWithToken() {
    try {
      const response = await axios.get('https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/erXuFYUfucBZaryVksYEcMg3', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)}`
        }
      });
      console.log('Data:', response.data.name[0].text);
      localStorage.setItem('responseData',JSON.stringify(response.data));
        // console.log('Data:', localStorage.getItem('responseData'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchLabDataWithToken() {
    try {
      const response = await axios.get('https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Observation?category=laboratory&patient=erXuFYUfucBZaryVksYEcMg3', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)}`
        }
      });
      console.log('Data:', response.data);
      localStorage.setItem('responseLabData',JSON.stringify(response.data));
        // console.log('Data:', localStorage.getItem('responseData'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

let patientInfo: Patient = {};
let patientName: string = '';
function showData(){
  patientInfo = JSON.parse(localStorage.getItem('responseData'));
  patientName = patientInfo.name?.[0]?.text;
  console.log(patientInfo.id);
  console.log(patientInfo.birthDate);
  // console.log(localStorage.getItem('responseData'));
}

async function fetchData() {
  await fetchPatientDataWithToken();
  await fetchLabDataWithToken();
}

</script>

<!-- {#if !patientInfo} -->
<div>
  <button class="btn variant-filled" on:click={fetchData}>Get Data</button>
</div>
<div>
  <button class="btn variant-filled" on:click={showData}>show Data</button>
</div>
<!-- {:else} -->
<Header patientInfo={patientInfo}/>
<!-- {/if} -->

