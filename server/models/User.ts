import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

// Define interface for User document
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      minlength: 3,
      maxlength: 20,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false, // Don't include password in query results by default
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      validate: {
        validator: function (value: string) {
          return validator.isEmail(value);
        },
        message: "Please provide a valid email",
      },
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Pre-save hook to hash password before saving
userSchema.pre("save", async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();
  
  try {
    // Generate a salt with cost factor 10
    const salt = await bcrypt.genSalt(10);
    
    // Hash password with the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    // Compare the provided password with the hashed password
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;