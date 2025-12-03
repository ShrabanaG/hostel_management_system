import Room from "../models/roomModel.js";
import Resident from "../models/residentModel.js";

export const createRoom = async (req, res) => {
  try {
    const roomData = req.body;

    const room = await Room.create(roomData);

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const uploadRoomImages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const fileUrls = req.files.map((file) => {
      return `/uploads/${file.filename}`;
    });

    const room = await Room.findByIdAndUpdate(
      roomId,
      { $push: { images: { $each: fileUrls } } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Images uploaded successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bookRoom = async (req, res) => {
  try {
    const { roomId, residentId } = req.body;

    const room = await Room.findById(roomId);
    const resident = await Resident.findById(residentId);

    if (!room || !resident) {
      return res
        .status(404)
        .json({ success: false, message: "Room or Resident not found" });
    }

    if (room.residents.length >= room.capacity) {
      return res.status(400).json({ success: false, message: "Room is full" });
    }

    room.residents.push(residentId);
    await room.save();

    resident.room = roomId;
    await resident.save();

    res.json({
      success: true,
      message: "Room booked successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoomsByCity = async (req, res) => {
  try {
    const city = req.params.city;

    const rooms = await Room.find({
      city: city,
      $expr: { $gt: ["$capacity", { $size: "$residents" }] },
    }).sort({ price: 1 });

    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("residents");
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("residents");
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
