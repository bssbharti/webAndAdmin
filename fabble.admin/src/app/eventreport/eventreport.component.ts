import { Component, OnInit } from '@angular/core';
import {  CommonService} from '../common.service'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-eventreport',
  templateUrl: './eventreport.component.html',
  styleUrls: []
})
export class EventreportComponent implements OnInit {

  eventReport =[];
  constructor(private commonService:CommonService) { }

  ngOnInit() {
    this.commonService.getEventReports()
            .pipe(first())
            .subscribe(
                data => {
                  this.eventReport=data;
                  console.log("data============",this.eventReport)
                    //this.router.navigate(['/departments',department.id])
                   //this.router.navigate(['/dashboard','users']);
                },
                error => {
                  console.log('error', error)
                });
  }

}
