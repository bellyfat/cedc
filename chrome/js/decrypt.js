Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
        }
        return size;
};

chrome.extension.sendRequest({method: "getDecryptKeys"}, function(response) {
	var locals = response.saved_decrypt_keys;
		
	if(locals == null)
	{
		return;
	}

	var arr = JSON.parse(locals);

	if(Object.size(arr) == 0)
	{
		return;
	}

	for(var key in arr)
	{
		console.log(CryptoJS.lib.WordArray.random(256).toString(CryptoJS.enc.Base64));
	}
});
