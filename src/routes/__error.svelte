<script context="module">
    export function load({ error, status }) {
	return {
	    props: {
		title: `${status}: ${error.message}`
	    }
	};
    }
</script>
 
<script>
    /* import { dev } from "$app/env" */
    export let title;
    export let error, status;
</script>
 
<svelte:head>
        <title>{title}</title>
</svelte:head>

<h1>ERROR: {title}</h1>
<p>test</p>
