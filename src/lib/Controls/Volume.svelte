<script lang="ts">
	import Fa from 'svelte-fa';
	import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let volume = 1;

	function setVolume(event: Event) {
		// @ts-ignore
		const newVolume = event.target!.value;
		volume = newVolume;

		dispatch('volume', { newVolume });
	}
</script>

<!-- HTML start -->

<div>
	<Fa icon={faVolumeHigh} />
	<input type="range" min="0" max="1" step="0.01" on:change={setVolume} />
</div>

<!-- HTML end -->

<style>
	div {
		display: inline-flex;
		align-items: center;

		&:hover input {
			display: block;
		}
	}

	input {
		margin: 0 0.5em;
		display: none;
	}
</style>
