import { Component, OnInit , OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { CommonService } from '../../service/common.service';
import { empty } from 'rxjs';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public datalist:any;
  public firstitem:any;
  public listitem:any;
  public storyList :any;
  public item:any;
  public currentPage:number=0;
  public count:number=11;
  public Math:any;
  private pageupdate:number;

  public show:any = 123;
  urlval:any;
  ActiveColor:boolean = true;

  constructor( public sanitizer: DomSanitizer, public commonServ : CommonService, ) {this.commonServ.activepage = 'index';}

  ngOnInit() {
    window.scroll(0,0);
    this.commonServ.storyItem({},1,this.count , 'page');  
    // this.urlval = this.sanitizer.bypassSecurityTrustResourceUrl("http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/story/renderPage?id="+this.data._id);  
  }

  ngDoCheck(){
    if(this.commonServ.filterupdate){ this.pagination(0)}
  }
  pagination(page){
    this.currentPage = page;
    this.commonServ.storyItem({},page+1,this.count, 'page');
  }
  pageChange(page,action){
    if(action === 'prev')
      {
        this.currentPage = this.currentPage-1;
        this.commonServ.storyItem({},this.currentPage-1,this.count, 'page');
      }
    else{
      this.currentPage = this.currentPage+1;
      this.commonServ.storyItem({},this.currentPage+1,this.count, 'page');
    }
  }

  cal=(no)=> {
    if(Math.round(no/this.count) < (no/this.count))
      return Math.round(no/this.count)+1;
    else
      return Math.round(no/this.count)
  }



  /*player code*/
  urlcorrect(val){
    let url =  this.sanitizer.bypassSecurityTrustResourceUrl(val);  //encodeURI(val)
    return val;
  }
  changeColor(val){this.ActiveColor = val;}

  showPlayer=(id)=>  {
    if(this.show !== id && this.show !== 123)
      {
        this.show = 123;
        //console.log((<any>window).player !== "undefined")
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
  urldata(id){
    return this.sanitizer.bypassSecurityTrustResourceUrl("http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/story/renderPage?id="+id);
  }

  addspace(val){
    let data = val.toString()
    return  data.replace(/,/g, ",  ");
  }

}