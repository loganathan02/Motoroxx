import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpareComponent } from './spare.component';

describe('SpareComponent', () => {
  let component: SpareComponent;
  let fixture: ComponentFixture<SpareComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
