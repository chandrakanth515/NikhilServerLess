import { LoadChildren } from '@angular/router/src/config';
import { Routes,RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AppComponent } from './app.component';
import { TestComponent } from './components/test/test.component';
import { SummaryComponent } from './components/summary/summary.component';

const routes : Routes = [
	{
		path: "", component : HomeComponent  
	},{
		path: "ServerlessTest", component : HomeComponent  
	},{
		path:"Test", component : TestComponent
	},{
		path:"Summary", component : SummaryComponent
	},{
		path: '**', component : HomeComponent  
	}
]

export const AppRoutingModule = RouterModule.forRoot(routes,{useHash:true});