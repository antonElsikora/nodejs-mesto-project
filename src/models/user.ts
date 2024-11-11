import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default:
      'https://www.ferra.ru/imgs/2024/05/08/05/6460496/c2150453d059e8999c5f0b211ce334f7c869147c.jpg',
    validate: {
      validator(url: string) {
        return validator.isURL(url, {
          protocols: ['http', 'https'],
          require_protocol: true,
          require_valid_protocol: true,
          require_host: true,
          require_tld: true,
        });
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email: string) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default mongoose.model<IUser>('user', userSchema);
