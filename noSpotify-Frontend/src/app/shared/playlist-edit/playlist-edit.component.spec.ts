import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistEditComponent } from './playlist-edit.component';

describe('PlaylistEditComponent', () => {
  let component: PlaylistEditComponent;
  let fixture: ComponentFixture<PlaylistEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
