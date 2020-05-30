import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from '../../services/storage.service';
import { from, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [NgbDropdownConfig],



})
export class HeaderComponent implements OnInit {
  profile_img: any = '';
  stgId: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private storageservice: StorageService) {

    this.stgId = this.storageservice.watchStorage().subscribe(() => {
      this.profile_img = localStorage.getItem('profileImage');
    })
    this.profile_img = localStorage.getItem('profileImage')
  }

  openVerticallyCentered(content) {

    this.modalService.open(content, { centered: true });
  }
  ngOnInit() {

    this.stgId = this.storageservice.watchStorage().subscribe(() => {
      this.profile_img = localStorage.getItem('profileImage');
    })
    this.profile_img = localStorage.getItem('profileImage')
  }
  logout() {
    sessionStorage.clear();
    this.modalService.dismissAll();
    this.router.navigate(['/auth/login'], { relativeTo: this.route });
    localStorage.clear();
  }
  // ngOnDestroy(): void {
   
  //   this.stgId.unsubscribe()
  // }


}
