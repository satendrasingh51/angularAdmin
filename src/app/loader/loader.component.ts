import { Component, OnInit } from '@angular/core';
import {LoaderService} from '../services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  show = false;
  private subscription: Subscription;
  constructor(private ls: LoaderService) { }

  ngOnInit() {
    this.subscription = this.ls.loaderState.subscribe((showState: boolean) => {
      this.show = showState;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
