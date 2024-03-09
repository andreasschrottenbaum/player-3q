<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Fa from 'svelte-fa';
	import {
		faPlay,
		faPause,
		faGear,
		faVolumeHigh,
		faExpand
	} from '@fortawesome/free-solid-svg-icons';

	export let currentTime = 0;
	export let duration = 0;
	export let paused = true;

	const dispatch = createEventDispatcher();

	function handlePlay() {
		dispatch('play');
	}

	function handleSeek(event: Event) {
		// @ts-ignore
		const newTime = event.target!.value;
		dispatch('seek', { newTime });
	}

	const intl = new Intl.DateTimeFormat('en-EN', {
		minute: '2-digit',
		second: '2-digit'
	});

	$: currentTimeDisplay = intl.format(currentTime * 1000);
	$: durationDisplay = intl.format(duration * 1000);
</script>

<div>
	<input type="range" min="0" max={duration} value={currentTime} on:change={handleSeek} />
</div>

<div class="bottom">
	<div>
		<button on:click={handlePlay}><Fa icon={paused ? faPlay : faPause} /></button>
		<span>{currentTimeDisplay}</span>
		/
		<span>{durationDisplay}</span>
		<button><Fa icon={faVolumeHigh} /></button>
	</div>

	<div>
		<!-- <button>Subtitles</button> -->
		<button><Fa icon={faGear} /></button>
		<button><Fa icon={faExpand} /></button>
	</div>
</div>

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
