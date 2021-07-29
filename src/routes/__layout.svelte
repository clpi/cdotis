<script lang="ts">
	import Nav from '../lib/nav.svelte';
	import Footer from '../lib/footer.svelte';
	import { page, navigating } from '$app/stores';
	import GoogleAnalytics from '$lib/google.svelte';


	$: section = $page.path.split('/')[1];
</script>

<style>
:global(ul:not(.navbar)) {
	margin-left: 3.5%;
	list-style:square;
	padding-top: 2.5%;
	border-top: 1px solid rgba(0,0,0,0.03);
	border-radius: 7px;
	padding-bottom: 2.5%;
	background-color: rgba(0,0,0,0.01);
	border:1px solid rgba(0,0,0,0.1);
	margin-top: 25px;
    }
:global(ul:not(.navbar):hover) {
    background-color: rgba(0,0,0,0.025);
    transition: all 0.2s ease-in-out;
    border: 1px solid rgba(0,0,0,0.25);
}
:global(li:not(.nav)) {
	margin-top: 4px;
	margin-bottom: 4px;
    }
:global(li:not(.nav):hover) {
}
    :global(li:not(.nav)) {
	padding-left: 1%;

	}
	:global(body) {
		border: 2px ridge transparent;
		background-color: #fffefd;
		height: 100vh;
		min-height: 100vh;
		margin: 0;
		max-width: 100%;
		overflow-x: hidden;
		padding: 2% 8% 2% 8%;
		font-weight: 300;
	}
	:global(h1),:global(h2),:global(h3),:global(h4) {

		font-weight: 300;
		font-family: monospace;
		letter-spacing: -2px;
		border-left: 2px solid rgba(0,0,0,0.00);
		/* border-bottom: 0px solid rgba(0,0,0,0.25); */
		/* padding: 0px 16px 4px 4px; */
	}
	:global(h1) { font-size: 2.4rem; padding-left: 32px;}
	:global(h2) { font-size: 2.0rem; padding-left: 28px; color: rgba(0,0,0,0.7)}
	:global(h3) { font-size: 1.8rem; padding-left: 21px; color: rgba(0,0,0,0.64)}
	:global(h4) { font-size: 1.6rem; padding-left: 16px; color: rgba(0,0,0,0.6)}
	:global(h1::before) { content: "#"; color: rgba(0,0,0,0.25); padding-right: 16px; }
	:global(h2::before) { content: "##"; color: rgba(0,0,0,0.20); padding-right: 12px; }
	:global(h3::before) { content: "###"; color: rgba(0,0,0,0.15); padding-right: 10px; }
	:global(h4::before) { content: "####"; color: rgba(0,0,0,0.10); padding-right: 8px; }
	:global(h1:hover::after) { color: rgba(0,0,0,0.15); padding-left: 8px; font-size: 1.2rem; content: "[.]" }
	:global(h2:hover::after) { color: rgba(0,0,0,0.12); padding-left: 6px; font-size: 1.0rem; content: "[..]" }
	:global(h3:hover::after) { color: rgba(0,0,0,0.09); padding-left: 4px; font-size: 0.9rem; content: "[...]" }
	:global(h4:hover::after) { color: rgba(0,0,0,0.09); padding-left: 4px; font-size: 0.7rem; content: "[....]" }
	:global(h1:hover) { color: black;border-left: 2px solid rgba(0,0,0,0.15); padding-left: 34px; transition: all 0.2s ease-in-out}
	:global(h2:hover) { color:rgba(0,0,0,0.8);border-left: 2px solid rgba(0,0,0,0.12); padding-left: 30px; transition: all 0.2s ease-in-out}
	:global(h3:hover) { color:rgba(0,0,0,0.74);border-left: 2px solid rgba(0,0,0,0.09); padding-left: 23px; transition: all 0.2s ease-in-out}
	:global(h4:hover) { color:rgba(0,0,0,0.7);border-left: 2px solid rgba(0,0,0,0.06); padding-left: 18px; transition: all 0.2s ease-in-out}
	:global(p) {
		padding-left: 32px;
		font-size: 1.1rem;
	}
	.content {
		font-size: 1.1rem;
		font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		font-weight: 400;
		}
	:global(#head) {
		padding-bottom: 8px;
		border-left: 2px solid rgba(0,0,0,0.00);
	}
	:global(#head:hover::after) { color: rgba(0,0,0,0.15); padding-left: 8px; font-size: 1.2rem; content: "[~]" }
	:global(#head:hover) {
		color: rgba(0,0,0,0.95);
		border-left: 2px solid rgba(0,0,0,0.15);
		padding-left: 37px;
		transition: all 0.2s ease-in-out;

	}
	:global(a:not(.nav):hover) {
		transition: all 0.2s;
		background-color: rgba(0,0,0,0.8);
		font-weight: 500;
		color: rgba(255,255,255,0.95);
		border-radius: 4px;
		text-decoration: underline;
		text-underline-offset: 6px;
	}
	:global(a:not(.nav)) {
		color: rgba(130,100,70,0.7);
		font-family: monospace;
		font-size:1rem;
		letter-spacing:-0px;
		text-decoration:none;
	}
	/* :global(a:not(.nav):hover::before){
		content: "["
	}
	:global(a:not(.nav):hover::after){
		content: "]"
	} */
	:global(p) {
		transition: all 0.2s ease-in-out;
		border-left: 2px solid rgba(0,0,0,0.0);
	}
	:global(p:hover:not(.foot)) {
		border-left: 2px solid rgba(0,0,0,0.1);
		transition: all 0.2s ease-in-out;}
	/* :global(p::before) {
		color: rgba(0,0,0,0.0);
		content: "--";
		padding-right: 4px;
	}
	:global(p:hover::before),:global(p:hover::after) {
		color: rgba(0,0,0,0.1);
	}
	:global(p::after) {
		color: rgba(0,0,0,0.0);
		content: "--";
		padding-left: 4px;
	} */

.content {
	padding: 12px;
	height: 100%;
	min-height: 45vh;
	background-color: rgba(0,0,0,0.01);
	border-left: 4px dashed rgba(0,0,0,0.02);
	border-right: 4px dashed rgba(0,0,0,0.02);
		border-top: 4px dotted rgba(0,0,0,0.08);
		border-bottom: 4px dotted rgba(0,0,0,0.08);
	display:block;
}
</style>

<GoogleAnalytics/>
<div>
	<Nav/>
	<div class="content">
		<slot></slot>
	</div>
	<Footer/>
</div>
