import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/guard/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginGuard } from './core/guard/login.guard';
import { LayoutComponent } from './layout/layout.component';
import { UserComponent } from './pages/user/user.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PermissionComponent } from './pages/permission/permission.component';
import { CompanieComponent } from './pages/companie/companie.component';
import { BranchesComponent } from './pages/branches/branches.component';
import { CarsComponent } from './pages/cars/cars.component';
import { UploadsComponent } from './pages/uploads/uploads.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { ProcesslistComponent } from './pages/processlist/processlist.component';
import { KanbanComponent } from './pages/kanban/kanban.component';
import { ImportsComponent } from './pages/imports/imports.component';
import { AutomationsComponent } from './pages/automations/automations.component';
import { SystemsComponent } from './pages/systems/systems.component';
import { CustomUsersComponent } from './pages/custom-users/custom-users.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'troca-de-senha',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'recuperar-senha',
    component: ForgotPasswordComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'permissions',
        component: PermissionComponent,
      },
      {
        path: 'profiles',
        component: ProfileComponent,
      },
      {
        path: 'menus',
        component: MenuComponent,
      },
      {
        path: 'users',
        component: CustomUsersComponent,
      },
      {
        path: 'cars',
        component: CarsComponent,
      },
      {
        path: 'uploads',
        component: UploadsComponent,
      },
      {
        path: 'charts',
        component: ChartsComponent,
      },
      {
        path: 'processlist',
        component: ProcesslistComponent,
      },
      {
        path: 'kanban',
        component: KanbanComponent,
      },     
      
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
