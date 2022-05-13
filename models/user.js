/** User class for message.ly */
const bcrypt = require('bcrypt');
const db = require('../db')
const ExpressError = require("../expressError")
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config")
const jwt = require("jsonwebtoken");
const { user } = require('pg/lib/defaults');

/** User of the site. */
class User {
  constructor({ username, password, first_name, last_name, phone }) {
    this.username = username;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
  }

  
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */
  static async register(username, password, first_name, last_name, phone) {
    // error handling
    if (!username || !password || !first_name || !last_name || !phone) {
      throw new ExpressError('All fields required', 404)
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)

    // create user and save to DB
    const newUser = await db.query(
      `INSERT into users (username, password, first_name, last_name, phone)
      VALUES ($1,$2,$3,$4,$5) RETURNING username, password, first_name, last_name, phone
      `, [username, hashedPassword, first_name, last_name, phone])
    
    return newUser.rows[0]
   }

  /** Authenticate: is this username/password valid? Returns boolean. */
  static async authenticate(username, password) { 
     if (!username || !password) {
      throw new ExpressError('All fields required', 404)
     }
    // Get user fro DB
    const GetUser = await db.query(`SELECT username, password FROM users WHERE username=$1`, [username]);
    const user = GetUser.rows[0]

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, SECRET_KEY)
        return token
      } else {
        throw new ExpressError('Invalid password', 404)
       }
    } else {
      throw new ExpressError('User does not exist', 404)
    }
    
  }

  /** Update last_login_at for user */
  static async updateLoginTimestamp(username) { }


  static async all() {
    // get all users
    const users = await db.query('SELECT * FROM users;')
    return users.rows
  };
  
  //Get: get user by username
  static async get(username) {
    // get user by username
    const user = await db.query('SELECT * FROM users WHERE username=$1', [username])

    // error handling
    if (user.rows.length === 0) { throw new ExpressError('Invalid user', 404) }
    return new User(user.rows[0])
  };


  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;