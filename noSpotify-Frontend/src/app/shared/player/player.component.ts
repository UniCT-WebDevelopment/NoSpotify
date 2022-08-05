import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaybackQuality, PlayerState, StateChange, StateChangeType, YtPlayerService } from 'yt-player-angular';
import { PlayerService } from './player.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import _ from 'lodash';
import { PlaylistListComponent } from '../playlist-list/playlist-list.component';
import { ShareplayComponent } from '../shareplay/shareplay.component';
import { Socket } from 'ngx-socket-io';
import { AccountService } from '@app/_services';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.less']
})
export class PlayerComponent implements OnInit {


  showPlayer = true;
  currentVideoId = null;
  indexPlaylist = 0;
  namePlaylist = [];
  playlist = [
    //   {
    //   id: "Tn3whQxSdJs"
    // }, {
    //   id: "Tn3whQxSdJs"
    // }
  ];
  repeat = false;
  shuffle = false;
  hideLabel = false;

  public onStateChange(stateChange: StateChange): void {

    this.ytPlayerService.setPlaybackQuality(PlaybackQuality.Small)



    if (StateChangeType[stateChange.type] == "Ended") {
      if (this.playlist && this.playlist.length > 0) {
        if (this.repeat) {


          this.ytPlayerService.seek(0);

        } else if (this.shuffle) {

          this.indexPlaylist = this.generateRandom(0, this.playlist.length - 1);

          setTimeout(() => {
            this.togglePlay();
          }, 3000);


        } else {


          if (this.indexPlaylist < this.playlist.length - 1) {
            this.indexPlaylist++;

            setTimeout(() => {
              this.togglePlay();
            }, 3000);

          }
        }



      }
    }


    if (StateChangeType[stateChange.type] == "Started") {
      this.ytPlayerService.setPlaybackQuality(PlaybackQuality.Small)

      if (this.playlist && this.playlist.length > 0) {


        let vol = (document.getElementById("rangeVolume") as HTMLInputElement).value

        document.getElementById("seekBarVolume").style.width = vol + "%"

        this.ytPlayerService.setVolume(parseFloat(vol));

        if (this.isMuted) this.ytPlayerService.mute()
        else this.ytPlayerService.unMute()



      }
    }



  }

  drop(event: CdkDragDrop<string[]>) {
    debugger
    moveItemInArray(this.playlist, event.previousIndex, event.currentIndex);

    if (event.previousIndex != this.indexPlaylist) {

      if (event.previousIndex <= this.indexPlaylist || event.currentIndex <= this.indexPlaylist) {
        if ((event.previousIndex < this.indexPlaylist && event.currentIndex >= this.indexPlaylist))
          this.indexPlaylist--;
        else
          if (event.currentIndex <= this.indexPlaylist && event.previousIndex > this.indexPlaylist)

            this.indexPlaylist++;

      }
    } else {
      this.indexPlaylist = event.currentIndex;
    }

    this.playerService.updatePlayList(_.cloneDeep(this.playlist), true);
  }

  nextSong() {
    if (!this.checkIfHost()) return;

    if (this.indexPlaylist < this.playlist.length - 1) {
      this.indexPlaylist++;

      setTimeout(() => {
        this.togglePlay();
      }, 2000);
    }
  }

  prevSong() {
    if (!this.checkIfHost()) return;

    if (this.indexPlaylist > 0) {
      this.indexPlaylist--;

      setTimeout(() => {
        this.togglePlay();
      }, 2000);
    }
  }


  shuffleBtn() {
    if (!this.checkIfHost()) return;
    this.shuffle = !this.shuffle;
    if (this.shuffle) this.repeat = false;

  }

  repeatBtn() {

    if (!this.checkIfHost()) return;

    this.repeat = !this.repeat;
    if (this.repeat) this.shuffle = false;
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {

  //   if (event.target.innerWidth <= 767) {
  //     this.hideLabel = true;
  //   } else {
  //     this.hideLabel = false;
  //   }

  // }

  constructor(private snotifyService: SnotifyService, private socket: Socket, private accountService: AccountService, private modalService: NgbModal, private router: Router, private playerService: PlayerService, private cdRef: ChangeDetectorRef, public ytPlayerService: YtPlayerService) {

    this.socket.fromEvent<any>('playerState').subscribe(data => {
      if (this.playerService.isHost()) return;
      let obj = _.cloneDeep(JSON.parse(data));
      this.indexPlaylist = obj.indexPlaylist;
      this.playerService.updatePlayList(obj["playlist"], true);
      this.shuffle = obj.shuffle;
      this.repeat = obj.repeat;
      // if(((obj.time - (+this.getCurrentTimeInSeconds())) > 0.5 )    ){
      //   let n = parseInt(obj.time) + 0.050
      //   this.seekTo(n+"")
      // }


      if (this.getDifference(+obj.time, this.getCurrentTimeMillis()) > 0.5) {
        let n = parseInt(obj.time) + 0.050
        this.seekTo(n + "")
      }
      if (obj.play) this.play();
      else this.pause();

    });



    setInterval(() => {
      if (this.playerService.isHost()) {
        let a = this.isPlaying();

        let objToSend = {
          userData: this.accountService.userValue,
          playerState: { indexPlaylist: this.indexPlaylist, currentVideoId: this.currentVideoId, shuffle: this.shuffle, repeat: this.repeat, play: a, time: this.getCurrentTimeMillis() }

        }

        objToSend.playerState["playlist"] = this.playerService.currPlayList;


        this.socket.emit('sendPlayerState', JSON.stringify(objToSend))
      }
    }, 100);



    if (this.playlist && this.playlist.length > 0) {
      this.indexPlaylist = 0;
    }



    setInterval(() => {
      this.cdRef.detectChanges()
    }, 100);


    playerService.model$.subscribe((playListInput) => {

      try {

        switch (playListInput.type) {

          case 'partialreInit': {

            this.playlist = playListInput.playlist;
            break;
          }

          case 'reInit': {
            this.playlist = playListInput.playlist;
            this.indexPlaylist = 0;
            setTimeout(() => {
              this.togglePlay();
            }, 3000);

            break;
          }

          case 'add': {
            this.playlist.push(playListInput.playlist);
            break;
          }

          case 'delete': {
            this.playlist = playListInput.playlist;
            this.indexPlaylist = 0;
            break;
          }


          case 'remove': {
            let currentSong = false;
            if (playListInput.playlist.length == 0) {
              this.playlist = playListInput.playlist;
              this.indexPlaylist = 0;
            } else {
              debugger
              if (playListInput.index == this.indexPlaylist) {
                currentSong = true;
                this.playlist = playListInput.playlist;
                if (this.indexPlaylist == 0) { }
                else {
                  if (this.indexPlaylist > (this.playlist.length) - 1) this.indexPlaylist--
                  // if(this.indexPlaylist < (this.playlist.length)-1) this.indexPlaylist++
                  // else this.indexPlaylist--;
                }
                //TODO STO ELIMINANDO SONG IN RIPRODUZIONE
              } else if (playListInput.index < this.indexPlaylist) {
                debugger
                //this.playlist.splice(playListInput.index,1);

                this.indexPlaylist -= 1;


                //TODO STO ELIMINANDO SONG PRECEDENTE SHIFT INDEX

              } else {

                //TODO STO ELIMINANDO SONG SUCCESSIVA 

                // this.playlist.splice(playListInput.index,1);

              }
            }

            if (currentSong)
              setTimeout(() => {
                this.togglePlay();
              }, 3000);
            break;
          }


        }

      } catch (e) { }


    })




  }

  isMuted = false;
  ngOnInit(): void {
  }

  getCurrentTimeMillis() {
    try {
      return this.ytPlayerService.getCurrentTime();

    } catch (e) {
      return 0
    }
  }

  getState() {
    try {
      return this.ytPlayerService.getState();

    } catch {
      return null;
    }

  }

  getDifference(a, b) {
    return Math.abs(parseFloat(a) - parseFloat(b));
  }


  play() {
    try {
      this.ytPlayerService.play();
    } catch (e) { }
  }

  pause() {
    try {
      this.ytPlayerService.pause();
    } catch (e) { }
  }


  togglePlay(internal = false) {
    if (internal && !this.checkIfHost()) return;

    try {
      if (!this.playlist || this.playlist.length == 0 || !this.ytPlayerService) return;




      if (this.getState() + "" == "playing") {
        this.ytPlayerService.pause();

      } else {
        this.ytPlayerService.play();
      }

    } catch (e) { }
  }


  isPlaying() {
    try {

      if (!this.playlist || this.playlist.length == 0 || !this.ytPlayerService) return;

      // debugger
      // (document.getElementById("rangeVolume") as HTMLInputElement).value = this.ytPlayerService.getVolume() + "";

      if (this.getState() + "" == "playing") return true
      return false;
    } catch (e) { }
  }

  setVolume(event) {
    try {

      document.getElementById("seekBarVolume").style.width = parseInt(event) + "%"


      if (!this.playlist || this.playlist.length == 0 || !this.ytPlayerService) return;


      if (this.isMuted) this.muteSwitch();
      this.ytPlayerService.setVolume(parseInt(event))
      debugger




    } catch (e) { }
  }

  muteSwitch() {

    try {

      this.isMuted = !this.isMuted;

      if (!this.playlist || this.playlist.length == 0 || !this.ytPlayerService) return;

      if (this.isMuted) this.ytPlayerService.mute();
      else this.ytPlayerService.unMute();
    } catch (e) { }
  }



  showHidePlayer() {
    this.showPlayer = !this.showPlayer;

    if (this.showPlayer) (document.getElementById("mainPlayer") as HTMLElement).style.display = "block";
    else (document.getElementById("mainPlayer") as HTMLElement).style.display = "none";
  }

  getCurrentTime() {
    try {
      if (!this.playlist || this.playlist.length == 0 || !this.ytPlayerService) return;

      const totalSeconds = parseInt(this.ytPlayerService.getCurrentTime().toFixed());

      const minutes = Math.floor(totalSeconds / 60);

      const seconds = totalSeconds % 60;

      function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
      }

      const result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;

      return result;
    } catch (e) { }
  }



  disableSeek() {
    try {
      if (!this.playlist || this.playlist.length == 0 || !this.ytPlayerService) return true;

      else return false;
    } catch (e) { }
  }


  seekTo(event, internal = false) {
    if (internal && !this.checkIfHost()) return;

    try {
      if (!this.playlist || this.playlist.length == 0 || !this.ytPlayerService) return;

      this.ytPlayerService.seek(parseInt(event))
    } catch (e) { }
  }



  getDurationInSeconds() {
    try {
      if (!this.playlist || this.playlist.length == 0 || !this.ytPlayerService) return;

      return this.ytPlayerService.getDuration().toFixed();
    } catch (e) { }
  }

  getCurrentTimeInSeconds() {
    try {
      if (!this.playlist || this.playlist.length == 0 || !this.ytPlayerService) return;



      let bho = (100 * this.ytPlayerService.getCurrentTime()) / (this.ytPlayerService.getDuration())

      document.getElementById("seekBarProgress").style.width = bho + "%";

      return this.ytPlayerService.getCurrentTime().toFixed();
    } catch (e) { }

  }


  getDuration() {
    try {
      if (!this.playlist || this.playlist.length == 0 || !this.ytPlayerService) return;


      const totalSeconds = parseInt(this.ytPlayerService.getDuration().toFixed());

      const minutes = Math.floor(totalSeconds / 60);

      const seconds = totalSeconds % 60;

      function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
      }

      const result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;

      return result;
    } catch (e) { }

  }


  generateRandom(min = 0, max = 100) {

    // find diff
    let difference = max - min;

    // generate random number 
    let rand = Math.random();

    // multiply with difference 
    rand = Math.floor(rand * difference);

    // add with min value 
    rand = rand + min;

    return rand;
  }


  openModalPlaylist(content) {
    if (!this.checkIfHost()) return;

    this.namePlaylist = [];
    for (let a of this.playlist) {
      this.namePlaylist.push(a.title);
    }


    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  deletePlaylist() {
    this.playerService.deletePlaylist();
  }

  openSharePlay() {
    const modalRef = this.modalService.open(ShareplayComponent, { size: 'xl' });
    // modalRef.componentInstance.name = 'World';
  }

  updatePlaylist() {

    let playlistNew = [
      {
        id: "Co9DFYbMFqM"
      }, {
        id: "059sh0cmm-0"
      },
      {
        id: "fc0i2Yc1_io"
      },
      {
        id: "ckH41HiIAFA"
      },
      {
        id: "URUV0mC6_RA"
      }
    ];
    this.playerService.updatePlayList(playlistNew);
  }


  removeFromPlaylist() {
    this.playerService.removeFromPlayList(0);
  }


  addToPlaylist() {
    this.playerService.addToPlayList({ id: "0TMoHVWEUnE" });
  }


  deleteSongFromPlaylist(index) {
    this.playerService.removeFromPlayList(index);
    this.playlist = _.cloneDeep(this.playerService.currPlayList);
  }

  openPlaylistList() {
    if (!this.checkIfHost()) return;

    const modalRef = this.modalService.open(PlaylistListComponent, { size: 'xl' });
    modalRef.componentInstance.modalAction = 'importQueue';
  }


  notifySocket() {
    this.snotifyService.info("Solo l'host della stanza puo' interagire col player!", {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
  }


  checkIfHost() {
    if (this.playerService.isInRoom() && !this.playerService.isHost()) {
      this.notifySocket();
      return false;
    }
    return true;
  }


}
