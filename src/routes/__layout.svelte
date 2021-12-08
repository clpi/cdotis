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
	    list-style: decimal;
	padding-top: 2.5%;
	border-top: 1px solid rgba(0,0,0,0.02);
	border-radius: 7px;
	padding-bottom: 2.5%;
	background-color: rgba(0,0,0,0.01);
	border-top:1px solid rgba(0,0,0,0.085);
	border-bottom:1px solid rgba(0,0,0,0.045);
	margin-top: 25px;
    }
:global(ul:not(.navbar):hover) {
    transition: all 0.2s ease-in-out;
    background-color: rgba(0,0,0,0.02);
    border-top:1px solid rgba(0,0,0,0.175);
    border-bottom:1px solid rgba(0,0,0,0.095);
}
:global(li:not(.nav)) {
	margin-bottom: 4px;
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
		padding: 2% 15% 2% 15%;
		font-weight: 300;
		background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='29' height='50.115' patternTransform='scale(1.05) rotate(90)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0.09)'/><path d='M14.498 16.858L0 8.488.002-8.257l14.5-8.374L29-8.26l-.002 16.745zm0 50.06L0 58.548l.002-16.745 14.5-8.373L29 41.8l-.002 16.744zM28.996 41.8l-14.498-8.37.002-16.744L29 8.312l14.498 8.37-.002 16.745zm-29 0l-14.498-8.37.002-16.744L0 8.312l14.498 8.37-.002 16.745z'  stroke-width='0.7' stroke='hsla(0, 0%, 0%, 0.030)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")
	}
	:global(h1),:global(h2),:global(h3),:global(h4) {

		font-weight: 100;
		font-family: Helvetica;
		letter-spacing: -1px;
		border-left: 1px solid rgba(0,0,0,0.0);
		/* border-bottom: 0px solid rgba(0,0,0,0.25); */
		/* padding: 0px 16px 4px 4px; */
	}
	:global(h1) { font-size: 1.9rem; padding-left: 18px; color: rgba(0,0,0,0.70); }
	:global(#head) { font-size: 1.9rem; padding-left: 18px; color: rgba(0,0,0,0.70); }
	:global(h2) { font-size: 1.6rem; padding-left: 12px; color: rgba(0,0,0,0.58); }
	:global(h3) { font-size: 1.4rem; padding-left: 8px; color: rgba(0,0,0,0.53); }
	:global(h4) { font-size: 1.2rem; padding-left: 7px; color: rgba(0,0,0,0.50); }
	:global(h1::before) { font-size: 1.9rem;font-weight: 100; content: "⚬"; color: rgba(140,210,160,0.0); padding-right: 12px; text-shadow: 0px 0px 18px rgba(140,210,160,0)}
	:global(#head::before) { font-size: 1.9rem;font-weight: 100; content: "•"; color: rgba(140,0,160,0.00); padding-right: 12px;text-shadow: 0px 0px 18px rgba(140,210,160,0) }
	:global(h2::before) { font-size: 1.6rem;font-weight: 100; content: "⚬⚬"; color: rgba(140,210,160,0.00); padding-right: 9px; text-shadow: 0px 0px 18px rgba(140,210,160,0)}
	:global(h3::before) { font-size: 1.4rem;font-weight: 100; content: "⚬⚬⚬"; color: rgba(140,210,160,0.00); padding-right: 7px; text-shadow: 0px 0px 18px rgba(140,210,160,0)}
	:global(h4::before) { font-size: 1.2rem;font-weight: 100; content: "⚬⚬⚬⚬⚬"; color: rgba(140,210,160,0.00); padding-right: 5px; text-shadow: 0px 0px 18px rgba(140,210,160,0)}
	:global(h1:hover::before) { font-size: 1.9rem;font-weight: 100; content: "⚬"; color:rgba(140,210,160,0.43) ; padding-right: 12px; transition:all 0.15s ease-in; text-shadow: 0px 0px 18px rgba(140,210,160,0.12)}
	:global(#head:hover::before) { font-size: 1.9rem;font-weight: 100; content: "•"; color:rgba(140,210,160,0.53) ; padding-right: 12px; transition:all 0.25s ease-in; text-shadow: 0px 0px 18px rgba(140,210,160,0.12)}
	:global(h2:hover::before) { font-size: 1.6rem;font-weight: 100; content: "⚬⚬"; color:rgba(140,210,160,0.48) ; padding-right: 9px; transition:all 0.25s ease-in; text-shadow: 0px 0px 18px rgba(140,210,160,0.08)}
	:global(h3:hover::before) { font-size: 1.4rem;font-weight: 100; content: "⚬⚬⚬"; color:rgba(140,210,160,0.43) ; padding-right: 7px; transition:all 0.25s ease-in; text-shadow: 0px 0px 18px rgba(140,210,160,0.06)}
	:global(h4:hover::before) { font-size: 1.2rem;font-weight: 100; content: "⚬⚬⚬⚬⚬"; color:rgba(140,210,160,0.38); padding-right: 5px; transition:all 0.25s ease-in; text-shadow: 0px 0px 18px rgba(140,210,160,0.05)}
	:global(h1:hover),:global(h2:hover),:global(h3:hover),:global(h4:hover),:global(#head:hover) {
	    }
	/* :global(h1:hover::after) { color: rgba(0,0,0,0.15); padding-left: 25px; font-size: 1.2rem; content: "." }
	:global(#head:hover::after) { color: rgba(0,0,0,0.15); padding-left: 25px; font-size: 1.2rem; content: "." }
	:global(h2:hover::after) { color: rgba(0,0,0,0.12); padding-left: 15; font-size: 1.0rem; content: ".." }
	:global(h3:hover::after) { color: rgba(0,0,0,0.09); padding-left: 10px; font-size: 0.9rem; content: "..." }
	:global(h4:hover::after) { color: rgba(0,0,0,0.09); padding-left: 08px; font-size: 0.7rem; content: "...." } */
	/* :global(h1:hover) { color: black;border-left: 4px solid rgba(0,0,0,0.15); transition: all 0.2s ease-in-out}
	:global(#head:hover) { border-left: 1px solid rgba(0,0,0,0.10); transition: all 0.2s ease-in-out}
	:global(h2:hover) { color:rgba(0,0,0,0.8);border-left: 1px solid rgba(0,0,0,0.10);  transition: all 0.2s ease-in-out}
	:global(h3:hover) { color:rgba(0,0,0,0.74);border-left: 1px solid rgba(0,0,0,0.10);  transition: all 0.2s ease-in-out}
	:global(h4:hover) { color:rgba(0,0,0,0.7);border-left: 1px solid rgba(0,0,0,0.1j);  transition: all 0.2s ease-in-out} */
	:global(p) {
		padding-left: 45px;
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
	/* :global(#head:hover::after) { color: rgba(0,0,0,0.15); padding-left: 8px; font-size: 1.2rem; content: "*" } */
	:global(#head:hover) {
		/* color: rgba(0,0,0,0.76); */
		transition: all 0.1s ease-in-out;
		margin-left: 0px;
		padding-left:18px;

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
	/* :global(a:not(.nav):hover::before){
		content: "["
	}
	:global(a:not(.nav):hover::after){
		content: "]"
	} */
	:global(p:hover:not(.foot)) {
		/* border-left: 1px solid rgba(0,0,0,0.1); */
		/* transition: all 0.2s ease-in-out; */
		}
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
	padding-top: 12px;
	line-height: 1.4rem;
	padding-bottom: 35px;
	padding-left: 40px;
	padding-right: 40px;
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
