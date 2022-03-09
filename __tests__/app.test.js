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
        expect(body.msg).toBe("Article ID does not exist for: 100000394");
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
  test("Status 200; Should return the updated article and work with negative numbers", () => {
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
  test("Status 200; Should return the updated article and work with negative numbers", () => {
    const update = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/2")
      .send(update)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 10,
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
  test("Status 404: Responds with an error and a message when an id that does not exist is passed", () => {
    const update2 = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/542561631")
      .send(update2)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID does not exist for: 542561631");
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

describe("GET /api/articles (updated to consider queries)", () => {
  test("Status 200: Should return an array of article objects default ordered by created_at desc, when no sort_by, order or topic are passed", () => {
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
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Status 200: Should return articles that can be passed sort_by and ordered_by arguments", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", {
          ascending: true,
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
              comment_count: expect.any(Number),
            })
          );
        });
      });
    })
      test('Status 404: Should return an empty array when a topic is passed that does not exist', () => {
        return request(app)
        .get("/api/articles?sort_by=title&order=asc&topic=shouldntexist")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toEqual('This topic does not exist')
        }
      );
  });
  test("Status 400: Responds with an error when invalid order by is passed", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order argument. This is a bad request");
      });
  });
  test("Status 400: Responds with an error when invalid sort by is passed", () => {
    return request(app)
      .get("/api/articles?sort_by=testx&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Invalid sort by argument. This is a bad request"
        );
      });
  });
  test("Status 200: Should return articles with default if sort_by or order queries are misspelt etc.", () => {
    return request(app)
      .get("/api/articles?sor=title&ordr=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("Status 200: Should return articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc&topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(2);
        expect(articles).toEqual([{
            article_id: 9,
            title: "They're not exactly dogs, are they?",
            topic: "cats",
            author: "butter_bridge",
            created_at: "2020-06-06T09:10:00.000Z",
            votes: 0,
            comment_count: 2
          },{
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            comment_count: 2
          }])
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
        expect(body.msg).toBe("Article ID does not exist for: 100000394");
      });
  });
  test("Status 200: Should return an empty array if no comments exist for that article", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
        expect(comments).toEqual([]);
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


describe('DELETE /api/comments/:comment_id', () => {
    test('Status 204: Should delete the comment specified by ID', () => {
        return request(app).delete("/api/comments/1").expect(204);
    });
    test('Status 404: Responds with an error if the comment does not already exist', () => {
        return request(app).delete("/api/comments/1539256").expect(404).then(({ body }) => {
            expect(body.msg).toBe("No comment exists for: 1539256");
          });
    });
    test('Status 400: Responds with an error if the comment passed is not a number', () => {
      return request(app).delete("/api/comments/notanid").expect(400).then(({ body }) => {
          expect(body.msg).toBe("This is a bad request");
        });
  });
  });

describe("POST /api/articles/:article_id/comments", () => {
  test("Status 201: Should POST a comment to the comments table and then return the comment", () => {
    const comment = { username: "rogersop", body: "This is a test comment" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.body).toBe('This is a test comment');
      });
  });
  test("Status 400: Responds with an error and a message when not an id is passed", () => {
    const comment = { username: "rogersop", body: "This is a test comment" };
    return request(app)
      .post("/api/articles/invalid-id/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("This is a bad request");
      });
  });
  test("Status 404: Responds with an error and a message when an invalid id or an id that does not exist is passed", () => {
    const comment = { username: "rogersop", body: "This is a test comment" };
    return request(app)
      .post("/api/articles/100000394/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID does not exist for: 100000394");
      });
  });
  test("Status 400: Responds with an error and a message when invalid data is sent via the object", () => {
    const comment = { test1: 1, test2: 10 };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("This is a bad request");
      });
  });
});

describe("GET /api", () => {
  test("Status 200: Should return JSON of all the potential endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(typeof endpoints).toBe('object')
      });
  });
});

describe.only("GET /api/user/:username", () => {
  test('Status 200: Should return username object of the username specified', () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: 'rogersop',
          name: 'paul',
          avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
        })
      });
  });
  test('Status 404: Should return username object of the username specified', () => {
    return request(app)
      .get("/api/users/blah")
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe("This user does not exist");
        });
  });
})