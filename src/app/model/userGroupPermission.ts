export interface GroupPermission{
    permission: number,
    role_id: number,
    type_id: number,
    menu_id: number,
    menu_name: string,
    can_read: number,
    can_write: number,
    created_at: string,
    updated_at: string
}
/* can_read: 1
can_write: 1
created_at: "2018-12-24 07:15:07"
menu_id: 1
permission: 1
role_id: 8
type_id: 1
updated_at: "2018-12-24 10:28:05" */