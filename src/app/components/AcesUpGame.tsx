import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, RotateCcw, Lightbulb, Undo, Book } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Card, suitSymbols, suitColors, createDeck, shuffleDeck, getRankValue } from "./shared/Card";

interface PlayingCardProps {
  card: Card;
  canRemove: boolean;
  showHint: boolean;
  onClick: () => void;
  pileIndex: number;
}

function PlayingCard({ card, canRemove, showHint, onClick, pileIndex }: PlayingCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { card, pileIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const highlightCard = canRemove && showHint;

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`w-28 h-36 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl border-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform ${
        highlightCard
          ? "border-yellow-400 shadow-yellow-400/60 shadow-2xl ring-4 ring-yellow-300 scale-105 animate-pulse"
          : "border-gray-200 hover:scale-105 hover:shadow-2xl"
      } ${isDragging ? "opacity-50 rotate-6" : ""}`}
    >
      <div className={`absolute top-2 left-2 text-2xl font-bold ${suitColors[card.suit]}`}>
        {card.rank}
      </div>
      <div className={`text-6xl ${suitColors[card.suit]} drop-shadow-sm`}>
        {suitSymbols[card.suit]}
      </div>
      <div className={`absolute bottom-2 right-2 text-2xl font-bold ${suitColors[card.suit]} rotate-180`}>
        {card.rank}
      </div>
    </div>
  );
}

interface EmptySlotProps {
  pileIndex: number;
  onDrop: (card: Card, fromPile: number) => void;
}

function EmptySlot({ pileIndex, onDrop }: EmptySlotProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: { card: Card; pileIndex: number }) => {
      onDrop(item.card, item.pileIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`w-28 h-36 border-4 border-dashed rounded-xl flex items-center justify-center transition-all duration-300 ${
        isOver ? "border-green-400 bg-green-100 scale-105 shadow-lg" : "border-white/30 bg-white/5"
      }`}
    >
      <span className="text-white/50 text-sm font-semibold">Empty</span>
    </div>
  );
}

interface GameState {
  tableau: Card[][];
  stock: Card[];
  discardPile: Card[];
}

function AcesUpGameContent() {
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], []]);
  const [stock, setStock] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [isRulebookOpen, setIsRulebookOpen] = useState(false);
  const [history, setHistory] = useState<GameState[]>([]);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck = createDeck();
    const shuffled = shuffleDeck(deck);
    const initialTableau: Card[][] = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      initialTableau[i] = [shuffled[i]];
    }

    setTableau(initialTableau);
    setStock(shuffled.slice(4));
    setDiscardPile([]);
    setGameWon(false);
    setHistory([]);
  };

  const getRemovableCards = (): Set<string> => {
    const removable = new Set<string>();
    const topCards = tableau
      .map((pile) => pile[pile.length - 1])
      .filter((card): card is Card => card !== undefined);

    for (let i = 0; i < topCards.length; i++) {
      const card1 = topCards[i];

      for (let j = 0; j < topCards.length; j++) {
        if (i === j) continue;
        const card2 = topCards[j];
        if (!card2) continue;

        if (card1.suit === card2.suit) {
          if (getRankValue(card1.rank) < getRankValue(card2.rank)) {
            removable.add(card1.id);
          }
        }
      }
    }

    return removable;
  };

  const handleCardClick = (pileIndex: number) => {
    const pile = tableau[pileIndex];
    if (pile.length === 0) return;

    const topCard = pile[pile.length - 1];
    const removableCards = getRemovableCards();

    if (removableCards.has(topCard.id)) {
      removeCard(pileIndex);
    }
  };

  const removeCard = (pileIndex: number) => {
    setHistory((prev) => [...prev, { tableau, stock, discardPile }]);
    const newTableau = tableau.map((pile, idx) => (idx === pileIndex ? pile.slice(0, -1) : pile));
    const removedCard = tableau[pileIndex][tableau[pileIndex].length - 1];

    setTableau(newTableau);
    setDiscardPile([...discardPile, removedCard]);

    checkWinCondition(newTableau);
  };

  const handleDeal = () => {
    if (stock.length === 0) return;

    setHistory((prev) => [...prev, { tableau, stock, discardPile }]);
    const newTableau = [...tableau];
    const newStock = [...stock];

    for (let i = 0; i < 4; i++) {
      if (newStock.length > 0) {
        newTableau[i] = [...newTableau[i], newStock.shift()!];
      }
    }

    setTableau(newTableau);
    setStock(newStock);
  };

  const handleDropOnEmpty = (card: Card, fromPile: number) => {
    const fromPileCards = tableau[fromPile];
    if (fromPileCards.length === 0) return;

    const topCard = fromPileCards[fromPileCards.length - 1];
    if (topCard.id !== card.id) return;

    const emptyPileIndex = tableau.findIndex((pile) => pile.length === 0);
    if (emptyPileIndex === -1) return;

    setHistory((prev) => [...prev, { tableau, stock, discardPile }]);
    const newTableau = tableau.map((pile, idx) => {
      if (idx === fromPile) return pile.slice(0, -1);
      if (idx === emptyPileIndex) return [...pile, card];
      return pile;
    });

    setTableau(newTableau);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setTableau(previousState.tableau);
    setStock(previousState.stock);
    setDiscardPile(previousState.discardPile);
    setHistory(history.slice(0, -1));
    setGameWon(false);
  };

  const checkWinCondition = (currentTableau: Card[][]) => {
    const allCards = currentTableau.flat().filter((card) => card !== null);

    if (allCards.length === 4) {
      const allAces = allCards.every((card) => card && card.rank === "A");
      if (allAces) {
        setGameWon(true);
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ["#FFD700", "#FFA500", "#FF6347"],
        });
      }
    }
  };

  const removableCards = getRemovableCards();
  const totalCardsRemaining = tableau.flat().filter((c) => c !== null).length;
  const canDeal = stock.length > 0;
  const noMovesAvailable = removableCards.size === 0 && !canDeal && tableau.every((pile) => pile.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-teal-800 to-cyan-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-emerald-800 px-5 py-3 rounded-xl font-bold hover:bg-white hover:scale-105 transition-all shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Home
          </Link>

          <h1 className="text-6xl font-black text-white drop-shadow-2xl tracking-tight">Aces Up</h1>

          <div className="flex gap-2">
            <button
              onClick={() => setIsRulebookOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-600 hover:scale-105 transition-all shadow-lg"
            >
              <Book className="w-5 h-5" />
            </button>
            <button
              onClick={initializeGame}
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-emerald-800 px-5 py-3 rounded-xl font-bold hover:bg-white hover:scale-105 transition-all shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              New Game
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border-2 border-white/20 shadow-2xl">
          <div className="flex justify-between items-center text-white">
            <div className="flex flex-col">
              <span className="text-sm opacity-75">Cards Remaining</span>
              <span className="text-3xl font-black">{totalCardsRemaining}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm opacity-75">Discarded</span>
              <span className="text-3xl font-black">{discardPile.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm opacity-75">Stock</span>
              <span className="text-3xl font-black">{stock.length}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  showHint ? "bg-yellow-400 text-gray-900" : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Lightbulb className="w-5 h-5" />
                Hints {showHint ? "ON" : "OFF"}
              </button>
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg font-bold hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Undo className="w-5 h-5" />
                Undo
              </button>
            </div>
          </div>
        </div>

        {gameWon && (
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white text-center py-6 px-8 rounded-2xl mb-6 text-3xl font-black shadow-2xl animate-bounce">
            🎉 VICTORY! All Aces Remaining! 🎉
          </div>
        )}

        {noMovesAvailable && !gameWon && (
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white text-center py-6 px-8 rounded-2xl mb-6 text-2xl font-black shadow-2xl">
            💀 Game Over - No more moves available
          </div>
        )}

        <div className="space-y-12">
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-white font-bold mb-4 text-xl tracking-wide">DISCARD PILE</div>
              <div className="w-32 h-44 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl border-4 border-white/30 border-dashed flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-4xl drop-shadow-lg">{discardPile.length}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-8">
            {tableau.map((pile, pileIndex) => (
              <div key={pileIndex} className="flex flex-col items-center gap-3">
                <div className="text-white font-bold text-lg tracking-wide">PILE {pileIndex + 1}</div>
                <div className="relative">
                  {pile.length > 0 ? (
                    <div className="relative">
                      {pile.map((card, cardIndex) => (
                        <div key={card.id} className="absolute" style={{ top: cardIndex * 10 }}>
                          {cardIndex === pile.length - 1 && (
                            <PlayingCard
                              card={card}
                              canRemove={removableCards.has(card.id)}
                              showHint={showHint}
                              onClick={() => handleCardClick(pileIndex)}
                              pileIndex={pileIndex}
                            />
                          )}
                          {cardIndex < pile.length - 1 && (
                            <div className="w-28 h-10 bg-white rounded-t-xl border-4 border-gray-200 border-b-0 shadow-md" />
                          )}
                        </div>
                      ))}
                      <div style={{ height: 40 + pile.length * 10 + 104 }} />
                    </div>
                  ) : (
                    <EmptySlot pileIndex={pileIndex} onDrop={handleDropOnEmpty} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-white font-bold mb-4 text-xl tracking-wide">STOCK PILE</div>
              <button
                onClick={handleDeal}
                disabled={!canDeal}
                className={`w-40 h-52 rounded-xl font-black text-2xl transition-all transform shadow-2xl ${
                  canDeal
                    ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 hover:scale-105 cursor-pointer border-4 border-blue-400"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed border-4 border-gray-700"
                }`}
              >
                {canDeal ? (
                  <>
                    <div>DEAL</div>
                    <div className="text-5xl mt-2">{stock.length}</div>
                  </>
                ) : (
                  "EMPTY"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isRulebookOpen} onOpenChange={setIsRulebookOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-emerald-800">How to Play Aces Up</DialogTitle>
            <DialogDescription className="text-lg text-gray-700 space-y-4 mt-4">
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">🎯 Goal</h3>
                <p>Remove all cards except the four Aces (one from each suit).</p>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">🃏 Removal Rule</h3>
                <p>
                  Click a top card if it is lower-ranked than another top card of the same suit. For example, if you
                  have a 7♥ and K♥ showing, you can remove the 7♥.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">👑 Aces are High</h3>
                <p>Aces have the highest value (rank 14), so they can never be removed.</p>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">📦 Empty Slots</h3>
                <p>Drag any top card from one pile to an empty pile to rearrange your tableau.</p>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">🎴 Deal</h3>
                <p>Click the stock pile to deal 4 new cards (one onto each pile) when you have no more moves.</p>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">🏆 Win Condition</h3>
                <p>Win by leaving only the four Aces on the tableau with all other 48 cards discarded!</p>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">💡 Hints</h3>
                <p>Toggle hints to see which cards can be removed (they'll glow yellow).</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AcesUpGame() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AcesUpGameContent />
    </DndProvider>
  );
}
