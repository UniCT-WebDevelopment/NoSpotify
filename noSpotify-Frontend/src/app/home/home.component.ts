import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;

    constructor(private router:Router,private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }

    search() {
        setTimeout(() => {
          let searchTitle = (document.getElementById("searchBoxHome") as HTMLInputElement).value
          this.router.navigate(['search', searchTitle]);
        }, 100);
    
      }
    
      onKeyDownEvent(event: any) {   
    
        let searchTitle = (document.getElementById("searchBoxHome") as HTMLInputElement).value
    
        this.router.navigate(['search', searchTitle]);
    
      }
}