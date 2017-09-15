"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var router_1 = require("@angular/router");
var AppService = (function () {
    function AppService(http, router) {
        this.http = http;
        this.router = router;
        this.URL = "https://h4otjkif0g.execute-api.us-east-1.amazonaws.com/prod";
        this.headers = new http_1.Headers();
        this.resumeFlag = false;
        this.user = {
            user_name: '',
            user_id: 8
        };
        this.selectedTest = {
            body: {
                test_id: '',
                user_id: '',
                question_bank_id: '',
                total_questions: '',
                elapsed_time: '',
                test_duration: ''
            }
        };
        this.summary = [];
        this.nextQuestion = {
            "body": {
                "test_session_id": '',
                "question_bank_id": '',
                "question_id": '',
                "selected_option": '',
                "question_seq": '',
                "navigatorValue": '',
                "review_flag": '',
                'elapsed_time': '',
                'last_question_flag': ''
            }
        };
        this.postBody = {
            "body": {}
        };
        this.reviewBody = {
            "body": {}
        };
        this.ResumeTest = {
            "body": {}
        };
    }
    AppService.prototype.checkRoute = function () {
        console.log(this.routeAccess);
        if (this.routeAccess) {
            this.router.navigate(['/']);
        }
    };
    AppService.prototype.getTestData = function () {
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(this.URL + "/landing-page", this.postBody, this.headers)
            .map(function (res) { return res.json(); })
            .map(function (data) {
            return data;
        });
    };
    AppService.prototype.getFirstQuestion = function () {
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(this.URL + "/start-test", this.selectedTest, this.headers)
            .map(function (res) { return res.json(); })
            .map(function (data) {
            return data;
        });
    };
    AppService.prototype.postFetchNextQuestion = function () {
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(this.URL + "/fetch-next-question", this.nextQuestion, this.headers)
            .map(function (res) { return res.json(); })
            .map(function (data) {
            return data;
        });
    };
    AppService.prototype.postResumeTest = function () {
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(this.URL + "/resume-test", this.ResumeTest, this.headers)
            .map(function (res) { return res.json(); })
            .map(function (question) {
            return question;
        });
    };
    AppService.prototype.postSummaryPage = function () {
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(this.URL + "/view-summary", this.postBody, this.headers)
            .map(function (res) { return res.json(); })
            .map(function (data) {
            return data;
        });
    };
    AppService.prototype.postReviewQuestion = function () {
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(this.URL + "/edit-response", this.reviewBody, this.headers)
            .map(function (res) { return res.json(); })
            .map(function (data) {
            return data;
        });
    };
    AppService.prototype.postSaveChanges = function () {
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(this.URL + "/submit-edited-response", this.reviewBody, this.headers)
            .map(function (res) { return res.json(); })
            .map(function (data) {
            return data;
        });
    };
    AppService.prototype.postSubmitTest = function (test) {
        this.headers.append('Content-Type', 'application/json');
        return this.http.post(this.URL + "/submit-test", test, this.headers)
            .map(function (res) { return res.json(); })
            .map(function (data) {
            return data;
        });
    };
    return AppService;
}());
AppService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, router_1.Router])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map