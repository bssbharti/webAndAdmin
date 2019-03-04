


IcarusAudioPlayer.Poster = function(ui, container, assetsPath, posterPath, displayName)
{
	this.ui = ui;
	this.container = container;
	
	this.container.classList.add("posterPanel");
	
	this.container.style.backgroundImage = "url('" + posterPath + "')";
	
	//this.container.parentNode.style.transform = 'rotateY(-180deg)';
	
	var self = this;
	
	this.svg = new IcarusAudioPlayer.SVG(function()
	{
		//var img = document.createElement("img");
		//img.src = posterPath;
		
		
		//container.appendChild(img);
		
		//self.svg.CreateActor("poster_panel", "name", "#tspan28");
		//self.svg.ElementTextSet("name", displayName);
		
		
		//self.slogan = document.createElement("div");
		//container.appendChild(self.slogan);
		//self.slogan.classList.add("posterSlogan");
		
		
		
		
		
		self.container.appendChild( self.svg.OnlyElement("poster_panel") );
		
		
		self.svg.CreateActor("poster_panel", "image", "#image4");
		self.svg.Prop("image", "xlink:href", posterPath);
		
		
		self.svg.CreateActor("poster_panel", "share", "#Subtraction_3", 0, 0, 1);
		
		self.svg.AddEventListener("share", "click", function(e)		
		{
			self.ui.Flip(false, 1);
			//self.ui.main.SetAction("play");
			
			ui.main.share.Open(true);
			
			ui.main.SetShareButtonHighlight(false);
			
			e.stopPropagation();
		});
		
		
		//self.svg.CreateActor("poster_panel", "time", "#tspan32");
		
		self.svg.CreateActor("poster_panel", "play", "#g6071", 0, 0, 1);
		
		self.svg.AddEventListener("play", "click", function(e)		
		{
			self.ui.Flip(false, 2);
			self.ui.main.SetAction("play");
			
			e.stopPropagation();
		});
		
		
		self.svg.AddEventListener("poster_panel", "click", function()		
		{
			self.ui.Flip(false, 2);
			self.ui.main.SetAction("play");
		});
		
		//self.svg.CreateActor("poster_panel", "name", "#tspan28");
		//self.svg.ElementTextSet("name", displayName);
		
		/*
		self.slogan = document.createElement("div");
		container.appendChild(self.slogan);
		self.slogan.classList.add("posterSlogan");
		
		var s = document.createElement("span");
		self.slogan.appendChild(s);
		s.innerText = displayName;
		*/
		
		ui.PosterReady();
		
	}, false);
	
	this.svg.AddSVG("poster_panel", assetsPath + "poster.svg");
}

IcarusAudioPlayer.Poster.slogan = null;

IcarusAudioPlayer.Poster.prototype.ui = null;

IcarusAudioPlayer.Poster.prototype.svg = null;

IcarusAudioPlayer.Poster.prototype.FormatSecs = function(secs)
{
	function PadDigits(d, len)
	{
		var str = "" + d;
		
		while(str.length < len )
			str = "0" + str;
		
		return str;
	}
	
	var hours = Math.floor( secs / (60 * 60) ) 
	secs -= hours * 60 * 60;
	
	var mins = Math.floor( secs / 60 ) ;
	secs -= mins * 60;
	
	secs = Math.floor(secs);
	
	if( hours > 0 )
		return PadDigits(hours, 2) + ":" + PadDigits(mins, 2) + ":" + PadDigits(secs, 2);
	
	else 
		return PadDigits(mins, 2) + ":" + PadDigits(secs, 2);
}

IcarusAudioPlayer.Poster.prototype.OnAudioDurationChange = function(secsDuration)
{
	var str = this.FormatSecs(secsDuration);
	
	//this.svg.ElementTextSet("time", str);
}

