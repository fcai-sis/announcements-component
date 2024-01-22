import mongoose from "mongoose";
import supertest from "supertest";

import { userModelName } from "@fcai-sis/shared-models";

import app from "../src/app";
import * as database from "./database";

const request = supertest(app);

describe("Example", () => {
  beforeAll(async () => {
    await database.connect();
  });

  beforeEach(async () => {
    await database.clear();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  describe("GET /example", () => {
    it("should return 200 OK", async () => {
      const response = await request.get("/example");

      expect(response.status).toBe(200);

      const findExampleResult = await mongoose
        .model(userModelName)
        .findOne({ name: "test", email: "test@test.com", password: "test" });

      expect(findExampleResult).not.toBeNull();
    });
  });
});
