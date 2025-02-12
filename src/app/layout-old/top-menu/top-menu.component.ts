import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { filter } from 'rxjs';
import { MenuService } from 'src/app/core/services/menu/menu.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
})
export class TopMenuComponent implements OnInit {
  @Input() isSidebarVisible: boolean = true; // Recebe o estado atual do sidebar
  @Output() toggleSidebar = new EventEmitter<void>(); // Evento para alternar o sidebar

  menuLabel: string = '';
  userName: string = '';
  userEmail: string = '';
  dropdownOpen = false;
  menus: any[] = [];
  
  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const nameFromStorage = sessionStorage.getItem('usr_name');
    const emailFromStorage = sessionStorage.getItem('usr_email');
    if (this.authService.isAuthenticated()) {
      this.menus = this.getMenuHierarchy();
    }

    this.userName = nameFromStorage ? JSON.parse(nameFromStorage) : 'Usuário';
    this.userEmail = emailFromStorage
      ? JSON.parse(emailFromStorage)
      : 'email@dominio.com';

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.url;
        this.menuLabel = this.menuService.getMenuLabelByRoute(currentRoute);
      });

    const initialRoute = this.router.url;
    this.menuLabel = this.menuService.getMenuLabelByRoute(initialRoute);
  }
  getMenuHierarchy(): any[] {
    const parentMenus = this.menuService.getParentMenus();

    const sortedParentMenus = parentMenus.sort((a, b) => a.mnu_id - b.mnu_id);

    return sortedParentMenus.map((parentMenu) => {
      return {
        ...parentMenu,
        children: this.menuService.getChildMenus(parentMenu.mnu_id),
      };
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  emitToggleSidebar(): void {
    this.toggleSidebar.emit(); // Emite o evento para o componente pai
  }
}
