import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '@app/shared/player/player.service';
import { PlaylistListComponent } from '@app/shared/playlist-list/playlist-list.component';
import { AccountService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
import { PlaylistEditComponent } from '@app/shared/playlist-edit/playlist-edit.component';
import _ from 'lodash';
import { YtPlayerService } from 'yt-player-angular';

@Component({
  selector: 'app-playlist-view',
  templateUrl: './playlist-view.component.html',
  styleUrls: ['./playlist-view.component.less']
})
export class PlaylistViewComponent implements OnInit {

  constructor(private ytService: YtPlayerService, private spinner: NgxSpinnerService, private modalService: NgbModal, private playerService: PlayerService, private route: ActivatedRoute, private accountService: AccountService) { }


  idPlaylist = null;
  rgb = null;

  musicList: any = [];
  playlist = null;

  ngOnDestroy(): void {

    // document.getElementById('headerBar').style.background = "#1b1c1e";

  }

  ngOnInit(): void {

    this.spinner.show();

    this.idPlaylist = this.route.snapshot.paramMap.get('id');


    this.accountService.getPlaylist(this.idPlaylist)
      .subscribe(res => {

        if (res) {
          this.musicList = res['playlist'] ? res['playlist'] : [];
          this.playlist = res

          this.spinner.hide();

        } else {
          this.spinner.hide();

        }


      });

  }

  checkCurrentSong(id) {
    try {
      if (!this.ytService || !this.ytService.videoId) return true
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
    this.playerService.updatePlayList([music])
  }


  addToQueue(music) {
    this.playerService.addToPlayList(music)
  }



  addToPlaylist(music) {
    const modalRef = this.modalService.open(PlaylistListComponent, { size: 'xl' });

    modalRef.componentInstance.modalAction = 'addMusic';
    modalRef.componentInstance.musicToAdd = music;
  }



  playAlbum() {
    this.playerService.updatePlayList(this.musicList)
  }


  downloadPlaylist() {
    this.accountService.downloadPlaylist(this.playlist.id).subscribe((res) => {

      saveAs(res, this.playlist.playlistName + `.nospotify`)
    })
  }


  openModalEditPlaylist() {
    const modalRef = this.modalService.open(PlaylistEditComponent, { size: 'xl' });
    modalRef.componentInstance.viewMode = 'add';
    modalRef.componentInstance.playlist = _.cloneDeep(this.playlist)
 
  }

}
