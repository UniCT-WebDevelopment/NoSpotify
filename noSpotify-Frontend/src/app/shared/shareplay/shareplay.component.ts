import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { Socket } from 'ngx-socket-io';
import { PlayerService } from '../player/player.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-shareplay',
  templateUrl: './shareplay.component.html',
  styleUrls: ['./shareplay.component.less']
})
export class ShareplayComponent implements OnInit {

  constructor(private snotifyService: SnotifyService,private clipboard: Clipboard, private socket: Socket, private playerService: PlayerService, private accountService: AccountService) { }

  roomId = "";
  room = null;


  ngOnInit(): void {
  }


  createRoom() {
    this.socket.emit("initRoom", JSON.stringify({ userData: this.accountService.userValue }));
  }


  copyId() {
    this.clipboard.copy(this.room.roomId);
    this.snotifyService.info("SharePlay ID Copiato", "", {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true
    });
  }

  joinRoom() {
    this.socket.emit("joinToOtherRoom", JSON.stringify({ roomId: this.roomId, userData: this.accountService.userValue }));
  }



  disconnectFromRoom() {
    this.socket.emit("disconnectFromRoom");
  }



  isInRoom() {
    this.room = this.playerService.getRoom();
    return this.playerService.isInRoom();
  }

  isHost() {
    return this.playerService.isHost();

  }


  getRoom() {

  }


}
