import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MenuService } from 'src/app/core/services/menu/menu.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SideBarMenuComponent implements OnInit {
  environment = environment;
  menus: any[] = [];

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.menus = this.getMenuHierarchy();
    }
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

  onMenuClick(menuLabel: string) {
    this.menuService.changeMenuLabel(menuLabel);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
