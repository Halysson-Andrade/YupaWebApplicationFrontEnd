import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  isSidebarVisible: boolean = true; // Sidebar visível inicialmente

  // Método para alternar a visibilidade do sidebar
  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
