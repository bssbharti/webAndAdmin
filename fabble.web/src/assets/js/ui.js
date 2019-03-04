

IcarusAudioPlayer.UI = function(iap, container, assetsPath, posterPath, displayName)
{
	this.iap = iap;
	this.container = container;

	this.layerFront = container.querySelector(".layerFront");
	this.layerBack  = container.querySelector(".layerBack");
	
	this.main = new IcarusAudioPlayer.Main(this, this.layerBack, assetsPath, posterPath, displayName);
	
	if( posterPath ) 
		this.poster = new IcarusAudioPlayer.Poster(this, this.layerFront, assetsPath, posterPath, displayName);
		
	else
	{
		this.PosterReady();
		this.layerBack.style.transition = undefined;
		this.Flip(false, 0.1);
	}
}

IcarusAudioPlayer.UI.prototype.iap 		= null;
IcarusAudioPlayer.UI.prototype.container = null;

IcarusAudioPlayer.UI.prototype.layerFront = null;
IcarusAudioPlayer.UI.prototype.layerBack  = null;

IcarusAudioPlayer.UI.prototype.poster = null;
IcarusAudioPlayer.UI.prototype.posterReady = false;

IcarusAudioPlayer.UI.prototype.main = null;
IcarusAudioPlayer.UI.prototype.mainReady = false;

IcarusAudioPlayer.UI.prototype.Flip = function(dir, s)
{
	//var s = 2;
	
	this.layerFront.style.transition = "opacity " + s + "s, pointer-events " + s + "s";
	this.layerBack.style.transition  = "opacity " + s + "s, pointer-events " + s + "s";
	
	if( dir ) 
	{
		this.layerFront.style.opacity = 1;
		this.layerFront.style.pointerEvents = "auto";
		
		this.layerBack.style.opacity = 0;
		this.layerBack.style.pointerEvents = "none";
		
	}
	
	else
	{
		this.layerFront.style.opacity = 0;
		this.layerFront.style.pointerEvents = "none";
		
		this.layerBack.style.opacity = 1;
		this.layerBack.style.pointerEvents = "auto";
	}
	
}



IcarusAudioPlayer.UI.prototype.CheckReady = function()
{
	if( this.mainReady && this.posterReady  ) 
		this.iap.UIReady();
}

IcarusAudioPlayer.UI.prototype.MainReady = function()
{
	this.mainReady = true;
	this.CheckReady();
}

IcarusAudioPlayer.UI.prototype.PosterReady = function()
{
	this.posterReady = true;
	this.CheckReady();
}

IcarusAudioPlayer.UI.prototype.AnimationFrame = function()
{
}


IcarusAudioPlayer.UI.prototype.OnMarkersUpdated = function()
{
	this.main.OnMarkersUpdated();
}

IcarusAudioPlayer.UI.prototype.OnAudioLoadedChange = function(secsLoaded)
{
	this.main.OnAudioLoadedChange(secsLoaded);
}

IcarusAudioPlayer.UI.prototype.OnAudioPositionChange = function(secsPosition)
{
	this.main.OnAudioPositionChange(secsPosition);
}

IcarusAudioPlayer.UI.prototype.OnAudioDurationChange = function(secsDuration)
{
	this.main.OnAudioDurationChange(secsDuration);
	
	if( this.poster ) 
		this.poster.OnAudioDurationChange(secsDuration);
}







