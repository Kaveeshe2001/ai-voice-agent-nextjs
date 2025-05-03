import mongoose, { models, Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true,
          unique: true
        },
        image: {
          type: String,
        },
        credit: {
          type: Number,
          default: 0
        }
    },
    { timestamps: true }
); 

const User = models.User || mongoose.model('User', userSchema);
export default User;