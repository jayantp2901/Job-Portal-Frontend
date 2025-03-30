import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsEmojiFrown } from "react-icons/bs";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-xl shadow-xl"
      >
        <BsEmojiFrown className="text-6xl text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800">Oops! Page Not Found</h1>
        <p className="mt-2 text-gray-600 text-lg">
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mt-6"
        >
          <Link
            to="/"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg shadow-md hover:bg-blue-600"
          >
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;