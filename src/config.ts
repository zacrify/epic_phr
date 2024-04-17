import axios from 'axios';
import { writable } from 'svelte/store';
import type { PaginationSettings } from '@skeletonlabs/skeleton';
export const CLIENT_ID = '5c7732f1-b949-4f28-9f9f-6fdec45bba9f';
export const FHIR_BASE_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';
export const SMART_AUTH_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize';
export const SMART_TOKEN_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token';
export const Redirect_URI = 'http://localhost:5173/redirect';
export const CODE_VERIFIER_LOCAL_STORAGE_KEY = 'code_verifier';
export const ACCESS_TOKEN_LOCAL_STORAGE_KEY = 'access_token';
export const PATIENT_ID_LOCAL_STORAGE_KEY = 'patient_id';
export const MEDICATION_DATA_LOCAL_STORAGE_KEY = 'medication_data';
export const LAB_DATA_LOCAL_STORAGE_KEY = 'lab_data';
export const VITALS_DATA_LOCAL_STORAGE_KEY = 'vitals_data';
export const patientData: any = writable({});
export const sourceData: any = writable({
    vitalsign: { patient: {name:'',birthDate:''},bp: [], temp: [], weight: [], pr: [], all: [] },
    med: [],
    lab: []
});

// export let paginationSettings = writable({
// 	page: 0,
// 	limit: 5,
// 	size: null,
// 	amounts: [5,10,15],
// } satisfies PaginationSettings);

export let patient: any = writable({ name: '', birthDate: '', age: null, id: '', gender: '' });
export const resourceData: any = writable({vitalsign: { bp:[],temp:[],weight:[],pr:[],all:[] },med:[],lab:[]});


export function calculateAge(birthdate: string) {
    if (!birthdate) {
        return null;
    } else {
        const birthdateArray = birthdate.split('-');
        const birthYear = parseInt(birthdateArray[0]);
        const birthMonth = parseInt(birthdateArray[1]);
        const birthDay = parseInt(birthdateArray[2]);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
        const currentDay = currentDate.getDate();

        let age = currentYear - birthYear;

        // If the current month and day are less than the birth month and day, subtract 1 from age
        if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
            age--;
        }

        return age;
    }
}

export function formatDateTime(dateTimeString: string) {
    const date = new Date(dateTimeString);
    return date.toLocaleString(); // You can customize the format as needed
  }