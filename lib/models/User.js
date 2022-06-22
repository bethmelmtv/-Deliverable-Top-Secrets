const pool = require('../utils/pool');

module.exports = class User {
  id;
  firstName;
  lastName;
  email;
  #passwordHash;
  //this is a node class
  //

  constructor(row) {
    this.id = row.id;
    this.firstName = row.first_name;
    this.lastName = row.last_name;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }
  //constructor: when you construct the object,
  //your telling it to look like this
  //SQL is snake_case,

  static async insert({ firstName, lastName, email, passwordHash }) {
    const { rows } = await pool.query(
      `
      INSERT INTO users (first_name, last_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [firstName, lastName, email, passwordHash]
      //ask Julie why do we repeat the arguments in the function at the end in the model
    );

    return new User(rows[0]);
  }
};
