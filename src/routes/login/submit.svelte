<script lang="ts">
	// Import Axios library
    // import { onMount } from 'svelte';

	import axios from 'axios';
	import { SMART_AUTH_URL, CLIENT_ID, Redirect_URI, FHIR_BASE_URL, CODE_VERIFIER_LOCAL_STORAGE_KEY} from '../../config.ts';
    import pkceChallenge from 'pkce-challenge';
	// // Function to handle button click
	// async function handleOAuth2() {
	// 	const params = new URLSearchParams({
	// 		response_type: 'code',
	// 		client_id: CLIENT_ID, // Replace with your client ID
	// 		redirect_uri: Redirect_URI, // Replace with your redirect URI
	// 		scope: 'openid fhirUser', // Replace with the scopes you need
	// 		state: '123456' // Replace with your state value
	// 	});
	// 	try {
	// 		// Send GET request using Axios
	// 		const response = await axios.get(
	// 			SMART_AUTH_URL,
	// 			// 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/metadata'
	// 			// + params.toString()
	// 			{
	// 				// Add any additional parameters required for OAuth2 authentication
	// 				params: {
	// 					// Add parameters here if needed
	// 					response_type: 'code',
	// 					client_id: CLIENT_ID, // Replace with your client ID
	// 					redirect_uri: 'http://localhost:3000', // Replace with your redirect URI
	// 					scope: 'openid fhirUser', // Replace with the scopes you need
	// 					state: '123456', // Replace with your state value
	// 					aud: FHIR_BASE_URL,
	//                     code_challenge: '',
	//                     code_challenge_method: 'S256'
	// 				},
	// 				// Add any additional headers if needed
	// 				headers: {
	// 					// Add headers here if needed
	// 					Accept: 'application/json'
	// 				}
	// 			}
	// 		);

	// 		// Handle response data
	// 		console.log('OAuth2 Response:', response.data);
	// 	} catch (error) {
	// 		// Handle errors
	// 		console.error('OAuth2 Error:', error);
	// 	}
	// }
    
    const generateCodeChallenge = async () => {
        const challenge = await pkceChallenge();
        // localStorage.setItem("code_challenge", challenge.code_challenge);
        localStorage.setItem(CODE_VERIFIER_LOCAL_STORAGE_KEY, challenge.code_verifier);
        // console.log(localStorage.getItem(CODE_VERIFIER_LOCAL_STORAGE_KEY));
        return challenge.code_challenge;
    }

    // generateCodeChallenge();

	const generatedRedirectUrl = (codeChallenge: string) => {
		const authorizationUrl = new URL(SMART_AUTH_URL);
		authorizationUrl.searchParams.set('response_type', 'code');
		authorizationUrl.searchParams.set('client_id', CLIENT_ID);
		authorizationUrl.searchParams.set('redirect_uri', Redirect_URI);
		authorizationUrl.searchParams.set('scope', 'openid fhirUser');
		authorizationUrl.searchParams.set('state', '123456');
		authorizationUrl.searchParams.set('aud', FHIR_BASE_URL);
		authorizationUrl.searchParams.set('code_challenge', codeChallenge);
		authorizationUrl.searchParams.set('code_challenge_method', 'S256');

		return authorizationUrl.href;
	};

	function generateRandomState() {
		return Math.random().toString(36).substring(2);
	}
	// function handleAuthorizeClick() {
	// 	const authorizationUrl = generatedRedirectUrl();
	// 	window.location.href = authorizationUrl;
	// }

    const initiateAuthorizationRequest = async () => {
        const codeChallenge = await generateCodeChallenge();
        const authorizationUrl = generatedRedirectUrl(codeChallenge);
        window.location.href = authorizationUrl;
        console.log(authorizationUrl);
    }
    // let currentUrl = '';

    // onMount(() => {
    // // Access the current URL from the browser's location object
    // currentUrl = window.location.href;
// });
</script>

<button class="btn variant-filled" on:click={initiateAuthorizationRequest}>Sign In with Epic</button>
<!-- <p>{currentUrl}</p> -->
