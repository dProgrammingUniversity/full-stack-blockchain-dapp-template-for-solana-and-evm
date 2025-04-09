
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title HelloWeb3World
/// @notice A simple contract to store and retrieve a message on Ethereum blockchain
/// @dev This is the Ethereum equivalent of the Solana hello_web3_world program
contract HelloWeb3World {
    // State variable to store the message
    string private message;
    
    // Event emitted when message is initialized
    event MessageInitialized(string message);
    
    // Event emitted when message is retrieved
    event MessageRetrieved(string message);
    
    // Flag to ensure message is initialized only once
    bool private initialized;
    
    /// @notice Initialize the message
    /// @dev Can only be called once
    function initialize() public {
        require(!initialized, "Message already initialized");
        message = "Hello Web3 World On Ethereum Blockchain";
        initialized = true;
        emit MessageInitialized(message);
    }
    
    /// @notice Retrieve the stored message
    /// @return The stored message
    function getMessage() public returns (string memory) {
        require(initialized, "Message not initialized yet");
        emit MessageRetrieved(message);
        return message;
    }
    
    /// @notice Check if message has been initialized
    /// @return true if initialized, false otherwise
    function isInitialized() public view returns (bool) {
        return initialized;
    }
}

///Remix Source:
/// https://remix.ethereum.org/#lang=en&optimize=true&runs=200&evmVersion=null&version=soljson-v0.8.26+commit.8a97fa7a.js