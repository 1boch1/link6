<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';

	// La funzione onMount viene eseguita quando il componente viene montato.
	onMount(() => {
		// Si imposta un listener per monitorare le variazioni di stato dell'autenticazione.
		// Ogni volta che lo stato cambia (login, logout, etc.), la callback viene eseguita.
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			// Aggiorna lo store `user` con il valore dell'utente attuale.
			// Se l'utente non è loggato, currentUser sarà null.
			console.log(currentUser);
			if (!currentUser || !currentUser.emailVerified) {
				auth.signOut();
				goto('/login');
			}
		});

		const style = getComputedStyle(document.documentElement);
		console.log('Text Color:', style.getPropertyValue('color'));
		console.log('Theme Variables:', {
			base: style.getPropertyValue('--theme-font-color-base'),
			dark: style.getPropertyValue('--theme-font-color-dark')
		});

		// La funzione restituita da onMount verrà eseguita quando il componente verrà distrutto,
		// per rimuovere il listener e prevenire memory leaks.
		return () => unsubscribe();
	});
</script>

<slot />
