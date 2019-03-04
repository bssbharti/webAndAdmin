import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { trigger, state, style, animate, transition, } from '@angular/animations';
import { first } from "rxjs/operators";
import { CommonService } from "../common.service";

import { AuthenticationServiceService } from "../authentication-service.service";

@Component({
  templateUrl: "dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
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
export class DashboardComponent implements OnInit {
  public stories: any[] = [];

  //@Input() users1: any[] = [];
  filterBy: any = {gen:"",ratings:"",videoDuration:""};
  genresList: any;
  selectedGenresId: any="";
  genresNameList: any = [];
  genresIds: any = [];
  // Counter = 5;
   dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};

  showSubmenu = false;
  public currentPage:number=1;
  public count:number=10;
  public getstoryitem:any;

  constructor(private route: ActivatedRoute, private router: Router, private commonService: CommonService, private service: AuthenticationServiceService) {}
 
  ngOnInit() {

    this.getGenersList();
    this.getStoryList();
    this.storyList({},1,10);
  }

  toggle=()=> {this.showSubmenu = !this.showSubmenu; }

  //   deletestory(_id: string) {
  //     if (confirm("Are you sure to Delete!")) {
  //       //this.service.deleteStoryVideo(_id);
  //       alert(1);
  //     }
  //   }
  getStoryList() {
    this.service
      .allStoryList()
      .pipe(first())
      .subscribe(
        data => {
          if(data)
          this.stories = data.data;
        },
        error => {
          console.log("error", error);
        }
      );
  }
  deleteStory(storyId, index) {
    if (confirm("Are you sure to Delete!")) {
      this.service
        .deleteStory(storyId)
        .pipe(first())
        .subscribe(
          data => {
            if (data.Status != 0) {
              this.getStoryList();
            }
            //this.router.navigate(["dashboard"]);
            else {
              alert(data.message);
            }
          },
          error => {
            console.log("error", error);
            // this.loading = true;
          }
        );
    } else {
      alert("no");
    }
  }
  detailstory(_id: string) {
    this.service
      .detailStory(_id)
      .pipe(first())
      .subscribe(
        data => {
          let getdetail = data.data;
          this.stories = getdetail;

          this.router.navigateByUrl["/detailstory"];
        },
        error => {
          console.log("error", error);
        }
      );
  }

  searchStory() {
    // console.log("filterObject",this.filterBy);
   this.filterBy.gen=this.genresIds;
   this.storyList(this.filterBy, this.currentPage , this.count);
    // this.service
    //   .searchStory(this.filterBy)
    //   .pipe(first())
    //   .subscribe(
    //     data => {
    //       this.stories = data.search ? data.search : [];
    //       //this.router.navigateByUrl[('/detailstory')];
    //     },
    //     error => {
    //       console.log("error", error);
    //     }
    //   );
  }


  
  addGenres() {
    if(!this.selectedGenresId)
    {
      this.genresNameList=[];
    }
    if (this.genresList.length > 0 && this.selectedGenresId) 
    {
    this.genresIds.push(this.selectedGenresId);
    let genreName=this.genresList.find(x=>x._id == this.selectedGenresId).name;
    if(genreName)
    this.genresNameList.push(genreName);
    }
  }
  removeGenres(index) {
    this.genresIds.splice(index, 1);
    this.genresNameList.splice(index, 1);
    if(this.genresNameList.length==0)
    {
      this.selectedGenresId="";
    }
  }
  
  getGenersList() {
    this.service
      .allGenres()
      .pipe(first())
      .subscribe(
        data => {
          if (data.status) this.genresList = data.category;
          else {
            alert(data);
          }
        },
        error => {
          console.log("error", error);
          //  this.loading = true;
        }
      );
  }

  logout(){
    window.localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  storyList(dataval, page , count){
    let data = dataval;
    data.page = page;
    data.count = count;
    // console.log("after",data);
    this.service.getStoryList(data).subscribe(
      data => {
        if (data.status){ 
          // console.log(data);
          this.getstoryitem = data;}
        else {
          alert(data);
        }
      },
      error => console.log("error", error)
    );
  }

  pagination(page){
    this.currentPage = page;
    this.storyList(this.filterBy,page,this.count);
    //this.commonServ.storyItem({},page+1,this.count, 'page');
  }
  pageChange(page,action){
    if(action === 'prev')
      {
        this.currentPage = this.currentPage-1;
        this.storyList(this.filterBy,this.currentPage,this.count);
      }
    else{
      this.currentPage = this.currentPage+1;
      this.storyList(this.filterBy,this.currentPage,this.count);
    }
  }

  cal=(no)=> {
    if(Math.round(no/this.count) < (no/this.count))
      return Math.round(no/this.count)+1;
    else
      return Math.round(no/this.count)
  }
  addspace(val){
    let data = val.toString()
    return  data.replace(/,/g, ",  ");
  }
  
}
