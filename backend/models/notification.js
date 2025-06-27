import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref: 'User',
        required : true
    },
    type:{
        type:String,
        enum: ['request', 'transaction', 'update'],
        equired : true
    },
    title :{
        type:String,
        required: true
    },
    message: { type: String },
  seen: { type: Boolean, default: false },
  data: { type: mongoose.Schema.Types.Mixed }, // Extra details like requestId, taskId, etc.
}, { timestamps: true }
);


notificationSchema.index({ user: 1 });
notificationSchema.index({ seen: 1 });


const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;