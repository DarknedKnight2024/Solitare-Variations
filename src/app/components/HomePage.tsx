import { Link } from "react-router";
import { Spade, Heart, Diamond, Club, Layers, Grid3x3, Pyramid, Mountain } from "lucide-react";

export default function HomePage() {
  const games = [
    {
      id: "aces-up",
      name: "Aces Up",
      description: "Remove all cards except the four Aces by discarding lower-ranked cards of the same suit.",
      path: "/aces-up",
      icon: Spade,
      color: "from-emerald-600 to-teal-700",
      textColor: "text-emerald-800",
      available: true,
    },
    {
      id: "klondike",
      name: "Klondike",
      description: "Classic Solitaire! Build foundations from Ace to King by suit.",
      path: "/klondike",
      icon: Heart,
      color: "from-red-600 to-rose-700",
      textColor: "text-red-800",
      available: true,
    },
    {
      id: "spider",
      name: "Spider",
      description: "Create eight complete sequences from King to Ace. Choose 1, 2, or 4 suits!",
      path: "/spider",
      icon: Layers,
      color: "from-purple-600 to-indigo-700",
      textColor: "text-purple-800",
      available: true,
    },
    {
      id: "freecell",
      name: "FreeCell",
      description: "Strategic solitaire with all cards visible. Use free cells wisely!",
      path: "/freecell",
      icon: Grid3x3,
      color: "from-blue-600 to-indigo-700",
      textColor: "text-blue-800",
      available: true,
    },
    {
      id: "pyramid",
      name: "Pyramid",
      description: "Match pairs of cards that sum to 13 to clear the pyramid.",
      path: "/pyramid",
      icon: Pyramid,
      color: "from-orange-600 to-red-700",
      textColor: "text-orange-800",
      available: true,
    },
    {
      id: "yukon",
      name: "Yukon",
      description: "Like Klondike but with more freedom! Move any face-up card.",
      path: "/yukon",
      icon: Mountain,
      color: "from-cyan-600 to-blue-700",
      textColor: "text-cyan-800",
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-800 to-green-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-8xl font-black text-white drop-shadow-2xl mb-4 tracking-tight">
            🃏 Solitaire Online
          </h1>
          <p className="text-green-100 text-2xl font-semibold drop-shadow-lg">
            Choose your favorite solitaire variant and start playing!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => {
            const Icon = game.icon;
            const content = (
              <div
                className={`bg-white rounded-3xl shadow-2xl p-8 transition-all duration-300 border-4 border-transparent ${
                  game.available
                    ? "hover:scale-105 hover:shadow-3xl hover:border-white/50 cursor-pointer transform hover:-translate-y-2"
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`bg-gradient-to-br ${game.color} rounded-2xl p-5 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                  <h2 className={`text-4xl font-black ${game.textColor}`}>{game.name}</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed font-medium min-h-[80px]">
                  {game.description}
                </p>
                {!game.available && (
                  <div className="mt-4 inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold shadow-md">
                    Coming Soon
                  </div>
                )}
                {game.available && (
                  <div className={`mt-6 inline-block bg-gradient-to-r ${game.color} text-white px-6 py-3 rounded-xl text-lg font-bold shadow-lg transform transition-transform group-hover:scale-110`}>
                    Play Now →
                  </div>
                )}
              </div>
            );

            return game.available ? (
              <Link key={game.id} to={game.path} className="group">
                {content}
              </Link>
            ) : (
              <div key={game.id}>{content}</div>
            );
          })}
        </div>

        <div className="mt-16 bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20">
          <h2 className="text-4xl font-black text-white mb-6 text-center">About Solitaire Online</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white text-lg">
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-2xl mb-3 text-yellow-300">🎮 Multiple Variants</h3>
              <p className="opacity-90">
                From classic Klondike to strategic FreeCell, enjoy six unique solitaire games with different
                challenges.
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-2xl mb-3 text-yellow-300">🎯 Beautiful Design</h3>
              <p className="opacity-90">
                Stunning gradients, smooth animations, and intuitive drag-and-drop gameplay for the best experience.
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-2xl mb-3 text-yellow-300">🧠 Strategic Gameplay</h3>
              <p className="opacity-90">
                Each variant offers unique rules and strategies. Master them all for the ultimate solitaire challenge!
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-2xl mb-3 text-yellow-300">✨ Free & Fun</h3>
              <p className="opacity-90">
                Play unlimited games anytime, anywhere. No sign-up required, just pure solitaire enjoyment!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
