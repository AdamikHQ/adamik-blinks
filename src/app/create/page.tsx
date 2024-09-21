"use client";
import React, { useState } from "react";
import { TokenBTC, TokenETH, TokenATOM } from "@web3icons/react";
import { BlinkConfig } from "~/types/blinks"; // Assuming this is the correct path
import { TransactionData, TransactionMode } from "~/types/adamik"; // Assuming this is the correct path

const DonatePage = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for controlling dropdown visibility

  // New form fields
  const [blinkName, setBlinkName] = useState("");
  const [blinkDescription, setBlinkDescription] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [defaultAmountUSD, setDefaultAmountUSD] = useState("");

  const handleSelectDonation = () => {
    setSelectedOption("donation");
  };

  const handleSelectStaking = () => {
    setSelectedOption("staking");
  };

  const handleAssetChange = (asset: string) => {
    setSelectedAsset(asset);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  // Counter to simulate blink generation
  let blinkCounter = 0;

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();

    // Increment counter for new blink
    blinkCounter += 1;
    const blinkId = `default-${blinkCounter.toString().padStart(4, "0")}`;

    const newBlinkConfig: BlinkConfig = {
      metadata: {
        name: blinkName,
        url: "https://adamik.io",
        description: blinkDescription,
        imageUrl: "https://picsum.photos/500/300",
      },
      transactionData: {
        chainId: selectedAsset, // Assume the chainId is the selected asset
        mode: TransactionMode.TRANSFER, // Use enum value here
        sender: "", // Sender completed during blink execution
        recipient: recipientAddress,
        amount: "", // Placeholder if needed for future use
        amountUSD: defaultAmountUSD,
      } as TransactionData,
    };

    // For now, logging the new blink configuration
    console.log("Blink Config Generated: ", blinkId, newBlinkConfig);

    // Here you would submit or use the `newBlinkConfig` to trigger any API or state update
  };

  // First step: User selects either "Donation Blink" or "Staking Blink"
  if (selectedOption === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
        <div className="flex justify-around w-full max-w-6xl">
          {/* Donation Blink Card */}
          <div
            className="bg-white shadow-md w-1/2 p-8 m-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleSelectDonation}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-600">
              Create a Donation Blink
            </h2>
            <p className="text-gray-600">
              Set up a blink for receiving donations on your address
            </p>
          </div>

          {/* Staking Blink Card */}
          <div
            className="bg-white shadow-md w-1/2 p-8 m-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleSelectStaking}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-600">
              Create a Staking Blink
            </h2>
            <p className="text-gray-600">
              Set up a blink for receiving delegation on your validator
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If "Donation Blink" is selected, render the donation form
  if (selectedOption === "donation") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
        <div className="bg-white shadow-md w-full p-12 text-center max-w-6xl">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-black">
              Edit your Donation Blink
            </h1>
            <p className="text-lg mb-8 text-gray-600">
              Select the asset, amount, and destination address
            </p>

            <form className="space-y-6" onSubmit={handleDeploy}>
              {/* Blink Details */}
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blink Name
                </label>
                <input
                  type="text"
                  value={blinkName}
                  onChange={(e) => setBlinkName(e.target.value)}
                  placeholder="Enter Blink Name"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blink Description
                </label>
                <textarea
                  value={blinkDescription}
                  onChange={(e) => setBlinkDescription(e.target.value)}
                  placeholder="Enter Blink Description"
                  className="w-full h-12 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              {/* Custom Dropdown for Asset Selection */}
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Asset to Receive
                </label>
                <div
                  className="relative inline-block w-full cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="bg-white border p-3 rounded-lg flex items-center justify-between">
                    {selectedAsset === "BTC" && (
                      <TokenBTC
                        variant="mono"
                        className="h-6 mr-2 text-black"
                      />
                    )}
                    {selectedAsset === "ETH" && (
                      <TokenETH
                        variant="mono"
                        className="h-6 mr-2 text-black"
                      />
                    )}
                    {selectedAsset === "ATOM" && (
                      <TokenATOM
                        variant="mono"
                        className="h-6 mr-2 text-black"
                      />
                    )}
                    <span className="text-black">{selectedAsset}</span>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 bg-white border rounded-lg w-full z-10">
                      <div
                        className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleAssetChange("BTC")}
                      >
                        <TokenBTC
                          variant="mono"
                          className="h-6 mr-2 text-black"
                        />
                        <span className="text-black">BTC (Bitcoin)</span>
                      </div>
                      <div
                        className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleAssetChange("ETH")}
                      >
                        <TokenETH
                          variant="mono"
                          className="h-6 mr-2 text-black"
                        />
                        <span className="text-black">ETH (Ethereum)</span>
                      </div>
                      <div
                        className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleAssetChange("ATOM")}
                      >
                        <TokenATOM
                          variant="mono"
                          className="h-6 mr-2 text-black"
                        />
                        <span className="text-black">ATOM (Cosmos)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enter Donation Address */}
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Donation Address
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x0000...0000"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              {/* Enter Default Amount in USD */}
              <div className="text-left relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Default Amount in USD
                </label>
                <input
                  type="text"
                  value={defaultAmountUSD}
                  onChange={(e) => setDefaultAmountUSD(e.target.value)}
                  placeholder="123"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                {/* Fixed USD ticker */}
                <span className="absolute right-4 top-12 text-gray-600">
                  USD
                </span>
              </div>

              {/* Deploy Blink Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white w-full p-3 rounded-lg shadow-sm hover:bg-blue-600"
                >
                  Deploy Blink
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Add a similar form for "staking" if needed in future

  return null;
};

export default DonatePage;
