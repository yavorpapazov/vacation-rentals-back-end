const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const CartItem = require('../models/cartItem');
const User = require('../models/user');
const Item = require('../models/item');
const Token = require('../models/token');

describe("/cart", () => {
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
        bnbCost: 141,
        bnbCountry: 'USA',
        bnbTitle: 'Vacation US',
        stars: 4.5
    }
    const item3 = {
      bnbCity: 'Yellowstone',
      bnbCost: 111,
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
    const testBnbs2 = [
      {
        bnbCity: 'Denver',
        bnbCost: 141,
        bnbCountry: 'USA',
        bnbTitle: 'Vacation US',
        stars: 4.5
      },
      {
        bnbCity: 'Yellowstone',
        bnbCost: 111,
        bnbCountry: 'USA',
        bnbTitle: 'Vacation US',
        stars: 4.5
      }
    ]
    
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
      let adminToken;
      beforeEach(async () => {
        await request(server).post("/login/signup").send(user0);
        const res0 = await request(server).post("/login").send(user0);
        token0 = res0.body.token;
        const user0TokenRecord = await Token.findOne({ token: token0 }).lean();
        //console.log(user0TokenRecord)
        await request(server).post("/login/signup").send(user1);
        await User.updateOne({ email: user1.email }, { $push: { roles: 'admin'} });
        const res1 = await request(server).post("/login").send(user1);
        adminToken = res1.body.token;
        const user1TokenRecord = await Token.findOne({ token: adminToken }).lean();
        //console.log(user1TokenRecord)
        testBnbs2[0].userId = user0TokenRecord.userId.toString();
        testBnbs2[1].userId = user1TokenRecord.userId.toString();
        const savedBnbs2 = await Item.insertMany(testBnbs2);
        testBnbs2.forEach((item, index) => {
          item._id = savedBnbs2[index]._id.toString();
        });
      });

      describe('POST /', () => {
        it('should send 200', async () => {
          const id = testBnbs2[0]._id;
          const res = await request(server)
            .post("/cart")
            .set('Authorization', 'Bearer ' + token0)
            .send({ itemId: id });
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject(item2);
        });

        it('should store cart item with addedToCart field', async () => {
          const id = testBnbs2[0]._id;
          await request(server)
            .post("/cart")
            .set('Authorization', 'Bearer ' + token0)
            .send({ itemId: id });
          const user = await User.findOne({ email: user0.email }).lean();
          const savedItem = await CartItem.findOne({ addedToCart: user._id }).lean();
          expect(savedItem).toMatchObject(item2);
        });
      });

      describe("GET /", () => {
        it("should return all cart items for user currently logged in with token0", async () => {
          const id0 = testBnbs2[0]._id;
          const id1 = testBnbs2[1]._id;
          const user0TokenRecord = await Token.findOne({ token: token0 }).lean();
          await request(server)
            .post("/cart")
            .set('Authorization', 'Bearer ' + token0)
            .send({ itemId: id0 });
          await request(server)
            .post("/cart")
            .set('Authorization', 'Bearer ' + token0)
            .send({ itemId: id1 });
          const res = await request(server)
            .get("/cart")
            .set('Authorization', 'Bearer ' + token0); 
          expect(res.statusCode).toEqual(200);
          testBnbs2.forEach((item, index) => {
            expect(res.body[index].addedToCart).toEqual(user0TokenRecord.userId.toString())
            expect(res.body[index].bnbId).toEqual(item._id)
          });
        });
      });
    });
});