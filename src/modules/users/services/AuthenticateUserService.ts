import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: Request): Promise<Response> {
        // Validar se email é valido

        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        // Validar senha criptografada
        const passwordMatched = await this.hashProvider.compareHash(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        // Usuário autenticado
        return {
            user,
            token,
        }
    }
}

export default AuthenticateUserService;
