import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

export interface ICard extends Document {
  name: string;
  link: string;
  owner: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema: Schema<ICard> = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', cardSchema);
