import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/guard/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginGuard } from './core/guard/login.guard';
import { LayoutComponent } from './layout/layout.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { CompanieComponent } from './pages/companie/companie.component';
import { AutomationsComponent } from './pages/automations/automations.component';
import { BorrowersComponent } from './pages/borrowers/borrowers.component';
import { BranchesComponent } from './pages/branches/branches.component';
import { ImportsComponent } from './pages/imports/imports.component';


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
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      //Paginas criadas por Halysson
      {
        path: 'charts',
        component: ChartsComponent,
      },
      { path: '', redirectTo: 'charts', pathMatch: 'full' },
      {
        path: 'companies',
        component: CompanieComponent,
      },
      { path: '', redirectTo: 'companies', pathMatch: 'full' },
      { path: '', redirectTo: 'charts', pathMatch: 'full' },
      {
        path: 'branches',
        component: BranchesComponent,
      },
      { path: '', redirectTo: 'branches', pathMatch: 'full' },
      { path: '', redirectTo: 'charts', pathMatch: 'full' },
      {
        path: 'borrowers',
        component: BorrowersComponent,
      },
      { path: '', redirectTo: 'borrowers', pathMatch: 'full' },
      { path: '', redirectTo: 'charts', pathMatch: 'full' },
      {
        path: 'imports',
        component: ImportsComponent,
      },
      { path: '', redirectTo: 'imports', pathMatch: 'full' },
      { path: '', redirectTo: 'charts', pathMatch: 'full' },
      {
        path: 'automations',
        component: AutomationsComponent,
      },
      { path: '', redirectTo: 'automations', pathMatch: 'full' },
      //**************************************************** */
    ],
  },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
