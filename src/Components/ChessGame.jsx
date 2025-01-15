import React, { useState, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const ChessGame = () => {
    const [game, setGame] = useState(new Chess());
    const [moveLog, setMoveLog] = useState([]);

    const getGameStatus = () => {
        if (game.isGameOver()) {
            if (game.isCheckmate()) return "Checkmate!";
            if (game.isDraw()) return "Draw!";
            if (game.isStalemate()) return "Stalemate!";
            return "Game Over!";
        }
        if (game.inCheck()) return "Check!";
        return `${game.turn() === "w" ? "White" : "Black"} to move`;
    };

    const resetGame = () => {
        setGame(new Chess());
        setMoveLog([]);
    };

    const onDrop = useCallback(
        (sourceSquare, targetSquare) => {
            try {
                const newGame = new Chess(game.fen()); // Clone the game state
                const move = newGame.move({
                    from: sourceSquare,
                    to: targetSquare,
                    promotion: "q", // Promote to queen for simplicity
                });

                if (move) {
                    setGame(newGame); // Update game state
                    const moveNotation = `${newGame.turn() === "w" ? "Black" : "White"}: ${move.san}`;
                    setMoveLog((prev) => [...prev, moveNotation]);
                    return true;
                }
            } catch (error) {
                console.error("Invalid move:", error);
                return false;
            }
            return false;
        },
        [game]
    );

    const containerStyle = {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        gap: "20px",
        flexDirection: window.innerWidth < 768 ? "column" : "row",
    };

    const boardContainerStyle = {
        flex: 2,
        maxWidth: "600px",
    };

    const moveLogStyle = {
        flex: 1,
        border: "1px solid #eee",
        padding: "10px",
    };

    const moveListStyle = {
        height: "400px",
        overflowY: "auto",
        border: "1px solid #eee",
        padding: "10px",
    };

    const moveItemStyle = {
        padding: "8px",
        borderBottom: "1px solid #eee",
        backgroundColor: "#fff",
    };

    const buttonStyle = {
        padding: "8px 16px",
        backgroundColor: "#2196f3",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginTop: "15px",
    };

    const statusStyle = {
        fontSize: "20px",
        marginBottom: "15px",
        textAlign: "center",
        color: game.inCheck() ? "#d32f2f" : "#333",
    };

    return (
        <div style={containerStyle}>
            <div style={boardContainerStyle}>
                <div style={statusStyle}>{getGameStatus()}</div>
                <Chessboard
                    position={game.fen()}
                    onPieceDrop={onDrop}
                    customBoardStyle={{
                        borderRadius: "4px",
                        boxShadow: "0 2px 10px rgba(0,0,0, 0.3)",
                    }}
                    customDarkSquareStyle={{
                        backgroundColor: "#779952",
                    }}
                    customLightSquareStyle={{
                        backgroundColor: "#edeed1",
                    }}
                />
                <button
                    onClick={resetGame}
                    style={buttonStyle}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#1976d2")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#2196f3")}
                >
                    New Game
                </button>
            </div>
            <div style={moveLogStyle}>
                <h2 style={{ marginBottom: "15px", fontSize: "18px" }}>Move History</h2>
                <div style={moveListStyle}>
                    {moveLog.length > 0 ? (
                        moveLog.map((move, index) => (
                            <div key={index} style={moveItemStyle}>
                                {`${Math.floor(index / 2) + 1}. ${move}`}
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
                            No moves yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChessGame;
