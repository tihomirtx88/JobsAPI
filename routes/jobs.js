const express = require("express");

const testUser = require("./../middlewares/testUser");

const router = express.Router();
const {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
} = require("./../controllers/jobs");


router.route("/").post(testUser, createJob).get(getAllJobs);

router.route("/:id").get(getJob).patch(testUser,updateJob).delete(testUser, deleteJob);

module.exports = router;
