import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { BaseUrlInterceptor } from "./core/interceptors/base-url.interceptor";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgxsModule } from "@ngxs/store";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { AppState } from "./store/app.state";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GlobalConfig, ToastrModule } from "ngx-toastr";

const ToastrOptions: Partial<GlobalConfig> = {
  timeOut: 3000,
  progressBar: true,
  progressAnimation: 'decreasing',
  tapToDismiss: true,
  positionClass: 'toast-top-right',
  maxOpened: 3,
}

@NgModule({
  declarations: [
    AppComponent,
  ],
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
      useClass: BaseUrlInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
