import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

const ImageUploadField = ({ register, setValue, watch }) => {
  const imageFile = watch("eventImage");

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length) {
        setValue("eventImage", acceptedFiles[0]);
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  // This is important - we're not using register directly on the input
  // because it would conflict with the dropzone functionality
  useEffect(() => {
    register("eventImage");
  }, [register]);

  return (
    <div className="grid gap-2">
      <label htmlFor="eventImage" className="text-sm font-medium">
        Event Image
      </label>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-md h-48 flex flex-col items-center justify-center cursor-pointer
          ${
            isDragActive
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 hover:border-orange-400"
          }
          transition-colors duration-200
        `}
      >
        <input {...getInputProps()} id="eventImage" />
        {/* {errors.eventImage && (
          <p className="text-sm text-red-500">{errors.eventImage.message}</p>
        )} */}
        {imageFile ? (
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-32 w-32">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Event preview"
                className="h-full w-full object-cover rounded"
              />
            </div>
            <p className="text-sm text-gray-500">Click or drag to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-8">
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="text-sm font-medium text-center">
              {isDragActive
                ? "Drop the image here"
                : "Drag and drop an image, or click to select"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadField;
