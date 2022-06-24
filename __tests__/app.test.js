const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const aUser = {
  firstName: 'Beth',
  lastName: 'Mel',
  email: 'beth@beth.com',
  password: '1234567',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? aUser.password;
  const agent = request.agent(app);
  console.log(agent);
  const user = await UserService.create({ ...aUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};
//is this the logs in a user test// if so, what is each line doing and where should i call registerAndLogin//

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  //beforeEach resets database between each test

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

  it('logs in a user', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users').send(aUser); //creating the user
    const res = await agent.post('/api/v1/users/sessions').send(aUser);
    expect(res.body).toEqual({ message: 'You have signed in' });
  });

  it('log out a user', async () => {
    const agent = await request.agent(app);
    const res = await agent.delete('/api/v1/users/sessions').delete(aUser);
    expect(res.body).toEqual({ message: 'You are  logged out' });
  });

  it('returns a list of secrets', async () => {
    const [agent] = await registerAndLogin(); //this lets us log in
    const res = await agent.get('/api/v1/secrets'); //this is storing our cookie

    expect(res.body).toEqual([
      {
        id: expect.any(String),
        title: 'secret',
        description: 'today is friday',
        created_at: expect.any(String),
      },
    ]);
  });
});
