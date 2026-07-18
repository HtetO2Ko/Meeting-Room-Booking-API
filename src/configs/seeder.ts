import pool from "./db.js";

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log("🌱 Starting database seeding checks...");

    const [userRows]: any = await pool.execute(
      "SELECT COUNT(*) as count FROM user",
    );

    if (userRows[0]?.count === 0) {
      console.log("🚀 Users table empty. Seeding roles...");
      const userQuery = `
        INSERT INTO user (name, role) 
        VALUES (?, ?)
      `;

      await pool.execute(userQuery, ["Default Admin", "admin"]);
      await pool.execute(userQuery, ["Default Owner", "owner"]);
      await pool.execute(userQuery, ["Default User", "user"]);

      console.log("✅ Default seed users injected successfully.");
    } else {
      console.log("ℹ️ Users table already has data. Skipping users seed.");
    }

    console.log(
      "🎉 Database background synchronization routine verified successfully.",
    );
  } catch (error) {
    console.error(
      "❌ Critical execution crash during database seed processing:",
      error,
    );
  }
};
