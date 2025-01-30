const express = require('express');

const router = express.Router()
const {
  createJob,
//   deleteJob,
//   getAllJobs,
//   updateJob,
//   getJob,
//TODO 
} = require('./../controllers/jobs');

router.route('/').post(createJob);

// router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);

module.exports = router;