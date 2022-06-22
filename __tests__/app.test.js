const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const aUser = {
  firstName: 'Beth',
  lastName: 'Mel',
  email: 'beth@beth.com',
  password: '1234567',
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(aUser);
    const { firstName, lastName, email } = aUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });
});
