import { motion } from "framer-motion";

function ImageCard({
  title,
  description,
  location,
  imageURL,
  status,
  statusColor,
}) {
  const handleImageError = (e) => {
    console.error("Image load error:", e);
    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-gray-900 rounded-lg border border-gray-800 
        hover:border-gray-700 transition-colors duration-200 
        flex flex-col max-w-md"
    >
      <div className="flex-1 space-y-3">
        <h3 className="text-white font-medium text-xl">{title}</h3>
        <p className="text-gray-400 text-base">{description}</p>
        <p className="text-gray-500 text-sm">{location}</p>
        <span className={`${statusColor} text-base font-medium`}>{status}</span>
      </div>
      {imageURL && (
        <div className="mt-4 w-full">
          <div className="relative w-full h-64">
            <img
              src={imageURL}
              alt={title}
              className="w-full h-full object-cover rounded-md"
              onError={handleImageError}
              loading="lazy"
              onLoad={() => console.log("Image loaded successfully")}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ImageCard;
