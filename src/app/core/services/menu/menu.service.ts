import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor() {}

  getMenus(): any[] {
    const menus = sessionStorage.getItem('menus');
    if (menus) {
      return JSON.parse(menus);
    }
    return [];
  }

  getParentMenus(): any[] {
    const menus = this.getMenus();
    return menus.filter((menu) => menu.mnu_parent === null);
  }

  getChildMenus(parentId: number): any[] {
    const menus = this.getMenus();
    return menus.filter((menu) => menu.mnu_parent === parentId);
  }
}
