import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ControlContainer, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';;
import { PlayerComponent } from './shared/player/player.component'
import { YtPlayerAngularModule } from 'yt-player-angular';;
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';;
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatSidenavModule} from '@angular/material/sidenav'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './search/search.component'
;
import { AlbumComponent } from './album/album.component';;
import { ArtistComponent } from './artist/artist.component'
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatListModule} from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { PlaylistEditComponent } from './shared/playlist-edit/playlist-edit.component';
import { PlaylistListComponent } from './shared/playlist-list/playlist-list.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PlaylistViewComponent } from './playlist-view/playlist-view.component';;
import { SpotifyImportComponent } from './spotify-import/spotify-import.component'
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';;
import { ShareplayComponent } from './shared/shareplay/shareplay.component'
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { environment } from '@environments/environment';





@NgModule({
    imports: [
        FormsModule,
        MatListModule,
        MatCheckboxModule,
        MatCheckboxModule,
        SocketIoModule.forRoot({ url: environment.apiUrl}),

        // SocketIoModule.forRoot(config),
        MatButtonModule,
        SnotifyModule,
        NgxSpinnerModule,
        MatInputModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatRadioModule,
        MatSelectModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatSidenavModule,
        MatBadgeModule,
        MatToolbarModule,
        MatListModule,
        MatGridListModule,
        MatCardModule,
        MatStepperModule,
        MatTabsModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatDividerModule,
        CommonModule,
        DragDropModule,
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        CommonModule,
        MatToolbarModule,
        MatSidenavModule,
        YtPlayerAngularModule,
        BrowserAnimationsModule,

        NgbModule ,

        NgxSpinnerModule         
      ],
    declarations: [
        AppComponent,
        AlertComponent,
        PlaylistListComponent,
        PlaylistEditComponent,
        HomeComponent,
        PlayerComponent ,
        SidebarComponent ,
        SearchComponent ,
        PlaylistViewComponent,
        AlbumComponent ,
        SpotifyImportComponent,
        ArtistComponent
,
        ShareplayComponent    ],

    providers: [ReactiveFormsModule,FormsModule,
        
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
        SnotifyService
        // provider used to create fake backend
        // fakeBackendProvider
    ],exports:[
        MatCheckboxModule,
        MatCheckboxModule,
        MatButtonModule,
        MatInputModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatRadioModule,
        MatSelectModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatSidenavModule,
        MatBadgeModule,
        MatToolbarModule,
        MatListModule,
        MatGridListModule,
        MatCardModule,
        MatStepperModule,
        MatTabsModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };