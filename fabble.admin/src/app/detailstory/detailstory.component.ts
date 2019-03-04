import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition, } from '@angular/animations';
import { first } from 'rxjs/operators';
import { AuthenticationServiceService } from '../authentication-service.service';
 

@Component({
  selector: 'app-detailstory',
  templateUrl: './detailstory.component.html',
  styleUrls: ['./detailstory.component.css'],
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
export class DetailstoryComponent implements OnInit {
  images: any;
  tags: any;
  genresName: any;
  credit={Name:"",Role:"",OriginalStory:"",Narator:"",Actor:"",Music:""};
  roles: any=[];
  pstrImgUrl: any="";
  embedImgurl: any="";
  spnsImgUrl: any="";
  isOpen = false;
  urlval:any;

  constructor(public sanitizer: DomSanitizer, private route: ActivatedRoute,private router: Router, private authenticationService: AuthenticationServiceService) {
    this.urlval = this.sanitizer.bypassSecurityTrustResourceUrl("http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/story/renderPage?id="+this.route.snapshot.paramMap.get('id'));
   }
 storyId:string;
 story:any;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.storyId= params['id'];
      console.log(this.storyId);
      this.getStoryDetail();
   });
  }

 getStoryDetail()
 {
   this.authenticationService.getStoryDetailById(this.storyId).subscribe(data=>{

    if(data)
    {
        this.story = data;
        this.images=data.image;
        this.tags = data.tags;
        this.story.genres=Array.prototype.map.call(data.genresId, s => s.name).toString();
        this.roles=data.credits;
        this.pstrImgUrl=data.posterImage;
        this.embedImgurl=data.playerImage;
        this.spnsImgUrl=data.sponsorImage;
        console.log(this.story);
        
    }

   })  
 }
 onNavigateOnUrl(url)
 {
   if(url.trim())
  window.open(url, "_blank");
  //[attr.href]="(item.url.indexOf('http')==0?item.url:'//'+item.url)"
 }
 deleteStoryVideo(id,index)
 {
  let newData = new FormData();
  newData.append("videoId",id);
  this.authenticationService.deleteStoryVideo(newData).subscribe(data=>{

    if(data && data.status!=0)
    {
      this.story.videos.splice(index,1);
        console.log(data.message);
        alert(data.message);
    }

  //  this.router.navigate(["dashboard"]);
   })  

 }
 removeImage(url,index)
  {
    if(this.storyId&&url)
    this.authenticationService.deleteImageByStoryId(url,this.storyId).subscribe(data => {
     
      console.log(data);
       if (data.status!=0) {
        this.images.splice(index,1);
        alert(data.message);
       
      }
    },error=>{

      let msg=error;
    }
    );
  }
  removeTag(index) {
    this.tags.splice(index, 1);
  }

  logout(){
    window.localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
  toggle=()=> this.isOpen = !this.isOpen;
  checkVideoUrl(url){
    // console.log(url.search("youtube"))
    if (url.search("youtube") > 0)
      return true
    else
      return false
  }
  transform(style) {
    return this.sanitizer.bypassSecurityTrustHtml(style);
    //return this.sanitizer.bypassSecurityTrustStyle(style);
    // return this.sanitizer.bypassSecurityTrustXxx(style); - see docs
  }    
}
