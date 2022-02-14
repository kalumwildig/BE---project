const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("Get /api/topics", () => {
  test("should return an array of topic objects, each of which should have a slug and description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((element) => {
          expect(element).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("Status 400: should return a 400 when the path specified is not found", () => {
    return request(app)
      .get("/api/bad-path")
      .expect(404)
      .then(({body}) => {
      expect(body.msg).toBe("Path not found")});
  });
});
