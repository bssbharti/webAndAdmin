import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, } from '@angular/animations';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
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
export class HelpComponent implements OnInit {
  public isOpen:number = 1;

  constructor() { }

  ngOnInit() {
  }
  opentab=(val)=>{
    console.log(val)
    this.isOpen = val;
  }
}
