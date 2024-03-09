<svelte:options customElement="player-3q" />

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Controls from './Controls.svelte';

	import Fa from 'svelte-fa';
	import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

	export let src = '';
	// export let mediaId = '';
	// export let provider: 'none' | '3Q' = 'none';
	// export let library: 'hls' | 'dash' | 'native' = 'native';

	export let poster = '';
	export let autoplay = false;
	export let controls = false;
	export let currentTime = 0;
	export let duration = 0;
	export let loop = false;
	export let muted = false;
	export let paused = !autoplay;
	export let playbackRate = 1;
	export let preload = 'auto';
	export let volume = 1;

	let rootEl: HTMLElement;
	let videoEl: HTMLMediaElement;

	let hideUI: boolean = true;

	const dispatch = createEventDispatcher();

	let uiTimeout: NodeJS.Timeout;
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

	function seek(event: CustomEvent<{ newTime: number }>) {
		videoEl.currentTime = event.detail.newTime;
	}

	function setVolume(event: CustomEvent<{ newVolume: number }>) {
		videoEl.volume = event.detail.newVolume;
		dispatch('media.volumechange', { detail: { volume: event.detail.newVolume } });
	}

	function toggleFullscreen() {
		if (document.fullscreenElement) {
			document.exitFullscreen();
			dispatch('media.fullscreenchange', { detail: { fullscreen: false } });
		} else {
			rootEl.requestFullscreen();
			dispatch('media.fullscreenchange', { detail: { fullscreen: true } });
		}
	}

	function timeUpdate() {
		currentTime = videoEl.currentTime;
		dispatch('media.timechange', { detail: { currentTime: videoEl.currentTime } });
	}

	function volumeChange() {
		volume = videoEl.volume;
		dispatch('media.volumechange', { detail: { volume: videoEl.volume } });
	}

	function durationChange() {
		duration = videoEl.duration;
		dispatch('media.durationchange', { detail: { duration: videoEl.duration } });
	}

	function playbackRateChange() {
		playbackRate = videoEl.playbackRate;
		dispatch('media.playbackratechange', { detail: { playbackRate: videoEl.playbackRate } });
	}

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
<div bind:this={rootEl} class:hideUI class="player" on:mousemove={toggleUI} role="application">
	<video
		bind:this={videoEl}
		{src}
		{preload}
		{poster}
		{volume}
		{autoplay}
		{loop}
		{muted}
		on:play={() => dispatch('play')}
		on:pause={() => dispatch('pause')}
		on:ended={() => dispatch('ended')}
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
		on:suspend={() => dispatch('suspend')}
	>
		<track kind="captions" />
	</video>

	<div class="full">
		<button on:click={playPauseRepeat} class="bigPlay">
			<Fa icon={paused ? faPlay : faPause} />
		</button>
	</div>

	<div class="top"></div>

	<div class="left"></div>

	<div class="right"></div>

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
