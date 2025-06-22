const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Generate Wallet
document.getElementById('generateWallet').addEventListener('click', () => {
  const wallet = ethers.Wallet.createRandom();
  document.getElementById('walletAddress').textContent = wallet.address;
  document.getElementById('privateKey').textContent = wallet.privateKey;

  // Clear QR code when generating a new wallet
  document.getElementById('qrcode').innerHTML = '';
  document.getElementById('copyStatus').textContent = '';
});

// Check Wallet Balance
document.getElementById('checkBalance').addEventListener('click', async () => {
  const walletAddress = document.getElementById('walletAddress').textContent;
  if (walletAddress === 'Not Generated') {
    alert('Please generate a wallet first.');
    return;
  }
  const balance = await provider.getBalance(walletAddress);
  document.getElementById('walletBalance').textContent = ethers.utils.formatEther(balance) + ' ETH';
});

// Generate QR Code
document.getElementById('generateQR').addEventListener('click', () => {
  const walletAddress = document.getElementById('walletAddress').textContent;
  if (walletAddress === 'Not Generated') {
    alert('Please generate a wallet first.');
    return;
  }

  const qrcodeContainer = document.getElementById('qrcode');
  qrcodeContainer.innerHTML = ''; // Clear any previous QR code
  new QRCode(qrcodeContainer, {
    text: walletAddress,
    width: 128,
    height: 128,
  });
});

// Copy Address
document.getElementById('copyAddress').addEventListener('click', () => {
  const walletAddress = document.getElementById('walletAddress').textContent;
  if (walletAddress === 'Not Generated') {
    alert('Please generate a wallet first.');
    return;
  }

  navigator.clipboard.writeText(walletAddress)
    .then(() => {
      document.getElementById('copyStatus').textContent = 'Address copied to clipboard!';
    })
    .catch(() => {
      document.getElementById('copyStatus').textContent = 'Failed to copy address.';
    });
});

// Send Transaction
document.getElementById('sendTransaction').addEventListener('click', async () => {
  const walletAddress = document.getElementById('walletAddress').textContent;
  const privateKey = document.getElementById('privateKey').textContent;

  if (walletAddress === 'Not Generated' || privateKey === 'Not Generated') {
    alert('Please generate a wallet first.');
    return;
  }

  const recipient = document.getElementById('toAddress').value;
  const amount = document.getElementById('amount').value;

  if (!recipient || !amount) {
    alert('Please provide a recipient address and amount.');
    return;
  }

  const wallet = new ethers.Wallet(privateKey, provider);

  try {
    const tx = await wallet.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther(amount),
    });
    document.getElementById('txStatus').textContent = 'Transaction Sent! Hash: ' + tx.hash;
  } catch (error) {
    console.error(error);
    document.getElementById('txStatus').textContent = 'Transaction Failed!';
  }
});
