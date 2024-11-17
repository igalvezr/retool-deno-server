import Permission from "./Permission.ts";

export default interface Role {
    _id: string;
    permission_list: Permission[] | string[];
}
