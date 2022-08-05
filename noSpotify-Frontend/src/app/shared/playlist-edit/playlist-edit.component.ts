import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Playlist } from '@app/_models/playlist';
import { AccountService } from '@app/_services';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-playlist-edit',
  templateUrl: './playlist-edit.component.html',
  styleUrls: ['./playlist-edit.component.less']
})
export class PlaylistEditComponent implements OnInit {

  constructor(private snotifyService:SnotifyService,private modalService: NgbModal, public activeModal: NgbActiveModal, private accountService: AccountService) { }

  viewMode = 'add';
  modalRef = null;
  fileToUpload: File | null = null;

  playlist: Playlist = {
    public: true,
    owner: null,
    ownerName: null,
    playlist: [],
    playlistName: "",
    id: null
  }


  ngOnInit(): void {
  }


  updatePlaylist(){
    this.accountService.updatePlaylist(this.playlist)
    .subscribe({
      next: () => {
        this.snotifyService.success("Playlist aggiornata", "", {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });
        this.activeModal.close()
      },
      error: error => {
        this.snotifyService.error("Errore aggiornamento playlist", "", {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });
        this.activeModal.close()

      }
    });
  }


  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}


checkLoadedPlaylist(){
  let fileReader = new FileReader();
  fileReader.onload = (e) => {

    let jsonPayload = {file:fileReader.result}

    this.accountService.checkUploadedPlaylist(jsonPayload)
    .subscribe({
      next: (res) => {
        if(res && res['playlist']){
          
            this.playlist.playlist = res['playlist'];

            this.snotifyService.success("Playlist importata correttamente", "", {
              timeout: 2000,
              showProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true
            });

        }else{
          this.snotifyService.error("Errore nel formato della playlist", "", {
            timeout: 2000,
            showProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          });
        }
        //this.activeModal.close()
      },
      error: error => {
        this.snotifyService.error("Errore nel formato della playlist", "", {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });

        // this.activeModal.close()

      }
    });


  }
  fileReader.readAsText(this.fileToUpload);
}

  createPlaylist() {
    this.accountService.createPlaylist(this.playlist)
      .subscribe({
        next: () => {
          this.snotifyService.success("Nuova playlist creata", "", {
            timeout: 2000,
            showProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          });
          this.activeModal.close()
        },
        error: error => {
          this.snotifyService.error("Errore nella creazione della playlist", "", {
            timeout: 2000,
            showProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          });
          this.activeModal.close()

        }
      });
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlist.playlist, event.previousIndex, event.currentIndex);

    // this.playerService.updatePlayList(_.cloneDeep(this.playlist),true);
  }

  deleteSongFromPlaylist(index){

    this.playlist.playlist.splice(index,1)
  }
}
