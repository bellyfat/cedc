chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.method == "getDecryptKeys")
        {
                if(localStorage["saved_decrypt_keys"] == null && localStorage["saved_encrypt_keys"] == null)
                {
                        sendResponse({});
                }

		var na = [];
		var d = JSON.parse(localStorage["saved_decrypt_keys"]);
		var e = JSON.parse(localStorage["saved_encrypt_keys"]);

		for (var key in d)
		{
			na.push(d[key]);
		}
		for (var key in e)
		{
			na.push(e[key]);
		}

                sendResponse({saved_decrypt_keys: na});
        }
        else
        {
                sendResponse({}); // snub them.
        }
});
