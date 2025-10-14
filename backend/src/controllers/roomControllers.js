import Room from "../models/roomModel.js";

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("residents", "name email");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const allocateRoom = async (req, res) => {
  const { roomNumber, residentId } = req.body;
  try {
    const room = await Room.findById(roomNumber);
    if (!room) return res.status(404).json({ message: "Room not found" });

    room.resident = residentId;
    room.availability = true;
    await room.save();
    res.status(200).json({ message: "Room allocated successfully", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const freeEachRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room is not found" });

    room.resident = null;
    room.availability = false;
    await room.save();
    res.status(200).json({ message: "Room freed successfully", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
