import { Component, OnInit,NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationServiceService } from '../authentication-service.service';

//import { AlertService, AuthenticationService } from '../_services';

@Component({templateUrl: 'login.component.html',selector: 'login-root', styleUrls: ['login.component.css']})
export class LoginComponent implements OnInit {
  userForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    email:string="";
    password:string="";

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
         private authenticationService: AuthenticationServiceService
        )
         {}
 

    ngOnInit() {
   
        this.userForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

   
       this.authenticationService.logout();

    
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

  

    onSubmit() {
 
        this.loading = true;
        this.authenticationService.login(this.email, this.password)
            .pipe(first())
            .subscribe(
                data => {
                    if(data.status)
                    this.router.navigate(['dashboard']);
                    else{
                        alert(data.message)
                    }
                },
                error => {
                  console.log('error', error)
                });
    }
}
