import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareplayComponent } from './shareplay.component';

describe('ShareplayComponent', () => {
  let component: ShareplayComponent;
  let fixture: ComponentFixture<ShareplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
