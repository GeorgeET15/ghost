import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

function SubmitTip({ contract, signer }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!contract || !signer) throw new Error("Wallet not connected");
      if (imageURL.length > 200) {
        throw new Error("Image URL must be under 200 characters");
      }

      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.submitTip(
        title,
        description,
        imageURL,
        location,
        { gasLimit: 500000 }
      );
      await tx.wait();
      setTitle("");
      setDescription("");
      setImageURL("");
      setLocation("");
    } catch (error) {
      console.error("Submit error:", error);
      setError(error.message || "Failed to submit tip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 w-full max-w-5xl mx-auto my-6 sm:my-8"
    >
      <h2 className="text-xl sm:text-2xl font-medium text-green-400 mb-4 sm:mb-6">
        Enter Tip Details
      </h2>
      {error && (
        <p className="text-red-400 mt-4 animate-pulse text-sm sm:text-base">
          Error: {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition duration-300 text-sm sm:text-base"
          disabled={loading}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition duration-300 text-sm sm:text-base"
          disabled={loading}
          rows={3}
        />
        <input
          type="text"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          placeholder="Image URL (max 200 characters)"
          className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition duration-300 text-sm sm:text-base"
          disabled={loading}
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition duration-300 text-sm sm:text-base"
          disabled={loading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading || !contract || !signer}
          className={cn(
            "w-full bg-green-950 text-gray-200 font-medium py-2 px-4 rounded-lg border border-green-900 hover:bg-green-900 transition duration-300 text-sm sm:text-base",
            (loading || !contract || !signer) && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? "Submitting..." : "Submit Tip"}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default SubmitTip;
