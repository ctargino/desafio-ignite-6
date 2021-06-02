import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const userWithGames = await this.repository.findOne({where: {id: user_id}, relations: ['games']})

    if(!userWithGames) throw new Error('User not found')

    return userWithGames
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`
    SELECT * from users 
    ORDER BY users.first_name ASC
    `)
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`
    SELECT * from users 
    WHERE LOWER(users.first_name) = LOWER($1) 
    AND LOWER(users.last_name) = LOWER($2)
    `, [first_name, last_name]);
  }
}
