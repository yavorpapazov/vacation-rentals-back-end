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
        password: 'user123',
        roles: ['user']
      },
      {
        email: 'user2@yahoo.com',
        password: 'user234',
        roles: ['admin']
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
    beforeEach(async () => {
      savedUsers = await User.insertMany(testUsers);
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

    describe('Before login', () => {
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
    });
    describe('after login', () => {
      const user0 = {
        email: 'user0@mail.com',
        password: '123password'
      };
      const user1 = {
        email: 'user1@mail.com',
        password: '456password'
      }
      let token0;
      let token1;
      beforeEach(async () => {
        await request(server).post("/login/signup").send(user0);
        const res0 = await request(server).post("/login").send(user0);
        token0 = res0.body.token;
        await request(server).post("/login/signup").send(user1);
        const res1 = await request(server).post("/login").send(user1);
        token1 = res1.body.token;
        console.log(token0)
        console.log(token1)
      });
      describe('POST /', () => {
        it('should send 200', async () => {
          let testBnb0 = {...testBnbs[0]}
          delete testBnb0._id
          console.log(testBnb0)
          const res = await request(server)
            .post("/bnbs")
            .set('Authorization', 'Bearer ' + token0)
            .send(testBnb0);
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject(testBnb0)
        });
      //   it('should store note with userId', async () => {
      //     await request(server)
      //       .post("/notes")
      //       .set('Authorization', 'Bearer ' + token0)
      //       .send(note);
      //     const user = await User.findOne({email: user0.email}).lean();
      //     const savedNote = await Note.findOne({ userId: user._id }).lean();
      //     expect(savedNote).toMatchObject(note);
      //   });
      //   it('should store note with userId for user1', async () => {
      //     await request(server)
      //       .post("/notes")
      //       .set('Authorization', 'Bearer ' + token1)
      //       .send(note2);
      //     const user = await User.findOne({email: user1.email}).lean();
      //     const savedNote = await Note.findOne({ userId: user._id }).lean();
      //     expect(savedNote).toMatchObject(note2);
      //   });
      });
    });
});