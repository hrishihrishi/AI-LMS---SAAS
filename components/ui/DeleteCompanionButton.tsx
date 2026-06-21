"use client";

import { deleteCompanion } from "@/lib/actions/companion.actions";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteCompanionButtonProps {
  id: string;
}

export default function DeleteCompanionButton({ id }: DeleteCompanionButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCompanion = async () => {
    try {
      setIsDeleting(true);
      const data = await deleteCompanion(id);
      
      if (data) {
        console.log("response: ", data);
      }
      
      // Navigate to the list page and refresh the route
      
    } catch (err) {
      console.error("Failed to delete companion:", err);
    } finally {
      setIsDeleting(false);
      redirect("/");
    }
  };

  return (
    <button
      onClick={handleDeleteCompanion}
      disabled={isDeleting}
      className="text-black font-xl max-md:text-base bg-red-500 rounded-lg px-3 py-1 cursor-pointer shadow-black shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isDeleting ? "Deleting..." : "Delete this companion"}
    </button>
  );
}
