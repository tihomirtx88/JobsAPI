const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");


const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
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
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

module.exports = {
  createJob,
};
