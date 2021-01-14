import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

// testes unitarios
describe('CreateUser', () => {
    beforeEach(() => {
         fakeUsersRepository = new FakeUsersRepository();
         fakeCacheProvider = new FakeCacheProvider();
         fakeHashProvider = new FakeHashProvider();

         createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider
        );
    });

    // permitir criar um novo usuario
    it('should be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
    });

    // Criar um novo usuario com email já existente
    it('should not be able to create a new user with same email from another', async () => {
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
        createUser.execute({
            name: 'John Doee',
            email: 'johndoe@example.com',
            password: '123456',
        }),
       ).rejects.toBeInstanceOf(AppError);
    });
});
