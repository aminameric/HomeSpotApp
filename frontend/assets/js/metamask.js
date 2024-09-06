// Store the connected MetaMask wallet for each logged-in user
function connectMetaMaskWallet() {
    if (typeof window.ethereum !== 'undefined') {
        ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            const userAccount = accounts[0];
            
            // Assuming the user is logged in and their user ID is stored in localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));

            // Store the connected MetaMask account in localStorage for this specific user
            localStorage.setItem(`metaMaskAccount_${currentUser.id}`, userAccount);

            console.log('Connected MetaMask account for user:', userAccount);

            // Update UI to reflect connection
            document.getElementById('connect-wallet-btn').style.display = 'none';
            document.getElementById('disconnect-wallet-btn').style.display = 'block';
            document.getElementById('buy-property-btn').style.display = 'block'; // Show the buy button
            toastr.success(`MetaMask connected to account: ${userAccount}`);
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
            document.getElementById('connect-wallet-btn').style.display = 'block';
            document.getElementById('disconnect-wallet-btn').style.display = 'none';
            document.getElementById('buy-property-btn').style.display = 'none'; // Hide the buy button
        }
    }
}

// Function to disconnect MetaMask
function disconnectMetaMaskWallet() {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (currentUser) {
        // Remove the MetaMask account associated with this user
        localStorage.removeItem(`metaMaskAccount_${currentUser.id}`);
        
        console.log('MetaMask wallet disconnected for user:', currentUser.id);

        // Update UI to reflect disconnection
        document.getElementById('connect-wallet-btn').style.display = 'block';
        document.getElementById('disconnect-wallet-btn').style.display = 'none';
        document.getElementById('buy-property-btn').style.display = 'none'; // Hide the buy button
        toastr.success('MetaMask wallet disconnected.');
    }
}

// Add event listener for connect and disconnect buttons
document.getElementById('connect-wallet-btn').addEventListener('click', connectMetaMaskWallet);
document.getElementById('disconnect-wallet-btn').addEventListener('click', disconnectMetaMaskWallet);

// Handle user logout
function logoutUser() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (currentUser) {
        // Clear MetaMask account for the logged-out user
        localStorage.removeItem(`metaMaskAccount_${currentUser.id}`);
        console.log('User logged out and MetaMask account disconnected.');

        // Clear user data from localStorage
        localStorage.removeItem('user');
        
        // Redirect to login page or show login UI
        window.location.href = '#login'; // Example of redirecting to a login page
    }
}

// Example function to handle property purchase with MetaMask
function buyPropertyWithMetaMask() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const connectedAccount = localStorage.getItem(`metaMaskAccount_${currentUser.id}`);

    if (connectedAccount) {
        console.log('Initiating MetaMask transaction from account:', connectedAccount);

        // Ensure Web3 is initialized
        if (typeof window.ethereum !== 'undefined') {
            const web3 = new Web3(window.ethereum);  // Initialize Web3 using MetaMask's provider

            // Prepare the transaction parameters
            const transactionParameters = {
                from: connectedAccount,
                to: '0x3B2bBcBB111cE699b540e34D0F2Cf4Cd36838566', // Replace with the contract address or receiver address
                value: web3.utils.toHex(web3.utils.toWei('0.01', 'ether')), // Example value (0.01 ETH in Wei)
                gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')), // Optional: reduced gas price (10 gwei)
                gas: web3.utils.toHex(21000), // Optional: gas limit for a simple transaction
            };

            // Send the transaction via MetaMask
            ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            })
            .then(txHash => {
                console.log('Transaction successful with hash:', txHash);
                toastr.success(`Property purchase successful! Transaction hash: ${txHash}`);
            })
            .catch(error => {
                console.error('Transaction failed:', error);
                alert('Transaction failed. Please try again.');
            });
        } else {
            alert('MetaMask is not installed or detected. Please install MetaMask to continue.');
        }
    } else {
        alert('Please connect your MetaMask wallet before purchasing a property.');
    }
}

// Add event listener for buying property button
document.getElementById('buy-property-btn').addEventListener('click', buyPropertyWithMetaMask);

// On page load, check MetaMask connection
checkMetaMaskConnection();
