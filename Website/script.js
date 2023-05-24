// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this feature.');
      return;
    }
  
    // NCR token contract address and ABI
    const ncrTokenAddress = '0x...'; // Replace with the actual NCR token contract address
    const ncrTokenABI = [
      // Replace with the actual ABI of the NCR token contract
      // Example ABI:
      // {
      //   "constant": true,
      //   "inputs": [],
      //   "name": "balanceOf",
      //   "outputs": [{ "name": "", "type": "uint256" }],
      //   "payable": false,
      //   "stateMutability": "view",
      //   "type": "function"
      // },
      // ...
    ];
  
    // Create a new instance of the web3 provider
    const provider = new Web3(window.ethereum);
  
    // Create a new instance of the NCR token contract
    const ncrTokenContract = new provider.eth.Contract(ncrTokenABI, ncrTokenAddress);
  
    // Handle form submission and payment
    document.getElementById('submitPayment').addEventListener('click', async () => {
      try {
        // Request user's permission to connect with MetaMask
        await ethereum.enable();
  
        // Get the user's Ethereum address
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const userAddress = accounts[0];
  
        // Get the advertisement details from the form
        const adTitle = document.getElementById('adTitle').value;
        const adDescription = document.getElementById('adDescription').value;
        const adPrice = document.getElementById('adPrice').value;
  
        // Check the user's NCR token balance
        const balance = await ncrTokenContract.methods.balanceOf(userAddress).call();
  
        // Convert the ad price to the token's smallest unit (e.g., Wei)
        const adPriceWei = provider.utils.toWei(adPrice.toString(), 'ether');
  
        // Verify if the user has enough balance
        if (balance < adPriceWei) {
          alert('Insufficient NCR token balance. Please purchase enough tokens.');
          return;
        }
  
        // Perform the token transfer to the advertiser's address
        await ncrTokenContract.methods.transfer(advertiserAddress, adPriceWei).send({ from: userAddress });
  
        // Perform the advertisement submission
        await submitAdvertisement(userAddress, adTitle, adDescription, adPriceWei);
  
        // Show success message to the user
        alert('Advertisement submitted successfully.');
      } catch (error) {
        console.error('Error submitting advertisement:', error);
        alert('Failed to submit advertisement.');
      }
    });
  });


  document.getElementById('adImage').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        document.getElementById('imagePreview').style.display = 'block';
        document.getElementById('imagePreview').src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      document.getElementById('imagePreview').style.display = 'none';
    }
  });
  
  