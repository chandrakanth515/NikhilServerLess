import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router'

@Injectable()
export class AppService {

    constructor(private http: Http, private router: Router) {}

    public routeAccess:boolean;
    URL:string = "https://h4otjkif0g.execute-api.us-east-1.amazonaws.com/prod";
    public headers = new Headers();
    public resumeFlag:boolean = false;
    public data:any;
    public elapsed_time:number;
    public duration:number;
    public user:any={
        user_name:'',
        user_id:8
    }
    public question:any;
    public selectedTest:any={
        body:{
            test_id:'',
            user_id:'',
            question_bank_id:'',
            total_questions:'',
            elapsed_time:'',
            test_duration:''
        }
    };
    public summary:any[]=[];

    public nextQuestion:any={
        "body": {
            "test_session_id": '',
            "question_bank_id":'',
            "question_id": '',
            "selected_option":'',
            "question_seq": '',
            "navigatorValue":'',
            "review_flag":'',
            'elapsed_time':'',
            'last_question_flag':''
        }
    }

    public postBody:any={
        "body":{}
    }

    public reviewBody:any={
        "body":{}
    }
    
    public ResumeTest:any={
        "body":{
            
        }
    }

    checkRoute(){
        console.log(this.routeAccess)
        if(this.routeAccess){
            this.router.navigate(['/']);
        }
    }

    getTestData(){
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(`${this.URL}/landing-page`,this.postBody,this.headers)
            .map(res => res.json())
            .map(data => {
                return data;
            });
    }

    getFirstQuestion(){
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(`${this.URL}/start-test`, this.selectedTest, this.headers)
            .map(res => res.json())
            .map(data => {
                return data;
            });
    }
  
 


    postFetchNextQuestion(){
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(`${this.URL}/fetch-next-question`,this.nextQuestion, this.headers)
            .map(res => res.json())
            .map(data => {
                return data;
            });
    }

    postResumeTest(){
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(`${this.URL}/resume-test`, this.ResumeTest, this.headers)
            .map(res => res.json())
            .map(question => {
                return question;
            });
    }

    postSummaryPage(){
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(`${this.URL}/view-summary`,this.postBody, this.headers)
            .map(res => res.json())
            .map(data => {
                return data;
            });
        
    }

     postReviewQuestion(){
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(`${this.URL}/edit-response`,this.reviewBody, this.headers)
            .map(res => res.json())
            .map(data => {
                return data;
            });
     }

     postSaveChanges(){
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(`${this.URL}/submit-edited-response`,this.reviewBody, this.headers)
            .map(res => res.json())
            .map(data => {
                return data;
            });
     }

    postSubmitTest(test:any){
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(`${this.URL}/submit-test`, test, this.headers)
            .map(res => res.json())
            .map(data => {
                return data;
            });
    }

}