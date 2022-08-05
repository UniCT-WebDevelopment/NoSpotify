import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Playlist } from '@app/_models/playlist';
import { Socket } from 'ngx-socket-io';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private socket:Socket,
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password) {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        this.socket.emit("disconnectFromRoom");
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);

    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }


    searchAlbumByName(name: string) {
        return this.http.get(`${environment.apiUrl}/youtube/searchAlbum/${name}`);
    }

    searchPlaylistsByName(name: string) {
        return this.http.get(`${environment.apiUrl}/youtube/searchPlaylist/${name}`);
    }



    downloadPlaylist(id: string) {
        return this.http.get(`${environment.apiUrl}/youtube/downloadPlaylist/${id}`,{ responseType: 'blob' });
    }



    addUserToSpotify(email: string,username:string) {
        return this.http.get(`${environment.apiUrl}/youtube/addUserToSpotify/${email}/${username}`);
    }


    getSpotifyPlaylists(bearer) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearer}`
          })

        return this.http.get<any>("https://api.spotify.com/v1/me/playlists?cache="+(+new Date),{headers:headers});
    }


    getSpotifyTracks(bearer,playlistId) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearer}`
          })

        return this.http.get<any>("https://api.spotify.com/v1/playlists/"+playlistId+"/tracks",{headers:headers});
    }

    
    getPlaylist(id: string) {
        return this.http.get(`${environment.apiUrl}/youtube/getPlaylist/${id}`);
    }


    deletePlaylist(playlist: Playlist) {
        return this.http.post(`${environment.apiUrl}/youtube/deletePlaylist`, playlist);
    }


    createPlaylist(playlist: Playlist) {
        return this.http.post(`${environment.apiUrl}/youtube/createPlaylist`, playlist);
    }


    checkUploadedPlaylist(data: any) {
        return this.http.post(`${environment.apiUrl}/youtube/checkUploadedPlaylist`, data);
    }

    updatePlaylist(playlist: Playlist) {
        return this.http.post(`${environment.apiUrl}/youtube/updatePlaylist`, playlist);
    }

    getAllPlaylistForUser() {
        return this.http.get(`${environment.apiUrl}/youtube/getAllPlaylistForUser`);
    }


    getArtist(id: string) {
        return this.http.get(`${environment.apiUrl}/youtube/getArtist/${id}`);
    }

    searchArtistByName(name: string,id?:string) {
        if(id) return this.http.get(`${environment.apiUrl}/youtube/searchArtist/${name}/${id}`);
        return this.http.get(`${environment.apiUrl}/youtube/searchArtist/${name}`);
    }

    searchMusicByName(name: string) {
        return this.http.get(`${environment.apiUrl}/youtube/searchMusic/${name}`);
    }

    getMusicFromAlbum(id: string) {
        return this.http.get(`${environment.apiUrl}/youtube/getMusicFromAlbum/${id}`);
    }



    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById() {
        return this.http.get<User>(`${environment.apiUrl}/users/current`);
    }

    update( params) {
        return this.http.put(`${environment.apiUrl}/users/edit`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                // if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                // }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }
}