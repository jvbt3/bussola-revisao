import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AppGateway } from 'src/app/app.gateway';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>, @Inject(AppGateway) private gateway = new AppGateway) { }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await this.userHash(createUserDto.password)
    const createdUser = new this.userModel(createUserDto)
    return createdUser.save();
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findOne({ _id: id });
  }

  findByName(name: string) {
    return this.userModel.findOne({ name });
  }

  update(id: string, updateUserDto: CreateUserDto) {
    this.gateway.updatedUser(id, updateUserDto)
    return this.userModel.updateOne({ _id: id }, updateUserDto);
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id })
  }

  private async userHash(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
}
