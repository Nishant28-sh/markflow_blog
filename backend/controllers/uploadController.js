import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// @route POST /api/upload
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file was provided");
  }

  res.status(201).json({
    success: true,
    data: {
      url: req.file.path,
      publicId: req.file.filename,
    },
  });
});
