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
    addresses: [{type:Schema.Types.ObjectId, ref: "Address"}]  //it showed me errors so, i add 0.0.00/0 ipv4 ,so we need not to change it again and again for connecting the mongodb cluster
}, { timestamps: true });



//comparing passwords
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next(); //if password is not modified then return
    const salt = await bcrypt.genSalt(10); //if password is modified then hash it
    this.password = await bcrypt.hash(this.password!, salt);
    next(); 
})

//matched with candidate password with user password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Export the user model
export default mongoose.model<IUser>("User", userSchema);