import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryPosterItemComponent } from './story-poster-item.component';

describe('StoryPosterItemComponent', () => {
  let component: StoryPosterItemComponent;
  let fixture: ComponentFixture<StoryPosterItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryPosterItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryPosterItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
