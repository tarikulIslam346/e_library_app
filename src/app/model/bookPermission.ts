export interface Permission{
    permission_id: number,
    book_id: number,
    type_id: number,
    can_view: number,
    can_download: number,
    created_at: string,
    updated_at: string
}