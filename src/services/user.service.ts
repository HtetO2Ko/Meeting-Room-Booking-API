import { UserRepository } from "../repositories/user.repository.js";
import type { UserRole } from "../interfaces/user.interface.js";

const userRepository = new UserRepository();

export class UserService {
  async createUser(name: string, role: UserRole) {
    if (!name || !role) throw new Error("Name and role are required");
    const userId = await userRepository.create(name, role);
    return { id: userId, name, role };
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }

  async updateUserRole(id: number, role: UserRole) {
    const updated = await userRepository.updateRole(id, role);
    if (!updated) throw new Error("User not found");
    return { id, role };
  }

  async deleteUser(id: number) {
    const deleted = await userRepository.delete(id);
    if (!deleted) throw new Error("User not found");
    return { id };
  }
}
