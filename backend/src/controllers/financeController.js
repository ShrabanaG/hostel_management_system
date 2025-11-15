import Payment from "../models/paymentModel.js";
import Room from "../models/roomModel.js";

export const getFinancialReport = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "Completed" });
    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
    const dailyRevenue = {};
    payments.forEach((p) => {
      const date = p.createdAt.toISOString().split("T")[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + p.amount;
    });
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({
      resident: { $exists: true, $ne: [] },
    });

    const occupancyRate =
      totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      totalRevenue,
      dailyRevenue,
      totalRooms,
      occupiedRooms,
      occupancyRate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating financial report" });
  }
};
