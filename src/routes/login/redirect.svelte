<script lang='ts'>
    import { onMount } from 'svelte';
    import axios from 'axios';
  
    import { SMART_AUTH_URL, CLIENT_ID, Redirect_URI, FHIR_BASE_URL,SMART_TOKEN_URL,CODE_VERIFIER_LOCAL_STORAGE_KEY,ACCESS_TOKEN_LOCAL_STORAGE_KEY } from '../../config.ts';
    
    // let accessToken = '';
    // Function to exchange authorization code for access token
    async function exchangeAuthorizationCodeForToken(authorizationCode: string, codeVerifier: string) {
      const form = new FormData();
      form.set('grant_type', 'authorization_code');
      form.set('code', authorizationCode);
      form.set('client_id', CLIENT_ID);
      form.set('redirect_uri', Redirect_URI);
      form.set('code_verifier', codeVerifier);
        try {
            const response = await axios.postForm(SMART_TOKEN_URL, form);
            localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY,response.data.access_token);
            console.log(localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY));
        } catch (error) {
            console.error('Error exchanging authorization code for token:', error);
        }
    //   try {
    //     const response = await fetch(SMART_TOKEN_URL, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //       },
    //       body: params
    //     });
  
    //     if (!response.ok) {
    //       throw new Error('Failed to exchange authorization code for token');
    //     }
  
    //     const data = await response.json();
    //     // Handle response data, typically store access token in local storage or state
    //     console.log('Access token:', data.access_token);
    //   } catch (error) {
    //     console.error('Error exchanging authorization code for token:', error);
    //   }
    }
  
    // Function to parse query parameters from URL
    function parseQueryParams() {
      return new URLSearchParams(window.location.search);
    }
  
    onMount(async () => {
      const queryParams = parseQueryParams();
      const authorizationCode = queryParams.get('code');
      const codeVerifier = localStorage.getItem(CODE_VERIFIER_LOCAL_STORAGE_KEY);
      if (authorizationCode && codeVerifier) {
        await exchangeAuthorizationCodeForToken(authorizationCode, codeVerifier);
        localStorage.removeItem(CODE_VERIFIER_LOCAL_STORAGE_KEY);
      }
    //   console.log('code: ' + authorizationCode);
    });



  </script>
  
  <h1>Authorization Callback Page</h1>
  <p>Handling authorization code...</p>
  