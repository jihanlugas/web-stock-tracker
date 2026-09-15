import { Paging } from "./pagination";

export declare interface UserView {
    id: string;
    role: string;
    email: string;
    username: string;
    phoneNumber: string;
    address: string;
    fullname: string;
    passVersion: number;
    isActive: boolean;
    photoId: string;
    photoUrl: string;
    lastLoginDt?: string;
    birthDt?: string;
    birthPlace: string;
    accountVerifiedDt?: string;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
}

export declare interface PageUser extends Paging {
    fullname?: string;
    email?: string;
    phoneNumber?: string;
    username?: string;
    address?: string;
    birthPlace?: string;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    search?: string;
    preloads?: string;
}

export declare interface CreateUser {
    fullname: string
    email: string
    phoneNumber: string
    username: string
    passwd: string
    address: string
    birthDt?: string | DateConstructor
    birthPlace: string
}

export declare interface UpdateUser {
    fullname: string
    email: string
    phoneNumber: string
    username: string
    address: string
    birthDt?: string | DateConstructor
    birthPlace: string
}

export declare interface ChangePassword {
  currentPasswd: string;
  passwd: string;
  confirmPasswd: string;
}