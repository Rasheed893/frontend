import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaCommentAlt } from "react-icons/fa";
import {
  useGetCommentsByProductIdQuery,
  useAddCommentMutation,
} from "../redux/features/commentAPI";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ productId }) => {
  const [commentInput, setCommentInput] = useState("");

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    data: comments = [],
    isLoading,
    isError,
  } = useGetCommentsByProductIdQuery(productId);

  const [addComment] = useAddCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      await addComment({
        productId,
        comment: commentInput,
        customerName: currentUser?.displayName || "Anonymous",
        email: currentUser?.email || email,
        userId: currentUser?.uid || "",
      }).unwrap();

      setCommentInput("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div className="mt-10 pt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Comments
      </h2>

      {/* Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <textarea
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100"
            placeholder="Write your comment..."
            rows={3}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="btn-primary px-6 space-x-1 flex items-center gap-1"
          >
            <FaCommentAlt />
            <span>Post Comment</span>
          </button>
        </form>
      ) : (
        <div className="mb-8 text-gray-600 dark:text-gray-300 text-sm">
          You must{" "}
          <button
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
            onClick={() => navigate("/login")}
          >
            log in
          </button>{" "}
          to post a comment.
        </div>
      )}

      {/* Comment List */}
      {isLoading && <p className="dark:text-gray-300">Loading comments...</p>}
      {isError && (
        <p className="text-red-600 dark:text-red-400">
          Error loading comments.
        </p>
      )}
      {!isLoading && comments.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No comments yet. Be the first!
        </p>
      )}

      <div
        className="space-y-6 overflow-y-auto pr-2"
        style={{ maxHeight: "27rem" }} // adjust height as needed
      >
        {comments.map((c) => (
          <div
            key={c.id}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm max-h-40 max-w-120 overflow-y-auto"
          >
            <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-words">
              {c.comment}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center mt-2">
              <span>— {c.customerName || "Anonymous"}</span>
              <span>{new Date(c.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
