import { NgModule } from '@angular/core';
import { UserPageComponent } from '@app/users/user-page/user-page.component';
import { SharedModule } from '@app/shared/shared.module';
import { UsersRoutingModule } from '@app/users/users-routing.module';
import { UserFormComponent } from './user-form/user-form.component';

@NgModule({
  declarations: [UserPageComponent, UserFormComponent],
  imports: [SharedModule, UsersRoutingModule],
})
export class UsersModule {}
