/**
Set up backwards compatibility
*/
if (!chrome.runtime) {
    // Chrome 20-21
    chrome.runtime = chrome.extension;
} else if(!chrome.runtime.onMessage) {
    // Chrome 22-25
    chrome.runtime.onMessage = chrome.extension.onMessage;
    chrome.runtime.sendMessage = chrome.extension.sendMessage;
    chrome.runtime.onConnect = chrome.extension.onConnect;
    chrome.runtime.connect = chrome.extension.connect;
}




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.method == "getDecryptKeys")
        {
                result = request.payload;

                if(result.saved_decrypt_keys == null && result.saved_encrypt_keys == null)
                {
                        sendResponse({saved_decrypt_keys: [], test: "hi"});
                }

		var na = [];

		for (var key in result.saved_decrypt_keys)
		{
			na.push(result.saved_decrypt_keys[key]);
		}
		for (var key in result.saved_encrypt_keys)
		{
			na.push(result.saved_encrypt_keys[key]);
		}

                sendResponse({saved_decrypt_keys: na});
        }
        else
        {
                sendResponse({saved_decrypt_keys: []}); // snub them.
        }
});
