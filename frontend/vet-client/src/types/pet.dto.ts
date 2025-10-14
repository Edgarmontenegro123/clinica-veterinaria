export interface CreatePet {
    name: string;
    species: string;
    age: number;
    sex: string;
    breed: string;
}

export interface ResponsePet {
    id:         number;
    name:       string;
    species:    string;
    age:        number;
    birth_date: Date;
    vaccines:   any[];
    history:    string;
    image:      string;
    sex:        string;
    is_active:  boolean;
    has_owner:  boolean;
    id_client:  number;
    breed:      string;
    client:     Client;
}

export interface Client {
    id:       number;
    name:     string;
    password: string;
    phone:    string;
    address:  string;
    email:    string;
}
