import mongoose from "mongoose";
import supertest from "supertest";

import { database, expectResponseToBeError, request } from "../index";
import {
  announcementModelName,
  AnnouncementType,
} from "../../src/features/announcements/data/models/announcement.model";

describe("GET /read", () => {
  // Connect to the database before running any tests
  beforeAll(async () => {
    await database.connect();
  });

  // Disconnect from the database after running all tests
  afterAll(async () => {
    await database.disconnect();
  });

  describe("when the request is invalid", () => {
    describe("when query param 'page' is missing", () => {
      let response: supertest.Response;

      beforeAll(async () => {
        await database.clear();

        response = await request.get("/read").query({
          pageSize: 10,
        });
      });

      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });
    });

    describe("when query param 'page' is not a number", () => {
      let response: supertest.Response;

      beforeAll(async () => {
        await database.clear();

        response = await request.get("/read").query({
          page: "abc",
          pageSize: 10,
        });
      });

      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });
    });

    describe("when query param 'pageSize' is missing", () => {
      let response: supertest.Response;

      beforeAll(async () => {
        await database.clear();

        response = await request.get("/read").query({
          page: 1,
        });
      });

      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });
    });

    describe("when query param 'pageSize' is not a number", () => {
      let response: supertest.Response;

      beforeAll(async () => {
        await database.clear();

        response = await request.get("/read").query({
          page: 1,
          pageSize: "abc",
        });
      });

      it("should return status 400", async () => {
        expect(response.status).toBe(400);
      });

      it("should return an error message", async () => {
        expectResponseToBeError(response);
      });
    });
  });

  describe("when the request is valid", () => {
    describe("when there are no announcements", () => {
      let response: supertest.Response;

      beforeAll(async () => {
        await database.clear();

        response = await request.get("/read").query({
          page: 1,
          pageSize: 10,
        });
      });

      it("should return status 200", async () => {
        expect(response.status).toBe(200);
      });

      it("should return an empty array", async () => {
        expect(response.body).toEqual({
          announcements: [],
        });
      });
    });

    describe("when there are announcements but not enough to fill the page size", () => {
      let response: supertest.Response;

      const announcements: Partial<AnnouncementType>[] = [
        {
          authorId: new mongoose.Types.ObjectId(),
          title: "announcement 1",
          content: "announcement 1 content",
          severity: "info",
        },
        {
          authorId: new mongoose.Types.ObjectId(),
          title: "announcement 2",
          content: "announcement 2 content",
          severity: "danger",
        },
      ];

      beforeAll(async () => {
        await database.clear();

        await mongoose.model(announcementModelName).create(announcements);

        response = await request.get("/read").query({
          page: 1,
          pageSize: 10,
        });
      });

      it("should return status 200", async () => {
        expect(response.status).toBe(200);
      });

      it("should return the announcements", async () => {
        expect(response.body).toEqual({
          announcements: [
            {
              _id: expect.any(String),
              author: { username: expect.any(String) },
              title: announcements[1].title,
              content: announcements[1].content,
              severity: announcements[1].severity,
              academicLevel: null,
              department: expect.arrayContaining([]),
              createdAt: expect.any(String),
              updatedAt: null,
            },
            {
              _id: expect.any(String),
              author: { username: expect.any(String) },
              title: announcements[0].title,
              content: announcements[0].content,
              severity: announcements[0].severity,
              academicLevel: null,
              department: expect.arrayContaining([]),
              createdAt: expect.any(String),
              updatedAt: null,
            },
          ],
        });
      });
    });

    describe("when there are more announcements than the page size", () => {
      let page1Response: supertest.Response;
      let page2Response: supertest.Response;
      let page3Response: supertest.Response;

      const announcements: Partial<AnnouncementType>[] = [
        {
          authorId: new mongoose.Types.ObjectId(),
          title: "announcement 1",
          content: "announcement 1 content",
          severity: "info",
        },
        {
          authorId: new mongoose.Types.ObjectId(),
          title: "announcement 2",
          content: "announcement 2 content",
          severity: "danger",
        },
        {
          authorId: new mongoose.Types.ObjectId(),
          title: "announcement 3",
          content: "announcement 3 content",
          severity: "info",
        },
        {
          authorId: new mongoose.Types.ObjectId(),
          title: "announcement 4",
          content: "announcement 4 content",
          severity: "danger",
        },
        {
          authorId: new mongoose.Types.ObjectId(),
          title: "announcement 5",
          content: "announcement 5 content",
          severity: "info",
        },
      ];

      const pageSize = 2;

      beforeAll(async () => {
        await database.clear();

        for (const announcement of announcements) {
          await mongoose.model(announcementModelName).create(announcement);
          // wait to ensure createdAt is different
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        page1Response = await request.get("/read").query({
          page: 1,
          pageSize,
        });
        page2Response = await request.get("/read").query({
          page: 2,
          pageSize,
        });
        page3Response = await request.get("/read").query({
          page: 3,
          pageSize,
        });
      });

      it("should return status 200", async () => {
        expect(page1Response.status).toBe(200);
        expect(page2Response.status).toBe(200);
        expect(page3Response.status).toBe(200);
      });

      it("should return the announcements", async () => {
        expect(page1Response.body).toEqual({
          announcements: [
            {
              _id: expect.any(String),
              title: announcements[4].title,
              content: announcements[4].content,
              severity: announcements[4].severity,
              academicLevel: null,
              department: expect.arrayContaining([]),
              author: { username: expect.any(String) },
              createdAt: expect.any(String),
              updatedAt: null,
            },
            {
              _id: expect.any(String),
              title: announcements[3].title,
              content: announcements[3].content,
              severity: announcements[3].severity,
              academicLevel: null,
              department: expect.arrayContaining([]),
              author: { username: expect.any(String) },
              createdAt: expect.any(String),
              updatedAt: null,
            },
          ],
        });
        expect(page2Response.body).toEqual({
          announcements: [
            {
              _id: expect.any(String),
              title: announcements[2].title,
              content: announcements[2].content,
              severity: announcements[2].severity,
              academicLevel: null,
              department: expect.arrayContaining([]),
              author: { username: expect.any(String) },
              createdAt: expect.any(String),
              updatedAt: null,
            },
            {
              _id: expect.any(String),
              title: announcements[1].title,
              content: announcements[1].content,
              severity: announcements[1].severity,
              academicLevel: null,
              department: expect.arrayContaining([]),
              author: { username: expect.any(String) },
              createdAt: expect.any(String),
              updatedAt: null,
            },
          ],
        });
        expect(page3Response.body).toEqual({
          announcements: [
            {
              _id: expect.any(String),
              title: announcements[0].title,
              content: announcements[0].content,
              severity: announcements[0].severity,
              academicLevel: null,
              department: expect.arrayContaining([]),
              author: { username: expect.any(String) },
              createdAt: expect.any(String),
              updatedAt: null,
            },
          ],
        });
      });
    });
  });
});
