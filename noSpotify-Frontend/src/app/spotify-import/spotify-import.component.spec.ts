import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyImportComponent } from './spotify-import.component';

describe('SpotifyImportComponent', () => {
  let component: SpotifyImportComponent;
  let fixture: ComponentFixture<SpotifyImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotifyImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
