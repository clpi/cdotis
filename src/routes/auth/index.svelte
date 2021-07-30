<style>
    :global(form) {
	padding-left: 2%;
	padding-right: 2%;
	background-color: rgba(0,0,0,0.02);
	box-shadow: 0px 0px 7px rgba(0,0,0,0.00);
	display: inline-flex;
	transition: all 0.15s ease-in-out;
	align-self: center;
	margin: 10px 15px;
	border: 1px solid rgba(0,0,0,0.0025);
	border-radius: 6px;
	border-bottom: 3px solid rgba(0,0,0,0.09);
	place-self: center;
	place-items: center;
	width: 10%;
    }
    label::before {
	    content: "$   ";
	    font-size: 0.8rem;
	    color: rgba(0,0,0,0.2);
	}
    input { 
	padding: 10px; 
	margin-top: 4px;
	border-radius:5px; 
	width: 90%;
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
	transition: all 0.15s ease-in-out;

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
	form button:hover {
	    background-color: rbga(0,0,0,0.25);
	    border-bottom: 2px solid rgba(0,0,0,0.25);
	    border-radius: 5px;
	    transform:scale(1.1);
	    transition:all 0.1s ease-in-out;
	}
	form button:active {

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
<h1>auth</h1>

<div class="form">
<form class="login">
    <span class="formtitle">log <span class="gray">in</span></span>

    <label for="user">user</label><br/>
    <input name="user" placeholder="user"/>


    <br/><br/>
    <label for="passwor">pass</label><br/>
    <input name="password" type="password" placeholder="password"/>

<br/>
<br/>
    <button label="login">login</button>
</form>
</div>
