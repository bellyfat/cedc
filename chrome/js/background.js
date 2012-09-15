chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.method == "getDecryptKeys")
        {
                if(localStorage["saved_decrypt_keys"] == null)
                {
                        sendResponse({});
                }

                sendResponse({saved_decrypt_keys: localStorage["saved_decrypt_keys"]});
        }
        else
        {
                sendResponse({}); // snub them.
        }
});
