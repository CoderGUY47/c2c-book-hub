import mongoose, { Document, Schema } from 'mongoose';

export interface IEmailChangeRequest extends Document {
    user: mongoose.Types.ObjectId;
    requestType: 'change' | 'remove';
    reason: string;
    otherReasonDetail?: string;
    status: 'pending' | 'approved' | 'rejected';
    adminResponse?: string;
    createdAt: Date;
    updatedAt: Date;
}

const EmailChangeRequestSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requestType: { type: String, enum: ['change', 'remove'], required: true },
    reason: { type: String, required: true },
    otherReasonDetail: { type: String, default: null },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminResponse: { type: String, default: null }
}, { timestamps: true });

export default mongoose.models.EmailChangeRequest || mongoose.model<IEmailChangeRequest>('EmailChangeRequest', EmailChangeRequestSchema);
