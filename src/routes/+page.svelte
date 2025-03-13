<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/login'); // Reindirizza automaticamente a /login quando si accede a "/"
	});
</script>
