<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';

	import { ArrowLeft, LogOut } from 'lucide-svelte';

	function logout() {
		auth.signOut();
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

	<div class="flex w-full items-center justify-between border-b border-gray-300 p-4">
		<button on:click={logout} class="flex items-center space-x-2">
			<LogOut size={26} class="text-gray-800" />
			<span class="pl-4 text-lg font-semibold text-gray-900">Logout</span>
		</button>
	</div>
</div>
