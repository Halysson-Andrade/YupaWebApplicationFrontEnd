import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menuLabelSource = new BehaviorSubject<string>('');
  currentMenuLabel = this.menuLabelSource.asObservable();

  constructor() { }

  changeMenuLabel(menuLabel: string) {
    this.menuLabelSource.next(menuLabel);
  }

  getMenuLabelByRoute(route: string): string {
    const menus = this.getMenus();
    console.log("getMenuLabelByRoute:", menus);
    const matchedMenu = menus.find((menu) => menu.mnu_routerlink === route);
    return matchedMenu ? matchedMenu.mnu_label : '';
  }

  getMenus(): any[] {
    const menus = sessionStorage.getItem('menus');

    if (menus) {
      const permissions = this.getPermissions();
      console.log("Permissions:", permissions);

      const menujson = JSON.parse(menus);
      console.log("Menu JSON antes da validação:", menujson);

      if (permissions.length > 0) {
        const validation = this.filterMenuByPermissions(permissions, menujson);
        console.log("Menu JSON após validação:", validation);
        console.log("Caiu aqui!");
        return validation;
      } else {
        console.log("Nenhuma permissão encontrada.");
        return [];
      }
    }

    console.log("Nenhum menu encontrado no sessionStorage.");
    return [];
  }

  // Função para filtrar menus com base nas permissões
  private filterMenuByPermissions(permissions: any[], menujson: any[]): any[] {
    const validPermissions = new Set(permissions.map(permission => permission.pms_id));
    
    return menujson.filter(menuItem => 
      validPermissions.has(menuItem.read) || menuItem.mnu_parent === null
    );
  }


  getPermissions(): any[] {
    const permissions = sessionStorage.getItem('roles');
    if (permissions) {
      return JSON.parse(permissions);
    }
    return [];
  }

  getParentMenus(): any[] {
    const menus = this.getMenus();
    console.log("GetParaentMenus:", menus);
    return menus.filter((menu) => menu.mnu_parent === null);
  }

  getChildMenus(parentId: number): any[] {
    const menus = this.getMenus();
    console.log("getChildMenus:", menus);
    return menus.filter((menu) => menu.mnu_parent === parentId);
  }
}
