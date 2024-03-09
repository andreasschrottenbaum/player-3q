<svelte:options customElement="player-3q" />

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Controls from './Controls.svelte';

	import Fa from 'svelte-fa';
	import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

	// Source of the video
	export let src = '';

	// Poster image for the video
	export let poster = '';
	// Autoplay option for the video
	export let autoplay = false;
	// Controls option for the video
	export let controls = false;
	// Current time of the video
	export let currentTime = 0;
	// Duration of the video
	export let duration = 0;
	// Loop option for the video
	export let loop = false;
	// Muted option for the video
	export let muted = false;
	// Paused state of the video
	export let paused = !autoplay;
	// Playback rate of the video
	export let playbackRate = 1;
	// Preload option for the video
	export let preload = 'auto';
	// Volume of the video
	export let volume = 1;

	// Root element of the player
	let rootEl: HTMLElement;
	// Video element of the player
	let videoEl: HTMLMediaElement;

	// UI visibility state
	let hideUI: boolean = true;

	// Event dispatcher for the player
	const dispatch = createEventDispatcher();

	// Timeout for hiding the UI
	let uiTimeout: NodeJS.Timeout;
	// Function to toggle the UI visibility
	function toggleUI() {
		hideUI = false;

		if (!uiTimeout) {
			dispatch('ui.show');
		}
		clearTimeout(uiTimeout);

		uiTimeout = setTimeout(() => {
			if (controls) return;

			dispatch('ui.hide');
			hideUI = true;
		}, 5000);
	}

	// Function to play, pause, or repeat the video
	function playPauseRepeat() {
		if (videoEl.currentTime === videoEl.duration) {
			videoEl.currentTime = 0;
			videoEl.play();
			paused = false;
			return;
		}

		if (videoEl.paused) {
			videoEl.play();
			paused = false;
		} else {
			videoEl.pause();
			paused = true;
		}
	}

	// Function to seek the video
	function seek(event: CustomEvent<{ newTime: number }>) {
		videoEl.currentTime = event.detail.newTime;
	}

	// Function to set the volume of the video
	function setVolume(event: CustomEvent<{ newVolume: number }>) {
		videoEl.volume = event.detail.newVolume;
		dispatch('volumechange', { detail: { volume: event.detail.newVolume } });
	}

	// Function to toggle fullscreen
	function toggleFullscreen() {
		if (document.fullscreenElement) {
			document.exitFullscreen();
			dispatch('fullscreenchange', { detail: { fullscreen: false } });
		} else {
			rootEl.requestFullscreen();
			dispatch('fullscreenchange', { detail: { fullscreen: true } });
		}
	}

	// Function to dispatch play event
	function play() {
		dispatch('play');
	}

	// Function to dispatch pause event
	function pause() {
		dispatch('pause');
	}

	// Function to dispatch ended event
	function ended() {
		dispatch('ended');
	}

	// Function to dispatch timeupdate event
	function timeUpdate() {
		currentTime = videoEl.currentTime;
		dispatch('timeupdate', { detail: { currentTime: videoEl.currentTime } });
	}

	// Function to dispatch volumechange event
	function volumeChange() {
		volume = videoEl.volume;
		dispatch('volumechange', { detail: { volume: videoEl.volume } });
	}

	// Function to dispatch durationchange event
	function durationChange() {
		duration = videoEl.duration;
		dispatch('durationchange', { detail: { duration: videoEl.duration } });
	}

	// Function to dispatch ratechange event
	function playbackRateChange() {
		playbackRate = videoEl.playbackRate;
		dispatch('ratechange', { detail: { playbackRate: videoEl.playbackRate } });
	}

	// On mount, set the poster if not provided and set the UI visibility based on the controls option
	onMount(() => {
		if (controls) {
			hideUI = false;
		}

		if (!poster) {
			poster = `//unsplash.it/${videoEl.clientWidth}/${videoEl.clientHeight}`;
		}
	});
</script>

<!-- HTML start -->

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- Root element of the player -->
<div bind:this={rootEl} class:hideUI class="player" on:mousemove={toggleUI} role="application">
	<!-- Video element of the player -->
	<video
		bind:this={videoEl}
		{src}
		{preload}
		{poster}
		{volume}
		{autoplay}
		{loop}
		{muted}
		on:play={play}
		on:pause={pause}
		on:ended={ended}
		on:timeupdate={timeUpdate}
		on:volumechange={volumeChange}
		on:ratechange={playbackRateChange}
		on:durationchange={durationChange}
		on:loadedmetadata={() => dispatch('loadedmetadata')}
		on:loadeddata={() => dispatch('loadeddata')}
		on:canplay={() => dispatch('canplay')}
		on:canplaythrough={() => dispatch('canplaythrough')}
		on:waiting={() => dispatch('waiting')}
		on:stalled={() => dispatch('stalled')}
		on:suspend={() => dispatch('suspend')}
		on:error={() => dispatch('error')}
		on:abort={() => dispatch('abort')}
		on:emptied={() => dispatch('emptied')}
		on:seeking={() => dispatch('seeking')}
		on:seeked={() => dispatch('seeked')}
		on:progress={() => dispatch('progress')}
	>
		<track kind="captions" />
	</video>

	<!-- Play/Pause button -->
	<div class="full">
		<button on:click={playPauseRepeat} class="bigPlay">
			<Fa icon={paused ? faPlay : faPause} />
		</button>
	</div>

	<!-- Top overlay -->
	<div class="top"></div>

	<!-- Left overlay -->
	<div class="left"></div>

	<!-- Right overlay -->
	<div class="right"></div>

	<!-- Bottom overlay with controls -->
	<div class="bottom">
		<Controls
			on:play={playPauseRepeat}
			on:seek={seek}
			on:volume={setVolume}
			on:fullscreen={toggleFullscreen}
			{currentTime}
			{duration}
			{paused}
			{volume}
		/>
	</div>
</div>

<!-- HTML end -->

<!-- Styles for the player -->
<style lang="scss">
	.player {
		position: relative;
		margin: 1em;
		width: 100%;
	}

	video {
		width: 100%;
		vertical-align: top;
	}

	.full,
	.top,
	.left,
	.right,
	.bottom {
		position: absolute;
	}

	.hideUI {
		.full,
		.top,
		.left,
		.right,
		.bottom {
			display: none;
		}
	}

	.full {
		inset: 0;
		display: grid;
		place-items: center;
	}

	.top {
		top: 0;
		left: 0;
		right: 0;
	}

	.left {
		top: 0;
		bottom: 0;
		left: 0;
	}

	.right {
		top: 0;
		bottom: 0;
		right: 0;
	}

	.bottom {
		bottom: 0;
		left: 0;
		right: 0;

		padding: 0.5em 1em;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
	}

	.bigPlay {
		aspect-ratio: 1;
		width: 1.25em;
		font-size: 3em;
		scale: 300%;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		border: none;
		border-radius: 50%;
	}
</style>
