import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators , FormBuilder, FormArray} from '@angular/forms';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public formData:any;
  public Notification:any;
  public response:any = {message:''}
  constructor(public commonServ : CommonService,public fb: FormBuilder) {
    this.formData = fb.group({
      email:['', Validators.required],
    });
  }

  ngOnInit() {}

  SubscribeFun(){
    // console.log('fgdfg', this.formData.value.email);
    this.commonServ.subFun(this.formData.value.email).subscribe( 
      data => {console.log(data)
        this.response = data;
      this.formData.reset();
      if(this.response.message !== '')
      {
        this.Notification= `<div class="toast showtoast" role="alert" style=opacity: 1">
        <div class="toast-header">            
          <strong class="d-block m-0 flex-fill" style="width:100%">Message </strong>          
        </div>
        <div class="toast-body">
        `+this.response.message+` </div></div>`;
      }
      // <span class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><i aria-hidden="true" (click)="`+this.close()+`">&times;</i></span>
      setTimeout(()=>{this.Notification='';},3000)
      },
      error => console.log(error)
    );
  }

  // close(){
  //   console.log('sdfsdafsd')
  //   this.Notification='';
  // }

}
