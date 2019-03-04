import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";
import { AuthenticationServiceService} from '../authentication-service.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

    public otp: string;
    public password: string;
    public email: string;
    public adminid: string;
    public successMessage: string;
    public errorMessage: string;
    public requesting: boolean = false;
    //public token: string;
    constructor(private router: Router, private service: AuthenticationServiceService) { }


    resetPassword(form: NgForm) {
        if (form.valid) {
            
            this.errorMessage = null;
            this.requesting = true;
          
            this.service.resetPassword(this.password, this.otp, this.email)
                .subscribe((msg) => {
                    this.requesting = false;
                    if (msg.status == 200) {
                        this.successMessage = 'Reset successfully';
                     
                        alert(this.successMessage)
                    }
                    else if (msg.status == 201) {
                        this.errorMessage = "Your OTP is either expired or invalid";

                        form.reset();
                    }
                    else {

                    }
                    this.router.navigateByUrl('/signin');
                    this.successMessage = 'Reset successfully';

                }, error => {
                    this.errorMessage = 'Invalid_token';
                    this.requesting = false;
                    this.successMessage = null;
                });

        } else {
            this.errorMessage = 'Form Data Invalid';
            this.successMessage = null;
        }

    }
    ngOnInit() {
        var id = localStorage.getItem("adminId");
        if (id == null || id == "") {
            this.router.navigateByUrl('/signin');
        }
    }
}
