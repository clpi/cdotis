<script context="module">
	export const hydrate = false;
	export const prerender = true;
	import Date from '$lib/date.svelte'
</script>

<svelte:head>
	<title>about • clp.is</title>
</svelte:head>
<style>
    :global(form) {
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
	align-items: center;
	box-shadow: 0px 0px 5px rgba(0,0,0,0.03);
	border: 1px solid rgba(0,0,0,0.02);
	border-radius: 6px;
	border-bottom: 3px solid rgba(0,0,0,0.09);
	margin: auto;
    }
    label::before {
	    content: "$   ";
	    font-size: 0.8rem;
	    color: rgba(0,0,0,0.2);
	}
    input { 
	padding: 10px; 
	margin-top: 4px;
	width: 80%;
	border-radius:5px; 
	border: 1px transparent; 
	border-top: 1px solid rgba(0,0,0,0.1);
	background: rgba(0,0,0,0.05);
	}
    textarea { 
	padding: 10px; 
	margin-top: 4px;
	border-radius:5px; 
	width: 80%;
	border: 1px transparent; 
	border-top: 1px solid rgba(0,0,0,0.1);
	background: rgba(0,0,0,0.05);
	}
	label {
		font-size: 0.9rem;
		padding-left: 02px;
		color: rgba(0,0,0,0.6);
		text-shadow: 0px 0px 4px rgba(0,0,0,0.05);
	    }
    button {
	border: 2px solid transparent;
	border-bottom: 2px solid rgba(0,0,0,0.1);
	border-top: 1px solid rgba(0,0,0,0.025);
	border-left: 1px solid rgba(0,0,0,0.025);
	border-right: 1px solid rgba(0,0,0,0.025);
	color: rgba(0,0,0,0.6);
	background-color: rgba(255,255,255,1);
	padding: 8px;
	border-radius: 3px;

	}
	input:active {
		background-color: rgba(0,0,0,0.2);
	    }
	input:focus {
		background-color: rgba(0,0,0,0.12);
		border-top: 1px solid rgba(0,0,0,0.2);
		outline:none;
		transform:scale(1.1);
		transition: all 0.1s ease-in-out;
	    }
	textarea:active {
		background-color: rgba(0,0,0,0.2);
		transform:scale(0.9);
	    }
	textarea:focus {
		background-color: rgba(0,0,0,0.12);
		border-top: 1px solid rgba(0,0,0,0.2);
		outline:none;
		transform:scale(1.05);
		transition: all 0.1s ease-in-out;
	    }
	form button:hover {
	    background-color: rbga(0,0,0,0.25);
	    border-bottom: 2px solid rgba(0,0,0,0.25);
	    border-radius: 5px;
	    transform:scale(1.05);
	    transition:all 0.1s ease-in-out;
	}
	form button:active {

	    }
	    .form {
		align-content: center;
	align-content: center;
	justify-content:center;


		}
	    .form {
		align-content: center;
	align-content: center;
	justify-content:center;
	}


		.formtitle {
		    font-family:monospace;
		    padding-bottom: 12px;
		    padding-left: 8px;
			display:block;
		    }
		    .gray {
			    color: rgba(0,0,0,0.5);
			}

/* .walloftext { width: 80%; margin: auto; display:block; } */
</style>

<h1 id="head">about</h1>
<p class="walloftext">Hi there! And <i>welcome</i> to Chris P's internet property. I'm a budding engineer, a few years out of the University of Washington Materials science & engineering program in Seattle.</p>
<p class="walloftext">I'm currenlty most practiced in backend software development + cloud infrastructure architecture & engineering. Coming from a physical engineering background, I've had to learn quite a lot in my IT endeavours, both on my own and from the gracious assistance of others, whose patience I am grateful for eternally. I envision that with my multifaceted background and cross-disciplinary engineering cultivation, I can really bring a new perspective to the table in backend development and architecture.</p>

<p class="walloftext">I'm also working to build <a class="link" href="https://devisa.io">devisa</a> and <a class="link" href="https://idlets.com">idlets</a>. Keep in touch with me through real means or quietly stalk my <a class="link" href="/etc/updates">activity</a> <a class="link" href="/posts">feeds</a> if you're into that. If you wanna talk, email me at <a href="mailto:clp@clp.is" class="link">clp@clp.is</a> or message me on LinkedIn. Thank you, sincerely!</p>

<p class="walloftext">- Chris P<Date date="07-29-21"/> </p>
<br/>
<h3>show yourself!</h3>
<div class="form">
<form class="login">
    <span class="formtitle">contact <span class="gray">me</span></span>

    <label for="msg">message</label><br/>
    <textarea name="msg" rows=8/>


    <br/><br/>
    <label for="email">email</label><br/>
    <input name="email" type="email"/>

<br/>
<br/>
    <button label="login" type="submit">login</button>
</form>
<h3>pics</h3>
<img src="me/closed.jpeg" height="375" width="375"/>
<img src="me/stare.jpeg" height="375" width="375"/>
<img src="me/cout.jpeg" height="375" width="375"/>
</div>
