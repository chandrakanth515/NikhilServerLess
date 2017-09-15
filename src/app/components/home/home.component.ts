import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';
import { Home } from './home';
import 'jquery';
declare const $: JQueryStatic;

@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(private http: Http,private appService: AppService,private router: Router) {}
    
    public question:any;
    public data:Home[]=[];
    public selectedTest:Home;
    test:any={body:{}};
    result:any;
    
    statusClick(data:any){
        if(data.test_status == null){
            this.appService.selectedTest.body.test_id = data.test_id;
            this.appService.selectedTest.body.total_questions = data.total_questions;
            this.appService.selectedTest.body.question_bank_id = data.question_bank_id;
            this.appService.selectedTest.body.test_duration = data.test_duration;
            this.appService.selectedTest.body.user_id = this.appService.user.user_id;
            this.appService.resumeFlag = false;
            this.router.navigate(['/Test']);
        }
        else if(data.test_status == "Pending"){
            this.appService.ResumeTest.body.question_bank_id = data.question_bank_id;
            this.appService.ResumeTest.body.total_questions = data.total_questions;
            this.appService.ResumeTest.body.test_id = data.test_id;
            this.appService.selectedTest.body.test_duration = data.test_duration;
            this.appService.ResumeTest.body.user_id = this.appService.user.user_id;
            console.log(this.appService.ResumeTest)
            this.appService.resumeFlag = true;
            this.router.navigate(['/Test']);
        }
        else if(data.test_status == "Time UP"){
            this.getResult(data);
        }
        else if(data.test_status == "Review Pending"){
            this.appService.postBody.body.test_id = data.test_id;
            this.appService.postBody.body.user_id = this.appService.user.user_id;
            this.appService.postBody.body.test_duration = data.test_duration;
            console.log(this.appService.postBody)
            this.appService.postSummaryPage().subscribe(res=>{
                this.appService.summary = res.response_question;
                this.appService.elapsed_time = res.elapsed_time;
                console.log(res);
                this.router.navigate(['/Summary']);
            });
        }
    }

    getResult(data:any){
        this.test.body.question_bank_id = data.question_bank_id;
        this.test.body.test_id = data.test_id;
        this.test.body.user_id = this.appService.user.user_id;
        this.appService.postSubmitTest(this.test).subscribe(res=>{
            this.result = res
            console.log(res)
        });
    }

    onClose(){
        this.result={};
    }

    ngOnInit(){ 
        $('body').css('background-color','white');
        this.appService.postBody.body.user_id=this.appService.user.user_id;
        this.appService.getTestData().subscribe(res=>{
            console.log(res);
            this.data = res.table_data;
            this.appService.user.user_name = res.user_name;
            this.appService.user.user_id = res.user_id;
        });

    }

}