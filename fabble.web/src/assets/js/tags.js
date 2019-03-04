
// b.COM=b.COMM;b.PRIV=b.COMM

//https://www.npmjs.com/package/jsmediatags

IcarusAudioPlayer.Tags = function(iap, tagPath)
{
	this.iap = iap;
	this.tagPath = tagPath;
}

IcarusAudioPlayer.Tags.prototype.RelativeToAbsolute = function(base, relative)
{
    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
                 // (omit if "base" is the current folder without trailing slash)
    for (var i=0; i<parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
}



IcarusAudioPlayer.Tags.prototype.Init = function()
{
	var self = this;
	var u = this.RelativeToAbsolute(window.location.href, this.tagPath);
	jsmediatags.read(u, 
	{
  		onSuccess: function(tag)   { self.OnJsMediaTagsSuccess(tag); }
  		,onError:   function(error) { self.OnJsMediaTagsError(error); }
    
  	} );
}

IcarusAudioPlayer.Tags.prototype.iap = null;

IcarusAudioPlayer.Tags.prototype.OnJsMediaTagsSuccess = function(tag)
{
	if( tag.tags && tag.tags.PRIV ) 
	{
		var data = tag.tags.PRIV.data.short_description;
		
		var xmlDoc = new DOMParser().parseFromString(data, "text/xml");
		
		this.MarkersFromXML(xmlDoc);
	}
	
	else
		this.OnJsMediaTagsError("No PRIV tag found");
}

IcarusAudioPlayer.Tags.prototype.OnJsMediaTagsError = function(error)
{
	console.log(error);
}


IcarusAudioPlayer.Tags.prototype.arrMarkers = [];

IcarusAudioPlayer.Tags.prototype.MarkersFromXML = function(xmlDoc)
{
	var arrMarkers = xmlDoc.getElementsByTagName("xmpDM:markers");
	
	if( arrMarkers.length == 0 ) 
		return;
	
	var arrSeq = arrMarkers[0].getElementsByTagName("rdf:Seq");
	
	if( arrSeq.length == 0 )
		return;
	
	if( arrSeq[0].parentNode == null || arrSeq[0].parentNode.parentNode == null ) 
		return;
	
	var frameStr    = arrSeq[0].parentNode.parentNode.getAttribute("xmpDM:frameRate");
	
	if( ! frameStr ) 
		return;
	
	var frameRate = parseFloat(frameStr.substr(1));
	

	var arrLI = arrSeq[0].getElementsByTagName("rdf:li");
	
	for(var i = 0 ; i < arrLI.length ; i++)
	{
		var li = arrLI[i];
		
		if( li.parentNode != arrSeq[0] ) 
			continue;
		
		var arrDesc = li.getElementsByTagName("rdf:Description");
		
		if( arrDesc.length == 0 ) 
			continue;
		
		var d = arrDesc[0];
			
		
		var name    = d.getAttribute("xmpDM:name");
		var comment = d.getAttribute("xmpDM:comment");
		var time    = d.getAttribute("xmpDM:startTime");
		
		if( !name || !time ) 
			continue;

		var secs = parseFloat(time) / frameRate;  //e.g 48000
		
		this.arrMarkers.push( { name:name, comment:comment, secs:secs } );
	}
		
	this.iap.TagsReady();
	
	/*
	
	this.iap.ui.AddMarker("TEST1", 30);
	this.iap.ui.AddMarker("TEST1", 60);
	this.iap.ui.AddMarker("TEST1", 90);
	this.iap.ui.AddMarker("TEST1", 120);
	this.iap.ui.AddMarker("TEST1", 150);
	
	
	this.iap.ui.AddMarker("TEST1", 166);
	this.iap.ui.AddMarker("TEST1", 156);
	this.iap.ui.AddMarker("TEST1", 146);
	this.iap.ui.AddMarker("TEST1", 136);
	*/
}





