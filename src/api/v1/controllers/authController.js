import { User } from '../../../models/User.js';
import { ok } from '../../../utils/response.js';

export async function login(req, res) {
  const { username } = req.body;
  if (!username) return res.status(400).json({ success: false, error: 'username is required' });
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ success: false, error: 'User not found' });
  req.session.userId = user._id.toString();
  return ok(res, { id: user._id, username: user.username, role: user.role });
}

export async function logout(req, res) {
  req.session.destroy(() => {});
  return ok(res, { loggedOut: true });
}
