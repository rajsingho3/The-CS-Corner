import PYQPaper from '../models/pyqPaper.model.js';
import { errorHandler } from '../utils/error.js';

// Create a new PYQ paper (Admin only)
export const createPYQ = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Only admins can upload PYQ papers'));
    }
    
    if (!req.body.title || !req.body.subject || !req.body.course || 
        !req.body.semester || !req.body.year || !req.body.fileUrl) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    // Validate Google Drive URL if provided
    if (req.body.googleDriveId && req.body.fileUrl) {
      const expectedDirectUrl = `https://drive.google.com/uc?export=download&id=${req.body.googleDriveId}`;
      if (req.body.fileUrl !== expectedDirectUrl) {
        return next(errorHandler(400, 'Invalid Google Drive URL format'));
      }
    }

    // Create slug from title, subject, and year
    const slug = `${req.body.title}-${req.body.subject}-${req.body.year}`
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    const newPYQ = new PYQPaper({
      ...req.body,
      slug,
      userId: req.user.id,
    });

    const savedPYQ = await newPYQ.save();
    res.status(201).json(savedPYQ);
  } catch (error) {
    next(error);
  }
};

// Get PYQ papers with filtering and pagination
export const getPYQs = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    
    // Build filter object
    const filter = {};
    
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.course) filter.course = req.query.course;
    if (req.query.semester) filter.semester = parseInt(req.query.semester);
    if (req.query.year) filter.year = parseInt(req.query.year);
    if (req.query.subject) filter.subject = { $regex: req.query.subject, $options: 'i' };    if (req.query.examType) filter.examType = req.query.examType;
    if (req.query.university) filter.university = { $regex: req.query.university, $options: 'i' };
    if (req.query.slug) filter.slug = req.query.slug;
    if (req.query.pyqId) filter._id = req.query.pyqId;
    if (req.query.isApproved !== undefined) filter.isApproved = req.query.isApproved === 'true';
    
    // Search functionality
    if (req.query.searchTerm) {
      filter.$or = [
        { title: { $regex: req.query.searchTerm, $options: 'i' } },
        { subject: { $regex: req.query.searchTerm, $options: 'i' } },
        { description: { $regex: req.query.searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.searchTerm, 'i')] } },
      ];
    }

    const pyqs = await PYQPaper.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPYQs = await PYQPaper.countDocuments(filter);

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPYQs = await PYQPaper.countDocuments({
      ...filter,
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      pyqs,
      totalPYQs,
      lastMonthPYQs,
    });
  } catch (error) {
    next(error);
  }
};

// Get PYQs organized by semester and year
export const getPYQsByOrganization = async (req, res, next) => {
  try {
    const { course } = req.query;    if (!course) {
      return next(errorHandler(400, 'Course parameter is required'));
    }

    const filter = { course, isApproved: true };
    
    // Aggregate PYQs by semester and year
    const organized = await PYQPaper.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            semester: '$semester',
            year: '$year'
          },
          papers: {
            $push: {
              _id: '$_id',
              title: '$title',
              subject: '$subject',
              examType: '$examType',
              university: '$university',
              fileUrl: '$fileUrl',
              fileName: '$fileName',
              fileType: '$fileType',
              difficulty: '$difficulty',
              downloadCount: '$downloadCount',
              slug: '$slug',
              createdAt: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.semester': 1,
          '_id.year': -1
        }
      }
    ]);

    res.status(200).json(organized);
  } catch (error) {
    next(error);
  }
};

// Update PYQ paper (Admin only)
export const updatePYQ = async (req, res, next) => {
  try {
    const pyq = await PYQPaper.findById(req.params.pyqId);
    
    if (!pyq) {
      return next(errorHandler(404, 'PYQ paper not found'));
    }

    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Only admins can update PYQ papers'));
    }    const updatedPYQ = await PYQPaper.findByIdAndUpdate(
      req.params.pyqId,
      {
        $set: {
          title: req.body.title,
          subject: req.body.subject,
          course: req.body.course,
          semester: req.body.semester,
          year: req.body.year,
          examType: req.body.examType,
          university: req.body.university,
          description: req.body.description,
          tags: req.body.tags,
          difficulty: req.body.difficulty,
          fileUrl: req.body.fileUrl,
          fileName: req.body.fileName,
          fileType: req.body.fileType,
          fileSize: req.body.fileSize,
          googleDriveId: req.body.googleDriveId,
          viewUrl: req.body.viewUrl,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPYQ);
  } catch (error) {
    next(error);
  }
};

// Delete PYQ paper (Admin only)
export const deletePYQ = async (req, res, next) => {
  try {
    const pyq = await PYQPaper.findById(req.params.pyqId);
    
    if (!pyq) {
      return next(errorHandler(404, 'PYQ paper not found'));
    }

    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Only admins can delete PYQ papers'));
    }    await PYQPaper.findByIdAndDelete(req.params.pyqId);
    res.status(200).json('The PYQ paper has been deleted');
  } catch (error) {
    next(error);
  }
};

// Approve PYQ paper (Admin only)
export const approvePYQ = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Only admins can approve PYQ papers'));
    }

    const updatedPYQ = await PYQPaper.findByIdAndUpdate(
      req.params.pyqId,
      {
        $set: {
          isApproved: true,
          approvedBy: req.user.id,
          approvedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedPYQ) {
      return next(errorHandler(404, 'PYQ paper not found'));
    }

    res.status(200).json(updatedPYQ);
  } catch (error) {
    next(error);
  }
};

// Increment download count
export const incrementDownload = async (req, res, next) => {
  try {
    const updatedPYQ = await PYQPaper.findByIdAndUpdate(
      req.params.pyqId,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!updatedPYQ) {
      return next(errorHandler(404, 'PYQ paper not found'));
    }

    res.status(200).json({ downloadCount: updatedPYQ.downloadCount });
  } catch (error) {
    next(error);
  }
};

// Get statistics
export const getPYQStats = async (req, res, next) => {
  try {
    const totalPYQs = await PYQPaper.countDocuments();
    const approvedPYQs = await PYQPaper.countDocuments({ isApproved: true });
    const pendingPYQs = await PYQPaper.countDocuments({ isApproved: false });
    
    const courseStats = await PYQPaper.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const yearStats = await PYQPaper.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    const semesterStats = await PYQPaper.aggregate([
      { $group: { _id: '$semester', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      totalPYQs,
      approvedPYQs,
      pendingPYQs,
      courseStats,
      yearStats,
      semesterStats,
    });
  } catch (error) {
    next(error);
  }
};
