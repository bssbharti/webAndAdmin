import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { trigger, state, style, animate, transition, } from '@angular/animations';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,
      })),
      state('closed', style({
        height: '0',
        opacity: 0,
      })),
      transition('open => closed', [
        animate('0.5s'),
        //style({ transform: 'translateX(-100%)' }),
      ]),
      transition('closed => open', [
        animate('0.5s'),
        //animate(100, style({ transform: 'translateX(100%)' }))
      ]),
    ]),
  ]
})
export class DetailComponent implements OnInit {
  public storyDetail:any;
  public storyList :any;
  public isOpen = false;
  public show:any = 123;
  urlval:any;
  ActiveColor:boolean = true;
  // relateStory:any;


  constructor(public sanitizer: DomSanitizer, public commonServ : CommonService, public route: ActivatedRoute,) { 
    this.commonServ.activepage = 'detail';
    
  }

  ngOnInit() {    
    this.commonServ.storyItem({},1,11, 'page');
    this.route.queryParams.subscribe(queryParams => {
      this.storyDetailFun();
      this.commonServ.relatedStoryAPI(this.route.snapshot.paramMap.get('id'));
      this.urlval = this.sanitizer.bypassSecurityTrustResourceUrl("http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/story/renderPage?id="+this.route.snapshot.paramMap.get('id'));
    });
    this.route.params.subscribe(routeParams => {
      this.storyDetailFun();
      this.commonServ.relatedStoryAPI(this.route.snapshot.paramMap.get('id'));
      this.urlval = this.sanitizer.bypassSecurityTrustResourceUrl("http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/story/renderPage?id="+this.route.snapshot.paramMap.get('id'));
      window.scroll(0,0);
    });

    // this.commonServ.relatedStoryAPI(this.route.snapshot.paramMap.get('id'));
    // console.log(this.commonServ.relatedStoryAPI(this.route.snapshot.paramMap.get('id')))
    // console.log(this.relateStory)
  }

  toggle=()=> this.isOpen = !this.isOpen;

  storyDetailFun(){
    this.commonServ.storydetail(this.route.snapshot.paramMap.get('id')).subscribe( 
      data => {this.storyDetail = data;}, // console.log(data)
      error => console.log(error)
    );
  }

 
  /*player code*/
  urlcorrect(val){
    let url =  this.sanitizer.bypassSecurityTrustResourceUrl(val);  //encodeURI(val)
    return val;
  }
  changeColor(val){this.ActiveColor = val;}

  showPlayer=(id)=>  {
    this.urlval = this.sanitizer.bypassSecurityTrustResourceUrl("http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/story/renderPage?id="+this.route.snapshot.paramMap.get('id'));

    if(this.show !== id && this.show !== 123)
      {
        this.show = 123;
        if((<any>window).player !== "undefined") 
        (<any>window).player.audio.Pause();
        setTimeout(()=>{this.show = id},100)    
      }
      else this.show = id;
  }
  hidePlayer=()=> {
    this.show = 123;
    if((<any>window).player !== "undefined") 
    (<any>window).player.audio.Pause(); /* */
  }

  stopOtherAudio(){
    alert('sadfsafsdf sdaf s');
  }

  // urldata(){
  //   return this.sanitizer.bypassSecurityTrustResourceUrl("http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/story/renderPage?id="+this.route.snapshot.paramMap.get('id'));
  // }

  checkVideoUrl(url){
    // console.log(url.search("youtube"))
    if (url.search("youtube") > 0)
      return true
    else
      return false
  }
  addspace(val){
    let data = val.toString()
    return  data.replace(/,/g, ",  ");
  }
  transform(style) {
    return this.sanitizer.bypassSecurityTrustHtml(style);
  }
}
