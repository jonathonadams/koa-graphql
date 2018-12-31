import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import config from '../config';
import { User } from '../api/users';

// A function that returns a singed JWT
export const signToken = (user: User): string => {
  return sign(
    {
      // Enter addtional paylod info here
    },
    config.secrets.jwt,
    {
      subject: user.id,
      expiresIn: config.expireTime,
      issuer: 'your-company-here'
    }
  );
};

/**
 *  A function that handles logging a user in
 *
 * @returns { Object } A User and signed JWT.
 */
export const login = async (root, args, context, info): Promise<{ token: string }> => {
  const username: string = args.username;
  const password: string = args.password;

  const user = await User.findByUsername(username);

  if (!user) {
    throw new Error('Unauthorized');
  }

  const valid = await compare(password, user.hashedPassword);

  if (!valid) {
    throw new Error('Unauthorized');
  }

  const token = signToken(user);

  return {
    token
  };
};

export const register = async (root, args, context, info) => {
  try {
    const user: User = args.user;
    const username: string = args.username;
    const password: string = args.password;

    user.hashedPassword = await hash(password, 10);

    return await User.create(user);
  } catch (err) {
    // TODO -> Error Handling
  }
};
