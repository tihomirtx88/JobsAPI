const { StatusCodes } = require("http-status-codes");
const path = require("path");

const uploadUserImage = async (req, res) => {
    console.log(req);
    
  const userImage = req.files.image;
  const imagePath = path.join(__dirname, '../public/uploads' + `${userImage.name}`);
  await userImage.mv(imagePath);
  return res.status(StatusCodes.OK).json({image: {src: `/uploads/${userImage.name}`}});
};

module.exports = {
    uploadUserImage
};