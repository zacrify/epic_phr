<script lang="ts">
	import axios from 'axios';
	import { SMART_AUTH_URL, CLIENT_ID, Redirect_URI, FHIR_BASE_URL, CODE_VERIFIER_LOCAL_STORAGE_KEY} from '../../config.ts';
    import pkceChallenge from 'pkce-challenge';

    
    const generateCodeChallenge = async () => {
        const challenge = await pkceChallenge();
        // localStorage.setItem("code_challenge", challenge.code_challenge);
        localStorage.setItem(CODE_VERIFIER_LOCAL_STORAGE_KEY, challenge.code_verifier);
        // console.log(localStorage.getItem(CODE_VERIFIER_LOCAL_STORAGE_KEY));
        return challenge.code_challenge;
    }

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
<div><h1>EPIC Personal Health Record</h1>
</div>
<button class="btn variant-filled" on:click={initiateAuthorizationRequest}>Sign In with Epic</button>
<!-- <p>{currentUrl}</p> -->
