import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '@app/shared/player/player.service';
import { PlaylistEditComponent } from '@app/shared/playlist-edit/playlist-edit.component';
import { PlaylistListComponent } from '@app/shared/playlist-list/playlist-list.component';
import { Playlist } from '@app/_models/playlist';
import { AccountService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FastAverageColor } from 'fast-average-color';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { YtPlayerService } from 'yt-player-angular';

const fac = new FastAverageColor();

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.less']
})
export class AlbumComponent implements OnInit, OnDestroy {

  constructor(private ytService:YtPlayerService ,private snotifyService: SnotifyService,private spinner: NgxSpinnerService,private modalService:NgbModal,private playerService: PlayerService, private route: ActivatedRoute, private accountService: AccountService) { }


  idAlbum = null;
  rgb = null;

  musicList: any = [];
  

  ngOnDestroy(): void {

    // document.getElementById('headerBar').style.background = "#1b1c1e";

  }

  ngOnInit(): void {

    this.spinner.show();

    this.idAlbum = this.route.snapshot.paramMap.get('id');


    this.accountService.getMusicFromAlbum(this.idAlbum)
      .subscribe(res => {

        if (res) {
          this.musicList = res;

          if (res && res[0] && res[0]["colorCover"]) {


            setTimeout(() => {

              let color = res[0]["colorCover"]

              document.getElementById('posterArtist').parentElement.style.background = "linear-gradient(65deg, rgba(0,0,0,0.8687850140056023) 0%, rgba(" + color[0] + "," + color[1] + "," + color[2] + ",1) 100%)"

              document.getElementById('posterArtist').parentElement.style.color = color.isDark ? '#fff' : '#000';
            }, 100)
            this.spinner.hide();

          }
        } else {
          this.spinner.hide();

        }


      });

  }


  playMusic(music) {
    this.playerService.updatePlayList([music]);
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
      const modalRef = this.modalService.open(PlaylistListComponent,{size:'xl'});
    
      modalRef.componentInstance.modalAction = 'addMusic';
      modalRef.componentInstance.musicToAdd = music;
  }



  playAlbum() {
    this.playerService.updatePlayList(this.musicList);
    this.snotifyService.info("Album in riproduzione", "", {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
  }

  averageColor(imageElement) {



    // Create the canvas element
    var canvas
      = document.createElement('canvas'),

      // Get the 2D context of the canvas
      context
        = canvas.getContext &&
        canvas.getContext('2d'),
      imgData, width, height,
      length,

      // Define variables for storing
      // the individual red, blue and
      // green colors
      rgb = { r: 0, g: 0, b: 0 },

      // Define variable for the
      // total number of colors
      count = 0;

    // Set the height and width equal
    // to that of the canvas and the image
    height = canvas.height =
      imageElement.naturalHeight ||
      imageElement.offsetHeight ||
      imageElement.height;
    width = canvas.width =
      imageElement.naturalWidth ||
      imageElement.offsetWidth ||
      imageElement.width;

    // Draw the image to the canvas
    context.drawImage(imageElement, 0, 0);

    // Get the data of the image
    imgData = context.getImageData(
      0, 0, width, height);

    // Get the length of image data object
    length = imgData.data.length;

    for (var i = 0; i < length; i += 4) {

      // Sum all values of red colour
      rgb.r += imgData.data[i];

      // Sum all values of green colour
      rgb.g += imgData.data[i + 1];

      // Sum all values of blue colour
      rgb.b += imgData.data[i + 2];

      // Increment the total number of
      // values of rgb colours
      count++;
    }

    // Find the average of red
    rgb.r
      = Math.floor(rgb.r / count);

    // Find the average of green
    rgb.g
      = Math.floor(rgb.g / count);

    // Find the average of blue
    rgb.b
      = Math.floor(rgb.b / count);

    return rgb;
  }

  // Function to set the background
  // color of the second div as
  // calculated average color of image

  // setTimeout(() => {
  //     rgb = averageColor(
  //         document.getElementById('img'));

  //     // Select the element and set its
  //     // background color
  //     document
  //         .getElementById("block")
  //         .style.backgroundColor =
  //         'rgb(' + rgb.r + ','
  //         + rgb.g + ','
  //         + rgb.b + ')';
  // }, 500)



  openModalEditPlaylist() {
    const modalRef = this.modalService.open(PlaylistEditComponent, { size: 'xl' });
    modalRef.componentInstance.viewMode = 'add';
    let playlist = {
        playlist:this.musicList,
        public:true,
        playlistName: this.musicList[0].album
    }
    modalRef.componentInstance.playlist = playlist
    // modalRef.closed.subscribe((modalClosed) => {
    //   this.getAllPlaylist()
    // })
  }
}
