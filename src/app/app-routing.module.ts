import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Registry } from '@app/auth/models/privilege';
import { RegistriesResolver } from '@app/core/resolvers/registries.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: {
      registries: RegistriesResolver,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth',
      },
      {
        path: 'auth',
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
    ],
  },
  {
    path: 'reports',
    pathMatch: 'full',
    children: [
      {
        path: '',
        loadChildren: () =>
         import('@app/reports/reports.module').then(m => m.ReportsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
