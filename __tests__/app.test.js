const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("GET /api/topics", () => {
  test("Status 200: Should return an array of topic objects, each of which should have a slug and description property", () => {
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
  test("Status 400: Should return a 400 when the path specified is not found", () => {
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
          comment_count: 11,
        });
      });
  });
  test("Status 200: Responds with: Should return with an article object of the specified id and return 0 comments if there are no comments on that article ", () => {
    return request(app)
      .get("/api/articles/11")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 11,
          title: "Am I a cat?",
          topic: "mitch",
          author: "icellusedkars",
          body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
          created_at: "2020-01-15T22:21:00.000Z",
          votes: 0,
          comment_count: 0,
        });
      });
  });
  test("Status 404: Responds with an error and a message when an invalid id or an id that does not exist is passed", () => {
    return request(app)
      .get("/api/articles/100000394")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No ID found for: 100000394");
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
      .expect(201)
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
  test("Status 404: Responds with an error and a message when an invalid id or an id that does not exist is passed", () => {
    const update2 = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/542561631")
      .send(update2)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No ID found for: 542561631");
      });
  });
  test("Status 400: Responds with an error and a message when not a non number is sent to update the votes total", () => {
    const update3 = { inc_votes: "not a number" };
    return request(app)
      .patch("/api/articles/2")
      .send(update3)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("This is a bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("Status 200: Should return an array of user objects, each of which should have a username property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((element) => {
          expect(element).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("Status 200: Should return an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(articles).toHaveLength(12);
        articles.forEach((element) => {
          expect(element).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Status 200: Should return array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(2);
        comments.forEach((element) => {
          expect(element).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("Status 404: Responds with an error and a message when an invalid id or an id that does not exist is passed", () => {
    return request(app)
      .get("/api/articles/100000394/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No ID found for: 100000394");
      });
  });
  test("Status 200: Should return an empty array if no comments exist for that article", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
        expect(comments).toEqual([])
      });
  });
  test("Status 400: Responds with an error and a message when not an id is passed", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("This is a bad request");
      });
  });
});
