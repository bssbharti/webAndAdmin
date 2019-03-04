

IcarusAudioPlayer.Audio = function(iap, audioSrc)
{
	this.iap = iap;
	this.audioSrc = audioSrc;
	
	var self = this;
	//setTimeout( function()
		//	{
	
	self.audio = new Audio(audioSrc);
	self.audio.autoplay = false;
	self.audio.controls = false;
	self.audio.preload = true;
	
	
	self.audio.addEventListener("canplaythrough", 		  function() { self.OnCanPlay(); } );
	self.audio.addEventListener("timeupdate", 	  function() { self.OnTimeUpdate(); } );
	self.audio.addEventListener("durationchange", function() { self.OnDurationChange(); } );
	self.audio.addEventListener("error", function(e) { self.OnError(e); } );
	
			//}, 5000);
}

IcarusAudioPlayer.Audio.prototype.iap = null;
IcarusAudioPlayer.Audio.prototype.audioSrc = null;
IcarusAudioPlayer.Audio.prototype.audio = null;

IcarusAudioPlayer.Audio.prototype.canPlay = false;
IcarusAudioPlayer.Audio.prototype.wasPlay = false;

IcarusAudioPlayer.Audio.prototype.OnError = function(e)
{
	console.log(e);
}

IcarusAudioPlayer.Audio.prototype.OnCanPlay = function()
{
	//console.log("can play");
	
	//this.audio.currentTime = 20;
	
	this.canPlay = true;
	
	if( this.wasPlay ) 
		this.Play();
}

IcarusAudioPlayer.Audio.prototype.SetVolume = function(v)
{
	this.audio.volume = v;
}

IcarusAudioPlayer.Audio.prototype.secsPosition = 0;
IcarusAudioPlayer.Audio.prototype.secsDuration = 0;

IcarusAudioPlayer.Audio.prototype.OnTimeUpdate = function()
{
	var secs = this.audio.currentTime;
	
	if( secs != this.secsPosition )
	{
		this.secsPosition = secs;
		
		this.iap.OnAudioPositionChange(secs);
	}
}

IcarusAudioPlayer.Audio.prototype.OnDurationChange = function()
{
	var secs = this.audio.duration;
	
	if( secs != this.secsDuration )
	{
		var first = this.secsDuration == 0; 
		
		this.secsDuration = secs;
		
		if( first ) 
			this.iap.AudioReady();
		
		this.iap.OnAudioDurationChange(secs);
	}
}

IcarusAudioPlayer.Audio.prototype.GetPositionSecs = function()
{
	return this.secsPosition;
}

IcarusAudioPlayer.Audio.prototype.GetDurationSecs = function()
{
	return this.secsDuration;
}

IcarusAudioPlayer.Audio.prototype.SetPositionSecs = function(secs)
{
	//if( ! this.canPlay ) 
	//	return;
	
//	this.canPlay = false;
	
	//this.audio.pause();
	
//	console.log("set pos");
	this.audio.currentTime = secs;
}
 
IcarusAudioPlayer.Audio.prototype.IsPlaying = function()
{
	return ! this.audio.paused;
}

IcarusAudioPlayer.Audio.prototype.Pause = function()
{
	if( ! this.audio ) 
		return;
	
	this.audio.pause();
	this.wasPlay = false;
}

IcarusAudioPlayer.Audio.prototype.Play = function()
{
	this.audio.play();
	this.wasPlay = true;
}

IcarusAudioPlayer.Audio.prototype.secsLoaded = 0.0;

IcarusAudioPlayer.Audio.prototype.GetLoadedSecs = function()
{
	return this.secsLoaded;
}

IcarusAudioPlayer.Audio.prototype.AnimationFrame = function()
{
	if( ! this.audio ) 
		return;
	
	var newSecsLoaded = 0.0;
	
  	if ( this.audio.buffered && this.audio.buffered.length)
  	{
  		for(var i = 0 ; i < this.audio.buffered.length ; i++)
  			newSecsLoaded = Math.max(newSecsLoaded, this.audio.buffered.end(i) ); 
  	}
  	
  		//newSecsLoaded = this.audio.buffered.end(0);
 
  	if( newSecsLoaded != this.secsLoaded ) 
  	{
  		this.secsLoaded = newSecsLoaded;
  		
  		this.iap.OnAudioLoadedChange(this.secsLoaded);
  	}
	
	
	
	
	
	
}


