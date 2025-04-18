import { User } from "../dao/index.js";

export default class UserRepository {
  constructor() {
    this.dao = User;
  }

  async getUserById(id) {
    return await this.dao.getUserById(id);
  }

  async getUserByEmail(email) {
    return await this.dao.getUserByEmail(email);
  }

  async createUser(user) {
    return await this.dao.createUser(user);
  }
}
