
//thumb.style.cursor = "pointer";
//apply document listeners only when dragging

//OnThumbMouseDown
//OnThumbTouchStart
//OnThumbTouchMove
//OnThumbTouchEnd

//optional
//OnContainerMouseDown
//OnContainerTouchStart

IcarusAudioPlayer.Slider = function()
{
	var self = this;
	
 	document.documentElement.addEventListener("mousemove",  function(e) { self.OnDocumentMouseMove(e); } );
 	document.documentElement.addEventListener("mouseup",    function(e) { self.OnDocumentMouseUp(e); } );
}

IcarusAudioPlayer.Slider.prototype.fClick 	   = null;
IcarusAudioPlayer.Slider.prototype.fDragBegin  = null;
IcarusAudioPlayer.Slider.prototype.fDragUpdate = null;
IcarusAudioPlayer.Slider.prototype.fDragEnd    = null;
IcarusAudioPlayer.Slider.prototype.fSetThumbPos= null;
IcarusAudioPlayer.Slider.prototype.fDragValue  = null;


IcarusAudioPlayer.Slider.prototype.value = 0;
IcarusAudioPlayer.Slider.prototype.max   = 0;

IcarusAudioPlayer.Slider.prototype.SetMax = function(max)
{
	if( this.max != max ) 
	{
		this.max = max;
		
		if( ! this.dragStarted ) 
			this.SetThumbPosition();
	}
}

IcarusAudioPlayer.Slider.prototype.SetValue = function(value)
{
	if( this.value != value ) 
	{
		this.value = value;

		if( ! this.dragStarted ) 
			this.SetThumbPosition();
	}
}

IcarusAudioPlayer.Slider.prototype.SetThumbPosition = function()
{
	if( this.fSetThumbPos ) 
		this.fSetThumbPos(this.value, this.max);
}

IcarusAudioPlayer.Slider.prototype.OnThumbMouseDown = function(e)
{
	e.stopPropagation();
	
	var r = e.target.getBoundingClientRect();
	//var s = e.currentTarget.getBoundingClientRect();
	
	//var x = r.left - s.left;
	//var y = r.top  - s.top;
	
	//x += e.offsetX;
	//y += e.offsetY;
	
	var offsetX = e.clientX - e.target.getBoundingClientRect().left;
	var offsetY = e.clientY - e.target.getBoundingClientRect().top;
	
	this.OnThumbPointerDown(e.pageX, e.pageY, e.clientX, e.clientY, offsetX, offsetY);
};

IcarusAudioPlayer.Slider.prototype.OnDocumentMouseMove = function(e) 
{
	this.OnDocumentPointerMove(e.pageX, e.pageY, e.clientX, e.clientY);
};

IcarusAudioPlayer.Slider.prototype.OnDocumentMouseUp = function(e)
{
  this.OnDocumentPointerUp(e.pageX, e.pageY, e.clientX, e.clientY);
}

IcarusAudioPlayer.Slider.prototype.OnThumbTouchStart = function(e)
{	
	if(e.touches.length > 2)
		return;

	e.preventDefault();

	var thumb = e.currentTarget;
	
	var offsetX = e.touches[0].clientX - thumb.getBoundingClientRect().left;
	var offsetY = e.touches[0].clientY - thumb.getBoundingClientRect().top;
	
 	this.OnThumbPointerDown(e.touches[0].pageX, e.touches[0].pageY, e.touches[0].clientX, e.touches[0].clientY, offsetX, offsetY);
};

IcarusAudioPlayer.Slider.prototype.OnThumbTouchMove = function(e)
{
	this.OnDocumentPointerMove(e.touches[0].pageX, e.touches[0].pageY, e.touches[0].clientX, e.touches[0].clientY);
};

IcarusAudioPlayer.Slider.prototype.OnThumbTouchEnd = function(e)
{
	this.OnDocumentPointerUp(e.changedTouches[0].pageX, e.changedTouches[0].pageY, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
}

IcarusAudioPlayer.Slider.prototype.dragStarted = false;

IcarusAudioPlayer.Slider.prototype.dragInitialPageX   = -1;
IcarusAudioPlayer.Slider.prototype.dragInitialPageY   = -1;
IcarusAudioPlayer.Slider.prototype.dragInitialClientX = -1;
IcarusAudioPlayer.Slider.prototype.dragInitialClientY = -1;
IcarusAudioPlayer.Slider.prototype.dragInitialOffsetX = -1;
IcarusAudioPlayer.Slider.prototype.dragInitialOffsetY = -1;

IcarusAudioPlayer.Slider.prototype.dragInitialValue = -1; //not a good sentinel, could actually happen

IcarusAudioPlayer.Slider.prototype.OnThumbPointerDown = function(pageX, pageY, clientX, clientY, offsetX, offsetY)
{	
	this.dragStarted = false;
	this.dragInitialPageX   = pageX;
	this.dragInitialPageY   = pageY;
	this.dragInitialClientX = clientX;
	this.dragInitialClientY = clientY;
	this.dragInitialOffsetX = offsetX;
	this.dragInitialOffsetY = offsetY;
	this.dragInitialValue = this.value;
};

IcarusAudioPlayer.Slider.prototype.OnDocumentPointerMove = function(pageX, pageY, clientX, clientY)
{ 
	if( this.dragInitialPageX == -1 )
		return;

	var deltaPixelX = pageX - this.dragInitialPageX;
	var deltaPixelY = pageY - this.dragInitialPageY;
	  
 	if( this.dragStarted ) 
 	{
 		this.value = this.fDragValue? this.fDragValue(pageX, pageY, clientX, clientY, deltaPixelX, deltaPixelY, this.dragInitialOffsetX, this.dragInitialOffsetY, this.dragInitialValue, this.max)
 				                    : this.dragInitialValue;
 		
 		//typical linear slider.
 		//var r = this.eTrack.getBoundingClientRect();
 		//var span = this.orientation == "horz"? r.right - r.left : r.bottom - r.top;
 		//var x = deltaPixel / span;
 		//this.value = (x * this.max) + this.dragInitialValue; //no because might not be linear.  pass that in.
 		
 		this.value = Math.max(0, Math.min(this.value, this.max));
 		
		this.SetThumbPosition();
	
		if( this.fDragUpdate ) 
			this.fDragUpdate();
 	}
 	
 	else if( Math.sqrt(deltaPixelX * deltaPixelX + deltaPixelY * deltaPixelY) ) 
 	{
		this.dragStarted = true;
		
		if( this.fDragBegin ) 
			this.fDragBegin();
 	}


};

IcarusAudioPlayer.Slider.prototype.OnDocumentPointerUp = function(pageX, pageY, clientX, clientY)
{
	if( this.dragInitialPageX != -1 )
  	{
		if( this.dragStarted )
    	{ 	
			this.dragStarted = false;
			
			if( this.fDragEnd ) 
				this.fDragEnd();
    	}

	    else
	    {
	    	if( this.fClick ) 
	    		this.fClick();
	    }

	    this.dragInitialPageX = -1;
	    this.dragInitialPageY = -1;
	    this.dragInitialClientX = -1;
	    this.dragInitialClientY = -1;
	    this.dragInitialOffsetX = -1;
	    this.dragInitialOffsetY = -1;
 	}
};



//----------------------------------------------------


/*
IcarusAudioPlayer.Slider.prototype.AddMarker = function(markerPoint, name, secs)
{
	this.trackGroup.appendChild(markerPoint);
	
	var x = secs / this.secsDuration;
	
	var ta = this.GetTrackStart();
	var tb = this.GetTrackEnd();
	
	var px = ((tb-ta)*x) + ta;
		
	if( this.orientation == "horz" ) 
	{
		markerPoint.x.baseVal.value = px;
		
		markerPoint.y.baseVal.value = this.line.y1.baseVal.value;
	}
		
	else
		markerPoint.y.baseVal.value = px;
	
}

*/










IcarusAudioPlayer.Slider.prototype.OnContainerMouseDown = function(e)
{
	//e.stopPropagation();
	
	//this.OnContainerPointerDown(e.screenX, e.screenY, e.offsetX, e.offsetY);
};

IcarusAudioPlayer.Slider.prototype.OnContainerTouchStart = function(e)
{
	//if(e.touches.length > 2)
	//	return;

	//e.preventDefault();

 	//this.OnContainerPointerDown(e.touches[0].screenX, e.touches[0].screenY, e.touches[0].clientX - this.eContainer.getBoundingClientRect().left, e.touches[0].clientY - this.eContainer.getBoundingClientRect().top, 0 );
  
  
};

/*

IcarusAudioPlayer.Slider.prototype.OnContainerPointerDown = function(screenX, screenY, offsetX, offsetY, flags)
{	
	var x = (offsetX - this.GetThumbPixelWidth()/ 2) / this.GetTrackPixelWidth();
	
	x = Math.max(0, Math.min(1, x));
	
	var s = x * this.secsDuration;
	
	this.afterCast.SetPlaybackSec(s);
};
*/














