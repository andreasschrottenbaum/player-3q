<script lang="ts">
	import Fa from 'svelte-fa';
	import { faGear } from '@fortawesome/free-solid-svg-icons';
</script>

<!-- HTML start -->

<div class="settings">
	<button><Fa icon={faGear} /></button>

	<div class="submenu">
		<ul>
			<li>Quality</li>
			<li>Speed</li>
			<li>Subtitles</li>
		</ul>
	</div>
</div>

<!-- HTML end -->

<style lang="scss">
	button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
	}

	.settings {
		position: relative;
		display: inline-block;

		.submenu {
			display: none;
			position: absolute;
			right: 0;
			bottom: 1em;
			color: black;
			list-style: none;
			padding: 0;
			padding-bottom: 1em;

			ul {
				background: white;
				padding: 0;
				margin: 0;
				list-style: none;

				li {
					padding: 0.5em 1em;
					cursor: pointer;

					&:hover {
						background: #f0f0f0;
					}
				}
			}
		}

		&:hover .submenu {
			display: block;
		}
	}
</style>
