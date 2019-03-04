import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators , FormBuilder, FormArray} from '@angular/forms';
import { trigger, state, style, animate, transition, } from '@angular/animations';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
export class HeaderComponent implements OnInit {
  showSubmenu:any = false;
  private genres:any;
  public filterData:any;
  public storyList:any;
  public formactive:boolean= false;
  public allGenresList:any;
  
  constructor(public commonServ : CommonService,public fb: FormBuilder) {
    this.filterData = fb.group({
      name:[''],
      ratings: [''],
      videoDuration: [''],
      allgenre:false,
      gen: fb.array,
    });

    setTimeout(()=>{
      this.allGenresList = this.commonServ.allGenresList.category;      
      const controls = this.allGenresList.map(c =>  new FormControl(false));
      this.filterData = fb.group({
        name:[''],
        ratings: [''],
        videoDuration: [''],
        allgenre:false,
        gen:this.fb.array(controls)
      });
      this.formactive = true;      
    },2000);

  }

  ngOnInit() {
  }


  toggle=(val)=> {this.showSubmenu = val; }

  filterFun=()=>{
    this.search();
  }

  checkAll(val){
    console.log(val);
    
    if(val) {
      // console.log(this.filterData.value.gen)
      this.filterData.value.gen.map((item,i)=>{
        this.filterData.value.gen[i]= true;
      })
    } else {
      this.filterData.value.gen.map((item,i)=>{
        this.filterData.value.gen[i]= false;
      })
    } 
    console.log(this.filterData.value.gen) 
    this.search();    
  }

  singlecheck(index){
    console.log(index)
    console.log(this.filterData.value)
    this.filterData.value.gen.map((item,i)=>{
      if(this.filterData.value.allgenre)
        {
          console.log(index)
          if(i===index)
            {this.filterData.value.gen[i]= true;
            this.filterData.value.allgenre= false;}
          else
            this.filterData.value.gen[i]= false;
        }
    })
  }

  search=()=>{
    this.commonServ.storyItem(this.filterData.value, 1, 11, 'header');
  }

  clearfilter(){
    this.filterData.reset();
    // console.log(this.filterData.value);
    this.search()
  }
  refresh(){
    // console.log('refresh')
    this.filterData.reset();
    this.commonServ.cleartagval();
    this.commonServ.storyItem({},1,11, 'logo')
    // window.location.reload();
  }

}
