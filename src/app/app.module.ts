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
import {Globals} from './_common/globals';

import { AppComponent } from './app.component';
import {
  AdminCompaniesListComponent, DialogCompanyBlockComponent,
  DialogCompanyUnblockComponent
} from './admin/admin-companies-list/admin-companies-list.component';
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
import {LoginComponent} from './login/login.component';
import {Error404Component} from './errors/error-404/error-404.component';
import {GeneralMenuComponent} from './_common/general-menu/general-menu.component';
import {AdminMenuComponent} from './_common/admin-menu/admin-menu.component';
import {GeneralLeftMenuComponent} from './_common/general-left-menu/general-left-menu.component';
import {MenuUserInfoComponent} from './_common/menu-user-info/menu-user-info.component';
import {Error403Component} from './errors/error-403/error-403.component';
import {ClientsListComponent} from './clients/clients-list/clients-list.component';
import { ClientModificateComponent } from './clients/client-modificate/client-modificate.component';
import { AdminRequestLocationComponent } from './admin/admin-request-location/admin-request-location.component';
import { SalesListSearchComponent } from './sales/sales-list-search/sales-list-search.component';
import {AgreementsCsListComponent} from './agreements-cs-list/agreements-cs-list.component';
import { SaleReguestLocationComponent } from './sales/sale-reguest-location/sale-reguest-location.component';
import { ClientListSearchComponent } from './clients/client-list-search/client-list-search.component';
import { GeneralTemplateComponent } from './_common/general-template/general-template.component';
import { HousesListComponent } from './houses/houses-list/houses-list.component';
import { HouseModificateComponent } from './houses/house-modificate/house-modificate.component';

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
import {AgreementService} from './_services/agreement.service';
import {RequestService} from './_services/request.service';
import {ClientService} from './_services/client.service';
import {ClientResolve} from './_services/clientResolve.service';
import {HouseService} from './_services/house.service';
import {HouseResolve} from './_services/HouseResolve';

import {MaterialModule} from './material.module';
import { SaleListPhotoComponent } from './sales/sale-list-photo/sale-list-photo.component';
import {NgxGalleryModule} from 'ngx-gallery';


import {SanitizeHtmlPipe} from './_pipes/sanitizeHtml.pipe';
import { HouseListSearchComponent } from './houses/house-list-search/house-list-search.component';




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
const clientsRoutes: Routes = [
  {path: '', component: ClientsListComponent},
  {path: 'client', component: ClientModificateComponent, canActivate: [LoginGuard]},
  {path: 'client/:id', component: ClientModificateComponent, resolve: {data: ClientResolve}}
];
const housesRoutes: Routes = [
  {path: '', component: HousesListComponent},
  {path: 'house', component: HouseModificateComponent, canActivate: [LoginGuard]},
  {path: 'house/:id', component: HouseModificateComponent, resolve: {data: HouseResolve}}
];

const agreements: Routes = [
  {path: '', component: AgreementsCsListComponent}
]
/*определение основных маршрутов*/
const routes: Routes = [

  {path: 'admin/companies', component: AdminComponent, children: adminCompaniesRoutes},
  {path: 'admin/modules', component: AdminComponent, children: adminModulesRoutes},
  {path: 'admin/users', component: AdminComponent, children: adminUsersRoutes},
  {path: 'admin/roles', component: AdminComponent, children: adminRolesRoutes},
  {path: 'admin/locations', component: AdminComponent, children: adminLocationsRoutes},
  {path: 'sales', component: GeneralTemplateComponent, children: salesRoutes},
  {path: 'clients', component: GeneralTemplateComponent, children: clientsRoutes},
  {path: 'houses', component: GeneralTemplateComponent, children: housesRoutes},
  {path: 'argeements/cs', component: GeneralTemplateComponent, children: agreements},
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
    AdminCompaniesListComponent,
    AdminModulesListComponent,
    AdminUsersListComponent,
    GeneralLeftMenuComponent,
    AdminRoleModificateComponent,
    AdminLocationsComponent,
    MenuUserInfoComponent,
    Error403Component,
    AdminRequestLocationComponent,
    SalesListSearchComponent,
    AgreementsCsListComponent,
    ClientsListComponent,
    ClientModificateComponent,
    SaleListPhotoComponent,
    SaleReguestLocationComponent,
    ClientListSearchComponent,
    GeneralTemplateComponent,
    HousesListComponent,
    HouseModificateComponent,
    DialogDeleteSaleComponent,
    DialogCompanyUnblockComponent,
    DialogCompanyBlockComponent,
    HouseListSearchComponent,
    SanitizeHtmlPipe
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
    NgxGalleryModule,
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
    AgreementService,
    ClientService,
    ClientResolve,
    HouseService,
    HouseResolve,
    Globals,
    SanitizeHtmlPipe
  ],
  entryComponents: [DialogDeleteSaleComponent, DialogCompanyBlockComponent, DialogCompanyUnblockComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
