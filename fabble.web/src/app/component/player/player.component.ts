import { Component, OnInit,  Input } from '@angular/core';
declare var IcarusAudioPlayer: any;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() data: any;
  @Input() postershow:boolean;

  constructor() {}
  ngOnInit() {
    var optionItem		 = null;
		var optionPathTag    = null;
		var optionPathAudio  = null;
		var optionPathPoster = null;
		var optionScheme 	 = "default";
    var optionDisplayName= "Untitled";
    
    console.log(this.data)
    optionItem		   = "example1";
    let audiofolder = this.data.audio.split('/')[this.data.audio.split('/').length - 2];
    optionPathTag    = "./upload/storyAudio/"+audiofolder+'/'+this.data.audioName; //"../"+this.data.audio.replace(/^https?:\/\//,'');
    optionPathAudio  = this.data.audio+"?"+ Math.random(); //"https://sample-videos.com/audio/mp3/crowd-cheering.mp3?";
    optionPathPoster = this.data.posterImage;
    optionDisplayName = "The story of the most interesting man in the world";

    //console.log(optionItem && optionPathTag && optionPathAudio && optionPathPoster && optionScheme )
    if( optionItem && optionPathTag && optionPathAudio && optionPathPoster && optionScheme )
      (<any>window).player = new IcarusAudioPlayer(document.querySelector(".playerContainer"), optionPathTag, optionPathAudio, "assets/js/assets/", optionItem, this.InIframe()? optionPathPoster : null, optionDisplayName);
  }

  //play(){ console.log('play') }
  //share(){ console.log('share') }
  InIframe()
  {
      if(this.postershow)
      {
        return true;
      }
      try { return window.self !== window.top; } 
      catch(e) { 
        //console.log(e)
        return true; 
      }
  }

}
