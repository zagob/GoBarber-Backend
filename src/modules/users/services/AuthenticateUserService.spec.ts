import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

// testes unitarios
describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
    });
    // permitir fazer autenticação na aplicação
    it('should be able to authenticate', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        const response = await authenticateUser.execute({
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });


    it('should not be able to authenticate with non existing user', async () => {
        await expect(authenticateUser.execute({
            email: 'johndoe@gmail.com',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await expect(
            authenticateUser.execute({
                email: 'johndoe@gmail.com',
                password: 'wrong-password',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
