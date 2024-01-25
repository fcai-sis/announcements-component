import mongoose from "mongoose";
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

describe("DELETE /delete/:announcementId", () => {
  beforeAll(async () => {
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  describe("when the announcementId param is missing", () => {
    let response: supertest.Response;

    beforeAll(async () => {
      await database.clear();

      response = await request.delete("/delete/");
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

      response = await request.delete("/delete/abc");
    });

    it("should return an error message", async () => {
      expectResponseToBeError(response);
    });
  });

  describe("when the create request is valid", () => {
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
      response = await request.post("/create").send(requestBody);

      const announcementCreated = await mongoose
        .model(announcementModelName)
        .exists({
          _id: response.body._id,
          ...requestBody,
        });

      expect(announcementCreated).toBeTruthy();
    });

    it("should return status 201", async () => {
      expect(response.status).toBe(201);
    });
  });

  describe("when the delete request is valid", () => {
    let response: supertest.Response;

    let announcementId: string;

    beforeAll(async () => {
      await database.clear();

      // Create the announcement to delete
      const announcement = await mongoose
        .model(announcementModelName)
        .create({
          title: "title",
          content: "content",
          severity: "info",
        });

      announcementId = announcement._id.toString();

      response = await request.delete(
        `/delete/${announcementId}`
      );
    });

    it("should return status 202", async () => {
      expect(response.status).toBe(202);
    });

    it("should be deleted from the database", async () => {
      const announcementDeleted = await mongoose
        .model(announcementModelName)
        .exists({
          _id: announcementId,
        });

      expect(announcementDeleted).toBeFalsy();
    });
  });
});
