import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Header } from "./landing_page/header/header.component";
import { Main } from "./landing_page/main/main.component";
import { Footer } from "./landing_page/footer/footer.component";
import { ReasonItem } from "./landing_page/main/reason/reason.component";
import { ArticleItem } from "./landing_page/main/article/article.component";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { SignupComponent } from "./pages/signup/signup.component";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../service/api.service";
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "../service/auth.service";
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';

const routes: Routes = [
  { path: '', component: Main },  // Redirect from MasterPageComponent
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'everif', component: EmailVerificationComponent }
];

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, routerOptions),
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    Header,
    Main,
    Footer,
    ReasonItem,
    ArticleItem,
    LoginComponent,
    SignupComponent,
    EmailVerificationComponent
  ],
  providers: [ApiService, AuthService],
  exports: [
    Header,
    Main,
    Footer,
    ReasonItem,
    ArticleItem,
    RouterModule
  ]
})

export class ComponentModules { }
