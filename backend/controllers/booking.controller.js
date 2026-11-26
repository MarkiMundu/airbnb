import Booking from "../model/booking.model.js";
import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";

export const createBooking = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.body;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (!checkIn || !checkOut || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return res.status(400).json({ message: "Please select valid check-in and check-out dates" });
    if (start < new Date(new Date().setHours(0, 0, 0, 0))) return res.status(400).json({ message: "Check-in cannot be in the past" });
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (String(listing.host) === String(req.userId)) return res.status(400).json({ message: "You cannot book your own listing" });
    if (listing.isBooked) return res.status(409).json({ message: "This listing is already booked" });
    const nights = Math.ceil((end - start) / 86400000);
    const subtotal = listing.rent * nights;
    const totalRent = Number((subtotal * 1.14).toFixed(2));
    // Conditional update prevents two requests from booking the same listing concurrently.
    const locked = await Listing.findOneAndUpdate({ _id: listing._id, isBooked: false }, { $set: { isBooked: true, guest: req.userId } }, { new: true });
    if (!locked) return res.status(409).json({ message: "This listing was just booked by someone else" });
    try {
      const booking = await Booking.create({ checkIn: start, checkOut: end, totalRent, host: listing.host, guest: req.userId, listing: listing._id });
      await User.findByIdAndUpdate(req.userId, { $addToSet: { booking: listing._id } });
      await booking.populate("host", "email name");
      return res.status(201).json(booking);
    } catch (error) {
      await Listing.findByIdAndUpdate(listing._id, { $set: { isBooked: false }, $unset: { guest: 1 } });
      throw error;
    }
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ message: "Unable to create booking" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (!listing.isBooked || !listing.guest) return res.status(409).json({ message: "There is no active booking for this listing" });
    if (String(listing.guest) !== String(req.userId) && String(listing.host) !== String(req.userId)) return res.status(403).json({ message: "You are not allowed to cancel this booking" });
    await Booking.updateMany({ listing: listing._id, status: "booked" }, { $set: { status: "cancel" } });
    await Listing.findByIdAndUpdate(listing._id, { $set: { isBooked: false }, $unset: { guest: 1 } });
    await User.updateMany({}, { $pull: { booking: listing._id } });
    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({ message: "Unable to cancel booking" });
  }
};
