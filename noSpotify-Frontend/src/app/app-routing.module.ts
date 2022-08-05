import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumComponent } from './album/album.component';
import { ArtistComponent } from './artist/artist.component';

import { HomeComponent } from './home';
import { PlaylistViewComponent } from './playlist-view/playlist-view.component';
import { SearchComponent } from './search/search.component';
import { SpotifyImportComponent } from './spotify-import/spotify-import.component';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'search/:title',  component: SearchComponent, canActivate: [AuthGuard]},
    { path: 'album/:id',  component: AlbumComponent, canActivate: [AuthGuard]},
    { path: 'artist/:name/:id',  component: ArtistComponent, canActivate: [AuthGuard]},
    { path: 'playlist/:id',  component: PlaylistViewComponent, canActivate: [AuthGuard]},
    { path: 'spotifyImport',  component: SpotifyImportComponent, canActivate: [AuthGuard]},
    { path: 'home',  component: HomeComponent, canActivate: [AuthGuard]},

    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }