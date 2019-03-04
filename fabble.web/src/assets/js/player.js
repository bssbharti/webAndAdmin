IcarusAudioPlayer = function(eContainer, tagPath, audioSrc, assetsPath, itemId, posterPath, displayName)
{
	this.audioSrc = audioSrc;
	this.itemId = itemId;
	
	this.audio = new IcarusAudioPlayer.Audio(this, audioSrc);
	this.tags = new IcarusAudioPlayer.Tags(this, tagPath);	  this.tags.Init();
	this.ui = new IcarusAudioPlayer.UI(this, eContainer, assetsPath, posterPath, displayName);

	this.OnAnimationFrame();	
}

IcarusAudioPlayer.prototype.itemId = null;
IcarusAudioPlayer.prototype.audioSrc = null;

IcarusAudioPlayer.prototype.audio = null;
IcarusAudioPlayer.prototype.audioReady = false;

IcarusAudioPlayer.prototype.ui = null;
IcarusAudioPlayer.prototype.uiReady = false;

IcarusAudioPlayer.prototype.tags = null;
IcarusAudioPlayer.prototype.tagsReady = false;

IcarusAudioPlayer.prototype.CheckReadyMarkers = function()
{
	if( this.audioReady && this.uiReady && this.tagsReady ) 
		this.ui.OnMarkersUpdated();
}

IcarusAudioPlayer.prototype.CheckReadyTimes = function()
{
	if( this.audioReady && this.uiReady ) 
	{
		this.ui.OnAudioDurationChange(this.audio.GetDurationSecs());
		this.ui.OnAudioPositionChange(this.audio.GetPositionSecs());
		this.ui.OnAudioLoadedChange(this.audio.GetLoadedSecs());
	}
}


IcarusAudioPlayer.prototype.UIReady = function()
{
	this.uiReady = true;
	
	this.CheckReadyTimes();
	this.CheckReadyMarkers();
}

IcarusAudioPlayer.prototype.AudioReady = function()
{
	this.audioReady = true;
	
	this.CheckReadyTimes();
	this.CheckReadyMarkers();
}

IcarusAudioPlayer.prototype.TagsReady = function()
{
	this.tagsReady = true;
	
	this.CheckReadyMarkers();
}


IcarusAudioPlayer.prototype.OnAnimationFrame = function()
{
	this.audio.AnimationFrame();
	this.ui.AnimationFrame();
	
	//-----------------------------------------------------------------
	
	var self = this;

	var raf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame;

	if( raf )
    	raf( function() { self.OnAnimationFrame(); } );

	else
    	setTimeout( function() { self.OnAnimationFrame(); }, 0);
}

IcarusAudioPlayer.prototype.OnAudioDurationChange = function(secsDuration)
{
	if( this.uiReady ) 
		this.ui.OnAudioDurationChange(secsDuration);
}

IcarusAudioPlayer.prototype.OnAudioPositionChange = function(positionSecs)
{
	if( this.uiReady ) 
		this.ui.OnAudioPositionChange(positionSecs);
}

IcarusAudioPlayer.prototype.OnAudioLoadedChange = function(secsLoaded)
{
	if( this.uiReady ) 
		this.ui.OnAudioLoadedChange(secsLoaded);
}

IcarusAudioPlayer.prototype.OnMarkersUpdated = function()
{
	if( this.uiReady && this.audioReady )  
		this.ui.OnMarkersUpdated();
}

//---------------------------------------------------------------------

IcarusAudioPlayer.Load = function(id, method, url, responseType, callback) //json, xml.   //callback = function(id, result, errorText);
{
	var ajaxRequest = new XMLHttpRequest();
  
	ajaxRequest.open(method, url, true);
	
	ajaxRequest.responseType = responseType;

	ajaxRequest.onreadystatechange = function()
	{
		if( ajaxRequest.readyState == 4 )
		{
			ajaxRequest.onreadystatechange = null;
			ajaxRequest.onprogress			= null;
			
			if( ajaxRequest.status == 200 )
			{
				var response = ajaxRequest.responseType == "xml"? ajaxRequest.responseXML : ajaxRequest.response;
	     
				callback(id, response, null);
			}
	
			else
			{
				callback(id, null, ajaxRequest.statusText);
			}
		}
	  };
	  
	  ajaxRequest.send(null);
}



