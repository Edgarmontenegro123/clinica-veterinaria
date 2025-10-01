import { ClientDTO, PetDTO, BillingDTO, AppointmentDTO, InventoryDTO } from './models/models.js';

const client1 = new ClientDTO(1, 'Leonardo', '55555', 'leo@aaaa.com', 'Av Evergreen');
const pet1 = new PetDTO(1, 'Firulais', 'Perro', 'Labrador', 5, 1, ['Rabia', 'Parvovirus'], ['Chequeo general']);
const appointment1 = new AppointmentDTO(1, 1, 1, '2025-09-30', '10:00', ['Vacunación anual']);
const billing1 = new BillingDTO(1, 1, 500, ['Pagado']);
const product1 = new InventoryDTO(1, 'Vacuna Rabia', 20, 200);

const show = () => {
    console.log(`--- Client ---`);
    console.log(`Name: ${client1.name}`);
    console.log(`Phone: ${client1.phone}`);
    console.log(`Email: ${client1.email}`);
    console.log(`Address: ${client1.address}\n`);

    console.log(`--- Pet ---`);
    console.log(`Name: ${pet1.name}`);
    console.log(`Species: ${pet1.species}`);
    console.log(`Breed: ${pet1.breed}`);
    console.log(`Age: ${pet1.age}`);
    console.log(`Vaccines: ${pet1.vaccines.join(', ')}`);
    console.log(`History: ${pet1.history.join('; ')}\n`);

    console.log(`--- Appointment ---`);
    console.log(`ID: ${appointment1.id}`);
    console.log(`Date: ${appointment1.date}`);
    console.log(`Time: ${appointment1.time}`);
    console.log(`Reason: ${appointment1.reason.join(', ')}`);
    console.log(`Client ID: ${appointment1.client_id}`);
    console.log(`Pet ID: ${appointment1.pet_id}\n`);

    console.log(`--- Billing ---`);
    console.log(`ID: ${billing1.id}`);
    console.log(`Appointment ID: ${billing1.appointment_id}`);
    console.log(`Amount: $${billing1.amount}`);
    console.log(`Status: ${billing1.status.join(', ')}\n`);

    console.log(`--- Inventory ---`);
    console.log(`Product: ${product1.name}`);
    console.log(`Stock: ${product1.stock}`);
    console.log(`Price: $${product1.price}`);
}

show();
