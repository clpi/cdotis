<svelte:head>
	<title>home • clp.is</title>
</svelte:head>

<script>
import  Date  from '$lib/date.svelte'
</script>
<style>

    :global(.ext::after) {
	content: " [->]";
	font-size: 0.6rem;
	transition: all 0.15s ease-in-out;
	color: rgba(0,0,0,0.4);
    }
    :global(.ext:hover::after) {
	content: " [->]";
	transition: all 0.15s ease-in-out;
    }
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
</style>
<h1 id="head">index</h1>

<p> <Date date="07/14/21"/> welcome to clp.is. feel free to check out my <a class="link ext" href="https://github.com/clpi">github</a>/<a class="link ext" href="https://gitlab.com/clpi">gitlab</a> for any projects i might be working on. for now site is under construction! to reach me, email me <a class="link ext" href="mailto:clp@clp.is">here</a>. thanks!</p>

<br/><br/>
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
</div>
