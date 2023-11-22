const Message = require("../models/messages");
const User = require("../models/user");

module.exports.getMessages = async (req, res) => {
    const {room} = req.params;
  const messages = await Message.find({room}).populate("to");
  res.json({ messages });
};

module.exports.getUsers = async (req, res) => {
  const { user } = req;

    // Find messages where the user is the sender or receiver
    const messages = await Message.find({
      $or: [{ to: user._id }, { from: user._id }],
    }).populate('to from').sort({ createdAt: -1 }); // Sort messages by createdAt in descending order

    // Extract unique users from the messages with most recent message timestamp
    const usersFromMessages = messages.reduce((acc, message) => {
      const otherUser = message.to._id.toString() !== user._id.toString()
        ? message.to
        : message.from;

      // Find the user in the accumulator
      const existingUser = acc.find(u => u._id.toString() === otherUser._id.toString());

      // Update the user's timestamp if the current message is more recent
      if (existingUser) {
        existingUser.latestMessageTimestamp = Math.max(existingUser.latestMessageTimestamp, message.createdAt);
      } else {
        // If the user is not in the accumulator, add them with the message timestamp
        acc.push({ ...otherUser.toObject(), latestMessageTimestamp: message.createdAt });
      }

      return acc;
    }, []);

    // Find users being followed by the current user
    const followedUsers = await User.find({ _id: { $in: user.following } });

    // Filter out followed users who are already in usersFromMessages
    const filteredFollowedUsers = followedUsers.filter(followedUser =>
      !usersFromMessages.some(userFromMessage =>
        userFromMessage._id.toString() === followedUser._id.toString()
      )
    );

    // Combine the two arrays of users
    const allUsers = [...usersFromMessages, ...filteredFollowedUsers];

    // Sort the combined array based on the latest message timestamp in descending order
    const sortedUsers = allUsers.sort((a, b) => b.latestMessageTimestamp - a.latestMessageTimestamp);

    res.json(sortedUsers);
};
