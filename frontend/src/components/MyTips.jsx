import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import ImageCard from "./ImageCard";

function MyTips({ contract }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyTips = async () => {
    if (!contract) {
      setError("Contract not initialized");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching tips from contract:", contract.target);
      const myTips = await contract.getMyTips();
      console.log("Raw tips response:", myTips);
      console.log("Tips length:", myTips.length);
      setTips(myTips.length > 0 ? myTips : []);
    } catch (error) {
      console.error("Error fetching tips:", error);
      setError(error.message || "Failed to fetch tips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTips();
  }, [contract]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto" // Increased from max-w-6xl for wider cards
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
            My Tips
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchMyTips}
            className={cn(
              "px-6 py-2 bg-green-600 rounded-full text-white font-medium",
              loading && "opacity-60 cursor-not-allowed"
            )}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </motion.button>
        </div>

        {/* Status Messages */}
        {(error || loading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700"
          >
            {error && <p className="text-red-400 text-center">{error}</p>}
            {loading && !error && (
              <p className="text-teal-400 text-center animate-pulse">
                Loading tips...
              </p>
            )}
          </motion.div>
        )}

        {/* Tips Grid */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-200">
            My Submitted Tips
          </h3>
          {tips.length === 0 && !loading ? (
            <div className="p-6 bg-gray-800/30 rounded-xl text-gray-400 text-center">
              No tips submitted yet
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {" "}
              {/* Reduced columns from 3 to 2 */}
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <ImageCard
                    title={tip.title}
                    description={tip.description}
                    location={tip.location}
                    imageURL={tip.imageURL}
                    status={tip.tookAction ? "Resolved" : "Pending Review"}
                    statusColor={
                      tip.tookAction ? "text-green-500" : "text-orange-500"
                    }
                    className="bg-gray-800/50 hover:bg-gray-800/70 transition-colors h-full"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default MyTips;
