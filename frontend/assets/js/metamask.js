// Store the connected MetaMask wallet for each logged-in user
function connectMetaMaskWallet() {
    if (typeof window.ethereum !== 'undefined') {
        ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            const userAccount = accounts[0];

            // Check if the user is logged in
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (currentUser) {
                // Store the connected MetaMask account in localStorage for this specific user
                localStorage.setItem(`metaMaskAccount_${currentUser.id}`, userAccount);

                console.log('Connected MetaMask account for user:', userAccount);

                // Update UI to reflect connection
                document.getElementById('connect-wallet-btn').style.display = 'none';
                document.getElementById('disconnect-wallet-btn').style.display = 'block';
                document.getElementById('buy-property-btn').style.display = 'block'; // Show the buy button
                toastr.success(`MetaMask connected to account: ${userAccount}`);
            } else {
                console.error("No user logged in. Cannot store MetaMask account.");
                alert("Please log in first.");
            }
        })
        .catch(error => {
            console.error('Error connecting MetaMask:', error);
            alert('Failed to connect MetaMask. Please try again.');
        });
    } else {
        alert('Please install MetaMask to use this feature.');
    }
}

// On page load or login, check if the user is connected to MetaMask
function checkMetaMaskConnection() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (currentUser) {
        const connectedAccount = localStorage.getItem(`metaMaskAccount_${currentUser.id}`);

        if (connectedAccount) {
            console.log(`User is already connected to MetaMask: ${connectedAccount}`);

            // Update UI to reflect the connected state
            document.getElementById('connect-wallet-btn').style.display = 'none';
            document.getElementById('disconnect-wallet-btn').style.display = 'block';
            document.getElementById('buy-property-btn').style.display = 'block'; // Show the buy button
            toastr.success(`Connected to MetaMask: ${connectedAccount}`);
        } else {
            // Ensure the buttons display correctly
            document.getElementById('connect-wallet-btn').style.display = 'block';
            document.getElementById('disconnect-wallet-btn').style.display = 'none';
            document.getElementById('buy-property-btn').style.display = 'none'; // Hide the buy button
        }
    } else {
        console.log("No user logged in. Skipping MetaMask connection check.");
    }
}

// Function to disconnect MetaMask
function disconnectMetaMaskWallet() {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (currentUser) {
        // Remove MetaMask account from localStorage
        localStorage.removeItem(`metaMaskAccount_${currentUser.id}`);
        console.log('MetaMask wallet disconnected for user:', currentUser.id);

        // Update UI to reflect disconnection
        document.getElementById('connect-wallet-btn').style.display = 'block';
        document.getElementById('disconnect-wallet-btn').style.display = 'none';
        document.getElementById('buy-property-btn').style.display = 'none'; // Hide the buy button

        toastr.success('MetaMask wallet disconnected.');

        // Optional: Reload the page to reset the session
        setTimeout(() => {
            window.location.reload();
        }, 500); // Small delay to allow UI changes to reflect before reload
    } else {
        console.error('No user logged in to disconnect MetaMask.');
    }
}

// Ensure event listeners are attached properly
window.onload = function() {
    document.getElementById('connect-wallet-btn').addEventListener('click', connectMetaMaskWallet);
    document.getElementById('disconnect-wallet-btn').addEventListener('click', disconnectMetaMaskWallet);
    document.getElementById('buy-property-btn').addEventListener('click', buyPropertyWithMetaMask);

    // On page load, check MetaMask connection
    checkMetaMaskConnection();
}

// Example function to handle property purchase with MetaMask
async function buyPropertyWithMetaMask() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const connectedAccount = localStorage.getItem(`metaMaskAccount_${currentUser.id}`);

    if (connectedAccount) {
        console.log('Initiating MetaMask transaction from account:', connectedAccount);

        // Ensure Web3 is initialized
        if (typeof window.ethereum !== 'undefined') {
            const web3 = new Web3(window.ethereum);  // Initialize Web3 using MetaMask's provider

            try {
                // Fetch current gas price dynamically to avoid delays
                const gasPrice = await web3.eth.getGasPrice();

                // Prepare the transaction parameters
                const transactionParameters = {
                    from: connectedAccount,
                    to: '0x3B2bBcBB111cE699b540e34D0F2Cf4Cd36838566', // Replace with the contract address or receiver address
                    value: web3.utils.toHex(web3.utils.toWei('0.01', 'ether')), // Example value (0.01 ETH in Wei)
                    gasPrice: web3.utils.toHex(gasPrice * 1.2), // Increase gas price by 20% to prioritize transaction
                    gas: web3.utils.toHex(21000), // Gas limit for a simple transaction
                };

                const txHash = await ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                });

                console.log('Transaction successful with hash:', txHash);
                toastr.success(`Property purchase successful! Transaction hash: ${txHash}`);

                // Optionally, you can direct the user to Etherscan for tracking
                window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
            } catch (error) {
                console.error('Transaction failed:', error);

                // Provide detailed feedback to the user
                if (error.code === 4001) {
                    alert('Transaction was rejected by the user.');
                } else if (error.code === -32603) {
                    alert('Insufficient funds or gas issues. Please check your account.');
                } else {
                    alert('Transaction failed. Please try again.');
                }
            }
        } else {
            alert('MetaMask is not installed or detected. Please install MetaMask to continue.');
        }
    } else {
        alert('Please connect your MetaMask wallet before purchasing a property.');
    }
}
