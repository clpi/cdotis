<script lang="ts">
	import Nav from '../lib/nav.svelte';
import Footer from '../lib/footer.svelte';
	import { page, navigating } from '$app/stores';
	import GoogleAnalytics from '$lib/google.svelte';


	$: section = $page.url.pathname.split('/')[1];
</script>

<style>
    :global(li:not(.nav)) {
	padding-left: 1%;
	margin-bottom: 4px;

	}
	:global(body) {
		border: 2px ridge transparent;
		background-color: #fffefd;
		height: 100vh;
		min-height: 100vh;
		margin: 0;
		max-width: 100%;
		overflow-x: hidden;
		padding: 2% 15% 2% 15%;
		font-weight: 300;
		/* background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='29' height='50.115' patternTransform='scale(1.05) rotate(90)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0.09)'/><path d='M14.498 16.858L0 8.488.002-8.257l14.5-8.374L29-8.26l-.002 16.745zm0 50.06L0 58.548l.002-16.745 14.5-8.373L29 41.8l-.002 16.744zM28.996 41.8l-14.498-8.37.002-16.744L29 8.312l14.498 8.37-.002 16.745zm-29 0l-14.498-8.37.002-16.744L0 8.312l14.498 8.37-.002 16.745z'  stroke-width='0.7' stroke='hsla(0, 0%, 0%, 0.030)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>") */
	}
	:global(h1),:global(h2),:global(h3),:global(h4) {

		font-weight: 100;
		font-family: Helvetica;
		letter-spacing: -1px;
		border-left: 1px solid rgba(0,0,0,0.0);
		/* border-bottom: 0px solid rgba(0,0,0,0.25); */
		/* padding: 0px 16px 4px 4px; */
	}
	:global(h1) { font-size: 1.9rem; color: rgba(0,0,0,0.70); }
	:global(#head) { font-size: 1.9rem; color: rgba(0,0,0,0.70); }
	:global(h2) { font-size: 1.6rem; color: rgba(0,0,0,0.58); }
	:global(h3) { font-size: 1.4rem; color: rgba(0,0,0,0.53); }
	:global(h4) { font-size: 1.2rem; color: rgba(0,0,0,0.50); }
	:global(p) {
		font-size: 1.0rem;
		border-left:1px solid transparent;
	}
	.content {
		font-size: 0.97rem;
		font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		font-family:Helvetica;
		font-weight: 300;
		color: rgba(0,2,1,0.58);
		}
	:global(#head) {
		padding-bottom: 8px;
		border-left: 1px solid rgba(0,0,0,0.0);
		margin-left:0px;
	}
	:global(.link:not(.nav):hover) {
	    transition: all 0.05s;
	    text-shadow: 0px 0px 8px rgba(0,0,0,0.0);
	    text-decoration: underline;
	    color: rgba(150,210,180,1);
	}
	:global(.link:not(.nav)) {
	    font-family: Helvetica;
	    text-decoration:none;
	    text-underline-offset: 1px;
	    font-size:1rem;
	    color: rgba(100,180,120,0.9);
	}

.content {
	padding-top: 12px;
	line-height: 1.4rem;
	padding-bottom: 35px;
	padding-left: 7%;
	padding-right: 7%;
	height: 100%;
	min-height: 45vh;
	background-color: rgba(246,246,246,0.925);
	border-left: 1px solid rgba(0,0,0,0.065);
	border-right: 1px solid rgba(0,0,0,0.065);
	border-top: 1px solid rgba(0,0,0,0.040);
	border-bottom: 2px solid rgba(0,0,0,0.13);
	box-shadow: 0px 7px 70px rgba(0,0,0,0.105);
	border-radius: 09px;
	display:block;
}
:global(li a ):not(.nav) {
	text-decoration: underline;
	text-underline-offset: 5px;
	text-shadow: 0px 0px 5px rgba(0,0,0,0.01);
    }
    :global( .link.ext ):not(.nav) {
	    color: rgba(0,0,0,0.5);
	}
	:global(li a:active):not(.nav) {
		transform: scale(1.1);
	}
	:global(li a:hover):not(.nav) {
		font-weight: 300;
		/* color: rgba(255,255,255,0.98); */
		/* border-radius: 4px; */
		/* box-shadow:  0px 0px 8px rgba(0,0,0,0.1); */
		text-shadow: 0px 0px 10px rgba(0,0,0,0.05);
		transition: all 0.2s ease-in-out;

	    }
	    :global(li:hover a):not(.nav) {
		transition: all 0.2s ease-in-out;
		transform: scale(1.1);

		}
    /* :global(form) {
	padding-left: 3%;
	padding-right: 1%;
	padding-top: 2%;
	padding-bottom: 2%;
	background-color: rgba(0,0,0,0.02);
	box-shadow: 0px 0px 7px rgba(0,0,0,0.00);
	width: 50%;
	display: block;
	position:relative;
	align-content: center;
	justify-content:center;
	transition: all 0.15s ease-in-out;
	align-items: center;
	box-shadow: 0px 0px 5px rgba(0,0,0,0.03);
	border: 1px solid rgba(0,0,0,0.02);
	border-radius: 6px;
	border-bottom: 3px solid rgba(0,0,0,0.09);
	margin: auto;
    }
	    .form {
		align-content: center;
	align-content: center;
	justify-content:center;


		}
		.formtitle {
		    font-family:Helvetica;
		    padding-bottom: 12px;
		    padding-left: 8px;
			display:block;
		    }
		    .gray {
			    color: rgba(0,0,0,0.5);
			} */
    :global(form) {
	padding: 3% 5% 3% 5%;
	margin-top: 10px;
	/* background-color: rgba(255,255,255,0.01); */
	box-shadow: 0px 0px 50px rgba(0,0,0,0.03);
	border-top: 1px solid rgba(0,0,0,0.035);
	border-left: 1px solid rgba(0,0,0,0.045);
	border-right: 1px solid rgba(0,0,0,0.045);
	border-bottom: 2px solid rgba(0,0,0,0.12);
	display: inline-flexbox;
	transition: all 0.15s ease-in-out;
	border-radius: 5px;
	min-width:40%;
	margin: 7px;
    }
    :global(input) { 
	padding: 15px 30px; 
	margin-top: 2px;
	border-radius:5px; 
	display:inline;
	width: 80%;
	border: 1px transparent; 
	border-top: 1px solid rgba(0,0,0,0.1);
	border-bottom: 1px solid rgba(255,255,255,1);
	background: rgba(0,0,0,0.025);
	}
	:global(label) {
		font-size: 0.9rem;
		padding-left: 02px;
		color: rgba(0,0,0,0.6);
		text-shadow: 0px 0px 4px rgba(0,0,0,0.05);
	    }
	:global(.form) {
	    display:inline-flex;
	    width: 100%;
	    margin:auto;
		}
    :global(button) {
	border: 2px solid transparent;
	border-bottom: 2px solid rgba(0,0,0,0.1);
	border-top: 1px solid rgba(0,0,0,0.025);
	border-left: 1px solid rgba(0,0,0,0.025);
	border-right: 1px solid rgba(0,0,0,0.025);
	color: rgba(0,0,0,0.6);
	background-color: rgba(150,220,170,1);
	color: rgba(255,255,255,1);
	text-shadow: 0px 1px 0px rgba(0,0,0,0.15);
	padding: 8px 10px;
	border-radius: 4px;
	transition: all 0.15s ease-in-out;

	}
	:global(input:active) {
		/* background-color: rgba(255,255,255,0.05); */
	    }
	:global(input:focus) {
		/* background-color: rgba(255,255,255,0.05); */
		border-top: 1px solid rgba(0,0,0,0.2);
		border-bottom: 1px solid rgba(150,220,170,0.8);
		color: rgba(110,210,140,0.9);
		outline:none;
		transform:scale(1.05);
		transition: all 0.1s ease-in-out;
	    }
	:global(form button:hover) {
	    background-color: rbga(0,0,0,0.25);
	    border-bottom: 2px solid rgba(0,0,0,0.25);
	    border-radius: 5px;
	    transform:scale(1.1);
	    transition:all 0.1s ease-in-out;
	}
	:global(.secondary) {
	    background-color: rbga(0,0,0,0.25);

	    }
	:global(.secondary:hover) {
	    background-color: rbga(0,0,0,0.35);

	    }
		:global(.formtitle) {
		    font-family:Helvetica;
		    padding-bottom: 12px;
			display:block;
		    }
		    :global(.gray) {
			    color: rgba(0,0,0,0.5);
			    font-weight: 500;
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
