import Link from "next/link";
import AuthButton from "./components/AuthButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Google Meet Generator</h1>
          <AuthButton />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Create Google Meet Links Instantly
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Generate instant or scheduled Google Meet links with a single click
          </p>
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}