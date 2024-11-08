import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(url: string) {
        const urlRegex = /^(https?:\/\/\S+)$/i;
        return urlRegex.test(url);
      },
    },
  },
});

export default mongoose.model<IUser>('user', userSchema);
