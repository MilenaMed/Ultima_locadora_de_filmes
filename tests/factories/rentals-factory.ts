import prisma from "../../src/database";
import { RENTAL_LIMITATIONS } from "services/rentals-service";

function createDate(): Date {
  const currentDate = new Date();
  const targetDate = new Date(currentDate);
  targetDate.setDate(currentDate.getDate() + RENTAL_LIMITATIONS.RENTAL_DAYS_LIMIT);
  return targetDate;
}

 export async function createRentTest(userId: number) {
   const result = await prisma.rental.create({
     data: {
      endDate: createDate(),
       userId,
     }
  })
  return {
    ...result,
    date: result.date.toISOString(),
    endDate: result.endDate.toISOString(),
  };
}

export async function createAndRentMovie(userId: number, movieId: number) {
  const endDate = createDate();
  
  const rental = await prisma.rental.create({
    data: {
      endDate,
      userId,
    }
  });

  await prisma.movie.update({
    data: {
      rentalId: rental.id,
    },
    where: {
      id: movieId,
    }
  });

  return {
    ...rental,
    date: rental.date.toISOString(),
    endDate: endDate.toISOString(),
  };
}