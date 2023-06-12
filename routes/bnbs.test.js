const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const User = require('../models/user');
const Item = require('../models/item');

describe("/bnbs", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
    afterEach(testUtils.clearDB);

    const item = {
        bnbCity: 'Cozumel',
        bnbCost: 120,
        bnbCountry: 'Mexico',
        bnbTitle: 'Vacation MX',
        stars: 4.5
    }
    const item2 = {
        bnbCity: 'Denver',
        bnbCost: 130,
        bnbCountry: 'USA',
        bnbTitle: 'Vacation US',
        stars: 4.5
    }
    const testUsers = [
      {
        email: 'user1@yahoo.com',
        password: 'user123'
      },
      {
        email: 'user2@yahoo.com',
        password: 'user234'
      }
    ]
    const testBnbs = [
      {
        bnbCity: 'Rainier',
        bnbCost: 141,
        bnbCountry: 'USA',
        bnbTitle: 'Vacation US',
        stars: 4.5
      },
      {
        bnbCity: 'NY',
        bnbCost: 111,
        bnbCountry: 'USA',
        bnbTitle: 'Vacation US',
        stars: 4.5
      }
    ]

    describe('Before login', () => {
      beforeEach(async () => {
        let savedUsers = await User.insertMany(testUsers);
        savedUsers = savedUsers.map(user => ({
          ...user.toObject(),
          _id: user._id.toString()
        }));
        //console.log(savedUsers)
        testBnbs[0].userId = savedUsers[0]._id
        testBnbs[1].userId = savedUsers[1]._id
        const savedBnbs = await Item.insertMany(testBnbs);
        testBnbs.forEach((item, index) => {
          item._id = savedBnbs[index]._id.toString();
        });
        //console.log(testBnbs)
      });

      describe('POST /', () => {
        it('should send 401 without a token', async () => {
          const res = await request(server).post("/bnbs").send(item);
          expect(res.statusCode).toEqual(401);
        });
        it('should send 401 with a bad token', async () => {
          const res = await request(server)
            .post("/bnbs")
            .set('Authorization', 'Bearer BAD')
            .send(item);
          expect(res.statusCode).toEqual(401);
        });
      });

      describe("GET /search", () => {
        it("should return one matching bnb item", async () => {
          const searchTerm = 'Rainier'
          const res = await request(server).get("/bnbs/search?query=" + encodeURI(searchTerm));
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject([
            testBnbs.find(item => item.bnbCity === 'Rainier')
          ]);
        });
      });

      describe("GET /", () => {
        it("should return all bnb items", async () => {
          const res = await request(server).get("/bnbs");
          expect(res.statusCode).toEqual(200);
          testBnbs.forEach(item => {
            expect(res.body).toContainEqual(
              expect.objectContaining(item)
            )
          })
        });
      });
  
      describe("GET /:id", () => {
        it("should return 404 if no matching id", async () => {
          const res = await request(server).get("/bnbs/123");
          expect(res.statusCode).toEqual(404);
        });
        it.each(testBnbs)("should find a single bnb item and return 200", async (item) => {
          const res = await request(server).get("/bnbs/" + item._id);
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject(item);
        });
      });
    });

    describe('after login', () => {
      const user0 = {
        email: 'user1@yahoo.com',
        password: 'user123'
      };
      const user1 = {
        email: 'user2@yahoo.com',
        password: 'user234'
      };
      let token0;
      let token1;
      beforeEach(async () => {
        await request(server).post("/login/signup").send(user0);
        const res0 = await request(server).post("/login").send(user0);
        token0 = res0.body.token;
        // const resUser1 = await request(server).post("/login/signup").send(user1);
        // const res1 = await request(server).post("/login").send(user1);
        // token1 = res1.body.token;
      });

      describe('POST /', () => {
        it('should send 200', async () => {
          const res = await request(server)
            .post("/bnbs")
            .set('Authorization', 'Bearer ' + token0)
            .send(item);
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject(item)
        });
        it('should store bnb item with userId', async () => {
          await request(server)
            .post("/bnbs")
            .set('Authorization', 'Bearer ' + token0)
            .send(item);
          const user = await User.findOne({email: user0.email}).lean();
          const savedItem = await Item.findOne({ userId: user._id }).lean();
          expect(savedItem).toMatchObject(item);
        });
      });
    });
});