<script>
	import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let email = 'testsaw08@gmail.com';
	let password = '12345678';
	let errorMessage = '';

	// La funzione onMount viene eseguita quando il componente viene montato.
	onMount(() => {
		// Si imposta un listener per monitorare le variazioni di stato dell'autenticazione.
		// Ogni volta che lo stato cambia (login, logout, inizializzazione etc.) la callback viene eseguita.
		// (funge anche da middleware)
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser && currentUser.emailVerified) {
				goto('/auth/home');
			}
		});

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
		email = email.trim().toLowerCase();

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			// Firebase di default no fa un controllo sullo stato di verifica della mail,
			// quindi ho inserito un controllo aggiuntico lato client.
			// Servono le DB rules di firestore per un controllo lato server.
			if (user && !user.emailVerified) {
				await auth.signOut(); // Blocca l'accesso
				errorMessage = 'Indirizzo email non verificato.';
				return;
			}
		} catch (error) {
			console.log(error.code);
			errorMessage = mapFirebaseError(error.code);
		}
	}
</script>

<section class="flex min-h-screen items-center justify-center bg-gray-50 p-6">
	<div class="w-full rounded-lg bg-white p-6 shadow-md">
		<p class="logo text-center text-[#3B81F6]">LINK6</p>
		<h1 class="mb-4 text-center text-2xl font-bold text-gray-900">Accedi al tuo account</h1>

		{#if errorMessage}
			<p class="message text-red-500">{errorMessage}</p>
		{/if}

		<form class="space-y-4" on:submit|preventDefault={loginSubmit}>
			<div>
				<label for="email" class="label">Email</label>
				<input
					id="email"
					bind:value={email}
					class="input"
					placeholder="tuamail@dominio.com"
					required
				/>
			</div>

			<div>
				<label for="password" class="label">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="input"
					placeholder="••••••••"
					required
				/>
			</div>

			<button
				type="submit"
				class="mt-4 w-full rounded-lg bg-[#3B81F6] px-5 py-2.5 text-sm font-medium text-white"
			>
				Accedi
			</button>

			<p class="mt-4 text-center text-sm text-gray-600">
				Non hai un account?
				<a href="/signup" class="text-[#3B81F6]">Registrati</a>
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

	.label {
		display: block;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.input {
		margin-top: 0.25rem;
		display: block;
		width: 100%;
		border-radius: 0.75rem;
		border: 1px solid #d1d5db;
		background-color: #f9fafb;
		padding: 0.625rem 1.25rem;
		color: #111827;
	}

	.message {
		margin-bottom: 1rem;
		text-align: center;
		font-size: 0.9rem;
	}
</style>
