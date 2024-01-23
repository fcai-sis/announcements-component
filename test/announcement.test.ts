import mongoose from "mongoose";
import supertest from "supertest";

import app from "../src/app";
import * as database from "./database";
import { announcementModelName, AnnouncementType } from "../src/features/announcements/data/models/announcement.model";

const request = supertest(app);

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
        const response = await request.post('/create').send(requestBody);

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

        // Ensure the announcement was created in the database
        const announcementInDatabase = await mongoose.model(announcementModelName).findOne({
          _id: response.body.announcement._id,
          ...requestBody
        });

        expect(announcementInDatabase).toBeTruthy();

      });
    });
  });
});
