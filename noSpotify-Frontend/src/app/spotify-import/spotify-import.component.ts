import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistEditComponent } from '@app/shared/playlist-edit/playlist-edit.component';
import { Playlist } from '@app/_models/playlist';
import { AccountService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-spotify-import',
  templateUrl: './spotify-import.component.html',
  styleUrls: ['./spotify-import.component.less']
})
export class SpotifyImportComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private route: ActivatedRoute, private accountService: AccountService, private modalService: NgbModal) { }

  playLists = null;
  bearer = null;

  ngOnInit(): void {
    if(document.getElementById("myVideo"))
    (document.getElementById("myVideo") as HTMLVideoElement).pause()
    if(document.getElementById("startVideo"))
    document.getElementById("startVideo").style.display = "none"
    this.spinner.show();


if(localStorage.getItem("spotifyBearer")){
  let bearer = localStorage.getItem("spotifyBearer")

  this.bearer = bearer;
  this.accountService.getSpotifyPlaylists(bearer).subscribe((res) => {

    localStorage.setItem("spotifyBearer", this.bearer)
    this.spinner.hide();


    if (res && res.items && res.items.length > 0) {
      this.playLists = res.items
    }

  }, (err) => {
    this.spinner.hide();

    localStorage.setItem("spotifyBearer", "");
    window.self.close();

  })
}else {



    setTimeout(() => {
      this.route.fragment.subscribe((fragment: string) => {
        let bearer = new URLSearchParams(fragment).get('access_token');
        this.bearer = bearer;
        this.accountService.getSpotifyPlaylists(bearer).subscribe((res) => {

          localStorage.setItem("spotifyBearer",  this.bearer)
          this.spinner.hide();


          if (res && res.items && res.items.length > 0) {
            this.playLists = res.items
          }

        }, (err) => {

          localStorage.setItem("spotifyBearer", "");
          window.self.close();

        })
      });
    }, 2000);

  }
  }


  async importPlaylist(playlistId, playlistName) {
    let playListOutput = [];

    this.accountService.getSpotifyTracks(this.bearer, playlistId).subscribe(async (res) => {



      if (res && res.items && res.items.length > 0) {
        let i = 0;
        for (let song of res.items) {

          await this.accountService.searchMusicByName(song['track'].name).subscribe((resYt: any) => {
            if (resYt && resYt.length > 0) {
              playListOutput.push(resYt[0])

            }
          })
        }
      }


      const modalRef = this.modalService.open(PlaylistEditComponent, { size: 'xl' });
      modalRef.componentInstance.viewMode = 'add';
      let compPlaylist: Playlist = {
        public: true,
        owner: null,
        ownerName: null,
        playlist: playListOutput,
        playlistName: playlistName,
        id: null
      }

      modalRef.componentInstance.playlist = compPlaylist
      modalRef.closed.subscribe((modalClosed) => {
        window.self.close();

      })



    })

  }

}
