import { Component, OnInit } from '@angular/core';
import { Playlist } from '@app/_models/playlist';
import { AccountService } from '@app/_services';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlayerService } from '../player/player.service';
import { PlaylistEditComponent } from '../playlist-edit/playlist-edit.component';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '@environments/environment';
import { SnotifyService } from 'ng-snotify';
import _ from 'lodash';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.less']
})
export class PlaylistListComponent implements OnInit {

  constructor(private snotifyService: SnotifyService, private playerService: PlayerService, private spinner: NgxSpinnerService, private modalService: NgbModal, private accountService: AccountService, private activeModal: NgbActiveModal) { }

  musicToAdd = null;

  modalAction = 'normal';

  listPlaylist: any = [];
  emailSpotify = null;
  usernameSpotify = null;

  modalRef;
  selectedPlaylist = null;

  ngOnInit(): void {

    this.getAllPlaylist();

    setInterval(() => {
      if (this.accountService.userValue)
        this.getAllPlaylist();
    }, 2000);
  }


  performAction(playlist) {

    switch (this.modalAction) {
      case 'addMusic': {

        playlist.playlist.push(this.musicToAdd)

        this.accountService.updatePlaylist(playlist).subscribe((res) => {
          this.activeModal.dismiss();
        })

        return;
      }

      case 'importQueue': {
        this.playerService.updatePlayList(playlist.playlist);
        this.activeModal.close();
      }
    }

  }




  getAllPlaylist() {
    this.accountService.getAllPlaylistForUser().subscribe((res) => {

      this.listPlaylist = res;



    })
  }

  openModalCreatePlaylist() {
    const modalRef = this.modalService.open(PlaylistEditComponent, { size: 'xl' });
    modalRef.closed.subscribe((modalClosed) => {
      this.getAllPlaylist()
    })
  }

  openModalEditPlaylist(playlist) {
    const modalRef = this.modalService.open(PlaylistEditComponent, { size: 'xl' });
    modalRef.componentInstance.viewMode = 'edit';
    modalRef.componentInstance.playlist = _.cloneDeep(playlist);
    modalRef.closed.subscribe((modalClosed) => {
      this.getAllPlaylist()
    })
  }


  loginSpotify() {
    var CLIENT_ID = environment.CLIENT_ID;
    var REDIRECT_URI = 'http://localhost:4000/spotifyImport';
    function getLoginURL(scopes) {
      return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&scope=' + encodeURIComponent(scopes.join(' ')) +
        '&response_type=token&antiCache=' + (+new Date);
    }

    var url = getLoginURL([
      'user-read-recently-played',
      'user-top-read',
      'user-read-playback-position',
      //Spotify Connect
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      //Playback - For SDK Playback //https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
      'streaming',
      //Playlists
      'playlist-modify-public',
      'playlist-modify-private',
      'playlist-read-private',
      'playlist-read-collaborative',
      //Library
      'user-library-modify',
      'user-library-read',
      //Users - For SDK Playback //https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
      'user-read-email',
      'user-read-private'
    ]);

    var width = 450,
      height = 730,
      left = (screen.width / 2) - (width / 2),
      top = (screen.height / 2) - (height / 2);



    var w = window.open(url,
      'Spotify',
      'menubar=no,location=no,resizable=0,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
    );

  }


  downloadPlaylist(playlist) {
    this.accountService.downloadPlaylist(playlist.id).subscribe((res) => {

      saveAs(res, playlist.playlistName + `.nospotify`)
    })
  }


  setPlaylist(playlist) {
    this.playerService.updatePlayList(playlist.playlist);
    this.snotifyService.info("Playlist in riproduzione", "", {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
    this.activeModal.close();

  }

  openModalDeletePlaylist(template, playlist) {
    this.selectedPlaylist = playlist;
    this.modalRef = this.modalService.open(template, { size: 'xl' });
  }

  openModalSpotify(template) {

    if (localStorage.getItem("spotifyBearer")) {
      // this.loginSpotify();

      var width = 450,
        height = 730,
        left = (screen.width / 2) - (width / 2),
        top = (screen.height / 2) - (height / 2);

      var w = window.open(environment.apiUrl + "/spotifyImport",
        'Spotify',
        'menubar=no,location=no,resizable=0,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
      );

    }
    else {
      this.modalRef = this.modalService.open(template, { size: 'xl' });

    }

  }

  deletePlaylist() {
    this.accountService.deletePlaylist(this.selectedPlaylist).subscribe((res) => {
      this.getAllPlaylist();

      this.snotifyService.success("Playlist eliminata", "", {
        timeout: 2000,
        showProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true
      });

    })
  }

  confirmDelete(): void {
    this.modalRef?.close();
    this.deletePlaylist();
  }

  decline(): void {
    this.modalRef?.close();
  }


  checkSpotifyBearer() {
    if (localStorage.getItem("spotifyBearer")) return true;
    else return false;
  }

  deleteSpotifyBearer() {
    localStorage.setItem("spotifyBearer", "");
  }

  importSpotify() {

    if (this.emailSpotify && this.usernameSpotify) {
      this.spinner.show()

      if (localStorage.getItem("spotifyBearer")) {

        this.spinner.hide()

        this.loginSpotify();

      } else {
        this.accountService.addUserToSpotify(this.emailSpotify, this.usernameSpotify).subscribe((res) => {
          if (res) {

            this.loginSpotify();
          }
          this.spinner.hide()

          this.decline();
        })
      }





    }
  }
}
