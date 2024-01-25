import mongoose from "mongoose";
import supertest from "supertest";

import { database, request, expectResponseToBeError } from "../index";
import {
  AnnouncementType,
  announcementModelName,
} from "../../src/features/announcements/data/models/announcement.model";

describe("PUT /archive/:announcementId", () => {
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

      response = await request.put("/archive/");
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

      response = await request.put("/archive/abc");
    });

    it("should return an error message", async () => {
      expectResponseToBeError(response);
    });
  });

  describe("when the archive request is valid", () => {
    let response: supertest.Response;

    let announcementId: string;

    const announcementToArchive: Partial<AnnouncementType> = {
      title: "Test announcement",
      content: "Test announcement content",
      severity: "info",
    };

    beforeAll(async () => {
      await database.clear();

      // Create the announcement to archive
      const announcement = await mongoose
        .model(announcementModelName)
        .create({
          ...announcementToArchive,
          authorId: new mongoose.Types.ObjectId(),
        });

      announcementId = announcement._id;

      response = await request.put(`/archive/${announcementId}`);
    });

    it("should return status 200", async () => {
      expect(response.status).toBe(200);
    });

    it("should return the archived announcement", async () => {
      expect(response.body).toEqual({
        announcement: {
          _id: announcementId.toString(),
          title: "Test announcement",
          content: "Test announcement content",
          severity: "info",
          author: { username: expect.any(String) },
          archived: true,
          createdAt: expect.any(String),
          updatedAt: null,
        }
      });
    });

    it("should update the announcement in the database", async () => {
      const announcement = await mongoose
        .model(announcementModelName)
        .exists({
          _id: announcementId,
          ...announcementToArchive,
          archived: true,
        })

      expect(announcement).toBeTruthy();
    });
  });

  describe("when the announcement to archive does not exist", () => {
    let response: supertest.Response;

    let announcementId: string;

    beforeAll(async () => {
      await database.clear();

      announcementId = new mongoose.Types.ObjectId().toString();

      response = await request.put(`/archive/${announcementId}`);
    });

    it("should return status 404", async () => {
      expect(response.status).toBe(404);
    });

    it("should return an error message", async () => {
      expectResponseToBeError(response);
    });
  });

  describe("when the announcement to archive is already archived", () => {
    let response: supertest.Response;

    let announcementId: string;

    beforeAll(async () => {
      await database.clear();

      // Create the announcement to archive
      const announcement = await mongoose
        .model(announcementModelName)
        .create({
          title: "Test announcement",
          content: "Test announcement content",
          severity: "info",
          authorId: new mongoose.Types.ObjectId(),
          archived: true,
        });

      announcementId = announcement._id;

      response = await request.put(`/archive/${announcementId}`);
    });

    it("should return status 400", async () => {
      expect(response.status).toBe(400);
    });

    it("should return an error message", async () => {
      expectResponseToBeError(response);
    });
  });
});
