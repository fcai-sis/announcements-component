import mongoose from "mongoose";
import supertest from "supertest";

import app from "../src/app";
import * as database from "./database";
import {
  announcementModelName,
  AnnouncementType,
} from "../src/features/announcements/data/models/announcement.model";
import expect from "expect";

const request = supertest(app);

expect.extend({
  toBeValidMongoId(received) {
    const pass = mongoose.Types.ObjectId.isValid(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid mongo id`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid mongo id`,
        pass: false,
      };
    }
  },
});
describe("Announcements", () => {
  beforeAll(async () => {
    await database.connect();
  });

  beforeEach(async () => {
    await database.clear();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  describe("POST /create", () => {
    describe("when the request is valid", () => {
      it("should return 201 and the announcement", async () => {
        // Create the request body
        const requestBody: Partial<AnnouncementType> = {
          title: "title",
          content: "content",
          severity: "info",
        };

        // Make the request
        const response = await request.post("/create").send(requestBody);

        // Ensure the response is 201
        expect(response.status).toBe(201);

        // Ensure the response body looks like this:
        // {
        //    announcement: {
        //        _id,
        //        title,
        //        content,
        //        severity,
        //        createdAt
        //        author: { username },
        //    }
        // }
        expect(response.body).toEqual({
          announcement: {
            //  @ts-ignore
            _id: expect.toBeValidMongoId(),
            title: requestBody.title,
            content: requestBody.content,
            author: {
              username: expect.any(String),
            },
            severity: requestBody.severity,
            createdAt: expect.any(String),
          },
        });

        // Ensure the announcement was created in the database
        const announcementCreated = await mongoose
          .model(announcementModelName)
          .exists({
            _id: response.body.announcement._id,
            ...requestBody,
          });

        expect(announcementCreated).toBeTruthy();
      });
    });

    describe("when the request is invalid", () => {
      describe("when the title is missing", () => {
        it("should return 400 and an error message", async () => {
          // Create the request body
          const requestBody: Partial<AnnouncementType> = {
            content: "content",
            severity: "info",
          };

          // Make the request
          const response = await request.post("/create").send(requestBody);

          // Ensure the response is 400
          expect(response.status).toBe(400);

          // Ensure the response body looks like this:
          // {
          //    error: {
          //        message,
          //    }
          // }
          expect(response.body).toEqual({
            error: {
              message: expect.any(String),
            },
          });

          // Ensure the announcement was not created in the database
          const announcementsCount = await mongoose
            .model(announcementModelName)
            .countDocuments();

          expect(announcementsCount).toBe(0);
        });
      });

      describe("when the title is not a string", () => {
        it("should return 400 and an error message", async () => {
          // Create the request body
          const requestBody: Partial<AnnouncementType> = {
            // @ts-ignore
            title: 1,
            content: "content",
            severity: "info",
          };

          // Make the request
          const response = await request.post("/create").send(requestBody);

          // Ensure the response is 400
          expect(response.status).toBe(400);

          // Ensure the response body looks like this:
          // {
          //    error: {
          //        message,
          //    }
          // }
          expect(response.body).toEqual({
            error: {
              message: expect.any(String),
            },
          });

          // Ensure the announcement was not created in the database
          const announcementsCount = await mongoose
            .model(announcementModelName)
            .countDocuments();

          expect(announcementsCount).toBe(0);
        });
      });

      describe("when the content is missing", () => {
        it("should return 400 and an error message", async () => {
          // Create the request body
          const requestBody: Partial<AnnouncementType> = {
            title: "title",
            severity: "info",
          };

          // Make the request
          const response = await request.post("/create").send(requestBody);

          // Ensure the response is 400
          expect(response.status).toBe(400);

          // Ensure the response body looks like this:
          // {
          //    error: {
          //        message,
          //    }
          // }
          expect(response.body).toEqual({
            error: {
              message: expect.any(String),
            },
          });

          // Ensure the announcement was not created in the database
          const announcementsCount = await mongoose
            .model(announcementModelName)
            .countDocuments();

          expect(announcementsCount).toBe(0);
        });
      });

      describe("when the content is not a string", () => {
        it("should return 400 and an error message", async () => {
          // Create the request body
          const requestBody: Partial<AnnouncementType> = {
            title: "title",
            // @ts-ignore
            content: 1,
            severity: "info",
          };

          // Make the request
          const response = await request.post("/create").send(requestBody);

          // Ensure the response is 400
          expect(response.status).toBe(400);

          // Ensure the response body looks like this:
          // {
          //    error: {
          //        message,
          //    }
          // }
          expect(response.body).toEqual({
            error: {
              message: expect.any(String),
            },
          });

          // Ensure the announcement was not created in the database
          const announcementsCount = await mongoose
            .model(announcementModelName)
            .countDocuments();

          expect(announcementsCount).toBe(0);
        });
      });

      describe("when the severity is missing", () => {
        it("should return 400 and an error message", async () => {
          // Create the request body
          const requestBody: Partial<AnnouncementType> = {
            title: "title",
            content: "content",
          };

          // Make the request
          const response = await request.post("/create").send(requestBody);

          // Ensure the response is 400
          expect(response.status).toBe(400);

          // Ensure the response body looks like this:
          // {
          //    error: {
          //        message,
          //    }
          // }
          expect(response.body).toEqual({
            error: {
              message: expect.any(String),
            },
          });

          // Ensure the announcement was not created in the database
          const announcementsCount = await mongoose
            .model(announcementModelName)
            .countDocuments();

          expect(announcementsCount).toBe(0);
        });
      });

      describe("when the severity is not valid", () => {
        it("should return 400 and an error message", async () => {
          // Create the request body
          const requestBody: Partial<AnnouncementType> = {
            title: "title",
            content: "content",
            // @ts-ignore
            severity: "potato",
          };

          // Make the request
          const response = await request.post("/create").send(requestBody);

          // Ensure the response is 400
          expect(response.status).toBe(400);

          // Ensure the response body looks like this:
          // {
          //    error: {
          //        message,
          //    }
          // }
          expect(response.body).toEqual({
            error: {
              message: expect.any(String),
            },
          });

          // Ensure the announcement was not created in the database
          const announcementsCount = await mongoose
            .model(announcementModelName)
            .countDocuments();

          expect(announcementsCount).toBe(0);
        });
      });
    });
  });
});
