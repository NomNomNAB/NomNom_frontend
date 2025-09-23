interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white font-worksans p-6 rounded-lg shadow-md">
        <h2 className="text-black text-lg sm:text-2xl font-semibold font-lobster">Please log in</h2>
        <p className="text-black mt-2 text-sm sm:text-lg">You need to log in before adding a recipe.</p>
        <div className="mt-4 flex gap-2 justify-end">
          {/* Cancel button */}
          <button
            onClick={onClose}
            className="px-4 py-2 text-black bg-transparent border border-gray-300 rounded hover:border-gray-400 transition"
          >
            Cancel
          </button>
          {/* Login button */}
          <a
            href="/login"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 hover:shadow-md transition"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}