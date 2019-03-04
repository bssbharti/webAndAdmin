
IcarusAudioPlayer.Info = function(main, container)
{
	this.main = main;
	this.container = container;
	
	this.markerPanel = document.createElement("div");
	this.markerPanel.classList.add("markerPanel");
	this.container.appendChild(this.markerPanel);

	this.markerPanelHead = document.createElement("div");
	this.markerPanel.appendChild(this.markerPanelHead);
	this.markerPanelHead.classList.add("markerPanelHead");
	
	var dot = document.createElement("span");
	dot.classList.add("dot");
	this.markerPanelHead.appendChild(dot);
	
	this.markerPanelBody = document.createElement("div");
	this.markerPanel.appendChild(this.markerPanelBody);
	this.markerPanelBody.classList.add("markerPanelBody");
	
	//var span = document.createElement("span");
	//markerPanel.appendChild(span);
	

	main.InfoReady();
}

IcarusAudioPlayer.Info.prototype.markerPanel = null;

IcarusAudioPlayer.Info.prototype.markerPanelHead = null;
IcarusAudioPlayer.Info.prototype.markerPanelBody = null;

IcarusAudioPlayer.Info.prototype.container = null;

IcarusAudioPlayer.Info.prototype.Close = function()
{
	this.markerPanel.style.opacity = 0.0;
	this.markerPanel.style.pointerEvents = "none";
	
	//this.markerPanel.style.display = "none";
}

IcarusAudioPlayer.Info.prototype.intervalId = null;

IcarusAudioPlayer.Info.prototype.Open = function(heading, text, closeSecs)
{
	this.markerPanel.style.opacity = 1.0;
	this.markerPanel.style.pointerEvents = "auto";
	
	//this.Close();
	
	//this.markerPanel.querySelector(".markerPanelHeading").querySelector("span:nth-child(2)").innerText = heading;
	this.markerPanel.querySelector(".markerPanelBody").innerText    = heading;
	
	//this.markerPanel.style.display = "block";
	
	if( closeSecs ) 
	{
		if( this.intervalId != null )
			clearTimeout(this.intervalId);
		
		var self = this;
		this.intervalId = setTimeout( function() { self.Close(); }, closeSecs * 1000); 
	}
	
}
























