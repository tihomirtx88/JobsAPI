const { StatusCodes } = require("http-status-codes");
const path = require("path");
const CustomError = require("../errors");

const uploadUserImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }

  const userImage = req.files.image;

  if (!userImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please upload image!');
  }

  const maxSize = 1024 * 1024;
  if (userImage.size > maxSize) {
    throw new CustomError.BadRequestError('Please upload image smaller then 1kb');
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads" + `${userImage.name}`
  );

  await userImage.mv(imagePath);
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${userImage.name}` } });
};

module.exports = {
  uploadUserImage,
};
