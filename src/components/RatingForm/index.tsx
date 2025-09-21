import Button from "../Button";
import type { Rating } from "../../types";
import useAuth from "../../hooks/useAuth";

interface Props {
  ratings: Rating[];
  showForm: boolean;
  stars: number;
  comment: string;
  onOpenForm: () => void;
  onCancel: () => void;
  onStarsChange: (n: number) => void;
  onCommentChange: (v: string) => void;
  onSubmit: () => void;
}
const rates = [1, 2, 3, 4, 5];

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-row justify-between items-center gap-1">
      {/* 0 -> 5 rates */}
      {rates.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-2xl leading-none ${
            n <= value ? "text-primary" : "text-gray-300"
          }`}
          aria-label={`rate ${n}`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">{value}/5</span>
    </div>
  );
}

export default function RatingForm({
  ratings,
  showForm,
  stars,
  comment,
  onOpenForm,
  onCancel,
  onStarsChange,
  onCommentChange,
  onSubmit,
}: Props) {
  const { user } = useAuth();
  return (
    <div>
      <div className="mb-4 flex items-center p-0">
        <h2 className="text-2xl md:text-xl font-playfair font-bold text-black">
          Review <span className="text-primary">Rating</span>
        </h2>
        {/* it checks if the form is open or not */}
        {!showForm && (
          <Button
            className="ml-auto shrink-0 text-sm font-playfair rounded-lg py-3 font-bold hover:bg-[#732c4e] hover:shadow-lg transition"
            onClick={onOpenForm}
          >
            Write your review
          </Button>
        )}
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm overflow-hidden">
          <div className="flex flex-row justify-between mb-4">
            <p className="font-bold text-[1.1rem]">
              {user?.email ? user.email : "Guest User"}
            </p>
            <StarPicker value={stars} onChange={onStarsChange} />
          </div>

          <div className="flex flex-col gap-3 min-w-0">
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Share your thoughts..."
              className=" w-full max-w-full min-w-0 rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-primary resize-y box-border"
            />
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              className="font-bold hover:bg-[#732c4e] transition"
              onClick={onSubmit}
            >
              Share
            </Button>
          </div>
        </div>
      )}

      {/* Ratings list */}
      {ratings.length ? (
        <ul className="space-y-4">
          {ratings.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm group transition duration-300 hover:bg-gray-100 hover:shadow-lg"
            >
              <div className="mb-1 flex items-center justify-between ">
                <span className="text-input font-semibold">{r.user}</span>
                <span className="text-primary text-lg leading-none">
                  {"★".repeat(r.rating)}
                  <span className="text-gray-300">
                    {"★".repeat(5 - r.rating)}
                  </span>
                </span>
              </div>
              <p className="text-sm text-gray">{r.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-black font-medium">
          No reviews yet. Let's be the first.
        </p>
      )}
    </div>
  );
}
