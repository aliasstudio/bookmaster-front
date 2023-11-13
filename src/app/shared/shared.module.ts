import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '@app/shared/components/menu/menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDatatableComponent } from '@app/shared/components/mat-datatable/mat-datatable.component';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BaseButtonDirective } from '@app/shared/directives/buttons/base-button.directive';
import { CreateGridRowButtonDirective } from '@app/shared/directives/buttons/create-grid-row-button.directive';
import { ReloadGridButtonDirective } from '@app/shared/directives/buttons/reload-grid-button.directive';
import { SearchGridButtonDirective } from '@app/shared/directives/buttons/search-button.directive';
import { MatDatatableSearchComponent } from '@app/shared/components/mat-datatable-search/mat-datatable-search.component';
import { MatSelectSearchComponent } from '@app/shared/components/mat-select-search/mat-select-search.component';
import { MatPaginatorCustomizeDirective } from '@app/shared/directives/mat-paginator-customize.directive';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ClearFormButtonDirective } from '@app/shared/directives/buttons/clear-form-button.directive';
import { SaveFormButtonDirective } from '@app/shared/directives/buttons/save-form-button.directive';
import { MatDeleteDialogComponent } from "@app/shared/components/mat-delete-dialog/mat-delete-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";

const imports = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  MatNativeDateModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatCheckboxModule,
  MatButtonModule,
  MatDatepickerModule,
  MatRadioModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSidenavModule,
  MatTooltipModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatMenuModule,
  MatToolbarModule,
  MatDatepickerModule,
  NgxMatSelectSearchModule,
  MatDialogModule
];

const exports = [
  MenuComponent,
  MatDatatableComponent,
  MatDatatableControlComponent,
  MatDatatableSearchComponent,
  MatSelectSearchComponent,
  BaseButtonDirective,
  CreateGridRowButtonDirective,
  ReloadGridButtonDirective,
  SearchGridButtonDirective,
  MatPaginatorCustomizeDirective,
  ClearFormButtonDirective,
  SaveFormButtonDirective,
  MatDeleteDialogComponent
];

@NgModule({
  declarations: exports,
  imports: imports,
  exports: [...imports, ...exports],
})
export class SharedModule {}
