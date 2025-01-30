const express = require('express');

const router = express.Router()
const {
  createJob,
//   deleteJob,
 getAllJobs,
//   updateJob,
getJob,
//TODO 
} = require('./../controllers/jobs');

router.route('/').post(createJob).get(getAllJobs)

router.route('/:id').get(getJob);

module.exports = router;