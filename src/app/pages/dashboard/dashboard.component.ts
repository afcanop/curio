import { AfterViewInit, Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from 'src/app/layouts/footer/footer.component';
import { HeaderComponent } from 'src/app/layouts/header/header.component';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { SearchModalComponent } from 'src/app/partials/search-modal/search-modal.component';
import KTComponents from 'src/metronic/core';
import KTLayout from '../../../metronic/app/layouts/demo1';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent, SearchModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements AfterViewInit, OnInit {
  title = 'metronic-tailwind-angular';
  @HostBinding('class') hostClass = 'flex grow';

  ngAfterViewInit(): void {
    KTComponents.init();
    KTLayout.init();
  }

  ngOnInit(): void {}
}
