
IcarusAudioPlayer.ShareLinks = {};

IcarusAudioPlayer.ShareLinks.Compose = function(rest)
{
	var str = "";
	
	for(var i = 0 ; i < arguments.length ; i += 2)
	{
		var key = arguments[i+0];
		var val = arguments[i+1];
		
		if( val == null ) //consider empty string to count as a value.
			continue;
		
		str += str.length == 0? "?" : "&";
		
		str += key + "=" + encodeURIComponent(val);
	}
		
	return str;
}

//https://developers.facebook.com/docs/plugins/share-button
IcarusAudioPlayer.ShareLinks.Facebook = function(url) 
{
	return "https://www.facebook.com/sharer/sharer.php" + IcarusAudioPlayer.ShareLinks.Compose("u", url);
}

//https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/overview
IcarusAudioPlayer.ShareLinks.Twitter = function(optionalText, optionalURL, optionalHashtags, optionalVia) //hashtags are comma separated list without #.  Via e.g me
{
	return "https://twitter.com/intent/tweet" + IcarusAudioPlayer.ShareLinks.Compose("text", optionalText, "url", optionalURL, "hashtags", optionalHashtags, "via", optionalVia);
}

//https://developers.google.com/+/web/share/
IcarusAudioPlayer.ShareLinks.GooglePlus = function(optionalURL, optionalLanguageCode) //the language code for the locale to use e.g en-US
{
	return "https://plus.google.com/share" + IcarusAudioPlayer.ShareLinks.Compose("url", optionalURL, "hl", optionalLanguageCode);
}

//https://developer.linkedin.com/docs/share-on-linkedin
IcarusAudioPlayer.ShareLinks.LinkedIn = function(url, optionalTitle, optionalSummary, optionalSource) //source of the content e.g website or application name "LinkedIn"
{
	return "https://www.linkedin.com/shareArticle" + IcarusAudioPlayer.ShareLinks.Compose("mini", "true", "url", url, "title", optionalTitle, "summary", optionalSummary, "source", optionalSource ); 
}

/*
IcarusAudioPlayer.Share.Pinterest = function(imageURL, source, optionalDescription)

	

	var $pinimagenew = encodeURI(document.pin.pinimage.value);
	$pinimagenew = amperoctoplus($pinimagenew);
	var $pinsummarynew = encodeURI(document.pin.pinsummary.value);
	$pinsummarynew = amperoctoplus($pinsummarynew);
	
	document.pin.pinoutput1.value = "https://pinterest.com/pin/create/button/?url=" + encodeURIComponent(imageURL) + "&media=" + $pinimagenew + "&description=" + $pinsummarynew;
}*/

//https://en.wikipedia.org/wiki/Mailto
IcarusAudioPlayer.ShareLinks.Email = function(optionalEmail, optionalSubject, optionalCC, optionalBCC, optionalBody) //email can be comma separated list.
{
	var str = "mailto:";
	
	if( optionalEmail ) 
		str += optionalEmail;
	
	return str + IcarusAudioPlayer.ShareLinks.Compose("subject", optionalSubject, "cc", optionalCC, "bcc", optionalBCC, "body", optionalBody);
}

IcarusAudioPlayer.ShareLinks.ByServiceMinimum = function(service, url, title, text)
{
	switch(service) {
	case "facebook": return IcarusAudioPlayer.ShareLinks.Facebook(url);
	case "linkedin": return IcarusAudioPlayer.ShareLinks.LinkedIn(url, title, text, null); 
	case "twitter":  return IcarusAudioPlayer.ShareLinks.Twitter(text, url, null, null);
	case "email":	 return IcarusAudioPlayer.ShareLinks.Email(null, title, null, null, text); 
	default: throw new Error("");
	}
}

IcarusAudioPlayer.ShareLinks.OpenShareService = function(service, url)
{
	if( service == "email" ) 
		location.href = url;
		
	else
		window.open(url, "_blank");
}

//-----------

IcarusAudioPlayer.ShareLinks.CopyToClipboard = function(text)
{
	const el = document.createElement('textarea');
	el.value = text;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
};

IcarusAudioPlayer.ShareLinks.Download = function(url, optionalFilename)
{
    var element = document.createElement('a');
    element.setAttribute('href', url);
    
    if( optionalFilename ) 
    	element.setAttribute('download', optionalFilename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

