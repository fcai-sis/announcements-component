import mongoose from "mongoose";
import supertest from "supertest";

import { database, request, expectAnnouncementsCollectionToBeEmpty, expectResponseToBeError } from "../index";
import { announcementModelName, AnnouncementType } from "../../src/features/announcements/data/models/announcement.model";

describe("POST /create", () => {
  beforeAll(async () => {
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });


  describe("when the request is valid", () => {
    let response: supertest.Response;

    // Create the request body
    const requestBody: Partial<AnnouncementType> = {
      title: "title",
      content: "content",
      severity: "info",
    };

    beforeAll(async () => {
      await database.clear();

      // Make the request
      response = await request.post('/create').send(requestBody);
      const announcementCreated = await mongoose
        .model(announcementModelName)
        .exists({
          _id: response.body.announcement._id,
          ...requestBody
        });

      expect(announcementCreated).toBeTruthy();
    });

    it("should return status 201", async () => {
      expect(response.status).toBe(201);
    });

    it("should return the created announcement", async () => {
      expect(response.body).toEqual({
        announcement: {
          _id: expect.any(String),
          title: requestBody.title,
          content: requestBody.content,
          author: {
            username: expect.any(String),
          },
          severity: requestBody.severity,
          createdAt: expect.any(String),
        },
      });
    });

    it("should create the announcement in the database", async () => {
      const announcementCreated = await mongoose
        .model(announcementModelName)
        .exists({
          _id: response.body.announcement._id,
          ...requestBody
        });

      expect(announcementCreated).toBeTruthy();
    });
  });

  describe("when the request is invalid", () => {
    describe("when the title is missing", () => {
      let response: supertest.Response;

      // Create the request body
      const requestBody: Partial<AnnouncementType> = {
        content: "content",
        severity: "info",
      };

      beforeAll(async () => {
        await database.clear();

        // Make the request
        response = await request.post('/create').send(requestBody);
      });

      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });

      it("should not create the announcement in the database", async () => {
        await expectAnnouncementsCollectionToBeEmpty();
      });

    });

    describe("when the title is not a string", () => {
      let response: supertest.Response;

      // Create the request body
      const requestBody: Partial<AnnouncementType> = {
        // @ts-ignore
        title: 1,
        content: "content",
        severity: "info",
      };

      beforeAll(async () => {
        await database.clear();

        // Make the request
        response = await request.post('/create').send(requestBody);
      });

      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });

      it("should not create the announcement in the database", async () => {
        await expectAnnouncementsCollectionToBeEmpty();
      });
    });

    describe("when the content is missing", () => {
      let response: supertest.Response;


      // Create the request body
      const requestBody: Partial<AnnouncementType> = {
        title: "title",
        severity: "info",
      };

      beforeAll(async () => {
        await database.clear();

        // Make the request
        response = await request.post('/create').send(requestBody);
      });


      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });

      it("should not create the announcement in the database", async () => {
        await expectAnnouncementsCollectionToBeEmpty();
      });
    });

    describe("when the content is not a string", () => {
      let response: supertest.Response;

      // Create the request body
      const requestBody: Partial<AnnouncementType> = {
        title: "title",
        // @ts-ignore
        content: 1,
        severity: "info",
      };

      beforeAll(async () => {
        await database.clear();

        // Make the request
        response = await request.post('/create').send(requestBody);
      });

      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });

      it("should not create the announcement in the database", async () => {
        await expectAnnouncementsCollectionToBeEmpty();
      });
    });

    describe("when the severity is missing", () => {
      let response: supertest.Response;

      const requestBody: Partial<AnnouncementType> = {
        title: "title",
        content: "content",
      };

      beforeAll(async () => {
        await database.clear();

        response = await request.post('/create').send(requestBody);
      });

      // Ensure the response is 400
      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });

      it("should not create the announcement in the database", async () => {
        await expectAnnouncementsCollectionToBeEmpty();
      });
    });

    describe("when the severity is not valid", () => {
      let response: supertest.Response;

      // Create the request body
      const requestBody: Partial<AnnouncementType> = {
        title: "title",
        content: "content",
        // @ts-ignore
        severity: "potato",
      };

      beforeAll(async () => {
        await database.clear();

        // Make the request
        response = await request.post('/create').send(requestBody);
      });

      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });

      it("should not create the announcement in the database", async () => {
        await expectAnnouncementsCollectionToBeEmpty();
      });
    });
  });
});
