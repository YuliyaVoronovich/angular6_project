import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {Http, RequestOptions, HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import { ScrollToModule } from 'ng2-scroll-to-el';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SelectModule} from 'ng-select';
import {ImageUploadModule} from 'angular2-image-upload';
import {NgxPaginationModule} from 'ngx-pagination';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {LoginGuard} from './_guard/login.guard';

import { AppComponent } from './app.component';
import {AdminCompaniesListComponent} from './admin/admin-companies-list/admin-companies-list.component';
import {CompanyResolve} from './_services/companyResolve.service';
import {AdminCompanyModificateComponent} from './admin/admin-company-modificate/admin-company-modificate.component';
import {AdminModulesListComponent} from './admin/admin-modules-list/admin-modules-list.component';
import {AdminUsersListComponent} from './admin/admin-users-list/admin-users-list.component';
import {AdminUserModificateComponent} from './admin/admin-user-modificate/admin-user-modificate.component';
import {UserResolve} from './_services/userResolve.service';
import {AdminRolesListComponent} from './admin/admin-roles-list/admin-roles-list.component';
import {AdminRoleModificateComponent} from './admin/admin-role-modificate/admin-role-modificate.component';
import {AdminLocationsComponent} from './admin/admin-locations/admin-locations.component';
import {
  DialogDeleteSaleComponent,
  SalesListComponent
} from './sales/sales-list/sales-list.component';
import {SaleModificateComponent} from './sales/sale-modificate/sale-modificate.component';
import {SaleResolve} from './_services/saleResolve.service';
import {AdminComponent} from './admin/admin.component';
import {SalesComponent} from './sales/sales.component';
import {LoginComponent} from './login/login.component';
import {Error404Component} from './errors/error-404/error-404.component';
import {GeneralMenuComponent} from './_common/general-menu/general-menu.component';
import {AdminMenuComponent} from './_common/admin-menu/admin-menu.component';
import {SaleListAdressComponent} from './sales/sale-list-adress/sale-list-adress.component';
import {GeneralLeftMenuComponent} from './_common/general-left-menu/general-left-menu.component';
import {MenuUserInfoComponent} from './_common/menu-user-info/menu-user-info.component';
import {Error403Component} from './errors/error-403/error-403.component';

import {HeaderService} from './_services/header.service';
import {LoginService} from './_services/login.service';
import {CompanyService} from './_services/company.service';
import {ModuleService} from './_services/module.service';
import {SaleService} from './_services/sale.service';
import {UserService} from './_services/user.service';
import {LabelService} from './_services/label.service';
import {LocationService} from './_services/location.service';
import {PermissionService} from './_services/permission.service';
import {RoleService} from './_services/role.service';
import {SharedService} from './_services/shared.service';
import {ImageService} from './_services/image.service';

import {MaterialModule} from './material.module';
import {RequestService} from './_services/request.service';
import { AdminRequestLocationComponent } from './admin/admin-request-location/admin-request-location.component';
import {Globals} from './_common/globals';
import { SalesListSearchComponent } from './sales/sales-list-search/sales-list-search.component';

const adminCompaniesRoutes: Routes = [
  {path: '', component: AdminCompaniesListComponent},
  {path: 'company', component: AdminCompanyModificateComponent},
  /*{path: 'company/:id', component: AdminCompaniesModificateComponent}*/
  {path: 'company/:id', component: AdminCompanyModificateComponent, resolve: {data: CompanyResolve}}
];

const adminModulesRoutes: Routes = [
  {path: '', component: AdminModulesListComponent},
];
const adminUsersRoutes: Routes = [
  {path: '', component: AdminUsersListComponent},
  {path: 'user', component: AdminUserModificateComponent, canActivate: [LoginGuard]},
  {path: 'user/:id', component: AdminUserModificateComponent, resolve: {data: UserResolve}}
];
const adminRolesRoutes: Routes = [
  {path: '', component: AdminRolesListComponent},
  /*  {path: 'role', component: AdminRoleModificateComponent, canActivate: [LoginGuard]},*/
  {path: 'role/:id', component: AdminRoleModificateComponent}
];
const adminLocationsRoutes: Routes = [
  {path: '', component: AdminLocationsComponent},
];

const salesRoutes: Routes = [
  {path: '', component: SalesListComponent},
  {path: 'sale', component: SaleModificateComponent, canActivate: [LoginGuard]},
  {path: 'sale/:id', component: SaleModificateComponent, resolve: {data: SaleResolve}}
];

/*определение основных маршрутов*/
const routes: Routes = [

  {path: 'admin/companies', component: AdminComponent, children: adminCompaniesRoutes},
  {path: 'admin/modules', component: AdminComponent, children: adminModulesRoutes},
  {path: 'admin/users', component: AdminComponent, children: adminUsersRoutes},
  {path: 'admin/roles', component: AdminComponent, children: adminRolesRoutes},
  {path: 'admin/locations', component: AdminComponent, children: adminLocationsRoutes},
  {path: 'sales', component: SalesComponent, children: salesRoutes},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LoginComponent},
  {path: '404', component: Error404Component},
  {path: '403', component: Error403Component},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  declarations: [
    AppComponent,
    SalesComponent,
    GeneralMenuComponent,
    LoginComponent,
    AdminComponent,
    AdminCompanyModificateComponent,
    Error404Component,
    AdminMenuComponent,
    AdminUserModificateComponent,
    AdminRolesListComponent,
    SaleModificateComponent,
    SalesListComponent,
    SaleListAdressComponent,
    AdminCompaniesListComponent,
    AdminModulesListComponent,
    AdminUsersListComponent,
    GeneralLeftMenuComponent,
    AdminRoleModificateComponent,
    AdminLocationsComponent,
    MenuUserInfoComponent,
    Error403Component,
    AdminRequestLocationComponent,
    SalesListSearchComponent ,
    DialogDeleteSaleComponent
  ],
  imports: [
    MaterialModule,
    SelectModule,
    BrowserModule,
    NgxPaginationModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    RouterModule.forRoot(routes),
    ImageUploadModule.forRoot(),
    NgbModule.forRoot(),
    ScrollToModule.forRoot()
  ],
  providers: [
    {provide: RequestOptions, useClass: HeaderService},
    LoginGuard,
    LoginService,
    CompanyService,
    CompanyResolve,
    ModuleService,
    SaleService,
    SaleResolve,
    UserService,
    UserResolve,
    LabelService,
    LocationService,
    PermissionService,
    RoleService,
    SharedService,
    ImageService,
    RequestService,
    Globals
  ],
  entryComponents: [DialogDeleteSaleComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
