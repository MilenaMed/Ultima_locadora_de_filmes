import supertest from "supertest";
import { cleanDb } from "../utils";
import app from "../../src/app";
import { createClient } from "../factories/user-factory";
import { createFilm } from "../factories/films-factory";
import { createRentTest } from "../factories/rentals-factory";

const api = supertest(app);

beforeEach(async () => {
  await cleanDb();
});

describe("Testes de Integração do Serviço de Aluguéis", () => {
  describe("GET /rentals", () => {
    it("deve retornar todos os aluguéis", async () => {
      const cliente = await createClient();
      const aluguel = await createRentTest(cliente.id);
      const { status, body } = await api.get("/rentals");

      expect(status).toBe(200);
      expect(body).toEqual([aluguel]);
    });

    it("deve retornar 200 e um array vazio quando não houver aluguéis", async () => {
      const { status, body } = await api.get("/rentals");

      expect(status).toBe(200);
      expect(body).toEqual([]);
    });
  });

  describe("GET rentals/:id", () => {
    it("deve retornar um aluguel pelo ID do aluguel", async () => {
      const cliente = await createClient();
      const aluguel = await createRentTest(cliente.id);
      console.log(aluguel);
      const { status, body } = await api.get(`/rentals/${aluguel.id}`);

      expect(status).toBe(200);
      expect(body).toEqual(aluguel);
    });

    it("deve retornar status 400 quando o ID do aluguel não for encontrado", async () => {
      const { status: statusNaoEncontrado } = await api.get(`/rentals/h`);

      expect(statusNaoEncontrado).toBe(400);
    });

    it("deve retornar status 404 quando o ID do aluguel não for encontrado", async () => {
      const { status } = await api.get(`/rentals/1`);

      expect(status).toBe(404);
    });
  });

  describe("POST /rentals", () => {
    it("deve retornar status 422 quando o corpo for inválido", async () => {
      const aluguel = {
        filmeId: "banana",
        clienteId: 4,
      };
      const { status } = await api.post(`/rentals`).send(aluguel);

      expect(status).toBe(422);
    });

    it("deve retornar status 201 com um corpo válido", async () => {
      const cliente = await createClient();
      const filme = await createFilm();

      const corpo = {
        clienteId: cliente.id,
        filmesId: [filme.id],
      };

      const { status } = await api.post('/rentals').send(corpo);
      expect(status).toBe(201);
    });
  });
});