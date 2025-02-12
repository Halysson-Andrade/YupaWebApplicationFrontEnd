import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './pages/login/login.module';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';
import { ChangePasswordModule } from './pages/change-password/change-password.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ForgotPasswordModule } from './pages/forgot-password/forgot-password.module';
import { HomeModule } from './pages/home/home.module';
import { LayoutModule } from './layout/layout.module';
import { PermissionModule } from './pages/permission/permission.module';
import { MenuModule } from './pages/menu/menu.module';
import { UserModule } from './pages/user/user.module';
import { ProfileModule } from './pages/profile/profile.module';

export function tokenGetter() {
  return sessionStorage.getItem('auth_token');
}

@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    HomeModule,
    MenuModule,
    UserModule,
    ProfileModule,
    PermissionModule,
    ChangePasswordModule,
    ForgotPasswordModule,
    LayoutModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.apiDomain],
        disallowedRoutes: [`${environment.apiDomain}${environment.authRoute}`],
      },
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
