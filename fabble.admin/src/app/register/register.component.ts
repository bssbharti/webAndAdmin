import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationServiceService } from '../authentication-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    registerForm: FormGroup;
    loading = false;
    submitted = false;
    email: string = "";
    password: string = "";


    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: AuthenticationServiceService
    
    ) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
        
            email: ['', Validators.required],
            password: ['', [Validators.required]]
        });
    }

    
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

      
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
      
    }

}
