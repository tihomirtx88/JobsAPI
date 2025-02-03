const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
  const { search, status, sort, jobType} = req.query;

  const queryObject = {
    createdBy: req.user.userId,

  };

  if (search) {
    queryObject.position = {$regex: search, $options: 'i'};
  }

  if (status && status !== 'all') {
    queryObject.status = status;
  }

  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

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


  let result = Job.find(queryObject);
  const jobs = await result;

  res.status(StatusCodes.OK).json({ jobs });
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


module.exports = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob
};
