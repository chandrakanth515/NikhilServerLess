export class Question{
    constructor(
        public question_bank_id:number,
        public question_id:number,
        public question_sequence:number,
        public question:string,
        public option_A:string,
        public option_B:string,
        public option_C:string,
        public option_D:string,
        public selected_option:string,
        public test_session_id:number
    ){}
}