export interface LoginUser {
    email: string;
    password: string;
}


export interface RegisterUser {
    name: string;
    phone: string;
    address?: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    email: string;
    id: number
}