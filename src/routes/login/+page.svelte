<script>
	import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let email = 'bochicchiomirco@gmail.com';
	let password = '12345678';
	let errorMessage = '';

	// La funzione onMount viene eseguita quando il componente viene montato.
	onMount(() => {
		// Si imposta un listener per monitorare le variazioni di stato dell'autenticazione.
		// Ogni volta che lo stato cambia (login, logout, etc.), la callback viene eseguita.
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser && currentUser.emailVerified) goto('/auth/home');
		});

		// La funzione restituita da onMount verrà eseguita quando il componente verrà distrutto,
		// per rimuovere il listener e prevenire memory leaks.
		return () => unsubscribe();
	});

	function mapFirebaseError(code) {
		const errors = {
			'auth/user-not-found': 'Email o password errati.',
			'auth/invalid-email': 'Formato email non valido.',
			'auth/invalid-credential': 'Email o password errati.',
			'auth/wrong-password': 'Password errata.',
			'auth/id-token-expired': 'Sessione scaduta, effettua nuovamente il login.',
			'auth/id-token-revoked': 'Accesso revocato. Contatta il supporto.',
			'auth/too-many-requests': 'Troppi tentativi. Riprova più tardi.',
			'auth/network-request-failed': 'Errore di rete. Controlla la connessione.',
			'auth/user-disabled': 'Questo account è stato disabilitato.',
			'auth/invalid-email-verified': 'Per favore, verifica la tua email prima di accedere.'
		};

		return errors[code] || 'Errore sconosciuto. Riprova più tardi.';
	}

	async function loginSubmit() {
		email = email.trim();

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			if (user && !user.emailVerified) {
				await auth.signOut(); // Blocca l'accesso
				errorMessage = 'Indirizzo email non verificato.';
			}
		} catch (error) {
			errorMessage = mapFirebaseError(error.code);
		}
	}
</script>

<section class="flex min-h-screen items-center justify-center bg-gray-50 p-6">
	<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
		<p class="logo text-center text-[#3B81F6]">LINK6</p>
		<h1 class="mb-4 text-center text-2xl font-bold text-gray-900">Accedi al tuo account</h1>

		{#if errorMessage}
			<p class="mb-4 text-center text-sm text-red-500">{errorMessage}</p>
		{/if}

		<form class="space-y-4" on:submit|preventDefault={loginSubmit}>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-900">Email</label>
				<input
					id="email"
					bind:value={email}
					class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
					placeholder="nome@dominio.com"
					required
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-900">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
					placeholder="••••••••"
					required
				/>
			</div>

			<button
				type="submit"
				class="mt-4 w-full rounded-lg bg-[#3B81F6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
			>
				Accedi
			</button>

			<p class="mt-4 text-center text-sm text-gray-600">
				Non hai un account?
				<a href="/signup" class="text-[#3B81F6] hover:underline">Registrati</a>
			</p>
		</form>
	</div>
</section>

<style>
	.logo {
		font-weight: 900;
		font-style: normal;
		font-stretch: expanded;
		font-size: 2rem;
	}
</style>
