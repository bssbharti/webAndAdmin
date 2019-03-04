import { Component, OnInit,  Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { CommonService } from '../../service/common.service';
@Component({
  selector: 'app-story-poster-item',
  templateUrl: './story-poster-item.component.html',
  styleUrls: ['./story-poster-item.component.scss']
})
export class StoryPosterItemComponent implements OnInit {
  @Input() data: any;
  public show:any;
  urlval:any;
  ActiveColor:boolean = true;
  
  constructor(public sanitizer: DomSanitizer, public commonServ : CommonService,) {
  }

  ngOnInit() {
	  //console.log(this.data)
	  this.urlval = this.sanitizer.bypassSecurityTrustResourceUrl("http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/story/renderPage?id="+this.data._id);
  }

  urlcorrect(val){
    let url =  this.sanitizer.bypassSecurityTrustResourceUrl(val);  //encodeURI(val)
    return val;
  }
  changeColor(val){
    console.log(val)
    this.ActiveColor = val;
  }

  ngDoCheck(){
    // console.log(this.commonServ.activeAudio)
    if(this.commonServ.activeAudio && this.commonServ.activeAudio !== this.data._id)
      this.hidePlayer();
  }

  showPlayer=(id)=>  {
    //this.commonServ.activePlayer(id);
    this.show = id;
  }
  hidePlayer=()=> {
    this.show = false;
    if((<any>window).player !== "undefined") 
    (<any>window).player.audio.Pause(); /* */
  }
}