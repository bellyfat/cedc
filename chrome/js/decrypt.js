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





var arr;
var reg;

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

//websites like facebook/twitter shouldn't have while loops.
//so facebook adds brackets in the html which destroys our regex.  we need this crazy regex because they can add garbage in our identifier. so.... strip everything.
function richwebsites()
{
	var b = strip($(this).html());
	var dec = "";

	if(reg.test(b))
	{
		b = b.replace(reg, function(mat)        {
			for(var key in arr)
			{
				dec = "";

				try
				{
					dec = CryptoJS.AES.decrypt(RegExp.$1.replace(/\.*/g, ''), arr[key]).toString(CryptoJS.enc.Utf8);
				}
				catch(err)
				{
				}

				if(dec != "")
				{
					return dec;
				}
			}

			return mat;
		});

		$(this).html(b);
	}

}

function everyoneelse()
{
	var b = $("body").html();
	var dec = "";

	if(reg.test(b))
	{
		while(b.match(reg))
		{
			b = b.replace(reg, function(mat)	{
				for(var key in arr)
				{
					dec = "";

					try
					{
						dec = CryptoJS.AES.decrypt(strip(RegExp.$1).replace(/\.*/g, ''), arr[key]).toString(CryptoJS.enc.Utf8);
					}
					catch(error)
					{
					}

					if(dec != "")
					{
						return dec;
					}
				}
				
				return RegExp.$1;
			});
		}

		$("body").html(b);
	}
}

function doit()
{
	chrome.storage.local.get(["saved_encrypt_keys", "saved_decrypt_keys"], function(result) {
		chrome.runtime.sendMessage({method: "getDecryptKeys", payload: result}, function(response) {
			var locals = response.saved_decrypt_keys;

			if(locals == null)
			{
				return;
			}

			arr = locals;

			if(Object.size(arr) == 0)
			{
				return;
			}

			if(location.hostname.match('facebook')) {
				reg = /\[[\s\S]*?c[\s\S]*?e[\s\S]*?d[\s\S]*?c[\s\S]*?b[\s\S]*?\]([\s\S]*?)\[[\s\S]*?c[\s\S]*?e[\s\S]*?d[\s\S]*?c[\s\S]*?e[\s\S]*?\]/gi;
			}
			else	{
				reg = /\[cedcb\]([\s\S]*?)\[cedce\]/gi;
			}

			if(location.hostname.match('facebook'))	{
				//fucking facebook destroys our message and is so massive we are too slow

				//posts on walls
				$('span.userContent').each(richwebsites);

				//replies to posts on walls
				$('span[data-reactid]').each(richwebsites);

				//messages on full message page
				$('div[class] > span > p').each(richwebsites);

				//messages in chat window
				$('div[data-jsid] > span[data-measureme] > span').each(richwebsites);
			}
			else if(location.hostname.match('twitter'))	{
				$('p.js-tweet-text').each(richwebsites);
			}
			else
			{
				everyoneelse();
			}
		});
	});
}

doit();

//to handle ajaxy applications
setInterval(doit, 1000);
