import { JSX } from "react";

export default function Home(): JSX.Element {
    return (
      <div className="p-6 bg-gray-20">
        <h1 className="text-3xl font-bold text-red-500">Home Page</h1>
        <p>Welcome to your React app!</p>
      </div>
    );
  }