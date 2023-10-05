import prisma from "../../src/database";
import {faker} from "@faker-js/faker"

export async function createClient(adult = true) {
  return await prisma.user.create({
    data: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      birthDate: genetateBirthDate(adult),
      cpf: faker.internet.ip(),
    }
  })
  
}


function genetateBirthDate(adult : boolean) {
  return adult ? faker.date.birthdate({min: 18, mode: 'age'}) : faker.date.birthdate({min:10, max:17, mode: 'age'})
}