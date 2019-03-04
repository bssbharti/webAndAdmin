
IcarusAudioPlayer.Main = function(ui, container, assetsPath, posterPath, displayName)
{
	this.ui = ui;
	this.container = container;
	
	this.arrMarkerInfo = [];
	
	var self = this;
	
	this.svg = new IcarusAudioPlayer.SVG(function()
	{
		self.container.appendChild( self.svg.OnlyElement("main") );
		
		var sharePanel = document.createElement("div");
		sharePanel.classList.add("playerShare");
		self.container.appendChild(sharePanel);
		self.share = new IcarusAudioPlayer.Share(self, sharePanel, assetsPath, posterPath, displayName);
		
		var infoPanel = document.createElement("div");
		infoPanel.classList.add("playerInfo");
		self.container.appendChild(infoPanel);
		self.info = new IcarusAudioPlayer.Info(self, infoPanel);
		
		
		//--------------------------------------------- 
		self.svg.CreateActor("main", "bg", "#Rectangle_530");
		self.svg.Style("bg", "fill", "none");
		
		
		
		self.svg.CreateActor("main", "poster_close", "#times-solid", 0, 0, true);
		
		if( posterPath != null ) 
		{
			self.svg.AddEventListener("poster_close", "click", function()		
			{
				ui.Flip(true, 2);
				ui.iap.audio.Pause();
			});
			
			
			/*
			self.nameDiv = document.createElement("div");
			self.nameDiv.classList.add("mainNameContainer");
			container.appendChild(self.nameDiv);
			
			var span = document.createElement("span");
			span.innerText = displayName;
			span.classList.add("mainName");
			self.nameDiv.appendChild(span);
			*/
		}
		
		else
			self.svg.Style("poster_close", "display", "none");
		
		self.svg.CreateActor("main", "play", "#Path_164", 0, 0, 1);
		self.svg.CreateActor("main", "pause", "#g1085-9", 0, 0, 1);
		
		self.svg.CreateActor("main", "rewind15", "#rewind_15_seconds", 0, 0, 1);
		self.svg.CreateActor("main", "forward15", "#forward_15_seconds", 0, 0, 1);
		
		self.svg.AddEventListener("rewind15", "click", function()		
		{
			self.ui.iap.audio.SetPositionSecs(self.ui.iap.audio.GetPositionSecs()-15);
		});
		
		self.svg.AddEventListener("forward15", "click", function()		
		{
			self.ui.iap.audio.SetPositionSecs(self.ui.iap.audio.GetPositionSecs()+15);
		});
		
		self.svg.AddHoverListener("rewind15", function(id, over)
		{
			var col =  "white";
			
			self.svg.StyleEx(id, "fill", "fill", over? "rgb(204, 0, 0)" : col);
			self.svg.StyleEx(id, "stroke", "stroke", over? "rgb(204, 0, 0)" : col);
		});
		
		self.svg.AddHoverListener("forward15", function(id, over)
		{
			var col= "white";
			
			self.svg.StyleEx(id, "fill", "fill", over? "rgb(204, 0, 0)" : col);
			self.svg.StyleEx(id, "stroke", "stroke", over? "rgb(204, 0, 0)" : col);
		});

		
		self.svg.CreateActor("main", "timeEndMins", "#_6");
		self.svg.CreateActor("main", "timeEndSecs10", "#_0");
		self.svg.CreateActor("main", "timeEndSecs01", "#_0-2");
		
		self.svg.CreateActor("main", "timeStartMins", "#_4");
		self.svg.CreateActor("main", "timeStartSecs10", "#_0-3");
		self.svg.CreateActor("main", "timeStartSecs01", "#_0-4");
		
		self.svg.CreateActor("main", "tick0", "#Path_1");
		
		var j = 1;
		for(var i = 144 ; i >= 88 ; i--, j++)
			self.svg.CreateActor("main", "tick" + j, "#Path_" + i);
		
		for(var i = 87 ; i >= 73 ; i--, j++)
			self.svg.CreateActor("main", "tick" + j, "#Path_" + i); 
		
		for(var i = 72 ; i >= 2 ; i--, j++)
			self.svg.CreateActor("main", "tick" + j, "#Path_" + i); 


		self.svg.CreateActor("main", "markerExample1", "#marker_circle_8x8", -18, 27, 3);
		self.svg.CreateActor("main", "markerExample2", "#marker_circle_8x8-2", 0, 0, 3);
		
		self.svg.Style("markerExample1", "display", "none");
		self.svg.Style("markerExample2", "display", "none");
		
		
		
		self.svg.CreateActor("main", "share", "#share_button", 0, 0, 1);
		self.svg.CreateActor("main", "share_border", "#share_border", 0, 0, 0);
		
		self.svg.AddEventListener("share", "click", function()		
		{
			if( self.nameDiv ) 
				self.nameDiv.style.visibility = "hidden";
			
			self.share.Open();
			
			self.SetShareButtonHighlight(false);
		});
		
		self.svg.AddHoverListener("share", function(id, over)
		{
			self.SetShareButtonHighlight(over);
		});
		
		self.svg.AddEventListener("play", "click", function()		
		{
			self.SetAction("play");
		});
		
		self.svg.AddEventListener("pause", "click", function()
		{
			self.SetAction("pause");
		});
		

		self.svg.CreateActor("main", "playpoint", "#live_point", 16, 22 /*10, -10*/);
	 	self.svg.CreateActor("main", "timeline", "#timeline");
		
		self.slider = new IcarusAudioPlayer.Slider( self.svg.OnlyElement("timeline"));
		self.slider.fDragUpdate = function()
		{
			self.ui.iap.audio.SetPositionSecs(self.slider.value);
		}
		self.slider.fSetThumbPos = function(value, max)
		{
			var p = self.CalcIdentityClockPosition(value, 27.5, 0, 0, 0);
			
			self.svg.Translate("playpoint", p.x , p.y);			
		}
		self.slider.fDragValue = function(pageX, pageY, clientX, clientY, deltaPixelX, deltaPixelY, offsetX, offsetY, initialValue, max)
		{
			var b = self.svg.OnlyElement("timeline").getBoundingClientRect();
			
			var c = self.svg.OnlyElement("playpoint").getBoundingClientRect();
			offsetX -= (c.right-c.left) / 2;
			offsetY -= (c.bottom-c.top) / 2;
			
			clientX -= offsetX;
			clientY -= offsetY;
			
			var px = clientX - (((b.right  - b.left)/2) + b.left);
			var py = clientY - (((b.bottom - b.top) /2) + b.top);

			var r = (Math.PI*2) - (Math.atan2(px, py) + Math.PI);
			
			r =  r / (Math.PI*2);
			
			r *= max;

			return r;
		}
		self.svg.AddEventListener("playpoint", "mousedown",  function(e) { self.slider.OnThumbMouseDown(e);  } );
		self.svg.AddEventListener("playpoint", "touchstart", function(e) { self.slider.OnThumbTouchStart(e); } );
		self.svg.AddEventListener("playpoint", "touchmove",  function(e) { self.slider.OnThumbTouchMove(e);  } );
		self.svg.AddEventListener("playpoint", "touchend",   function(e) { self.slider.OnThumbTouchEnd(e);   } );
		
		
		self.SetAction("pause");
		
		self.SelfReady();
		
	}, false);
	
	this.svg.AddSVG("main", assetsPath + "main.svg");
	

}

IcarusAudioPlayer.Main.prototype.SetShareButtonHighlight = function(over)
{
	if( this.nameDiv ) 
		this.nameDiv.style.visibility = this.share.IsOpen()? "hidden" :"visible";
	
	if( this.share.IsOpen() )
		over  = true;
	
	this.svg.Style("share_border", "stroke", over?"rgb(204, 0, 0)" : "rgb(179, 179, 179)");
	this.svg.Style("share_border", "fill", over? "rgb(204, 0, 0)" : "none");
}


IcarusAudioPlayer.Main.prototype.nameDiv = null;

IcarusAudioPlayer.Main.prototype.ui = null;
IcarusAudioPlayer.Main.prototype.container = null;

IcarusAudioPlayer.Main.prototype.svg = null;


IcarusAudioPlayer.Main.prototype.selfReady = false;

IcarusAudioPlayer.Main.prototype.SelfReady = function()
{
	this.selfReady = true;
	
	if( this.selfReady && this.shareReady && this.infoReady ) 
		this.ui.MainReady();
}

IcarusAudioPlayer.Main.prototype.share = null;
IcarusAudioPlayer.Main.prototype.shareReady = false;

IcarusAudioPlayer.Main.prototype.ShareReady = function()
{
	this.shareReady = true;
	
	if( this.selfReady && this.shareReady && this.infoReady ) 
		this.ui.MainReady();
}


IcarusAudioPlayer.Main.prototype.info = null;
IcarusAudioPlayer.Main.prototype.infoReady = false;

IcarusAudioPlayer.Main.prototype.InfoReady = function()
{
	this.infoReady = true;
	
	if( this.selfReady && this.shareReady && this.infoReady ) 
		this.ui.MainReady();
}

IcarusAudioPlayer.Main.prototype.SetAction = function(action)
{
	if( action == "play") 
	{
		this.svg.Style("pause", "visibility", "visible", true);
		this.svg.Style("play", "visibility", "hidden", true);
		
		this.ui.iap.audio.Play();
	}
	
	else if( action == "pause") 
	{
		this.svg.Style("pause", "visibility", "hidden", true);
		this.svg.Style("play", "visibility", "visible", true);
		
		this.ui.iap.audio.Pause();
	}
	
}


IcarusAudioPlayer.Main.prototype.UpdateTimeText = function()
{
	function PadDigits(d, len)
	{
		var str = "" + d;
		
		while(str.length < len )
			str = "0" + str;
		
		return str;
	}
	
	var end   = this.secsDuration - this.secsPosition;
	var start = this.secsPosition;
	
	var startMins = Math.floor( start / 60.0 );
	var endMins   = Math.floor( end   / 60.0 );
	start -= (startMins * 60);
	end   -= (endMins   * 60);
	
	var startSecsTens = Math.floor( start / 10.0);
	var endSecsTens   = Math.floor( end   / 10.0);
	start -= (startSecsTens * 10.0);
	end   -= (endSecsTens   * 10.0);
	
	var startSecsOnes = Math.floor( start );
	var endSecsOnes   = Math.floor( end );
	
	this.svg.ElementTextSet("timeStartMins",   "" + PadDigits( startMins, 1) );
	this.svg.ElementTextSet("timeStartSecs10", "" + startSecsTens);
	this.svg.ElementTextSet("timeStartSecs01", "" + startSecsOnes);
	
	this.svg.ElementTextSet("timeEndMins",   "" + PadDigits( endMins, 1) );
	this.svg.ElementTextSet("timeEndSecs10", "" + endSecsTens);
	this.svg.ElementTextSet("timeEndSecs01", "" + endSecsOnes);

}

IcarusAudioPlayer.Main.prototype.UpdateTimeTicks = function()
{
	//playback text turns red at some point.  when playing?  when non-zero?
	//red circle follows playback position
	
	var tickIndex = Math.floor( (this.secsPosition / this.secsDuration) * 144.0);
	
	if( isNaN(tickIndex) ) //zero length;
		tickIndex = -1;
	
	var i = 0;
	for( ; i < tickIndex ; i++)
		this.svg.Style("tick" + i, "fill", "rgb(204, 0, 0)");
		
	for( ; i < 144 ; i++)
		this.svg.Style("tick" + i, "fill", "#d1d1d1");
	
	for(var i = 0 ; i < this.arrMarkerInfo.length ; i++)
	{
		var mi = this.arrMarkerInfo[i];
		
		this.svg.Style(mi.markerId, "fill", this.secsPosition > mi.secs? "rgb(204, 0, 0)" : "#d1d1d1");
		
		
	}
	
	
	
}

IcarusAudioPlayer.Main.prototype.UpdateTimeTicksLoaded = function()
{	
	var tickIndex = Math.floor( (this.secsLoaded / this.secsDuration) * 144.0);
	
	if( isNaN(tickIndex) || tickIndex == Number.POSITIVE_INFINITY ) //zero length;
		tickIndex = -1;
	
	//console.log(this.secsLoaded + ", " + this.secsDuration);
	
	var i = 0;
	for( ; i < tickIndex ; i++)
		this.svg.Style("tick" + i, "opacity", "1");
	
	for( ; i < 144 ; i++)
		this.svg.Style("tick" + i, "opacity", "0.3");
	
	
	
}


IcarusAudioPlayer.Main.prototype.secsDuration = 0;
IcarusAudioPlayer.Main.prototype.secsPosition = 0;
IcarusAudioPlayer.Main.prototype.secsLoaded   = 0;


IcarusAudioPlayer.Main.prototype.OnAudioLoadedChange = function(secsLoaded)
{
	this.secsLoaded = secsLoaded;
	
	this.UpdateTimeTicksLoaded();
}

IcarusAudioPlayer.Main.prototype.OnAudioDurationChange = function(secsDuration)
{
	this.secsDuration = secsDuration;
	
	this.UpdateTimeText();
	this.UpdateTimeTicks();
	this.UpdateTimeTicksLoaded();
	
	this.slider.SetMax(secsDuration);
}
	
IcarusAudioPlayer.Main.prototype.OnAudioPositionChange = function(secsPosition)
{
	this.secsPosition = secsPosition;
	
	this.UpdateTimeText();
	this.UpdateTimeTicks();
	
	this.slider.SetValue(secsPosition);
}



IcarusAudioPlayer.Main.prototype.CalcIdentityClockPosition = function(secs, r, dx, dy)
{
	var x = secs / this.slider.max;
			
	x *= Math.PI * 2.0;
			
	var px =  Math.sin(x);
	var py = -Math.cos(x);
	
	px *= r;
	py *= r;
	
	px += dx;
	py += dy;
	
	return { x: px, y: py };
}

IcarusAudioPlayer.Main.prototype.OnMarkersUpdated = function()
{
	for(var i = 0 ; i < this.ui.iap.tags.arrMarkers.length ; i++)
	{
		var info = this.ui.iap.tags.arrMarkers[i];
		
		this.AddMarker(info.name, info.comment, info.secs);
	}
}

IcarusAudioPlayer.Main.prototype.arrMarkerInfo = null;

IcarusAudioPlayer.Main.prototype.AddMarker = function(name, comment, secs)
{
	var markerId = this.svg.CloneActor("markerExample1", null);
	
	this.arrMarkerInfo.push( {secs:secs, markerId:markerId } );
	
	var p = this.CalcIdentityClockPosition(secs, 32, 0.5, 0.5);
	this.svg.Translate(markerId, p.x , p.y);		
	
	this.svg.Style(markerId, "display", "inline");
	//this.svg.Style(markerId, "fill", "green");
	
	var self = this;
	
	if( ! this.svg.HasTouch() ) 
	{
	
		this.svg.AddEventListener(markerId, "mouseenter", function()
		{
			self.info.Open(name, comment);	
		});
		
		this.svg.AddEventListener(markerId, "mouseleave", function()
		{
			self.info.Close();	
		});
	
	}
	
	this.svg.AddEventListener(markerId, "touchstart", function(e)
	{
		e.preventDefault();
		
		self.ui.iap.audio.SetPositionSecs( secs );
		self.info.Open(name, comment, 4);
		
		//alert("dfgdg");
		
	});
	
	this.svg.AddEventListener(markerId, "click", function()
	{
		//self.info.Open(name, comment);	
		
		self.ui.iap.audio.SetPositionSecs( secs );
	});
	
		
}

IcarusAudioPlayer.Main.prototype.Share = function(service)
{
	var url = IcarusAudioPlayer.Share.ByServiceMinimum(service, /*"http://www.google.com"*/ document.location.href, "Icarus Audio Player", "Check this out");
	
	IcarusAudioPlayer.Share.OpenShareService(service, url);
}






