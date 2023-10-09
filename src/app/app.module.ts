import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalConfig, ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { SharedModule } from '@app/shared/shared.module';
import { AppState } from '@app/store/app.state';
import { BaseInterceptor } from '@app/core/interceptors/base.interceptor';

const ToastrOptions: Partial<GlobalConfig> = {
  timeOut: 3000,
  progressBar: true,
  progressAnimation: 'decreasing',
  tapToDismiss: true,
  positionClass: 'toast-top-right',
  maxOpened: 3,
  enableHtml: true,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    NgxsModule.forRoot([AppState]),
    NgxsLoggerPluginModule.forRoot(),
    ToastrModule.forRoot(ToastrOptions),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
