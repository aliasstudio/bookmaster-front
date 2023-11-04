import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
  {
    path: 'auth',
    pathMatch: 'full',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@app/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: 'users',
    pathMatch: 'full',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@app/users/users.module').then((m) => m.UsersModule),
      },
    ],
  },
  {
    path: 'customers',
    pathMatch: 'full',
    children: [
      {
        path: '',
        loadChildren: () =>
            import('@app/customers/customers.module').then((m) => m.CustomersModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
