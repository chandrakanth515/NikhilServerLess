export class Home{
    constructor(
        public question_bank_id:number,
        public test_id:number,
        public test_name:string,
        public total_questions:number,
        public test_duration:number,
        public status:'Attend'
    ){}
}