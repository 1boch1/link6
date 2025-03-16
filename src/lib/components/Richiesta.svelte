<script>
	import { goto } from '$app/navigation';

	export let nome = 'Anonimo';
	export let testo = 'Testo della richiesta...';
	export let bottone = true;
	export let testoContratto = true;
</script>

<div class="rounded-2xl bg-[rgb(250,250,250)] px-6 py-4 shadow-lg">
	<div class="mb-3 flex justify-between">
		<h3 class="text-md font-semibold text-gray-900">{nome.split('@')[0]}</h3>
		{#if bottone}
			<button
				on:click={() => goto('/auth/aiuta')}
				class=" content-center rounded-xl border border-[#3B81F6] px-2 text-xs text-[#3B81F6]"
			>
				visualizza
			</button>
		{/if}
	</div>

	<div>
		{#if testoContratto}
			<p
				class="overflow-hidden text-base leading-relaxed text-ellipsis text-gray-700"
				style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; white-space: normal;"
			>
				{testo}
			</p>
		{/if}
		{#if !testoContratto}
			<p class="text-base leading-relaxed text-ellipsis text-gray-700">
				{testo}
			</p>
		{/if}
	</div>
</div>
