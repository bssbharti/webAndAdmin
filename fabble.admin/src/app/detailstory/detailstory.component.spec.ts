import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailstoryComponent } from './detailstory.component';

describe('DetailstoryComponent', () => {
  let component: DetailstoryComponent;
  let fixture: ComponentFixture<DetailstoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailstoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailstoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
