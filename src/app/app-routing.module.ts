import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Registry } from '@app/auth/models/privilege';
import { authGuard } from '@app/core/guards/auth.guard';
import { RegistriesGuard } from '@app/core/guards/registries.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [RegistriesGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth',
      },
      {
        path: 'auth',
        canActivate: [authGuard],
        loadChildren: () =>
          import('@app/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'users',
        data: {
          registryKey: Registry.User,
        },
        loadChildren: () =>
          import('@app/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'books',
        data: {
          registryKey: Registry.Book,
        },
        loadChildren: () =>
          import('@app/books/books.module').then((m) => m.BooksModule),
      },
      {
        path: 'authors',
        data: {
          registryKey: Registry.Author,
        },
        loadChildren: () =>
          import('@app/authors/authors.module').then((m) => m.AuthorsModule),
      },
      {
        path: 'customers',
        data: {
          registryKey: Registry.Customer,
        },
        loadChildren: () =>
          import('@app/customers/customers.module').then(
            (m) => m.CustomersModule,
          ),
      },
      // {
      //   path: 'issues',
      //   data: {
      //     registryKey: Registry.Issue,
      //   },
      //   loadChildren: () =>
      //     import('@app/issues/issues.module').then(
      //       (m) => m.IssuesModule,
      //     ),
      // },
      {
        path: 'reports',
        data: {
          registryKey: Registry.Report,
        },
        loadChildren: () =>
          import('@app/reports/reports.module').then((m) => m.ReportsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
