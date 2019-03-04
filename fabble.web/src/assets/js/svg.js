
IcarusAudioPlayer.SVG = function(callbackReady, debug)
{
	this.callbackReady = callbackReady;
	this.debug = debug;
	
	this.dictIdToArrActors = {};
	this.dictSVG = {};	
}

IcarusAudioPlayer.SVG.prototype.AddSVG = function(svgId, path)
{
	this.dictSVG[svgId] = null;
	
	var self = this;
	
	IcarusAudioPlayer.Load(svgId, "GET", path, "text", function(svgId, result, errorText)
	{ 
		if( errorText != null ) 
			console.log(errorText);
	
		else if( result != null )
		{
			var nodes = new DOMParser().parseFromString(result, 'text/xml').documentElement;
					
			self.dictSVG[svgId] = document.adoptNode(nodes,true); 
			
			self.CreateActor(svgId, null, null, 0, 0, false);
			
			for(var svgId in self.dictSVG)
			{
				var svg = self.dictSVG[svgId];
				
				if( svg == null ) 
					return;
			}
			
			self.callbackReady();
		}
	});
	
}

IcarusAudioPlayer.SVG.prototype.callbackReady = null;

IcarusAudioPlayer.SVG.prototype.dictSVG = null;

IcarusAudioPlayer.SVG.prototype.dictIdToArrActors = null;

IcarusAudioPlayer.SVG.prototype.BuildActor = function(element, offsetTranslateX, offsetTranslateY, boundingBoxMul, arrActors)
{
	arrActors.push( new IcarusAudioPlayer.SVG.Actor(element, offsetTranslateX, offsetTranslateY, false) );
	
	if( boundingBoxMul  )
	{
		if( document.contains && ! document.contains(element) )
			throw new Error("Needs to be attached for calculations");
		
		if ( element && element.getBBox && element.getAttributeNS)
	    {   
			var box;
			
			try
			{box = element.getBBox(); }
			catch(err)
			{
				return;
			}
			
			if (box.x && box.y && box.width && box.height ) //only when on screen
			{
				var hw = box.width/2;
				var hh = box.height/2
				
				var cx = box.x + hw;
				var cy = box.y + hh;
				
				var bw = 2 * hw * boundingBoxMul;
				var bh = 2 * hh * boundingBoxMul;
				var bx = cx - hw * boundingBoxMul;
				var by = cy - hh * boundingBoxMul;
				
				
				var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
				rect.setAttributeNS(null, 'x', bx);
				rect.setAttributeNS(null, 'y', by);
				rect.setAttributeNS(null, 'width', bw);
				rect.setAttributeNS(null, 'height', bh);
				rect.setAttributeNS(null, 'fill',   this.debug? 'yellow' : 'rgba(0,0,0,0)');
				rect.setAttributeNS(null, 'stroke', this.debug? 'orange' : 'rgba(0,0,0,0)');
				
				var transform = element.getAttributeNS(null, 'transform');
				
				if( transform ) 
					rect.setAttributeNS(null, 'transform', transform);
				 
				element.parentNode.appendChild(rect);
				
				arrActors.push( new IcarusAudioPlayer.SVG.Actor(rect, offsetTranslateX, offsetTranslateY, true) );
			}
		}    
	}
	
}

IcarusAudioPlayer.SVG.prototype.CreateActor = function(svgId, id, querySelector, offsetTranslateX, offsetTranslateY, boundingBoxMul)
{
	offsetTranslateX = offsetTranslateX || 0;
	offsetTranslateY = offsetTranslateY || 0;
	
	var svg = this.dictSVG[svgId];
	
	if( ! svg ) 
		throw new Error("");
	
	var arrActors = [];
	
	if( id == null ) 
	{
		id = svgId;
		this.BuildActor(svg, offsetTranslateX, offsetTranslateY, boundingBoxMul, arrActors);
	}
	
	else
	{
		if( ! ( querySelector instanceof Array) )
			querySelector = [querySelector];
		
		for(var i = 0 ; i < querySelector.length ; i++)
		{
			var element = svg.querySelector(querySelector[i]);
	
			if( ! element ) 
				throw new Error("");
			
			this.BuildActor(element, offsetTranslateX, offsetTranslateY, boundingBoxMul, arrActors);
		}
	}
	
	this.dictIdToArrActors[id] = arrActors;
	
	return this;
}

IcarusAudioPlayer.SVG.ID_COUNTER = 0;

IcarusAudioPlayer.SVG.prototype.CloneActor = function(id, newId)
{
	if( newId == null ) 
		newId = "auto-id-" + (++IcarusAudioPlayer.SVG.ID_COUNTER);
	
	var arrOldActors = this.dictIdToArrActors[id];
	
	var arrNewActors = [];
	
	for(var i = 0 ; i < arrOldActors.length ; i++)
	{
		var oldActor = arrOldActors[i];
		
		var newElement = oldActor.element.cloneNode(true);
		
		//oldActor.element.parentNode.appendChild(newElement);
		oldActor.element.parentNode.insertBefore(newElement, oldActor.element);
	
		var newActor = new IcarusAudioPlayer.SVG.Actor(newElement, oldActor.offsetTranslateX, oldActor.offsetTranslateY, oldActor.isBoundingBox);
	
		arrNewActors.push(newActor);
	}
	
	this.dictIdToArrActors[newId] = arrNewActors;
	
	return newId;
}

IcarusAudioPlayer.SVG.prototype.OnlyElement = function(id)
{
	var arrActors = this.dictIdToArrActors[id];
	
	if( arrActors == null || arrActors.length != 1 ) 
		throw new Error("");
	
	return arrActors[0].element;
}

IcarusAudioPlayer.SVG.prototype.Style = function(id, prop, val, includeBounds)
{
	var arrActors = this.dictIdToArrActors[id];
	
	for(var i = 0 ; i < arrActors.length ; i++)
	{
		var actor = arrActors[i];
		
		if( includeBounds || actor.isBoundingBox == false) 
			actor.element.style[prop] = val;
	}
		
}

IcarusAudioPlayer.SVG.prototype.Prop = function(id, prop, val)
{
	var arrActors = this.dictIdToArrActors[id];
	
	for(var i = 0 ; i < arrActors.length ; i++)
	{
		var actor = arrActors[i];
		
		if( actor.isBoundingBox == false) 
		{
			
				actor.element.setAttribute(prop, val);
		}
			
	}
		
}

IcarusAudioPlayer.SVG.prototype.StyleExElement = function(element, propCond, propSet, valSet)
{
	if( ! element.style ) 
		return;
	
	var v = element.style[propCond];
	
	if( v != null && v != "" &&  v != "none" )
		element.style[propSet] = valSet;
	
	//for(var i = 0 ; i < element.children.length ; i++ )
		//this.StyleExElement(element.children[i], propCond, propSet, valSet);
	
	for(var i = 0 ; i < element.childNodes.length ; i++ )
		if( element.childNodes[i].nodeType == Node.ELEMENT_NODE ) 
			this.StyleExElement(element.childNodes[i], propCond, propSet, valSet);
}

IcarusAudioPlayer.SVG.prototype.StyleExElement2 = function(element, propCond, valCond, propSet, valSet)
{
	if( ! element.style ) 
		return;
	
	var v = element.style[propCond];
	
	if( v == valCond ) 
		element.style[propSet] = valSet;
	
	//for(var i = 0 ; i < element.children.length ; i++ )
		//this.StyleExElement(element.children[i], propCond, propSet, valSet);
	
	for(var i = 0 ; i < element.childNodes.length ; i++ )
		if( element.childNodes[i].nodeType == Node.ELEMENT_NODE ) 
			this.StyleExElement(element.childNodes[i], propCond, propSet, valSet);
}

IcarusAudioPlayer.SVG.prototype.StyleEx = function(id, propCond, propSet, valSet)
{
	var arrActors = this.dictIdToArrActors[id];
	
	for(var i = 0 ; i < arrActors.length ; i++)
	{
		var actor = arrActors[i];
		
		if( actor.isBoundingBox == false) 
			this.StyleExElement(actor.element, propCond, propSet, valSet);
	}
		
}

IcarusAudioPlayer.SVG.prototype.StyleEx2 = function(id, propCond, valCond, propSet, valSet)
{
	var arrActors = this.dictIdToArrActors[id];
	
	for(var i = 0 ; i < arrActors.length ; i++)
	{
		var actor = arrActors[i];
		
		if( actor.isBoundingBox == false) 
			this.StyleExElement2(actor.element, propCond, valCond, propSet, valSet);
	}
		
}

IcarusAudioPlayer.SVG.prototype.AddEventListener = function(id, name, func)
{
	var arrActors = this.dictIdToArrActors[id];
	
	for(var i = 0 ; i < arrActors.length ; i++)
		arrActors[i].element.addEventListener(name, func);
}

IcarusAudioPlayer.SVG.prototype.HasTouch = function()
{
    return 'ontouchstart' in document.documentElement
           || navigator.maxTouchPoints > 0
           || navigator.msMaxTouchPoints > 0;
}


IcarusAudioPlayer.SVG.prototype.AddHoverListener = function(id, func)
{
	if( this.HasTouch() ) 
		return;
	
	var funcHover = function(e)
	{
		func(id, e.type == "mouseenter");
	};
	
	this.AddEventListener(id, "mouseenter", funcHover);
	this.AddEventListener(id, "mouseleave", funcHover);
	
	
}

IcarusAudioPlayer.SVG.prototype.ElementTextSet = function(id, val)
{
	var arrActors = this.dictIdToArrActors[id];
	
	for(var i = 0 ; i < arrActors.length ; i++)
		arrActors[i].ElementTextSet(val);
}

IcarusAudioPlayer.SVG.prototype.Translate = function(id, x, y)
{
	var arrActors = this.dictIdToArrActors[id];
	
	for(var i = 0 ; i < arrActors.length ; i++)
		arrActors[i].Translate(x, y);
}

IcarusAudioPlayer.SVG.prototype.PathData = function(id, d)
{
	var arrActors = this.dictIdToArrActors[id];
	
	for(var i = 0 ; i < arrActors.length ; i++)
		arrActors[i].PathData(d);
}

//------------------------------------------------

//https://stackoverflow.com/questions/10349811/how-to-manipulate-translate-transforms-on-a-svg-element-with-javascript-in-chrom

IcarusAudioPlayer.SVG.Actor = function(element, offsetTranslateX, offsetTranslateY, isBoundingBox)
{
	this.element = element;
	this.isBoundingBox = isBoundingBox;
	var svg = this.element.ownerSVGElement || this.element;
	
	this.offsetTranslateX = offsetTranslateX;
	this.offsetTranslateY = offsetTranslateY;
	
	this.initialTranslateX = 0;
	this.initialTranslateY = 0;
	
	
	/*
	var transform = element.getAttribute("transform");
	
	if (transform != null ) 
	{
		var parts  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform);
		var firstX = parts[1];
    	var firstY = parts[2];
	}*/
	
	//this.transform = svg.createSVGTransform();
	
	this.initialTransform = element.getAttribute("transform") || "";
	
	//this.transform = new SVGTransform();
	
	//if( element.transform == null ) 
	//{
		//element.setAttribute("transform", /*svg.createSVGTransform()*/ "translate(0,0)");
		
	//	element.transform = new SVGTransformList();
		//element.transform.baseVal.appendItem(this.transform);
		//var t = element.getAttribute("transform");
		
		
		//element.transform = this.transform;
	//}
		
	//element.transform.baseVal.appendItem(this.transform);
	
	//var transformList = element.transform.baseVal; // An SVGTransformList
	
	
	
	
	//var initialTransform = transformList.consolidate();
	
	//this.initialTranslateX = initialTransform.matrix.e,
	//this.initialTranslateY = initialTransform.matrix.f;
	
	/*
	
	if( xforms.length != 0 )
	{
		var firstXForm = xforms.getItem(0);       // An SVGTransform
		
		if (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE)
		{
	  		this.initialTranslateX = firstXForm.matrix.e,
	      	this.initialTranslateY = firstXForm.matrix.f;
		}
	}*/
	
//	if( addBoundingBox ) 
//		this.AddBox(debug);
}

/*
IcarusAudioPlayer.SVG.Actor.prototype.AddBox = function(debug)
{       
	if (this.element && this.element.getBBox && this.element.getAttributeNS)
    {   
		var box = this.element.getBBox();
		
		if (box.x && box.y && box.width && box.height ) //only when on screen
		{
			var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
			rect.setAttributeNS(null, 'x', box.x);
			rect.setAttributeNS(null, 'y', box.y);
			rect.setAttributeNS(null, 'width', box.width);
			rect.setAttributeNS(null, 'height', box.height);
			rect.setAttributeNS(null, 'fill',   debug? 'yellow' : 'rgba(0,0,0,0)');
			rect.setAttributeNS(null, 'stroke', debug? 'orange' : 'rgba(0,0,0,0)');
			
			var transform = this.element.getAttributeNS("http://www.w3.org/2000/svg", 'transform');
			
			if( transform ) 
				rect.setAttributeNS(null, 'transform', transform);
			 
			this.element.parentNode.appendChild(rect);
		}
	}       

};*/


IcarusAudioPlayer.SVG.Actor.prototype.isBoundingBox = false;

IcarusAudioPlayer.SVG.Actor.prototype.element = null;
//IcarusAudioPlayer.SVG.Actor.prototype.initialTranslateX = null;
//IcarusAudioPlayer.SVG.Actor.prototype.initialTranslateY = null;

IcarusAudioPlayer.SVG.Actor.prototype.transform = null;

IcarusAudioPlayer.SVG.Actor.prototype.offsetTranslateX  = null;
IcarusAudioPlayer.SVG.Actor.prototype.offsetTranslateY  = null;


IcarusAudioPlayer.SVG.Actor.prototype.ElementTextSet = function(str)
{
	this.element.textContent = str;
}

IcarusAudioPlayer.SVG.Actor.prototype.ElementLinePoint1 = function()
{
	return { x: this.element.x1.baseVal.value, y: this.element.y1.baseVal.value }
}

IcarusAudioPlayer.SVG.Actor.prototype.ElementLinePoint2 = function()
{
	return { x: this.element.x2.baseVal.value, y: this.element.y2.baseVal.value }
}

IcarusAudioPlayer.SVG.Actor.prototype.PathData = function(d)
{
	this.element.setAttribute("d", d);
}



IcarusAudioPlayer.SVG.Actor.prototype.Translate = function(dx, dy) //from position, determinted by initial pos after sub offset
{
//	var t = new SVGTransform();
	//t.setTranslate(this.offsetTranslateX + dx, this.offsetTranslateY + dy);
	
	//this.transform.setTranslate(this.initialTranslateX - this.offsetTranslateX + dx, this.initialTranslateY - this.offsetTranslateY + dy);
	
	//this.transform.setTranslate(dx - this.offsetTranslateX, dy - this.offsetTranslateY);
	
	var x = dx - this.offsetTranslateX;
	var y = dy - this.offsetTranslateY;
	
	
	this.element.setAttribute("transform", this.initialTransform + " translate(" + x + "," + y + ")");
	
	
	/*
	var x = this.initialTranslateX - this.offsetTranslateX;
	var y = this.initialTranslateY - this.offsetTranslateY;
	
	x += dx;
	y += dy;
	
	this.element.setAttribute("transform", "translate(" + x + "," + y + ")");  //myElement.transform.baseVal.getItem(0).setTranslate(30,100);
	
	*/
}

