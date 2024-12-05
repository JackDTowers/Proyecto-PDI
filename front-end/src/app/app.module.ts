import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Import FormsModule and ReactiveFormsModule for handling forms
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
// Import ToastrModule for displaying toast notifications
import { ToastrModule } from 'ngx-toastr';
// Angular Material modules
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

//Import components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MapaEstrategicoComponent } from './components/mapa-estrategico/mapa-estrategico.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrearPlanComponent } from './components/crear-plan/crear-plan.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { FormIndicadorPlanComponent } from './components/form-indicador-plan/form-indicador-plan.component';
import { ContainerpdiDirective } from './directives/containerpdi.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapaEstrategicoComponent,
    CrearPlanComponent,
    CrearUsuarioComponent,
    FormIndicadorPlanComponent,
    ContainerpdiDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    AppRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
