import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ImageCard from "./ImageCard";

function UserTips({ contract, signer }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTips = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!contract || !signer) return;
      const contractWithSigner = contract.connect(signer);
      const myTips = await contractWithSigner.getMyTips();
      setTips(myTips);
    } catch (error) {
      console.error("Error fetching tips:", error);
      setError(error.message || "Failed to fetch tips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, [contract, signer]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 sm:px-6 py-8 w-full"
    >
      <h1 className="text-2xl sm:text-3xl font-medium text-green-400 mb-8 text-center">
        My Tips
      </h1>
      {error && (
        <p className="text-red-400 mt-4 animate-pulse text-sm sm:text-base">
          Error: {error}
        </p>
      )}
      {loading ? (
        <p className="text-gray-400 mt-4 animate-pulse text-sm sm:text-base">
          Loading tips...
        </p>
      ) : tips.length === 0 ? (
        <p className="text-gray-400 mt-4 text-sm sm:text-base">
          No tips submitted yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, index) => (
            <ImageCard
              key={index}
              title={tip.title}
              description={tip.description}
              location={tip.location}
              imageURL={tip.imageURL}
              status={tip.tookAction ? "Action Taken" : "Pending"}
              statusColor={tip.tookAction ? "text-green-400" : "text-red-400"}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default UserTips;
