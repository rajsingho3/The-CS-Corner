import mongoose from 'mongoose';

const pyqPaperSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
      enum: ['BCA', 'MCA', 'BTech', 'MTech', 'BSc', 'MSc', 'Other'],
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    year: {
      type: Number,
      required: true,
      min: 2010,
      max: new Date().getFullYear(),
    },
    examType: {
      type: String,
      required: true,
      enum: ['Mid-Semester', 'End-Semester', 'Internal', 'External', 'Quiz', 'Assignment'],
      default: 'End-Semester',
    },
    university: {
      type: String,
      required: true,
    },    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
      default: 'pdf',
    },
    fileSize: {
      type: Number, // in bytes (0 for Google Drive links)
      required: true,
    },
    googleDriveId: {
      type: String, // Google Drive file ID
      default: null,
    },
    viewUrl: {
      type: String, // Google Drive view URL
      default: null,
    },
    description: {
      type: String,
      maxlength: 500,
    },    tags: [{
      type: String,
      trim: true,
    }],
    downloadCount: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: String,
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Index for better query performance
pyqPaperSchema.index({ course: 1, semester: 1, year: 1, subject: 1 });
pyqPaperSchema.index({ slug: 1 });
pyqPaperSchema.index({ isApproved: 1 });

const PYQPaper = mongoose.model('PYQPaper', pyqPaperSchema);

export default PYQPaper;
