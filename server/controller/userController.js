import User from '../model/User.js'

export const userController = {
  updateUser: async (req, res, next) => {
    try {
      const { id: userId } = req.params;
      const updateData = req.body;

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { id: userId } = req.params;

      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found." });
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });

      res.status(200).json({ message: "User deleted successfully and logged out." });
    } catch (error) {
      next(error);
    }
  },

  blockUser: async (req, res, next) => {
    try {
      const userId = req.user.userId.toString();
      const { targetUserId } = req.params;

      if (userId === targetUserId) {
        return res.status(400).json({ message: "You cannot block yourself." });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      if (!user.blockedUsers.includes(targetUserId)) {
        user.blockedUsers.push(targetUserId);
        await user.save();
      }

      res.status(200).json({ message: "User blocked successfully", blockedUsers: user.blockedUsers });
    } catch (error) {
      next(error);
    }
  },

  unblockUser: async (req, res, next) => {
    try {
      const userId = req.user.userId.toString();
      const { targetUserId } = req.params;

      if (userId === targetUserId) {
        return res.status(400).json({ message: "You cannot unblock yourself." });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== targetUserId);
      await user.save();

      res.status(200).json({ message: "User unblocked successfully", blockedUsers: user.blockedUsers });
    } catch (error) {
      next(error);
    }
  },
};
