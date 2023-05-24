document.addEventListener('DOMContentLoaded', async () => {
  // Check if MetaMask is installed
  if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask to use this feature.');
    return;
  }

  const provider = new Web3(window.ethereum);

  // Connect to MetaMask
  const connectButton = document.getElementById('connectButton');
  connectButton.addEventListener('click', async () => {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      alert('Connected to MetaMask successfully.');
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('Failed to connect to MetaMask.');
    }
  });

  // Neos Credits token contract address and ABI
  const neosCreditsTokenAddress = '0xDB5C3C46E28B53a39C255AA39A411dD64e5fed9c'; 
  const neosCreditsTokenABI = [
    [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeSub","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeDiv","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeMul","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeAdd","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}]
  ];

  // Create a new instance of the web3 provider

  // Create a new instance of the Neos Credits token contract
  const neosCreditsTokenContract = new provider.eth.Contract(neosCreditsTokenABI, neosCreditsTokenAddress);

  // Resolve ENS domain to Ethereum address
  async function resolveENSAddress(ensDomain) {
    try {
      const resolver = await provider.eth.ens.getResolver(ensDomain);
      const address = await resolver.addr(ensDomain);
      return address;
    } catch (error) {
      console.error('Failed to resolve ENS address:', error);
      throw error;
    }
  }

  // Handle form submission and payment
  document.getElementById('submitPayment').addEventListener('click', async () => {
    try {
      // Request user's permission to connect with MetaMask
      await ethereum.request({ method: 'eth_requestAccounts' });

      // Get the user's Ethereum address
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const userAddress = accounts[0];

      // Get the advertisement details from the form
      const adTitle = document.getElementById('adTitle').value;
      const adDescription = document.getElementById('adDescription').value;
      const adPrice = document.getElementById('adPrice').value;

      // Check the user's Neos Credits token balance
      const balance = await neosCreditsTokenContract.methods.balanceOf(userAddress).call();

      // Convert the ad price to the token's smallest unit (e.g., Wei)
      const adPriceWei = provider.utils.toWei(adPrice.toString(), 'ether');

      // Verify if the user has enough balance
      if (balance < adPriceWei) {
        alert('Insufficient Neos Credits token balance. Please purchase enough tokens.');
        return;
      }

      // Resolve the advertiser's ENS domain to Ethereum address
      const advertiserENS = 'xlinka.eth'; // Replace with the actual ENS domain name
      const advertiserAddress = await resolveENSAddress(advertiserENS);

      // Perform the token transfer to the advertiser's address
      await neosCreditsTokenContract.methods.transfer(advertiserAddress, adPriceWei).send({ from: userAddress });

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
  
  fetch('https://api.coingecko.com/api/v3/simple/price?ids=neos-credits&vs_currencies=usd')
  .then(response => response.json())
  .then(data => {
    if (data['neos-credits']) {
      const price = data['neos-credits'].usd;
      const ncrPerHour = 1 / (price * 24); // calculate NCR needed per hour for a $1 ad per day
      document.getElementById('priceInfo').innerText = `Current NCR price: $${price.toFixed(2)} | NCR needed for an ad per hour: ${ncrPerHour.toFixed(2)}`;

      document.getElementById('adDuration').addEventListener('input', () => {
        const adDuration = document.getElementById('adDuration').value;
        const ncrInfo = document.getElementById('ncrInfo');
        const adPriceInput = document.getElementById('adPrice');

        if (adDuration > 0) {
          const ncrAmount = adDuration * ncrPerHour;
          ncrInfo.textContent = `NCR needed: ${ncrAmount.toFixed(2)}`;
          adPriceInput.value = ncrAmount.toFixed(2);
        } else {
          ncrInfo.textContent = '';
          adPriceInput.value = '';
        }
      });
    } else {
      console.log('No data for NCR');
    }
  })
  .catch(error => console.error('Error:', error));

  