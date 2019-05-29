
export interface Fine {
    fine_id: number,
    user_id: number,
    issue_id: number,
    course_no: string,
    issue_date: string,
    return_date: string,
    fine_amount: number,
    delay_days: number,
    status : number,
    updated_at: any;
    created_at: any;
}