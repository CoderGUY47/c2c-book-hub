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
    otp?: string;
    otpExpires?: Date;
    // Institution info (required for personal Gmail users)
    hasCompletedProfile: boolean;
    institution?: string;
    institutionType?: 'university' | 'college' | 'govt_organization' | 'other';
    department?: string;
    educationalEmail?: string;
    institutionRole?: 'student' | 'faculty' | 'staff' | 'alumni' | 'employee' | 'other';
    studentId?: string;
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
    otp: {type:String, default:null},
    otpExpires: {type:Date, default:null},
    hasCompletedProfile: {type:Boolean, default:false},
    institution: {type:String, default:null},
    institutionType: {type:String, enum:['university','college','govt_organization','other'], default:null},
    department: {type:String, default:null},
    educationalEmail: {type:String, default:null},
    institutionRole: {type:String, enum:['student','faculty','staff','alumni','employee','other'], default:null},
    studentId: {type:String, default:null},
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
