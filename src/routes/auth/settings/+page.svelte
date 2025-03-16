<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { ArrowLeft, LogOut, Bell } from 'lucide-svelte';

	function logout() {
		auth.signOut();
	}

	function askForNotificationPermission() {
		if (!('Notification' in window)) console.log('Non possiedi questa funzione');

		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				console.log('Permesso notifiche concesso!');
			}
		});
	}
</script>

<div class="m-auto w-[85%]">
	<!-- torna indietro -->
	<button
		on:click={() => goto('/auth/home')}
		class="mb-2 flex w-full items-center justify-between p-1"
	>
		<ArrowLeft size={30} class="text-gray-800" />
	</button>

	<div class="elemento">
		<button on:click={askForNotificationPermission}>
			<Bell size={26} class="text-gray-800" />
			<span>Abilita notifiche</span>
		</button>
	</div>

	<div class="elemento">
		<button on:click={logout}>
			<LogOut size={26} class="text-gray-800" />
			<span>Logout</span>
		</button>
	</div>
</div>

<style>
	.elemento {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #d1d5db;
		padding: 1rem;
	}

	.elemento > button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.elemento span {
		padding-left: 1rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1a202c;
	}
</style>
