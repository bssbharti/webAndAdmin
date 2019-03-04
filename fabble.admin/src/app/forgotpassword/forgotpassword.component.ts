import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationServiceService} from '../authentication-service.service';
 
@Component({
    selector: 'app-forgotpassword',
    templateUrl: './forgotpassword.component.html',
    styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {

    public email: string;
    public successMessage: string;
    public errorMessage: string;
    public requesting: boolean = false;
    constructor(private router: Router, private service: AuthenticationServiceService) { }
    forgotPassword(form: NgForm) {
        if (form.valid) {
            
            this.errorMessage = null;
            this.requesting = true;
            this.service.forgotPassword(this.email)
                //            .subscribe((msg) => {
                //                this.requesting = false;

                //                if (msg.status = "success") {
                //                    //localStorage.setItem("adminId", msg.id);
                //                    this.router.navigateByUrl('/resetpassword');
                //                }
                //                else {
                //                    //this.successMessage = msg;
                //                }

                //            }, error => {
                //                this.errorMessage = error.json().msg;
                //                this.requesting = false;
                //                this.successMessage = null;
                //                this.errorMessage = 'Please enter correct EmailID';
                //            });
                //    }
                //    else {
                //        this.errorMessage = 'Form Data Invalid';
                //        this.successMessage = null;
                //    }
                //}


                //first())
                .subscribe(
                data => {
                    if (data.status = "success")
                    {

                        this.router.navigate(['resetpassword']);
                    }
                    else {
                        alert("sucessfully details sent")
                    }
                },
                error => {
                    console.log('error', error)
                });
        }

        form.reset();
    }
    
}
