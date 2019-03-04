

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable()
export class AuthService {
  constructor(private myRoute: Router) { }
  sendToken(token: string) {
    localStorage.setItem("currentUser", token)
  }
  getToken() {
    return localStorage.getItem("currentUser")
  }
  isLoggednIn() {
    return this.getToken() !== null;
  }
  logout() {
    localStorage.removeItem("currentUser");
    this.myRoute.navigate(["login"]);
  }
}