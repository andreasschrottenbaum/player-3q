<script lang="ts">
	// Importing necessary modules and components
	import Fa from 'svelte-fa';
	import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';

	// Creating an event dispatcher
	const dispatch = createEventDispatcher();

	// Exporting volume variable to be used in the component
	export let volume = 1;

	// Function to set volume
	function setVolume(event: Event) {
		// @ts-ignore
		const newVolume = event.target!.value;
		volume = newVolume;

		// Dispatching the volume event with the new volume
		dispatch('volume', { newVolume });
	}
</script>

<!-- HTML start -->

<div>
	<!-- Icon for volume -->
	<Fa icon={faVolumeHigh} />
	<!-- Input for setting the volume -->
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
