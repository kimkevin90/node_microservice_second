import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// User 생성 시 프로퍼티 인터페이스 (User 생성 후 UserDoc 반환)
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// User 생성 후 프로퍼티 인터페이스
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  //   createdAt: string;
  //   updatedAt: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // password, __v 출력 제거 ~ 타 db와 호환 될 수 있도록 일관된 id 반환
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// Ts 검사 위해 사용
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

export { User };
