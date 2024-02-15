import mongoose, { Mongoose } from "mongoose";
import supertest from "supertest";

import {
  database,
  request,
  expectResponseToBeError,
} from "../index";
import {
  announcementModelName,
  AnnouncementType,
} from "../../src/features/announcements/data/models/announcement.model";

describe("PATCH /update/:announcementId", () => {
  // Connect to the database before running any tests
  beforeAll(async () => {
    await database.connect();
  });

  // Disconnect from the database after running all tests
  afterAll(async () => {
    await database.disconnect();
  });

  describe("when the announcementId param is missing", () => {
    let response: supertest.Response;

    beforeAll(async () => {
      await database.clear();

      response = await request.patch("/update/");
    });

    it("should return status 404", async () => {
      expect(response.status).toBe(404);
    });

    it("should return an error message", async () => {
      expectResponseToBeError(response);
    });
  });

  describe("when the announcementId param is invalid", () => {
    let response: supertest.Response;

    beforeAll(async () => {
      await database.clear();

      response = await request.patch("/update/abc");
    });

    it("should return an error message", async () => {
      expectResponseToBeError(response);
    });
    it("should return a status of 400", () => {
      expect(response.status).toBe(400);
    });
  });

  describe("when the announcement does not exist", () => {
    let response: supertest.Response;

    beforeAll(async () => {
      await database.clear();

      response = await request.patch(
        `/update/${new mongoose.Types.ObjectId()}`
      );
    });

    it("should return status 404", async () => {
      expect(response.status).toBe(404);
    });

    it("should return an error message", async () => {
      expectResponseToBeError(response);
    });
  });

  describe("when the request is valid", () => {
    let response: supertest.Response;

    // Create the request body
    const requestBody: Partial<AnnouncementType> = {
      title: "title",
      content: "content",
      severity: "info",
      academicLevel: 3,
      authorId: new mongoose.Types.ObjectId(),
    };

    beforeAll(async () => {
      await database.clear();

      // Create the announcement in the database
      const announcementCreated = await mongoose
        .model(announcementModelName)
        .create(requestBody);

      // Make the request
      response = await request
        .patch(`/update/${announcementCreated._id}`)
        .send({
          title: "new title",
        });
    });

    it("should return status 200", async () => {
      expect(response.status).toBe(200);
    });

    it("should return the updated announcement", async () => {
      expect(response.body).toEqual({
        announcement: {
          title: "new title",
          content: "content",
          severity: "info",
          academicLevel: 3,
          department: expect.arrayContaining([]),
          _id: expect.any(String),
          author: { username: expect.any(String) },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });
  });

  describe("when the request is invalid", () => {
    // DATA TYPE CHECK
    describe("when the title data type isn't a string", () => {
      let response: supertest.Response;

      // Create the request body
      const requestBody: Partial<AnnouncementType> = {
        // @ts-ignore
        title: 123,
        content: "content",
        severity: "info",
      };

      beforeAll(async () => {
        // Clear the database before all tests
        await database.clear();

        // create the announcement
        const announcementCreated = await mongoose
          .model(announcementModelName)
          .create({
            title: "title",
            content: "content",
            severity: "info",
            authorId: new mongoose.Types.ObjectId(),
          });
        // Make the request
        response = await request
          .patch(`/update/${announcementCreated._id}`)
          .send(requestBody);
      });

      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });
    });

    describe("when the content data type isn't a string", () => {
      let response: supertest.Response;

      // Create the request body
      const requestBody: Partial<AnnouncementType> = {
        title: "title",
        // @ts-ignore
        content: 123,
        severity: "info",
      };

      beforeAll(async () => {
        // Clear the database before all tests
        await database.clear();

        // create the announcement
        const announcementCreated = await mongoose
          .model(announcementModelName)
          .create({
            title: "title",
            content: "content",
            severity: "info",
            authorId: new mongoose.Types.ObjectId(),
          });
        // Make the request
        response = await request
          .patch(`/update/${announcementCreated._id}`)
          .send(requestBody);
      });

      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });
    });

    describe("when the severity content isn't part of the enum", () => {
      let response: supertest.Response;

      // Create the request body
      const requestBody: Partial<AnnouncementType> = {
        title: "title",
        content: "content",
        // @ts-ignore
        severity: "abc",
      };

      beforeAll(async () => {
        // Clear the database before all tests
        await database.clear();

        // create the announcement
        const announcementCreated = await mongoose
          .model(announcementModelName)
          .create({
            title: "title",
            content: "content",
            severity: "info",
            authorId: new mongoose.Types.ObjectId(),
          });
        // Make the request
        response = await request
          .patch(`/update/${announcementCreated._id}`)
          .send(requestBody);
      });

      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });
    });

    // INVALID FIELD UPDATE

    describe("if the request body contains the following fields : authorId, createdAt, updatedAt, archived", () => {
      let response1: supertest.Response;
      let response2: supertest.Response;
      let response3: supertest.Response;
      let response4: supertest.Response;

      // Create the request body

      beforeAll(async () => {
        // Clear the database before all tests
        await database.clear();

        // create the announcement
        const announcementCreated = await mongoose
          .model(announcementModelName)
          .create({
            title: "title",
            content: "content",
            severity: "info",
            authorId: new mongoose.Types.ObjectId(),
          });
        // Make the request
        response1 = await request
          .patch(`/update/${announcementCreated._id}`)
          .send({
            authorId: new mongoose.Types.ObjectId(),
          });
        response2 = await request
          .patch(`/update/${announcementCreated._id}`)
          .send({
            createdAt: Date.now(),
          });
        response3 = await request
          .patch(`/update/${announcementCreated._id}`)
          .send({
            updatedAt: Date.now(),
          });
        response4 = await request
          .patch(`/update/${announcementCreated._id}`)
          .send({
            archived: true,
          });
      });

      it("should return status 400", async () => {
        expect(response1.status).toBe(400);
        expect(response2.status).toBe(400);
        expect(response3.status).toBe(400);
        expect(response4.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response1);
        expectResponseToBeError(response2);
        expectResponseToBeError(response3);
        expectResponseToBeError(response4);
      });
    });
  });
});
