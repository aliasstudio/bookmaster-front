import { NgModule } from '@angular/core';

import { AuthRoutingModule } from '@app/auth/auth-routing.module';
import { AuthPageComponent } from '@app/auth/pages/auth-page/auth-page.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [AuthPageComponent],
  imports: [SharedModule, AuthRoutingModule],
})
export class AuthModule {}
