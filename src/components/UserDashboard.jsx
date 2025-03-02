import { motion } from "framer-motion";
import SubmitTip from "./SubmitTip";

function UserDashboard({ contract, signer }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 sm:px-6 py-8 w-full"
    >
      <h1 className="text-2xl sm:text-3xl font-medium text-green-400 mb-8 text-center">
        Submit a Tip
      </h1>
      <SubmitTip contract={contract} signer={signer} />
    </motion.div>
  );
}

export default UserDashboard;
