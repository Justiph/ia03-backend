import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(dto: RegisterDto) {
    const { email, password } = dto;

    // Basic validation beyond class-validator (optional)
    if (!email || !password) {
      throw new BadRequestException('Email and password are required.');
    }

    const exists = await this.userModel.findOne({ email });
    if (exists) {
      throw new ConflictException('Email already exists.');
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ email, password: hash });

    return {
      message: 'Registration successful',
      user: { id: user._id, email: user.email, createdAt: user.createdAt },
    };
  }
}
