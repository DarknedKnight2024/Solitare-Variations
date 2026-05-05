import { ReactNode } from "react";

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

export const suitSymbols: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

export const suitColors: Record<Suit, string> = {
  hearts: "text-red-600",
  diamonds: "text-red-600",
  clubs: "text-gray-900",
  spades: "text-gray-900",
};

export const suitColorsBg: Record<Suit, string> = {
  hearts: "bg-red-50",
  diamonds: "bg-red-50",
  clubs: "bg-gray-50",
  spades: "bg-gray-50",
};

export const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
export const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, id: `${suit}-${rank}` });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRankValue(rank: Rank): number {
  const values: Record<Rank, number> = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 11, "Q": 12, "K": 13, "A": 14
  };
  return values[rank];
}

export function isRedSuit(suit: Suit): boolean {
  return suit === "hearts" || suit === "diamonds";
}

export function isBlackSuit(suit: Suit): boolean {
  return suit === "clubs" || suit === "spades";
}

export function alternatingColors(card1: Card, card2: Card): boolean {
  return (isRedSuit(card1.suit) && isBlackSuit(card2.suit)) ||
         (isBlackSuit(card1.suit) && isRedSuit(card2.suit));
}

interface PlayingCardDisplayProps {
  card: Card;
  faceDown?: boolean;
  highlight?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
}

export function PlayingCardDisplay({
  card,
  faceDown = false,
  highlight = false,
  size = "md",
  className = "",
  children,
}: PlayingCardDisplayProps) {
  const sizeClasses = {
    sm: "w-16 h-24 text-2xl",
    md: "w-24 h-32 text-4xl",
    lg: "w-32 h-44 text-5xl",
  };

  const symbolSizeClasses = {
    sm: "text-3xl",
    md: "text-5xl",
    lg: "text-6xl",
  };

  if (faceDown) {
    return (
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg border-2 border-blue-900 flex items-center justify-center ${className}`}
      >
        <div className="text-blue-400 text-6xl opacity-30">🂠</div>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} bg-white rounded-lg shadow-lg border-2 flex flex-col items-center justify-center transition-all duration-200 ${
        highlight
          ? "border-yellow-400 shadow-yellow-400/50 shadow-2xl ring-2 ring-yellow-300"
          : "border-gray-300"
      } ${className}`}
    >
      <div className={`${sizeClasses[size].split(" ")[2]} font-bold ${suitColors[card.suit]}`}>
        {card.rank}
      </div>
      <div className={`${symbolSizeClasses[size]} ${suitColors[card.suit]}`}>
        {suitSymbols[card.suit]}
      </div>
      {children}
    </div>
  );
}
