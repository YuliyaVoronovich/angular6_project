import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {Http, RequestOptions, HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import {ScrollToModule} from 'ng2-scroll-to-el';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SelectModule} from 'ng-select';
import {ImageUploadModule} from 'angular2-image-upload';
import {NgxPaginationModule} from 'ngx-pagination';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {LoginGuard} from './_guard/login.guard';
import {Globals} from './_common/globals';

import {AppComponent} from './app.component';
import {
  AdminCompaniesListComponent, DialogCompanyBlockComponent,
  DialogCompanyUnblockComponent
} from './admin/admin-companies-list/admin-companies-list.component';
import {CompanyResolve} from './_services/company_resolve.service';
import {AdminCompanyModificateComponent} from './admin/admin-company-modificate/admin-company-modificate.component';
import {AdminModulesListComponent} from './admin/admin-modules-list/admin-modules-list.component';
import {AdminUsersListComponent} from './admin/admin-users-list/admin-users-list.component';
import {AdminUserModificateComponent} from './admin/admin-user-modificate/admin-user-modificate.component';
import {UserResolve} from './_services/user_resolve.service';
import {AdminRolesListComponent} from './admin/admin-roles-list/admin-roles-list.component';
import {AdminRoleModificateComponent} from './admin/admin-role-modificate/admin-role-modificate.component';
import {AdminLocationsComponent} from './admin/admin-locations/admin-locations.component';
import {
  DialogDeleteSaleComponent, DialogReclameSaleComponent, SalesListComponent
} from './sales/sales-list/sales-list.component';
import {SaleModificateComponent} from './sales/sale-modificate/sale-modificate.component';
import {SaleResolve} from './_services/sale_resolve.service';
import {AdminComponent} from './admin/admin.component';
import {LoginComponent} from './login/login.component';
import {Error404Component} from './errors/error-404/error-404.component';
import {GeneralMenuComponent} from './_common/general-menu/general-menu.component';
import {AdminMenuComponent} from './_common/admin-menu/admin-menu.component';
import {GeneralLeftMenuComponent} from './_common/general-left-menu/general-left-menu.component';
import {MenuUserInfoComponent} from './_common/menu-user-info/menu-user-info.component';
import {Error403Component} from './errors/error-403/error-403.component';
import {ClientsListComponent, DialogDeleteClientComponent} from './clients/clients-list/clients-list.component';
import {ClientModificateComponent} from './clients/client-modificate/client-modificate.component';
import {AdminRequestLocationComponent} from './admin/admin-request-location/admin-request-location.component';
import {SalesListSearchComponent} from './sales/sales-list-search/sales-list-search.component';
import {AgreementsCsListComponent} from './agreements-cs-list/agreements-cs-list.component';
import {ClientsListSearchComponent} from './clients/clients-list-search/clients-list-search.component';
import {GeneralTemplateComponent} from './_common/general-template/general-template.component';
import {
  DialogDeleteHouseComponent,
  DialogReclameHouseComponent,
  HousesListComponent
} from './houses/houses-list/houses-list.component';
import {HouseModificateComponent} from './houses/house-modificate/house-modificate.component';
import {HousesListSearchComponent} from './houses/houses-list-search/houses-list-search.component';
import {HouseListPhotoComponent} from './houses/house-list-photo/house-list-photo.component';
import {SaleModificateMapComponent} from './sales/sale-modificate-map/sale-modificate-map.component';
import {HouseModificateMapComponent} from './houses/house-modificate-map/house-modificate-map.component';
import {RolesListComponent} from './roles/roles-list/roles-list.component';
import {FilterPipe, RoleModificateComponent} from './roles/role-modificate/role-modificate.component';
import {UsersListComponent} from './users/users-list/users-list.component';
import {UserModificateComponent} from './users/user-modificate/user-modificate.component';
import {CompanyModificationComponent} from './companies/company-modification/company-modification.component';
import {SalesListArchiveComponent} from './sales/sales-list-archive/sales-list-archive.component';
import {HousesListArchiveComponent} from './houses/houses-list-archive/houses-list-archive.component';
import {ClientsListArchiveComponent} from './clients/clients-list-archive/clients-list-archive.component';
import {
  ClientsHouseListComponent,
  DialogDeleteClientHouseComponent
} from './clients_house/clients-house-list/clients-house-list.component';
import {ClientHouseModificationComponent} from './clients_house/client-house-modification/client-house-modification.component';
import {ClientsHouseListSearchComponent} from './clients_house/clients-house-list-search/clients-house-list-search.component';
import {ClientsHouseListArchiveComponent} from './clients_house/clients-house-list-archive/clients-house-list-archive.component';
import {SalesListModerationComponent} from './sales/sales-list-moderation/sales-list-moderation.component';
import {SalesListDeleteComponent} from './sales/sales-list-delete/sales-list-delete.component';
import {SaleModificateModerationComponent} from './sales/sale-modificate-moderation/sale-modificate-moderation.component';
import {SaleModificateDeleteComponent} from './sales/sale-modificate-delete/sale-modificate-delete.component';
import {HousesListDeleteComponent} from './houses/houses-list-delete/houses-list-delete.component';
import {HousesListModerationComponent} from './houses/houses-list-moderation/houses-list-moderation.component';
import {HouseModificateModerationComponent} from './houses/house-modificate-moderation/house-modificate-moderation.component';
import {HouseModificateDeleteComponent} from './houses/house-modificate-delete/house-modificate-delete.component';
import { CallsListComponent } from './calls/calls-list/calls-list.component';
import { CallModificateComponent } from './calls/call-modificate/call-modificate.component';
import { CallsHouseListComponent } from './calls_house/calls-house-list/calls-house-list.component';
import { CallHouseModificateComponent } from './calls_house/call-house-modificate/call-house-modificate.component';
import {SaleListPhotoComponent} from './sales/sale-list-photo/sale-list-photo.component';
import {CalculatorComponent} from './_common/calculator/calculator.component';
import { AdminSitesListComponent } from './admin/admin-sites-list/admin-sites-list.component';
import { PartnerListComponent } from './users/partner-list/partner-list.component';
import { CallsOtherListComponent } from './calls_other/calls-other-list/calls-other-list.component';
import { AdminSourcesListComponent } from './admin/admin-sources-list/admin-sources-list.component';
import { CallsListSearchComponent } from './calls/calls-list-search/calls-list-search.component';
import { CallsHouseListSearchComponent } from './calls_house/calls-house-list-search/calls-house-list-search.component';
import { SaleShowComponent } from './sales/sale-show/sale-show.component';

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
import {ClientResolve} from './_services/client_resolve.service';
import {HouseService} from './_services/house.service';
import {HouseResolve} from './_services/house_resolve';
import {ClientHouseService} from './_services/client_house.service';
import {ClientHouseResolve} from './_services/client_house_resolve.service';
import {CallResolve} from './_services/call_resolve.service';
import {CallService} from './_services/call.service';
import {CallHouseService} from './_services/call_house.service';
import {CallHouseResolve} from './_services/call_house_resolve.service';
import {SiteService} from './_services/site_service';
import {CallOtherService} from './_services/call_other.service';
import {SourceService} from './_services/source.service';

import {MaterialModule} from './material.module';
import {NgxGalleryModule} from 'ngx-gallery';

import {SanitizeHtmlPipe} from './_pipes/sanitize_html.pipe';



const adminCompaniesRoutes: Routes = [
  {path: '', component: AdminCompaniesListComponent},
  {path: 'company', component: AdminCompanyModificateComponent},
  /*{path: 'company/:id', component: AdminCompaniesModificateComponent}*/
  {path: 'company/:id', component: AdminCompanyModificateComponent, resolve: {data: CompanyResolve}}
];

const adminModulesRoutes: Routes = [
  {path: '', component: AdminModulesListComponent},
];
const adminSitesRoutes: Routes = [
  {path: '', component: AdminSitesListComponent},
];
const adminSourcesRoutes: Routes = [
  {path: '', component: AdminSourcesListComponent},
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
  {path: 'sale/:id', component: SaleModificateComponent, resolve: {data: SaleResolve}},
  {path: 'archive', component: SalesListArchiveComponent},
  {path: 'archive/sale', component: SaleModificateComponent, canActivate: [LoginGuard]},
  {path: 'archive/sale/:id', component: SaleModificateComponent, resolve: {data: SaleResolve}},
  {path: 'moderation', component: SalesListModerationComponent, canActivate: [LoginGuard]},
  {path: 'moderation/sale/:id', component: SaleModificateModerationComponent, resolve: {data: SaleResolve}},
  {path: 'delete', component: SalesListDeleteComponent, canActivate: [LoginGuard]},
  {path: 'delete/sale/:id', component: SaleModificateDeleteComponent, resolve: {data: SaleResolve}}
];
const clientsRoutes: Routes = [
  {path: '', component: ClientsListComponent},
  {path: 'client', component: ClientModificateComponent, canActivate: [LoginGuard]},
  {path: 'client/:id', component: ClientModificateComponent, resolve: {data: ClientResolve}},
  {path: 'archive', component: ClientsListArchiveComponent, canActivate: [LoginGuard]},
  {path: 'archive/client', component: ClientModificateComponent, canActivate: [LoginGuard]},
  {path: 'archive/client/:id', component: ClientModificateComponent, resolve: {data: ClientResolve}}
];
const housesRoutes: Routes = [
  {path: '', component: HousesListComponent},
  {path: 'house', component: HouseModificateComponent, canActivate: [LoginGuard]},
  {path: 'house/:id', component: HouseModificateComponent, resolve: {data: HouseResolve}},
  {path: 'archive', component: HousesListArchiveComponent, canActivate: [LoginGuard]},
  {path: 'archive/house', component: HouseModificateComponent, canActivate: [LoginGuard]},
  {path: 'archive/house/:id', component: HouseModificateComponent, resolve: {data: HouseResolve}},
  {path: 'moderation', component: HousesListModerationComponent, canActivate: [LoginGuard]},
  {path: 'moderation/house/:id', component: HouseModificateModerationComponent, resolve: {data: HouseResolve}},
  {path: 'delete', component: HousesListDeleteComponent, canActivate: [LoginGuard]},
  {path: 'delete/house/:id', component: HouseModificateDeleteComponent, resolve: {data: HouseResolve}}
];
const clientsHouseRoutes: Routes = [
  {path: '', component: ClientsHouseListComponent},
  {path: 'client', component: ClientHouseModificationComponent, canActivate: [LoginGuard]},
  {path: 'client/:id', component: ClientHouseModificationComponent, resolve: {data: ClientHouseResolve}},
  {path: 'archive', component: ClientsHouseListArchiveComponent, canActivate: [LoginGuard]},
  {path: 'archive/client', component: ClientHouseModificationComponent, canActivate: [LoginGuard]},
  {path: 'archive/client/:id', component: ClientHouseModificationComponent, resolve: {data: ClientHouseResolve}}
];
const rolesRoutes: Routes = [
  {path: '', component: RolesListComponent},
  {path: 'role', component: RoleModificateComponent, canActivate: [LoginGuard]},
  {path: 'role/:id', component: RoleModificateComponent}
];
const usersRoutes: Routes = [
  {path: '', component: UsersListComponent},
  {path: 'user', component: UserModificateComponent, canActivate: [LoginGuard]},
  {path: 'user/:id', component: UserModificateComponent, resolve: {data: UserResolve}},
  {path: 'user', component: UserModificateComponent, canActivate: [LoginGuard]},
];
const partnersRoutes: Routes = [
  {path: '', component: PartnerListComponent}
];
const companyRoutes: Routes = [
  {path: '', component: CompanyModificationComponent, resolve: {data: CompanyResolve}}
];
const callsRoutes: Routes = [
  {path: '', component: CallsListComponent},
  {path: 'call/:id', component: CallModificateComponent, resolve: {data: CallResolve}}
];
const callsHouseRoutes: Routes = [
  {path: '', component: CallsHouseListComponent},
  {path: 'call/:id', component: CallHouseModificateComponent, resolve: {data: CallHouseResolve}}
];
const callsOther: Routes = [
  {path: '', component: CallsOtherListComponent},
  {path: 'call/:id', component: CallModificateComponent}
];

const agreements: Routes = [
  {path: '', component: AgreementsCsListComponent}
]
/*определение основных маршрутов*/
const routes: Routes = [

  {path: 'admin', component: AdminComponent, children: adminCompaniesRoutes},
  {path: 'admin/companies', component: AdminComponent, children: adminCompaniesRoutes},
  {path: 'admin/modules', component: AdminComponent, children: adminModulesRoutes},
  {path: 'admin/users', component: AdminComponent, children: adminUsersRoutes},
  {path: 'admin/roles', component: AdminComponent, children: adminRolesRoutes},
  {path: 'admin/locations', component: AdminComponent, children: adminLocationsRoutes},
  {path: 'admin/sites', component: AdminComponent, children: adminSitesRoutes},
  {path: 'admin/sources', component: AdminComponent, children: adminSourcesRoutes},
  {path: 'sales', component: GeneralTemplateComponent, children: salesRoutes},
  {path: 'sales/sale/show/:id', component: SaleShowComponent},
  {path: 'clients', component: GeneralTemplateComponent, children: clientsRoutes},
  {path: 'houses', component: GeneralTemplateComponent, children: housesRoutes},
  {path: 'clients_house', component: GeneralTemplateComponent, children: clientsHouseRoutes},
  {path: 'calls', component: GeneralTemplateComponent, children: callsRoutes},
  {path: 'calls_house', component: GeneralTemplateComponent, children: callsHouseRoutes},
  {path: 'calls_other', component: GeneralTemplateComponent, children: callsOther},
  {path: 'roles', component: GeneralTemplateComponent, children: rolesRoutes},
  {path: 'users', component: GeneralTemplateComponent, children: usersRoutes},
  {path: 'partners', component: GeneralTemplateComponent, children: partnersRoutes},
  {path: 'companies/company/:id', component: GeneralTemplateComponent, children: companyRoutes},
  {path: 'agreements/cs', component: GeneralTemplateComponent, children: agreements},
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
    AdminSitesListComponent,
    MenuUserInfoComponent,
    Error403Component,
    AdminRequestLocationComponent,
    SalesListSearchComponent,
    AgreementsCsListComponent,
    ClientsListComponent,
    ClientModificateComponent,
    SaleListPhotoComponent,
    ClientsListSearchComponent,
    GeneralTemplateComponent,
    HousesListComponent,
    HouseModificateComponent,
    DialogDeleteSaleComponent,
    DialogReclameSaleComponent,
    DialogDeleteHouseComponent,
    DialogReclameHouseComponent,
    DialogDeleteClientComponent,
    DialogDeleteClientHouseComponent,
    DialogCompanyUnblockComponent,
    DialogCompanyBlockComponent,
    CalculatorComponent,
    HousesListSearchComponent,
    HouseListPhotoComponent,
    SaleModificateMapComponent,
    HouseModificateMapComponent,
    RolesListComponent,
    RoleModificateComponent,
    UsersListComponent,
    UserModificateComponent,
    CompanyModificationComponent,
    SalesListArchiveComponent,
    HousesListArchiveComponent,
    ClientsListArchiveComponent,
    ClientsHouseListComponent,
    ClientHouseModificationComponent,
    ClientsHouseListSearchComponent,
    ClientsHouseListArchiveComponent,
    SalesListModerationComponent,
    SalesListDeleteComponent,
    SaleModificateModerationComponent,
    SaleModificateDeleteComponent,
    HousesListDeleteComponent,
    HousesListModerationComponent,
    HouseModificateModerationComponent,
    HouseModificateDeleteComponent,
    CallsListComponent,
    CallModificateComponent,
    CallsHouseListComponent,
    CallHouseModificateComponent,
    PartnerListComponent,
    CalculatorComponent,
    CallsOtherListComponent,
    AdminSourcesListComponent,
    CallsListSearchComponent,
    CallsHouseListSearchComponent,
    SaleShowComponent,
    FilterPipe,
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
    SiteService,
    ClientResolve,
    HouseService,
    HouseResolve,
    ClientHouseService,
    ClientHouseResolve,
    CallService,
    CallResolve,
    CallHouseService,
    CallHouseResolve,
    CallOtherService,
    SourceService,
    Globals,
    SanitizeHtmlPipe
  ],
  entryComponents: [DialogDeleteSaleComponent, DialogReclameSaleComponent, DialogDeleteHouseComponent, DialogReclameHouseComponent, DialogDeleteClientComponent,
    DialogDeleteClientHouseComponent,  DialogCompanyBlockComponent, DialogCompanyUnblockComponent, CalculatorComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
