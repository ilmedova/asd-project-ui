import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FINNHUB_WS_URL = "wss://ws.finnhub.io?token=ct8bg11r01qtkv5s13qgct8bg11r01qtkv5s13r0";

function Dashboard() {
    const backend_url = "http://localhost:5000";

    const [selectedSymbols, setSelectedSymbols] = useState({});
    const [realTimePrices, setRealTimePrices] = useState({});
    const [previousPrices, setPreviousPrices] = useState({});
    const [newStock, setNewStock] = useState("");
    const [threshold, setThreshold] = useState("");
    const [mute, setMute] = useState(false);

    const playSound = () => {
        const audio = new Audio("/sounds/notification.wav");
        audio.play();
    };


    useEffect(() => {
        fetch(`${backend_url}/user/stocks`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        }).then((res) => res.json()).then((data) => setSelectedSymbols(data));
    }, []);


    useEffect(() => {
        const ws = new WebSocket(FINNHUB_WS_URL);

        ws.onopen = () => {
            Object.keys(selectedSymbols).forEach((symbol) =>
                ws.send(JSON.stringify({ type: "subscribe", symbol }))
            );
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "trade") {
                const updatedPrice = data.data[0].p;
                const symbol = data.data[0].s;

                setRealTimePrices((prev) => {
                    const prevPrice = prev[symbol];
                    setPreviousPrices((prevPrev) => ({
                        ...prevPrev,
                        [symbol]: prevPrice || updatedPrice,
                    }));
                    return {
                        ...prev,
                        [symbol]: updatedPrice,
                    };
                });

                if (selectedSymbols[symbol] && updatedPrice <= selectedSymbols[symbol]) {
                    notifyUser(symbol, updatedPrice, selectedSymbols[symbol]);
                }
            }
        };

        return () => {
            ws.close();
        };
    }, [selectedSymbols]);

    const muteSound = () => {
        setMute(true);
    }

    const addStock = () => {
        fetch(`${backend_url}/user/stocks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify({
                stock_symbol: newStock,
                threshold: parseFloat(threshold),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setSelectedSymbols(data);
                setNewStock("");
                setThreshold("");
            });
    };

    const removeStock = (symbol) => {
        fetch(`${backend_url}/user/stocks/${symbol}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        })
            .then((res) => res.json())
            .then((data) => setSelectedSymbols(data));
    };

    // Notify User via Firebase
    const notifyUser = (symbol, price, threshold) => {
        toast(`🦄 ${symbol} dropped to ${price}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
        });
        if(!mute){
            playSound();
        }
    };

    const getArrowClass = (symbol) => {
        const currentPrice = realTimePrices[symbol];
        const prevPrice = previousPrices[symbol];

        if (currentPrice > prevPrice) {
            return "bg-green-200 text-green-600";
        } else if (currentPrice < prevPrice) {
            return "bg-red-200 text-red-600";
        }
        return "bg-gray-200 text-gray-600";
    };

    const getArrowDirection = (symbol) => {
        const currentPrice = realTimePrices[symbol];
        const prevPrice = previousPrices[symbol];

        if (currentPrice > prevPrice) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
        );
        } else if (currentPrice < prevPrice) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25"/>
                </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"/>
            </svg>
        );
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex items-center gap-4 mb-6 bg-gray-200 p-6 justify-center rounded">
                <div className="w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="symbol">Stock symbol</label>
                    <input
                        type="text"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        placeholder="Stock Symbol (e.g., AAPL)"
                        className="bg-gray-100 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                </div>
                <div className="w-1/4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="threshold">Threshold</label>
                    <input
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        placeholder="Threshold (e.g., 500)"
                        className="bg-gray-100 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    />
                </div>
                <div className="w-1/4">
                    <button onClick={addStock} className="bg-gray-300 text-gray-700 hover:bg-grey-dark font-bold py-2 px-4 rounded ml-4 shadow mt-6">
                        Add Stock
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Object.keys(selectedSymbols).map((symbol) => (
                    <div
                        key={symbol}
                        className="p-4 bg-white rounded shadow border p-6 transition-transform transform hover:scale-105 relative group"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-400">{symbol}</p>
                            <div
                                className={`w-10 h-10 items-center justify-center rounded flex ${getArrowClass(symbol)}`}
                                >
                                    {getArrowDirection(symbol)}
                                </div>
                            </div>
                            <h5 className="text-3xl font-bold mb-4 mt-0">${realTimePrices[symbol]?.toFixed(2) || "Loading..."}</h5>
                            <span
                                className="inline-block bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 rounded-full">
                            Threshold: ${selectedSymbols[symbol]}
                        </span>
                            <button
                                onClick={() => removeStock(symbol)}
                                className="absolute bottom-4 right-4 bg-gray-300  p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                </svg>
                            </button>
                        </div>

                    ))}
                </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default Dashboard;
