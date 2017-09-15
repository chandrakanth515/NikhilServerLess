import { Component } from '@angular/core';
import { AppService } from './services/app.service';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
     
})
export class AppComponent {

constructor(private appService: AppService){}

checkRoute(){
    this.appService.checkRoute();
}

user:any;
    ngOnInit(){
        this.appService.routeAccess = true;
        this.user = this.appService.user;
    }
}
