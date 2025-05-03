"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Wallet, ArrowRight, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react";

interface PaymentState {
  publicKey: string | null;
  recipient: string;
  status: 'idle' | 'connecting' | 'connected' | 'signing' | 'sending' | 'success' | 'error';
  errorMessage: string | null;
}

interface PaymentModalProps {
  amount: string;
  onComplete?: (success: boolean) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    freighterApi: any;
  }
}

const initialState = (amount: string): PaymentState => ({
  publicKey: null,
  recipient: process.env.NEXT_PUBLIC_FREIGHTER_WALLET_RECIPIENT!,
  status: 'idle',
  errorMessage: null,
});

export default function PaymentModal({ amount, onComplete, onClose }: PaymentModalProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>(initialState(amount));
  const [freighterLoaded, setFreighterLoaded] = useState(false);

  // Check if Freighter is loaded
  useEffect(() => {
    const checkForFreighter = () => {
      console.log("Checking for Freighter API...");
      console.log("window.freighterApi available:", typeof window !== 'undefined' && !!window.freighterApi);
      
      if (typeof window !== 'undefined' && window.freighterApi) {
        setFreighterLoaded(true);
        return true;
      }
      return false;
    };

    // Try immediately
    if (checkForFreighter()) return;

    const timer = setTimeout(() => {
      if (checkForFreighter()) {
        console.log("Freighter API found after delay!");
      } else {
        console.log("Freighter API still not found after delay.");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only try to connect if Freighter is loaded
    if (freighterLoaded) {
      console.log("Freighter is loaded, attempting to connect...");
      
      const checkFreighter = async () => {
        try {
          console.log("Checking if Freighter is connected...");
          const isConnected = await window.freighterApi.isConnected();
          console.log("Freighter connected:", isConnected);
          
          if (!isConnected) {
            throw new Error("Freighter not connected");
          }

          try {
            await window.freighterApi.requestAccess();
          } catch (err) {
            console.error('Error checking if allowed:', err);
          }

          console.log("Getting public key...");
          const address = await window.freighterApi.getAddress();
          
          setPaymentState((prev) => ({ ...prev, publicKey: address, status: 'connected' }));
        } catch (error: any) {
          console.error('Freighter not installed or not connected:', error);
          setPaymentState((prev) => ({
            ...prev,
            status: 'error',
            errorMessage: 'Freighter not installed or not connected.',
          }));
        }
      };

      checkFreighter();
    }
  }, [freighterLoaded]);

  // Notify parent when transaction completes (success or failure)
  useEffect(() => {
    if (paymentState.status === 'success' && onComplete) {
      onComplete(true);
    } else if (paymentState.status === 'error' && onComplete) {
      onComplete(false);
    }
  }, [paymentState.status, onComplete]);

  const handleConnectWallet = async () => {
    setPaymentState((prev) => ({ ...prev, status: 'connecting', errorMessage: null }));
    try {
      if (typeof window !== 'undefined' && window.freighterApi) {
        // First check if connected
        const isConnected = await window.freighterApi.isConnected();
        if (!isConnected) {
          throw new Error("Freighter not connected");
        }
        
        // Then check if allowed to connect to this website
        const isAllowed = await window.freighterApi.isAllowed();
        if (!isAllowed) {
          // This will trigger the permission prompt
          await window.freighterApi.setAllowed();
        }
  
      } else {
        throw new Error('Freighter extension not detected');
      }
    } catch (error: any) {
      console.error('Error connecting to Freighter:', error);
      setPaymentState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: 'Failed to connect to Freighter. Please check extension permissions.',
      }));
    }
  };

  const handlePay = async () => {
    if (!paymentState.publicKey) {
      setPaymentState((prev) => ({ ...prev, errorMessage: 'Connect your wallet first.' }));
      return;
    }
  
    setPaymentState((prev) => ({ ...prev, status: 'signing', errorMessage: null }));
  
    try {
      // Get current account and network
      const freighterPublicKey = await window.freighterApi.getAddress();
      console.log('Freighter details:', freighterPublicKey);
  
      // Get transaction XDR from backend
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderPublicKey: paymentState.publicKey.address,
          recipientPublicKey: paymentState.recipient,
          amount: amount
        })
      });
  
      if (!response.ok) throw new Error('Failed to create transaction');
      const { transactionXDR } = await response.json();
  
      const signedXDR = await window.freighterApi.signTransaction(transactionXDR, {
        network: 'TESTNET', // Must be string literal
        accountToSign: freighterPublicKey.address, // Explicit signer
        networkPassphrase: 'Test SDF Network ; September 2015',
        overwrite: true
      });
  
      if (!signedXDR) throw new Error('Signing rejected or failed');
  
      // Submit to network
      const submitResponse = await fetch('/api/submit-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          signedXDR: signedXDR.signedTxXdr 
        })
      });
  
      if (!submitResponse.ok) throw new Error('Submission failed');
      
      setPaymentState((prev) => ({ ...prev, status: 'success' }));
  
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: error.message || 'Payment failed'
      }));
    }
  };
  
  // Helper function to truncate wallet address for display
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  // Get status badge based on current state
  const getStatusBadge = () => {
    switch(paymentState.status) {
      case 'connecting':
        return <div className="flex items-center gap-1 text-yellow-400"><Wallet className="h-4 w-4 animate-pulse" /> Connecting...</div>;
      case 'connected':
        return <div className="flex items-center gap-1 text-green-400"><CheckCircle2 className="h-4 w-4" /> Connected</div>;
      case 'signing':
        return <div className="flex items-center gap-1 text-yellow-400"><Wallet className="h-4 w-4 animate-pulse" /> Signing...</div>;
      case 'sending':
        return <div className="flex items-center gap-1 text-yellow-400"><ArrowRight className="h-4 w-4 animate-pulse" /> Sending...</div>;
      case 'success':
        return <div className="flex items-center gap-1 text-green-400"><CheckCircle2 className="h-4 w-4" /> Success</div>;
      case 'error':
        return <div className="flex items-center gap-1 text-red-400"><AlertCircle className="h-4 w-4" /> Error</div>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="cosmic-card backdrop-blur-sm border-cosmic-blue/40 bg-cosmic-dark/80 w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        {onClose && (
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-gray-400 hover:text-white z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
            </svg>
          </button>
        )}
        
        <CardHeader>
          <div className="absolute top-2 right-10">{getStatusBadge()}</div>
          <CardTitle className="text-xl text-cosmic-blue">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-cosmic-blue" />
              Stellar Payment
            </div>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Connect your wallet to pay {parseFloat(amount).toFixed(2)} XLM
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {paymentState.publicKey ? (
            <div className="space-y-6">
              {/* Wallet Details Card */}
              <div className="bg-cosmic-darker p-4 rounded-lg border border-cosmic-blue/30 shadow-[0_0_15px_rgba(59,158,255,0.1)]">
                <h3 className="text-md font-medium text-cosmic-cyan mb-3">Wallet Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">Status</div>
                    <div className="text-sm font-medium text-cosmic-blue">
                      {paymentState.status === 'connected' ? 'Connected' : paymentState.status}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">Address</div>
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                      <span className="font-mono">{
                        typeof paymentState.publicKey === 'string' 
                          ? truncateAddress(paymentState.publicKey) 
                          : truncateAddress(paymentState.publicKey?.address || '')
                      }</span>
                      <button 
                        onClick={() => {
                          const address = typeof paymentState.publicKey === 'string' 
                            ? paymentState.publicKey
                            : paymentState.publicKey?.address;
                          navigator.clipboard.writeText(address || '');
                        }}
                        className="text-cosmic-blue hover:text-cosmic-cyan transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16V4a2 2 0 0 1 2-2h10" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">Network</div>
                    <div className="text-sm font-medium text-cosmic-purple">Stellar Testnet</div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-cosmic-blue/20">
                    <div className="text-sm text-gray-400">Amount to Pay</div>
                    <div className="text-md font-medium text-cosmic-cyan">{parseFloat(amount).toFixed(2)} XLM</div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <Button 
                onClick={handlePay}
                disabled={paymentState.status === 'signing' || paymentState.status === 'sending'}
                className="w-full cosmic-button rounded-md"
              >
                {paymentState.status === 'signing' || paymentState.status === 'sending' ? 
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {paymentState.status === 'signing' ? 'Signing Transaction...' : 'Sending Payment...'}
                  </div>
                  : 
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Pay {parseFloat(amount).toFixed(2)} XLM
                  </div>
                }
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-6 text-center">
                <Wallet className="h-12 w-12 text-cosmic-blue mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">Connect Wallet</h3>
                <p className="text-gray-400 text-sm mt-2 mb-4">Connect your Freighter wallet to make a payment</p>
                <div className="px-6 py-3 bg-cosmic-darker rounded-lg mt-4 mb-4 border border-cosmic-blue/20">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Amount to Pay:</span>
                    <span className="text-lg font-semibold text-cosmic-cyan">{parseFloat(amount).toFixed(2)} XLM</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleConnectWallet} 
                disabled={paymentState.status === 'connecting' || !freighterLoaded}
                className="cosmic-button rounded-md"
              >
                {!freighterLoaded ? (
                  'Freighter Not Detected'
                ) : paymentState.status === 'connecting' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </div>
                )}
              </Button>
              
              {!freighterLoaded && (
                <div className="mt-4 text-sm text-amber-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Freighter wallet extension not detected</span>
                </div>
              )}
            </div>
          )}

          {paymentState.status === 'success' && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-start gap-3 text-white">
              <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Transaction Successful!</h4>
                <p className="text-sm text-green-200 mt-1">Your payment of {parseFloat(amount).toFixed(2)} XLM has been sent.</p>
                <a href="#" className="text-sm flex items-center gap-1 text-cosmic-blue mt-2 hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  View on Explorer
                </a>
              </div>
            </div>
          )}

          {paymentState.status === 'error' && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3 text-white">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Transaction Failed</h4>
                <p className="text-sm text-red-200 mt-1">{paymentState.errorMessage}</p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center border-t border-cosmic-blue/20 pt-4">
          <p className="text-xs text-gray-400 text-center">
            Powered by Stellar Network • <a href="https://stellar.org" className="text-cosmic-blue hover:underline">Learn more</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}