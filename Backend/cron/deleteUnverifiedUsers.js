import cron from "node-cron";
import UserModel from "../models/UserModel.js";

cron.schedule("0 2 * * *", async () => {
  try {
    console.log("Cron Job Started: Deleting unverified users...");

    const cutoffTime = new Date(Date.now() - 48 * 60 * 60 * 1000);
    
    const result = await UserModel.deleteMany({
      isAccountVerified: false,
      verifyTokenExpireAt: { $lt: cutoffTime }
    });

    console.log(`Deleted ${result.deletedCount} unverified users`);
  } catch (err) {
    console.error("Error deleting unverified users:", err);
  }
});
