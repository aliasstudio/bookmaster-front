import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Registry } from '@app/auth/models/privilege';
import { FirstAccessibleChildRedirectGuard } from '@app/core/guards/first-accessible-child-redirect.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [FirstAccessibleChildRedirectGuard],
    children: [
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
      {
        path: 'reports',
        data: {
          registryKey: Registry.Reports,
        },
        loadChildren: () =>
          import('@app/reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'book-return',
        data: {
          registryKey: Registry.Returns,
        },
        loadChildren: () =>
          import('@app/book-return/book-return.module').then(
            (m) => m.BookReturnModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
