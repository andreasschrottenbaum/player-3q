<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	import { faPlay, faPause, faExpand } from '@fortawesome/free-solid-svg-icons';
	import Volume from './Controls/Volume.svelte';
	import Settings from './Controls/Settings.svelte';

	export let currentTime = 0;
	export let duration = 0;
	export let paused = true;
	export let volume = 1;

	const dispatch = createEventDispatcher();

	function handlePlay() {
		dispatch('play');
	}

	function handleSeek(event: Event) {
		// @ts-ignore
		const newTime = event.target!.value;
		currentTime = newTime;
		dispatch('seek', { newTime });
	}

	function handleVolume(event: CustomEvent<{ newVolume: number }>) {
		const newVolume = event.detail.newVolume;
		volume = newVolume;
		dispatch('volume', { newVolume });
	}

	function toggleFullscreen() {
		dispatch('fullscreen');
	}

	const intl = new Intl.DateTimeFormat('en-EN', {
		minute: '2-digit',
		second: '2-digit'
	});

	$: currentTimeDisplay = intl.format(currentTime * 1000);
	$: durationDisplay = intl.format(duration * 1000);
</script>

<!-- HTML start -->

<div>
	<input type="range" min="0" max={duration} value={currentTime} on:change={handleSeek} />
</div>

<div class="bottom">
	<div>
		<button on:click={handlePlay}><Fa icon={paused ? faPlay : faPause} /></button>
		<span>{currentTimeDisplay}</span>
		/
		<span>{durationDisplay}</span>
		<Volume on:volume={handleVolume} />
	</div>

	<div>
		<Settings />
		<button on:click={toggleFullscreen}><Fa icon={faExpand} /></button>
	</div>
</div>

<!-- HTML end -->

<style>
	input[type='range'] {
		width: 100%;
		margin: 0;
	}

	button {
		background: none;
		border: none;
		cursor: pointer;
	}

	.bottom {
		display: flex;
		justify-content: space-between;
	}
</style>
