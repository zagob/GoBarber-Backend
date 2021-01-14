import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

// testes unitarios
describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    // atualizar profile
    it('should be able update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon@example.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'Jhon Trê',
            email: 'jhon3@example.com',
        });

        expect(updatedUser.name).toBe('Jhon Trê');
        expect(updatedUser.email).toBe('jhon3@example.com');
    });

    it('should not bet able update the profile from non-existing user', async () => {
        await expect(
            updateProfileService.execute({
                user_id: 'non-existing-id',
                name: 'Test',
                email: 'test@example.com'
            })
        ).rejects.toBeInstanceOf(AppError);
    })

    // email existente
    it('should not be able to change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon@example.com',
            password: '123456',
        });

        const user = await fakeUsersRepository.create({
            name: 'Teste',
            email: 'teste@example.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'Jhon Trê',
                email: 'jhon@example.com',
            })).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon@example.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'Jhon Trê',
            email: 'jhon3@example.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon@example.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'Jhon Trê',
                email: 'jhon3@example.com',
                password: '123123',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon@example.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'Jhon Trê',
                email: 'jhon3@example.com',
                old_password: 'wrong-old-password',
                password: '123123',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
