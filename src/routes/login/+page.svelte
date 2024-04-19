<script lang="ts">
	// import { SMART_AUTH_URL, CLIENT_ID, Redirect_URI, FHIR_BASE_URL, CODE_VERIFIER_LOCAL_STORAGE_KEY} from '../../config.ts';
    // import pkceChallenge from 'pkce-challenge';

    
    // const generateCodeChallenge = async () => {
    //     const challenge = await pkceChallenge();
    //     localStorage.setItem(CODE_VERIFIER_LOCAL_STORAGE_KEY, challenge.code_verifier);
    //     return challenge.code_challenge;
    // }

	// const generatedRedirectUrl = (codeChallenge: string) => {
	// 	const authorizationUrl = new URL(SMART_AUTH_URL);
	// 	authorizationUrl.searchParams.set('response_type', 'code');
	// 	authorizationUrl.searchParams.set('client_id', CLIENT_ID);
	// 	authorizationUrl.searchParams.set('redirect_uri', Redirect_URI);
	// 	authorizationUrl.searchParams.set('scope', 'openid fhirUser');
	// 	authorizationUrl.searchParams.set('state', '123456');
	// 	authorizationUrl.searchParams.set('aud', FHIR_BASE_URL);
	// 	authorizationUrl.searchParams.set('code_challenge', codeChallenge);
	// 	authorizationUrl.searchParams.set('code_challenge_method', 'S256');

	// 	return authorizationUrl.href;
	// };

	// function generateRandomState() {
	// 	return Math.random().toString(36).substring(2);
	// }

    // const initiateAuthorizationRequest = async () => {
    //     const codeChallenge = await generateCodeChallenge();
    //     const authorizationUrl = generatedRedirectUrl(codeChallenge);
    //     window.location.href = authorizationUrl;
    //     console.log(authorizationUrl);
    // }

    import PocketBase from 'pocketbase';

    const pb = new PocketBase('http://127.0.0.1:8090');

    async function login(form: HTMLFormElement) {
        try {
            await pb.collection('users').authWithOAuth2({ provider: 'oidc' });
            form.token.value = pb.authStore.token;
            form.submit();
        } catch (err) {
            console.error(err);
        }
    }
</script>
<div><h1>PocketBase Version</h1>
</div>
<form method="post" on:submit|preventDefault={(e) => login(e.currentTarget)}>
    <input name="token" type="hidden" />
    <button
        class="btn variant-filled"
    >
        Login
    </button>
</form>
<!-- <p>{currentUrl}</p> -->
