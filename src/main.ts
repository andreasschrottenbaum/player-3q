import './devpage.css';
import DevPage from './DevPage.svelte';

const app = new DevPage({
	target: document.getElementById('app') as HTMLElement
});

export default app;
