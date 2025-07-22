import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

export default function LoadingProgress(){
  return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
}