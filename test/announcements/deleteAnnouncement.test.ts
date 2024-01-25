import mongoose from "mongoose";
import supertest from "supertest";

import {
  database,
  request,
  expectAnnouncementsCollectionToBeEmpty,
  expectResponseToBeError,
} from "../index";
import {
  announcementModelName,
  AnnouncementType,
} from "../../src/features/announcements/data/models/announcement.model";

describe("DELETE /delete/:announcementId", () => {
  let createdAnnouncementId: string; // Variable to store the created announcementId

  beforeAll(async () => {
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
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
    let creationResponse: supertest.Response;

    // Create the request body
    const requestBody: Partial<AnnouncementType> = {
      title: "title",
      content: "content",
      severity: "info",
    };

    beforeAll(async () => {
      await database.clear();

      // Make the request
      creationResponse = await request.post("/create").send(requestBody);
      createdAnnouncementId = creationResponse.body.announcement._id; // Store the created announcementId

      const announcementCreated = await mongoose
        .model(announcementModelName)
        .exists({
          _id: createdAnnouncementId,
          ...requestBody,
        });

      expect(announcementCreated).toBeTruthy();
    });

    it("should return status 201", async () => {
      expect(creationResponse.status).toBe(201);
    });
  });
  describe("when the delete request is valid", () => {
    let deletionResponse: supertest.Response;

    beforeAll(async () => {
      // Make the delete request using the stored announcementId
      //TODO: make the delete not depend on the creation endpoint
      deletionResponse = await request.delete(
        `/delete/${createdAnnouncementId}`
      );
    });

    it("should return status 202", async () => {
      expect(deletionResponse.status).toBe(202);
    });
    it("should not be able to find the announcement in the DB", async () => {
      const announcementDeleted = await mongoose
        .model(announcementModelName)
        .exists({
          _id: createdAnnouncementId,
        });

      expect(announcementDeleted).toBeFalsy();
    });
  });
});
