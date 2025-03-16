<script>
	import '../app.css';
	import { pwaInfo } from 'virtual:pwa-info';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>
<!-- Il <slot /> permette di inserire al suo interno altri componenti o contenuti che utilizzeranno questo layout. -->
<slot />
