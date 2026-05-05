import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function SolitaireGame() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-800 to-green-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-6">Solitaire</h1>
        <p className="text-green-100 text-xl mb-8">Coming soon!</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
