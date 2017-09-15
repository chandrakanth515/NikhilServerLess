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
var app_service_1 = require("../../services/app.service");
var router_1 = require("@angular/router");
var HomeComponent = (function () {
    function HomeComponent(http, appService, router) {
        this.http = http;
        this.appService = appService;
        this.router = router;
        this.data = [];
        this.test = { body: {} };
    }
    // status='Attend';
    HomeComponent.prototype.statusClick = function (data) {
        var _this = this;
        if (data.test_status == null) {
            this.appService.selectedTest.body.test_id = data.test_id;
            this.appService.selectedTest.body.total_questions = data.total_questions;
            this.appService.selectedTest.body.question_bank_id = data.question_bank_id;
            this.appService.selectedTest.body.test_duration = data.test_duration;
            this.appService.selectedTest.body.user_id = this.appService.user.user_id;
            this.appService.resumeFlag = false;
            this.router.navigate(['/Test']);
        }
        else if (data.test_status == "Pending") {
            this.appService.ResumeTest.body.question_bank_id = data.question_bank_id;
            this.appService.ResumeTest.body.total_questions = data.total_questions;
            this.appService.ResumeTest.body.test_id = data.test_id;
            this.appService.selectedTest.body.test_duration = data.test_duration;
            this.appService.ResumeTest.body.user_id = this.appService.user.user_id;
            console.log(this.appService.ResumeTest);
            this.appService.resumeFlag = true;
            this.router.navigate(['/Test']);
        }
        else if (data.test_status == "Time UP") {
            this.getResult(data);
        }
        else if (data.test_status == "Review Pending") {
            this.appService.postBody.body.test_id = data.test_id;
            this.appService.postBody.body.user_id = this.appService.user.user_id;
            this.appService.postBody.body.test_duration = data.test_duration;
            console.log(this.appService.postBody);
            this.appService.postSummaryPage().subscribe(function (res) {
                _this.appService.summary = res.response_question;
                _this.appService.elapsed_time = res.elapsed_time;
                console.log(res);
                _this.router.navigate(['/Summary']);
            });
        }
    };
    HomeComponent.prototype.getResult = function (data) {
        var _this = this;
        this.test.body.question_bank_id = data.question_bank_id;
        this.test.body.test_id = data.test_id;
        this.test.body.user_id = this.appService.user.user_id;
        this.appService.postSubmitTest(this.test).subscribe(function (res) {
            _this.result = res;
            console.log(res);
        });
    };
    HomeComponent.prototype.onClose = function () {
        this.result = {};
    };
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('body').css('background-color', 'white');
        this.appService.postBody.body.user_id = this.appService.user.user_id;
        this.appService.getTestData().subscribe(function (res) {
            console.log(res);
            _this.data = res.table_data;
            _this.appService.user.user_name = res.user_name;
            _this.appService.user.user_id = res.user_id;
        });
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'home',
        templateUrl: './home.component.html',
        styleUrls: ['./home.component.css']
    }),
    __metadata("design:paramtypes", [http_1.Http, app_service_1.AppService, router_1.Router])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map