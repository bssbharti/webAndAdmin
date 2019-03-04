
IcarusAudioPlayer.Share = function(main, container, assetsPath, posterPath, displayName)
{
	this.main = main;
	this.container = container;
		
	if( posterPath ) 
	{
		this.container.style.backgroundImage = "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.6) 100%), " + "url('" + posterPath + "')";
	}
	
	var self = this;
	this.svg = new IcarusAudioPlayer.SVG(function()
	{
		self.container.appendChild( self.svg.OnlyElement("share_panel") );
		
		
		if( posterPath )
		{
			self.svg.CreateActor("share_panel", "bg", "#Rectangle_530");
			self.svg.Style("bg", "fill", "none");
		
			self.svg.CreateActor("share_panel", "bg2", "#Rectangle_537");
			self.svg.Style("bg2", "fill", "none");
		}
		
		
		self.svg.CreateActor("share_panel", "shareFacebook", "#Group_31", 0, 0, 1);
		self.svg.CreateActor("share_panel", "shareLinkedIn", "#Group_30", 0, 0, 1);
		self.svg.CreateActor("share_panel", "shareTwitter",  "#Group_32", 0, 0, 1);
		self.svg.CreateActor("share_panel", "shareEmail", 	"#g3280", 0, 0, 1);
		self.svg.CreateActor("share_panel", "shareLink", 	"#g3289", 0, 0, 1);
		self.svg.CreateActor("share_panel", "shareEmbed", 	"#g3296", 0, 0, 1);
		self.svg.CreateActor("share_panel", "shareDownload", 	"#g3303", 0, 0, 1);
		self.svg.CreateActor("share_panel", "linkcopied", 	"#tspan291", 0, 0, 1);	//get BBox fails on firefox.  not implemented for span?
		self.svg.CreateActor("share_panel", "close", 	"#times-solid-2", 0, 0, 2);
		
		
		
		//self.svg.Style("share_panel", "opacity", 0);
		
		//self.svg.Style("share_panel", "display", "none");
		self.svg.Style("linkcopied", "display", "none");
		
		
		self.svg.AddEventListener("shareFacebook", "click", function() { self.Share("facebook"); } );
		self.svg.AddEventListener("shareLinkedIn", "click", function() { self.Share("linkedin"); } );
		self.svg.AddEventListener("shareTwitter",  "click", function() { self.Share("twitter");  } );
		self.svg.AddEventListener("shareEmail",    "click", function() { self.Share("email");    } );
		self.svg.AddEventListener("shareLink",    "click", function() { self.ShareLink();    } );
		self.svg.AddEventListener("shareEmbed",    "click", function() { self.ShareEmbed();    } );
		self.svg.AddEventListener("shareDownload",    "click", function() { self.ShareDownload();    } );
		self.svg.AddEventListener("close",   	 "click", function() { self.Close();    } );
		
		/*
		self.slogan = document.createElement("div");
		container.appendChild(self.slogan);
		self.slogan.classList.add("shareSlogan");
		self.slogan.innerText = displayName;
		*/
		self.Close();
		
		main.ShareReady();
		
	}, false);
	
	this.svg.AddSVG("share_panel", 	assetsPath + "share.svg");
	
	
	
}

IcarusAudioPlayer.Share.prototype.ui = null;


IcarusAudioPlayer.Share.prototype.container = null;

IcarusAudioPlayer.Share.prototype.svg = null;

IcarusAudioPlayer.Share.prototype.IsOpen = function()
{
	return this.container.style.opacity != 0.0;
}

IcarusAudioPlayer.Share.prototype.Close = function()
{
	
	
	//this.svg.Style("share_panel", "display", "none");
	
//	self.svg.Style("share_panel", "opacity", 0);
	//self.svg.Style("share_panel", "pointerEvents", "none");
	
	this.container.style.opacity = 0.0;
	this.container.style.pointerEvents = "none";
	
	this.svg.Style("linkcopied", "display", "none");
	
	this.main.SetShareButtonHighlight(false);
	
	if( this.openFromPoster ) 
	{
		this.openFromPoster = false;
		this.main.ui.Flip(true, 1);
	}
}

IcarusAudioPlayer.Share.prototype.openFromPoster = false;

IcarusAudioPlayer.Share.prototype.Open = function(openFromPoster)
{
	this.Close();
	
	this.openFromPoster = openFromPoster;
	
//	this.svg.Style("share_panel", "display", "block");
	
	//self.svg.Style("share_panel", "opacity", 1.0);
	//self.svg.Style("share_panel", "pointerEvents", "auto");
	
	this.container.style.opacity = 1.0;
	this.container.style.pointerEvents = "auto";
	
	
}





IcarusAudioPlayer.Share.prototype.Share = function(service)
{
	var url = IcarusAudioPlayer.ShareLinks.ByServiceMinimum(service, /*"http://www.google.com"*/ document.location.href, "Icarus Audio Player", "Check this out");
	
	IcarusAudioPlayer.ShareLinks.OpenShareService(service, url);
}

IcarusAudioPlayer.Share.prototype.ShareLink = function()
{
	IcarusAudioPlayer.ShareLinks.CopyToClipboard(document.location.href);
	
	this.svg.Style("linkcopied", "display", "inline-block");
	this.svg.ElementTextSet("linkcopied", "Link copied.");
}

IcarusAudioPlayer.Share.prototype.ShareEmbed = function()
{
	var str = '<iframe scrolling="no" style="overflow:hidden;height:490px;border:none" src="icarus-audio-player/embeddable.html?item=example1"></iframe>';
	
	IcarusAudioPlayer.ShareLinks.CopyToClipboard(str);
	
	this.svg.Style("linkcopied", "display", "inline-block");
	this.svg.ElementTextSet("linkcopied", "HTML copied.");
}

IcarusAudioPlayer.Share.prototype.ShareDownload = function()
{
	IcarusAudioPlayer.ShareLinks.Download( this.main.ui.iap.audioSrc , "download.mp3");
}












