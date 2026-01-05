import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { NavComponent } from '../../../../../shared/nav/nav.component/nav.component';
import { SideNavComponent } from '../../../../../shared/side-nav/side-nav-postulante.component/side-nav.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-postulante',
  standalone: true,
imports: [MatSidenavModule, RouterModule],
templateUrl: './postulante.component.html',
styleUrl: './postulante.component.css'
})
export class PostulanteComponent implements OnInit{
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSmallScreen = false;
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;

        if (this.isSmallScreen) {
          this.sidenavMode = 'over';
          this.sidenavOpened = false;
        } else {
          this.sidenavMode = 'side';
          this.sidenavOpened = true;
        }
      });
  }

  onToggleSidenav(): void {
    this.sidenav.toggle();
  }

  onNavItemClicked() {
   if (this.sidenavMode === 'over') {
    this.sidenav.close();
  }
  }
}
