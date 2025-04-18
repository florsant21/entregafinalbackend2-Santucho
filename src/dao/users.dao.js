import userModel from "./models/user.model.js";
import UserDTO from "./dtos/user.dto.js";

export default class UserDAO {
  async getUserById(id) {
    const user = await userModel.findById(id).populate("cart");
    return user ? new UserDTO(user) : null;
  }

  async getUserByEmail(email) {
    return await userModel.findOne({ email });
  }

  async createUser(user) {
    return await userModel.create(user);
  }
}
