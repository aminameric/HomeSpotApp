$(document).ready(function() {
    console.log('Document is ready');

    // Check if MetaMask is available
    function checkMetaMaskAvailability() {
        if (typeof window.ethereum === 'undefined') {
            toastr.error('Please install MetaMask to use this feature.');
            return false;
        }
        return true;
    }

    // Connect MetaMask
    async function connectMetaMaskWallet() {
        if (!checkMetaMaskAvailability()) return;

        try {
            // Request accounts
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAccount = accounts[0];

            if (userAccount) {
                console.log('Connected MetaMask account:', userAccount);
                toastr.success(`MetaMask connected to account: ${userAccount}`);

                // Update UI to reflect connection
                $('#connect-wallet-btn').hide();
                $('#disconnect-wallet-btn').show();
                $('#buy-property-btn').show();
            } else {
                toastr.error('Failed to connect MetaMask. No account selected.');
            }
        } catch (error) {
            console.error('Error connecting MetaMask:', error);
            toastr.error('Failed to connect MetaMask. Please try again.');
        }
    }

    // Disconnect MetaMask
    function disconnectMetaMaskWallet() {
        console.log('Disconnect button clicked');
        toastr.success('MetaMask wallet disconnected.');

        // Update UI to reflect disconnection
        $('#connect-wallet-btn').show();
        $('#disconnect-wallet-btn').hide();
        $('#buy-property-btn').hide();
    }

    // Convert BAM to Ether
function convertBAMtoEther(bamAmount) {
    const conversionRate = 0.1 / 100; // 0.001 Ether per BAM
    return bamAmount * conversionRate;
}

// Fetch Property Price from the API and Convert to Ether
function fetchPropertyPriceAndConvertToEther(propertyId) {
    $.ajax({
        url: `../rest/priceprop/${propertyId}`, // Ensure this URL is correct
        method: 'GET',
        success: function(response) {
            console.log('API Response:', response); // Debugging
            
            // Check for the correct result structure
            if (response.result && response.result.price) {
                const priceBAM = parseFloat(response.result.price);
                if (!isNaN(priceBAM)) {
                    console.log('Property price BAM:', priceBAM);
                    const priceEther = convertBAMtoEther(priceBAM);
                    console.log('Property price ETH:', priceEther);
                    sendTransaction(priceEther);
                } else {
                    toastr.error('Invalid property price retrieved.');
                }
            } else {
                toastr.error('No property price found.');
            }
        },
        error: function() {
            toastr.error('Failed to fetch property price.');
        }
    });
}



// Send Transaction
async function sendTransaction(propertyPriceEther) {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
        toastr.error("Please connect to MetaMask.");
        return;
    }
    const userAddress = accounts[0];
    const contractAddress = '0x3B2bBcBB111cE699b540e34D0F2Cf4Cd36838566'; // Replace with your contract address

    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    const propertyId = getQueryParameter('id');
    if (!userId || !propertyId) {
        toastr.error('Missing user ID or property ID. Cannot proceed.');
        return;
    }

    const txParams = {
        from: userAddress,
        to: contractAddress,
        value: web3.utils.toWei(propertyPriceEther.toString(), 'ether'),
        gas: '2000000',
        gasPrice: web3.utils.toWei('20', 'gwei')
    };

    try {
        const receipt = await web3.eth.sendTransaction(txParams);
        console.log('Transaction Receipt:', receipt);
        toastr.success(`Transaction successful! Hash: ${receipt.transactionHash}`);
        
        // Call buyProperty instead of deleteProperty
        buyProperty(userId, propertyId);
    } catch (error) {
        console.error('Transaction Error:', error);
        toastr.error('Failed to send transaction. Please try again.');
    }
}


// Buy Property
function buyProperty(userId, propertyId) {
        
    $.ajax({
        url: '../rest/buyProperty',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ users_id: userId, property_id: propertyId }),
        success: function(response) {
            console.log('Sent data:', { users_id: userId, property_id: propertyId });
            console.log('Response from backend:', response);
            
            if (response.success) {
                toastr.success('Property bought successfully!');
                // Call update status only if buying is successful
                updatePropertyStatus(propertyId, 1, userId);
            } else {
                alert('Failed to buy property: ' + response.message);
            }
        },
        error: function(xhr) {
            toastr.error('Error: ' + xhr.responseJSON.message);
            console.error('Backend error:', xhr);
        }
    });
}

// Function to update the property status
function updatePropertyStatus(propertyId, status, userId) {
    $.ajax({
        url: '../rest/updatePropertyStatus',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ propertyId: propertyId, status: status }),
        success: function(updateResponse) {
            console.log('Update status response:', updateResponse);
            if (updateResponse.success) {
                //toastr.success('Property status updated successfully!');
                $('#buyModal').modal('hide'); // Hide the modal if using Bootstrap, for example
                // Redirect user
                window.location.href="#properties"
                loadBoughtProperties(userId);
            } else {
                //toastr.error('Failed to update property status: ' + updateResponse.message);
            }
        },
        error: function(updateError, textStatus, errorThrown) {
            console.error('Error updating property status:', updateError);
            let errorMessage = 'Unknown error'; // Default message
            if (updateError.responseJSON && updateError.responseJSON.message) {
                errorMessage = updateError.responseJSON.message;
            } else if (updateError.responseText) {
                errorMessage = updateError.responseText; // Fallback if responseJSON is not available
            } else {
                errorMessage = errorThrown; // Use errorThrown if no other details are available
            }
            alert('Error updating property status: ' + errorMessage);
        }
        
    });
}

// Extract Property ID from URL
function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

$('#buy-property-btn').on('click', function() {
    const propertyId = getQueryParameter('id');
    if (!propertyId) {
        toastr.error('Property ID not found in URL.');
        return;
    }

    // Fetch property price and convert it to Ether before initiating the transaction
    fetchPropertyPriceAndConvertToEther(propertyId);
});





    

    // Event listeners
    $('#connect-wallet-btn').on('click', function() {
        console.log('Connect button clicked');
        window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] })
        .then(() => connectMetaMaskWallet())
        .catch(error => {
            console.error('Error forcing MetaMask account prompt:', error);
            toastr.error('Failed to prompt for account selection.');
        });
    });

    $('#disconnect-wallet-btn').on('click', function() {
        console.log('Disconnect button clicked');
        disconnectMetaMaskWallet();
    });

    
});