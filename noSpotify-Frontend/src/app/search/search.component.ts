import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PlayerService } from '@app/shared/player/player.service';
import { PlaylistListComponent } from '@app/shared/playlist-list/playlist-list.component';
import { AccountService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { YtPlayerService } from 'yt-player-angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

  constructor(private ytService: YtPlayerService, private snotifyService: SnotifyService, private spinner: NgxSpinnerService, private modalService: NgbModal, private route: ActivatedRoute, private accountService: AccountService, private playerService: PlayerService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  paramName = null;
  albumList: any = [];
  artistList: any = [];
  musicList: any = [];
  playlistList: any = [];
  viewMode = "top";


  ngOnInit(): void {
    this.spinner.show();


    this.paramName = this.getQueryName();

    this.accountService.searchAlbumByName(this.paramName)
      .subscribe(res => {

        if (res) {
          this.albumList = res;
        } else {
        }

        this.spinner.hide();

      });


    this.accountService.searchMusicByName(this.paramName)
      .subscribe(res => {

        if (res) {
          this.musicList = res;
        }

      });

    this.accountService.searchArtistByName(this.paramName)
      .subscribe(res => {

        if (res) {
          this.artistList = res;
        }


      });

    this.accountService.searchPlaylistsByName(this.paramName)
      .subscribe(res => {

        if (res) {
          this.playlistList = res;
        }


      });
  }


  loadAlbum(idAlbum) {
    this.accountService.getMusicFromAlbum(idAlbum)
      .subscribe(res => {

        if (res) {
          this.playerService.updatePlayList(res)
          this.snotifyService.info("Album in riproduzione", "", {
            timeout: 2000,
            showProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          });
        }


      });
  }

  getQueryName() {
    return this.route.snapshot.paramMap.get('title');

  }

  checkCurrentSong(id) {
    try {
      if (!this.ytService || !this.ytService.videoId) return false
      if (this.ytService.getState() + "" == "playing" && this.ytService.videoId == id) return true;

      return false

    } catch (e) {
      return false
    }

  }


  pausePlayer() {
    this.ytService.pause();
  }


  playMusic(music) {
    this.playerService.updatePlayList([music]);
    this.snotifyService.info("Canzone in riproduzione", "", {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
  }

  addToQueue(music) {
    this.playerService.addToPlayList(music);
    this.snotifyService.info("Canzone aggiunta alla coda", "", {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
  }

  addToPlaylist(music) {
    const modalRef = this.modalService.open(PlaylistListComponent, { size: 'xl' });

    modalRef.componentInstance.modalAction = 'addMusic';
    modalRef.componentInstance.musicToAdd = music;
  }



}
