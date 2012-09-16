Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
        }
        return size;
};

function strip(html)
{
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;

	return tmp.textContent||tmp.innerText;
}

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

	var b = $("body").html();
	var reg = /\[cedcb\]([\s\S]*?)\[cedce\]/g;

	if(reg.test(b))
	{
		while(b.match(reg))
		{
			b = b.replace(reg, function(mat)	{
				for(var key in arr)
				{
					var dec = CryptoJS.AES.decrypt(strip(RegExp.$1), arr[key]).toString(CryptoJS.enc.Utf8);

					if(dec != "")
					{
						return dec;
					}
				}
				
				return "";
			});
		}

		$("body").html(b);
	}

});
