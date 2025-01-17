import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfiguratorService } from 'src/app/core/services/configurator.service';
import { ConfiguratorState } from 'src/app/core/services/model';

@Component({
  selector: 'app-rifle-preview',
  templateUrl: './rifle-preview.component.html',
  styles: [
  ]
})
export class RiflePreviewComponent {

  state: any; 
  private subscription!: Subscription;
  
  constructor(private configuratorService: ConfiguratorService) {}
  
  ngOnInit() {
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      console.log('[RiflePreviewComponent] otrzymano state:', state);
      this.state = state; 
    });
  }

}
