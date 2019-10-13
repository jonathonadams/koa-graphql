import { verifyToken, verifyUser } from './authGuardRest';
import { signAccessToken } from './auth';
import { IUserDocument, User } from '../api/users/user.model';
import { sign } from 'jsonwebtoken';
import { ParameterizedContext } from 'koa';
import { newId } from '../../tests/helpers';

describe('Rest Auth Guards', () => {
  let jwt: string;
  let invalidJwt: string;

  beforeAll(() => {
    jwt = signAccessToken({ id: '1', role: 0 } as IUserDocument);
    invalidJwt = sign({}, 'wrong-secret');
  });

  describe('verifyToken', () => {
    it('should call the next handler if a JWT is provided and is valid', async () => {
      const nextSpy = jest.fn();

      await expect(
        verifyToken({ request: { token: jwt }, state: {} }, nextSpy)
      ).resolves.not.toThrowError();

      expect(nextSpy).toHaveBeenCalled();
    });

    it('should throw 401 Unauthorized if the JWT is not provided', async () => {
      const nextSpy = jest.fn();

      await expect(
        verifyToken({ request: {}, state: {} }, nextSpy)
      ).rejects.toThrowError('Unauthorized');

      expect(nextSpy).not.toHaveBeenCalled();
    });

    it('should throw 401 Unauthorized if the JWT is not valid', async () => {
      const nextSpy = jest.fn();

      await expect(
        verifyToken({ request: { token: invalidJwt }, state: {} }, nextSpy)
      ).rejects.toThrowError('Unauthorized');

      expect(nextSpy).not.toHaveBeenCalled();
    });
  });

  describe('verifyUser', () => {
    it('should call the next handler if a JWT is provided and is valid', async () => {
      const nextSpy = jest.fn();

      const id = newId();
      const spy = jest
        .spyOn(User, 'findById')
        .mockResolvedValue({ id: `${id}` } as IUserDocument);

      await expect(
        verifyUser({ state: { token: { sub: id } } } as any, nextSpy)
      ).resolves.not.toThrowError();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(id);
      expect(nextSpy).toHaveBeenCalled();
    });

    it('should throw 401 Unauthorized if the User can not be found', async () => {
      const nextSpy = jest.fn();

      const id = newId();
      const spy = jest.spyOn(User, 'findById').mockResolvedValue(null);

      await expect(
        verifyUser({ state: { token: { sub: id } } } as any, nextSpy)
      ).rejects.toThrowError('Unauthorized');

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(id);
      expect(nextSpy).not.toHaveBeenCalled();
    });
  });
});
