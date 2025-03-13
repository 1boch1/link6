<script>
	import { onMount } from 'svelte';
	import { userStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';

	// Questo layout protegge tutte le pagine in /auth
	onMount(() => {
		const unsubscribe = userStore.subscribe((currentUser) => {
			console.log(currentUser);
			if (!currentUser.emailVerified) {
				auth.signOut();
				goto('/login');
			}
			// Se non c'è un utente autenticato, reindirizza a /login
			if (!currentUser) goto('/login');
		});
		// Pulizia: restituisce la funzione di unsubscribe quando il componente viene distrutto.
		return () => unsubscribe();
	});
</script>

<slot />
