import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

//user schema make document for typescript issue
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    profilePicture?: string;
    phoneNumber?: string;
    isVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    agreeTerms: boolean;
    addresses: mongoose.Types.ObjectId[];
    comparePassword(candidatePassword: string): Promise<boolean>;
    role:"user"|"admin" 
}

//user schema
const userSchema = new Schema<IUser>({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String},
    googleId: {type:String},
    profilePicture: {type:String, default:null},
    phoneNumber: {type:String, default:null},
    isVerified: {type:Boolean, default:false},
    agreeTerms: {type:Boolean, default:false},
    verificationToken: {type:String, default:null},
    resetPasswordToken: {type:String, default:null},
    resetPasswordExpires: {type:Date, default:null},
    addresses: [{type:Schema.Types.ObjectId, ref: "Address"}],
    role: {type:String, enum:["user","admin"], default:"user"}
}, { timestamps: true });

//comparing passwords
userSchema.pre<IUser>('save', async function (this: IUser) {
    if(!this.isModified('password')) return; 
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password!, salt);
});

//matched with candidate password with user password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Export the user model
export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
