// ConnectWallet.jsx
import React from "react";

function ConnectWallet({ connectWallet, account }) {
  return (
    <div className="text-center mb-6">
      {account ? (
        <p className="text-gray-600">Connected Account: {account}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default ConnectWallet;
