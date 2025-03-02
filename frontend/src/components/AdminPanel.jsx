import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils"; // Adjust path if needed

function AdminPanel({ contract, signer, isOwner, account }) {
  const [allTips, setAllTips] = useState([]);
  const [error, setError] = useState(null);
  const [adminAddress, setAdminAddress] = useState("");

  useEffect(() => {
    fetchAllTips();
  }, [contract, signer]);

  const fetchAllTips = async () => {
    try {
      if (!contract || !signer) return;
      const contractWithSigner = contract.connect(signer);
      const tips = await contractWithSigner.getAllTips();
      setAllTips(tips);
      setError(null);
    } catch (error) {
      console.error("Fetch all tips error:", error);
      setError(
        error.reason || "Failed to fetch tips. Are you an authorized admin?"
      );
    }
  };

  const markActionTaken = async (tipIndex) => {
    try {
      if (!contract || !signer)
        throw new Error("Contract or signer not available");
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.markActionTaken(tipIndex, {
        gasLimit: 200000,
      });
      await tx.wait();
      alert(`Tip ${tipIndex} marked as action taken`);
      fetchAllTips();
    } catch (error) {
      console.error("Mark action error:", error);
      setError(error.message || "Failed to mark action taken");
    }
  };

  const assignAdmin = async () => {
    try {
      if (!contract || !signer)
        throw new Error("Contract or signer not available");
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.assignAdmin(adminAddress, {
        gasLimit: 200000,
      });
      await tx.wait();
      alert(`${adminAddress} assigned as admin`);
      setAdminAddress("");
    } catch (error) {
      console.error("Assign admin error:", error);
      setError(error.message || "Failed to assign admin");
    }
  };

  const removeAdmin = async (adminToRemove) => {
    try {
      if (!contract || !signer)
        throw new Error("Contract or signer not available");
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.removeAdmin(adminToRemove, {
        gasLimit: 200000,
      });
      await tx.wait();
      alert(`${adminToRemove} removed as admin`);
    } catch (error) {
      console.error("Remove admin error:", error);
      setError(error.message || "Failed to remove admin");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 p-6 rounded-lg border border-gray-800 max-w-2xl mx-auto my-8"
    >
      <h2 className="text-2xl font-medium text-green-400 mb-6">Admin Panel</h2>
      {error && <div className="text-red-400 mb-4 animate-pulse">{error}</div>}

      <h3 className="text-xl text-gray-300 mb-4">All Tips</h3>
      <div className="space-y-4 mb-6">
        {allTips.length > 0 ? (
          allTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-750 transition duration-300"
            >
              <p className="text-gray-300">
                <strong>Sender:</strong> {tip.sender}
              </p>
              <p className="text-gray-300">
                <strong>Title:</strong> {tip.title}
              </p>
              <p className="text-gray-300">
                <strong>Description:</strong> {tip.description}
              </p>
              <p className="text-gray-300">
                <strong>Location:</strong> {tip.location}
              </p>
              <p className="text-gray-300">
                <strong>Status:</strong>{" "}
                <span
                  className={tip.tookAction ? "text-green-400" : "text-red-400"}
                >
                  {tip.tookAction ? "Action Taken" : "Pending"}
                </span>
              </p>
              {tip.imageURL && (
                <div className="mt-2">
                  <p className="text-gray-300">
                    <strong>Image:</strong>
                  </p>
                  <img
                    src={tip.imageURL}
                    alt={tip.title}
                    className="max-w-full h-auto rounded-lg border border-gray-700"
                    onError={(e) => console.error("Image load error:", e)}
                  />
                </div>
              )}
              {!tip.tookAction && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => markActionTaken(index)}
                  className="mt-2 bg-green-950 text-gray-200 font-medium py-2 px-4 rounded-lg border border-green-900 hover:bg-green-900 transition duration-300"
                >
                  Mark Action Taken
                </motion.button>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400">No tips available or access denied</p>
        )}
      </div>

      {isOwner && (
        <div className="space-y-4">
          <h3 className="text-xl text-gray-300 mb-4">Manage Admins</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={adminAddress}
              onChange={(e) => setAdminAddress(e.target.value)}
              placeholder="Enter admin address"
              className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={assignAdmin}
              className="bg-green-950 text-gray-200 font-medium py-2 px-4 rounded-lg border border-green-900 hover:bg-green-900 transition duration-300"
            >
              Assign Admin
            </motion.button>
          </div>
          {allTips.length > 0 &&
            allTips.some((tip) => tip.sender !== account) && (
              <div className="space-y-2">
                <h4 className="text-lg text-gray-300">Remove Admin</h4>
                {allTips
                  .filter((tip) => tip.sender !== account)
                  .map((tip, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeAdmin(tip.sender)}
                      className="w-full bg-red-950 text-gray-200 p-2 rounded-lg border border-red-900 hover:bg-red-900 transition duration-300"
                    >
                      Remove {tip.sender}
                    </motion.button>
                  ))}
              </div>
            )}
        </div>
      )}
    </motion.div>
  );
}

export default AdminPanel;
