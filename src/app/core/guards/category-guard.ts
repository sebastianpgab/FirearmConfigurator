import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { ConfiguratorService } from '../services/configurator.service';

@Injectable({ providedIn: 'root' })
export class CategoryGuard implements CanActivate {

  constructor(
    private router: Router,
    private configuratorService: ConfiguratorService
  ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const path = state.url;
    const config = this.configuratorService.getState();

    if (path === '/r8/barrel') {
      return this.checkAndRedirect(config.selectedRifle);
    }

    if (path === '/r8/stock') {
      return this.checkAndRedirect(config.selectedContour);
    }

    if (path === '/r8/chamberBolt') {
      return this.checkAndRedirect(
        config.selectedButtstockType || config.selectedStockColorSynthetic
      );
    }

    if (path === '/r8/accessory') {
      return this.checkAndRedirect(config.selectedChamberEngraving);
    }

    if (path === '/r8/summary') {
      return true;
    }

    this.router.navigate(['/r8/model']);
    return false;
  }

  private checkAndRedirect(condition: any): boolean {
    if (condition !== null) {
      return true;
    } else {
      this.router.navigate(['/r8/model']);
      return false;
    }
  }
}
