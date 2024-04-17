<script lang="ts">
    import type { Patient } from 'fhir/r4'
    import { AppBar } from '@skeletonlabs/skeleton';
    export let patient: any = {name: '', birthDate: '', age: null, id:''};

    // function _calculateAge(birthday: Date) { // birthday is a date
    // var ageDifMs = Date.now() - birthday.getTime();
    // var ageDate = new Date(ageDifMs); // miliseconds from epoch
    // return Math.abs(ageDate.getUTCFullYear() - 1970);
// }
function calculateAge(birthdate: string) {
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

    // let patient = {
    //     name: patientInfo?.name?.[0]?.text,
    //     id: patientInfo?.id,
    //     // age: _calculateAge((patientInfo?._birthDate))
    // }
</script>
<!-- <div>
    <h1>Patient Information</h1>
    <p>Patient Name: {patientInfo?.name?.[0]?.text}</p>
    <p>Patient ID: {patientInfo?.id}</p>
    <p>Age: {calculateAge(patientInfo.birthDate)}</p>
</div> -->
<AppBar>
<div class="flex flex-row">
    

        <h1 class="h-full p-4 col-span-3">{patient.name}</h1>
    <h2 class="p-4 col-span-1">age: {patient.age} yr</h2>
</div>
</AppBar>
