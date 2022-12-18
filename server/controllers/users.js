import User from "../models/User.js"

/* READ */
export const getUser = async (request, response) => {
  try {
    const { id } = request.params;
    const user = await User.findById(id);
    response.status(200).json(user);
  } catch (err) {
    response.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (request, response) => {
  try {
    const { id } = request.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    response.status(200).json(formattedFriends);
  } catch (err) {
    response.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (request, response) => {
  try {
    const { id, friendId } = request.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    response.status(200).json(formattedFriends);
  } catch (err) {
    response.status(404).json({ message: err.message });
  }
};
