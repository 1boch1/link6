<script>
	export let nome = 'Anonimo';
	export let testo = 'Testo della richiesta...';
</script>

<div
	class="max-w-md rounded-2xl bg-[rgb(250,250,250)] px-6 py-4 shadow-lg transition-all hover:shadow-xl"
>
	<div class="mb-3 flex justify-between">
		<h3 class="text-xl font-bold text-gray-900">{nome}</h3>
		<div class=" content-center rounded-xl border border-[#3B81F6] px-2 text-xs text-[#3B81F6]">
			visualizza
		</div>
	</div>

	<p
		class="overflow-hidden text-base leading-relaxed text-ellipsis text-gray-700"
		style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; white-space: normal;"
	>
		{testo}
	</p>
</div>
