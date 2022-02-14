const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const { Test } = require("supertest");

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
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("Status 200: Responds with: Should return with an article object of the specified id ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
  test("Status 404: Responds with an error and a message when an invalid id or an id that does not exist is passed", () => {
    return request(app)
      .get("/api/articles/100000394")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user found for user_id: 100000394");
      });
  });
  test("Status 400: Responds with an error and a message when not an id is passed", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("This is a bad request");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("Status 200; Should return the updated article", () => {
    const update = { inc_votes: -12 };

    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 88,
        });
      });
  });
  test("Status 400: Responds with an error and a message when not an id is passed", () => {
    const update2 = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/invalid_id")
      .send(update2)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("This is a bad request");
      });
  });
});
