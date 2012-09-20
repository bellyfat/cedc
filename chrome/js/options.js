Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
	if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

//Generate a random key, put it in the input
function generate_key()
{
	$("#key").val(CryptoJS.lib.WordArray.random(256));
}

function select_key()
{
	$("#key").focus().select();
}

function save_key_encrypt()
{
	var k = $("#key_to_save_encrypt").val();
	var i = $("#ident_to_save_encrypt").val();
	var arr = {};

	if(k == "" || i == "")
	{
		return;
	}

	if(localStorage["saved_encrypt_keys"] != null)
	{
		arr = JSON.parse(localStorage["saved_encrypt_keys"]);
	}

	arr[i] = k;
	localStorage["saved_encrypt_keys"] = JSON.stringify(arr);

	populateSavedKeyEncryptDiv();
}

function save_key_decrypt()
{
	var k = $("#key_to_save_decrypt").val();
	var i = $("#ident_to_save_decrypt").val();
	var arr = {};

	if(k == "" || i == "")
	{
		return;
	}

	if(localStorage["saved_decrypt_keys"] != null)
	{
		arr = JSON.parse(localStorage["saved_decrypt_keys"]);
	}

	arr[i] = k;
	localStorage["saved_decrypt_keys"] = JSON.stringify(arr);

	populateSavedKeyDecryptDiv();
}

function populateSavedKeyEncryptDiv()
{
	if(localStorage["saved_encrypt_keys"] == null)
	{
		return;
	}

	var arr = JSON.parse(localStorage["saved_encrypt_keys"]);

	if(Object.size(arr) == 0)
	{
		$("#saved_keys_encrypt").html("");

		return;
	}

	var output = "<table border='1'><th>X</th><th>Label</th><th>Encrypt Key</th>";

	for(var key in arr)
	{
		output = output + "<tr><td><input type='checkbox' class='delete_encrypt' value='" + key + "'></input></td><td>" + key + "</td><td><textarea rows='5' cols='100' readonly='readonly'>" + arr[key] + "</textarea></td></tr>";
	}

	output = output + "</table><br />";

	$("#saved_keys_encrypt").html(output);
	$("#ident_to_save_encrypt").val("");
	$("#key_to_save_encrypt").val("");
}

function populateSavedKeyDecryptDiv()
{
	if(localStorage["saved_decrypt_keys"] == null)
	{
		return;
	}

	var arr = JSON.parse(localStorage["saved_decrypt_keys"]);

	if(Object.size(arr) == 0)
	{
		$("#saved_keys_decrypt").html("");

		return;
	}

	var output = "<table border='1'><th>X</th><th>Label</th><th>Decrypt Key</th>";

	for(var key in arr)
	{
		output = output + "<tr><td><input type='checkbox' class='delete_decrypt' value='" + key + "'></input></td><td>" + key + "</td><td><textarea rows='5' cols='100' readonly='readonly'>" + arr[key] + "</textarea></td></tr>";
	}

	output = output + "</table><br />";

	$("#saved_keys_decrypt").html(output);
	$("#ident_to_save_decrypt").html("");
	$("#key_to_save_decrypt").html("");
}

function delete_key_encrypt()
{
	$("div#saved_keys_encrypt :checked").each(function() {
		var arr = JSON.parse(localStorage["saved_encrypt_keys"]);
		delete arr[$(this).val()];
		localStorage["saved_encrypt_keys"] = JSON.stringify(arr);
	});

	populateSavedKeyEncryptDiv();
}

function delete_key_decrypt()
{
	$("div#saved_keys_decrypt :checked").each(function() {
		var arr = JSON.parse(localStorage["saved_decrypt_keys"]);
		delete arr[$(this).val()];
		localStorage["saved_decrypt_keys"] = JSON.stringify(arr);
	});

	populateSavedKeyDecryptDiv();
}



//Add listeners
document.addEventListener('DOMContentLoaded', function () {
	populateSavedKeyEncryptDiv();
	populateSavedKeyDecryptDiv();
	document.querySelector('button#genkey').addEventListener('click', generate_key);
	document.querySelector('textarea#key').addEventListener('click', select_key);
	document.querySelector('button#save_key_encrypt').addEventListener('click', save_key_encrypt);
	document.querySelector('button#save_key_decrypt').addEventListener('click', save_key_decrypt);
	document.querySelector('button#delete_key_encrypt').addEventListener('click', delete_key_encrypt);
	document.querySelector('button#delete_key_decrypt').addEventListener('click', delete_key_decrypt);
});
