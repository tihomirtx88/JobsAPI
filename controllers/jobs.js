const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require('../errors');
const mongoose = require("mongoose");
const moment = require("moment");

const getAllJobs = async (req, res) => {
  const { search, status, sort, jobType} = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  };

  if (status && status !== 'all') {
    queryObject.status = status;
  }

  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  let result = Job.find(queryObject);

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }

  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('position');
  }

  if (sort === 'z-a') {
    result = result.sort('-position');
  }
  
  //Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result.skip(skip).limit(limit);

 
  const jobs = await result;

  const totalJob = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJob/limit);

  res.status(StatusCodes.OK).json({ jobs, totalJob, numOfPages });
};

const getJob = async (req, res) => {
  // Destructor user info
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  //Finding job with that user
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ error: "User authentication failed" });
    }

    req.body.createdBy = req.user.userId;

    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  };
};

const updateJob = async (req, res) => {
  //Finding info about current job
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === '' || position === '') {
    throw new BadRequestError('Company or Position fields cannot be empty')
  };
  
  //Update job
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  
  try {
    const {
      user: { userId },
      params: { id: jobId },
    } = req
  
    const job = await Job.findByIdAndRemove({
      _id: jobId,
      createdBy: userId,
    })
    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).send()
  } catch (error) {
    console.log(error);
    
  }
}

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    {$match: {createdBy: mongoose.Types.ObjectId(req.user.userId)}},
    {$group: {_id: '$status', count: {$sum: 1}}}
  ]);

  stats= stats.reduce((acc, curr)=> {
    const {_id: title, count} = curr;
    acc[title] = count;
    return acc;
  },{});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications.map((item) => {
    const {_id: { year, month }, count} = item;
    const date = moment().month(month - 1).year(year).format('MMM Y');
    return {date, count};
  });
   res.status(StatusCodes.OK).json({defaultStats, monthlyApplications});
};


module.exports = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  showStats
};
