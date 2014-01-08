Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
	if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

/**
Update the div with our encryption keys from local storage
*/
function populateSavedKeyEncryptDiv()
{
	chrome.storage.local.get("saved_encrypt_keys", function(result) {
		var arr = result.saved_encrypt_keys;

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
	});
}

/**
Update the div with our decryption keys from local storage
*/
function populateSavedKeyDecryptDiv()
{
	chrome.storage.local.get("saved_decrypt_keys", function(result) {
		var arr = result.saved_decrypt_keys;

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
		$("#ident_to_save_decrypt").val("");
		$("#key_to_save_decrypt").val("");
	});
}



//Add listeners
document.addEventListener('DOMContentLoaded', function () {
	populateSavedKeyEncryptDiv();
	populateSavedKeyDecryptDiv();

	/**
	Generates a new key
	*/
	document.querySelector('button#genkey').addEventListener('click', function() {
		$("#key").val(CryptoJS.lib.WordArray.random(256));
	});

	/**
	Highlights the generated key on selection of text area
	*/
	document.querySelector('textarea#key').addEventListener('click', function() {
		$("#key").focus().select();
	});

	/**
	Save an encryption key to local storage
	*/
	document.querySelector('button#save_key_encrypt').addEventListener('click', function() {
		chrome.storage.local.get("saved_encrypt_keys", function(result) {
			var k = $("#key_to_save_encrypt").val();
			var i = $("#ident_to_save_encrypt").val();
			var sek = result;

			if(k == "" || i == "")
			{
				return;
			}

			if(!sek.saved_encrypt_keys)
			{
				sek = {saved_encrypt_keys: {}};
			}

			sek.saved_encrypt_keys[i] = k;

			chrome.storage.local.set(sek, function() {
				populateSavedKeyEncryptDiv();
			});
		});
	});

	/**
	Save a decryption key to local storage
	*/
	document.querySelector('button#save_key_decrypt').addEventListener('click', function() {
		chrome.storage.local.get("saved_decrypt_keys", function(result) {
			var k = $("#key_to_save_decrypt").val();
			var i = $("#ident_to_save_decrypt").val();
			var sdk = result;

			if(k == "" || i == "")
			{
				return;
			}

			if(!sdk.saved_decrypt_keys)
			{
				sdk = {saved_decrypt_keys: {}};
			}

			sdk.saved_decrypt_keys[i] = k;

			chrome.storage.local.set(sdk, function() {
				populateSavedKeyDecryptDiv();
			});
		});
	});

	/**
	Delete an encryption key from local storage
	*/
	document.querySelector('button#delete_key_encrypt').addEventListener('click', function() {
		chrome.storage.local.get("saved_encrypt_keys", function(result) {
			$("div#saved_keys_encrypt :checked").each(function() {
				var key = $(this).val();

				delete result.saved_encrypt_keys[key];
			});

			chrome.storage.local.set(result, function() {
				populateSavedKeyEncryptDiv();
			});
		});
	});

	/**
	Delete a decryption key from local storage
	*/
	document.querySelector('button#delete_key_decrypt').addEventListener('click', function() {
		chrome.storage.local.get("saved_decrypt_keys", function(result) {
			$("div#saved_keys_decrypt :checked").each(function() {
				var key = $(this).val();

				delete result.saved_decrypt_keys[key];
			});

			chrome.storage.local.set(result, function() {
				populateSavedKeyDecryptDiv();
			});
		});
	});

	/**
	Export our saved encrypt & decrypt keys
	*/
	document.querySelector('button#export_keys').addEventListener('click', function() {
		chrome.storage.local.get(["saved_encrypt_keys", "saved_decrypt_keys"], function(result) {
			$('textarea#all_keys').val(JSON.stringify(result));
		});
	});

	/**
	Import encrypt & decrypt keys found in the textarea
	*/
	document.querySelector('button#import_keys').addEventListener('click', function() {
		chrome.storage.local.set(JSON.parse($('textarea#all_keys').val()), function() {
			populateSavedKeyEncryptDiv();
			populateSavedKeyDecryptDiv();
		});
	});
});
