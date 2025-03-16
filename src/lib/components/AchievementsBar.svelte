<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Sun, HeartHandshake, Handshake, HandHelping } from 'lucide-svelte';

	export let achievements = [];
	export let barHeight = '20px';
	export let iconSize = '40px';
	export let textSize = '16px';
	export let iconStroke = '1.5';
	export let iconColor = '#050505';
	export let iconLitColor = '#00AF50';
	export let bgColor = '#8C93A8';
	export let mainColor = '#4CAF50';
	export let progress = 0;

	let icons = [HandHelping, Handshake, HeartHandshake, Sun];
</script>

<div class="progress-bar-container">
	<div class="progress-bar-wrapper">
		<div class="progress-bar" style="--bar-height: {barHeight}; --bg-color: {bgColor};">
			<div
				class="progress"
				style="width: {(progress / (achievements.length - 1)) * 100}%; --main-color: {mainColor};"
			></div>
		</div>

		<div class="achievements">
			{#each achievements as achievement, index}
				<div class="achievement" style="--icon-size: {iconSize}; --text-size: {textSize};">
					{#if icons[index]}
						<div
							class="icon {progress >= index ? 'lit' : ''}"
							style="--main-color: {mainColor}; --bg-color: {bgColor};"
						>
							<svelte:component
								this={icons[index]}
								size={iconSize}
								color={progress >= index ? iconLitColor : iconColor}
								strokeWidth={iconStroke}
							/>
						</div>
					{/if}
					<div class="text" style="top: calc({iconSize} + 1vw)">
						{achievement.text}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.progress-bar-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.progress-bar-wrapper {
		width: 100%;
		position: relative;
		display: flex;
		align-items: center;
	}

	.progress-bar {
		background-color: var(--bg-color);
		border-radius: 2vw;
		height: var(--bar-height);
		width: 100%;
		position: relative;
	}

	.progress {
		background-color: var(--main-color);
		height: 100%;
		width: 0;
		transition: width 0.3s;
		border-radius: 2vw;
	}

	.achievements {
		display: flex;
		justify-content: space-between;
		width: 100%;
		position: absolute;
	}

	.achievement {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		position: relative;
	}

	.icon {
		padding: calc(var(--icon-size) / 2.4);
		border-radius: 50%;
		background-color: var(--bg-color); /* Background color for the icon circle */
		display: flex;
		justify-content: center;
		align-items: center;
		transition: background-color 0.3s;
	}

	.icon.lit {
		background-color: var(--main-color); /* Lit color */
	}

	.text {
		font-size: var(--text-size);
		position: absolute;
		margin-top: calc(var(--icon-size) * 0.8); /* Adjusted position */
	}
</style>
