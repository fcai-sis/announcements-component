import mongoose from "mongoose";
import supertest from "supertest";

import app from "../src/app";
import { announcementModelName } from "../src/features/announcements/data/models/announcement.model";

export * as database from "./database";
export const request = supertest(app);

export async function expectAnnouncementsCollectionToBeEmpty() {
  const announcementsCount = await mongoose
    .model(announcementModelName)
    .countDocuments();

  expect(announcementsCount).toBe(0);
}

export function expectResponseToBeError(response: supertest.Response) {
  expect(response.body).toEqual({
    error: {
      message: expect.any(String),
    },
  });
}
