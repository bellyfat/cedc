Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
        }
        return size;
};

function populateSelectKey()
{
	if(localStorage["saved_encrypt_keys"] == null)
        {
		$("div#key_select_div").html("<b>No keys saved!  Create some in the Options menu of the extensions page.</b><br /><br />");

                return;
        }

        var arr = JSON.parse(localStorage["saved_encrypt_keys"]);

	if(Object.size(arr) == 0)
        {
                $("div#key_select_div").html("<b>No keys saved!  Create some in the Options menu of the extensions page.</b><br /><br />");

                return;
        }

	var output = "<span>Key to use:</span><br /><select id='saved_keys'>";

	for(var key in arr)
	{
		output = output + "<option value='" + key + "'>" + key + "</option>";
	}

	output = output + "</select><br /><br />";

	$("div#key_select_div").html(output);
}

function encrypt_text()
{
        if(localStorage["saved_encrypt_keys"] == null || $("textarea#text_to_encrypt").val() == "")
        {
                return;
        }

        var arr = JSON.parse(localStorage["saved_encrypt_keys"]);

        if(Object.size(arr) == 0)
        {
                return;
        }

	var key = $("select#saved_keys").val();

	$("textarea#encrypted").val("[cedcb]" + CryptoJS.AES.encrypt($("textarea#text_to_encrypt").val(), arr[key]) + "[cedce]");
}

function encrypt_pic()
{
        if(localStorage["saved_encrypt_keys"] == null || $("div#img_encrypt").html() == "")
        {
                return;
        }

        var arr = JSON.parse(localStorage["saved_encrypt_keys"]);

        if(Object.size(arr) == 0)
        {
                return;
        }

        var key = $("select#saved_keys").val();

	$("textarea#encrypted").val("[cedcb]" + CryptoJS.AES.encrypt($("div#img_encrypt").html(), arr[key]) + "[cedce]");
}

function noopHandler(evt)
{
	evt.stopPropagation();
	evt.preventDefault();
}

function drop(evt)
{
	
	var files = evt.dataTransfer.files;
	var count = files.length;
	 
	// Only call the handler if 1 or more files was dropped.
	if (count > 0)
	{
		var file = files[0];

		$("span#status").html("Processing " + file.name);

		var reader = new FileReader();

		// init the reader event handlers
		reader.onload = (function(evt)  {
			$("div#img_encrypt").html("<img src='" + evt.target.result + "'></img>");
			$("span#status").html("");
		});

		// begin the read operation
		reader.readAsDataURL(file);
	}

	evt.stopPropagation();
	evt.preventDefault(); 
}

function select_encrypted()
{
        $("textarea#encrypted").focus().select();
}

function decrypt()
{
	if(localStorage["saved_encrypt_keys"] == null || $("textarea#text_to_decrypt").val() == "")
        {
                return;
        }

        var arr = JSON.parse(localStorage["saved_encrypt_keys"]);

        if(Object.size(arr) == 0)
        {
                return;
        }

	var key = $("select#saved_keys").val();
	var reg = /\[cedcb\]([\s\S]*?)\[cedce\]/gi;
	var b = $("textarea#text_to_decrypt").val().replace(reg, function(mat)	{
		return CryptoJS.AES.decrypt(RegExp.$1.replace(/\.*/g, ''), arr[key]).toString(CryptoJS.enc.Utf8);
	});

	$("div#decrypted").html(b);
}


//Add listeners
document.addEventListener('DOMContentLoaded', function () {
	populateSelectKey();
	document.querySelector('button#encrypt_text').addEventListener('click', encrypt_text);
	document.querySelector('button#encrypt_pic').addEventListener('click', encrypt_pic);
	document.querySelector('button#decrypt').addEventListener('click', decrypt);
	document.querySelector('div#picture_encrypt_div').addEventListener('drop', drop);
	document.querySelector('textarea#encrypted').addEventListener('click', select_encrypted);
	document.querySelector('div#picture_encrypt_div').addEventListener('dragenter', noopHandler);
	document.querySelector('div#picture_encrypt_div').addEventListener('dragexit', noopHandler);
	document.querySelector('div#picture_encrypt_div').addEventListener('dragover', noopHandler);
});
