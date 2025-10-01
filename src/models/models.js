export class ClientDTO {
    constructor(id, name, phone, email, address) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
    }
}

export class PetDTO {
    constructor(id, name, species, breed, age, client_id, vaccines, history) {
        this.id = id;
        this.name = name;
        this.species = species;
        this.breed = breed;
        this.age = age;
        this.client_id = client_id;
        this.vaccines = vaccines;
        this.history = history;
    }
}

export class BillingDTO {
    constructor(id, appointment_id, amount, status) {
        this.id = id;
        this.appointment_id = appointment_id;
        this.amount = amount;
        this.status = status;
    }
}

export class AppointmentDTO {
    constructor(id, pet_id, client_id, date, time, reason) {
        this.id = id;
        this.pet_id = pet_id;
        this.client_id = client_id;
        this.date = date;
        this.time = time;
        this.reason = reason;
    }
}

export class InventoryDTO {
    constructor(id, name, stock, price) {
        this.id = id;
        this.name = name;
        this.stock = stock;
        this.price = price;
    }
}
