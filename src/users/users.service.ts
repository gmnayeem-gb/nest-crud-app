import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService { 
  // inject user repository
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  create(createUserDto: CreateUserDto) : Promise<User> {
    const user:User = new User();

    user.fullName = createUserDto.fullName;
    user.email = createUserDto.email;
    user.age = createUserDto.age;

    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) { 
    const user:User = new User();

    user.fullName = updateUserDto.fullName;
    user.email = updateUserDto.email;
    user.age = updateUserDto.age;
    user.id = id;

    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
