import mongoose from "mongoose";
import supertest from "supertest";

import {
  database,
  request,
  expectAnnouncementsCollectionToBeEmpty,
  expectResponseToBeError,
} from "../index";
import {
  announcementDepartments,
  announcementModelName,
  AnnouncementType,
} from "../../src/features/announcements/data/models/announcement.model";

describe("POST /create", () => {
  // Connect to the database before running any tests
  beforeAll(async () => {
    await database.connect();
  });

  // Disconnect from the database after running all tests
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
      // Clear the database before all tests
      await database.clear();

      // Make the request
      response = await request.post("/create").send(requestBody);

      // Create the announcement in the database
      const announcementCreated = await mongoose
        .model(announcementModelName)
        .exists({
          _id: response.body.announcement._id,
          ...requestBody,
        });

      // Ensure the announcement was created
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
          academicLevel: null,
          department: expect.stringMatching(announcementDepartments[6]),
          createdAt: expect.any(String),
        },
      });
    });

    it("should create the announcement in the database", async () => {
      // Check if the announcement was created
      const announcementCreated = await mongoose
        .model(announcementModelName)
        .exists({
          _id: response.body.announcement._id,
          ...requestBody,
        });

      // Ensure the announcement was created
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
        // Clear the database before all tests
        await database.clear();

        // Make the request
        response = await request.post("/create").send(requestBody);
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
        // Clear the database before all tests
        await database.clear();

        // Make the request
        response = await request.post("/create").send(requestBody);
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
        // Clear the database before all tests
        await database.clear();

        // Make the request
        response = await request.post("/create").send(requestBody);
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
        // Clear the database before all tests
        await database.clear();

        // Make the request
        response = await request.post("/create").send(requestBody);
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

      // Create the request body
      const requestBody: Partial<AnnouncementType> = {
        title: "title",
        content: "content",
      };

      beforeAll(async () => {
        // Clear the database before all tests
        await database.clear();

        // Make the request
        response = await request.post("/create").send(requestBody);
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
        // Clear the database before all tests
        await database.clear();

        // Make the request
        response = await request.post("/create").send(requestBody);
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
