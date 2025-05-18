import { NextResponse } from 'next/server';
// import Sodium from 'libsodium-wrappers';
import StellarSdk, { Networks } from 'stellar-sdk';   // default import

// await Sodium.ready;  // Ensure libsodium is initialized

export async function POST(req: Request) {
  try {
    const { senderPublicKey, recipientPublicKey, amount } = await req.json();

    if (!senderPublicKey || !recipientPublicKey || !amount) {
      return NextResponse.json(
        { error: 'Missing parameters: senderPublicKey, recipientPublicKey, and amount are required.' },
        { status: 400 }
      );
    }

    const horizonUrl = 'https://horizon-testnet.stellar.org';

    // 1) Fetch the raw account JSON from Horizon
    const accountRes = await fetch(`${horizonUrl}/accounts/${senderPublicKey}`);
    if (!accountRes.ok) {
      throw new Error(
        `Failed to fetch account: ${senderPublicKey}. Status: ${accountRes.status} ${accountRes.statusText}`
      );
    }
    const accountJson = await accountRes.json();

    // 2) Wrap it in the SDK's Account class so it has sequenceNumber()
    //    Note: Horizon JSON has accountJson.sequence (a string)
    const account = new StellarSdk.Account(senderPublicKey, accountJson.sequence.toString());

    console.log(account)

    // 3) Fetch fee stats
    const feeRes = await fetch(`${horizonUrl}/fee_stats`);
    if (!feeRes.ok) {
      throw new Error(`Failed to fetch fee stats. Status: ${feeRes.status}`);
    }
    const feeStats = await feeRes.json();
    if (!feeStats.last_ledger_base_fee) {
      throw new Error('Unable to fetch fee from the Horizon server.');
    }
    const fee = feeStats.last_ledger_base_fee; // already a string

    // 4) Build the transaction
    console.log(StellarSdk.Networks)
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: recipientPublicKey,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString(),
        })
      )      .addMemo(StellarSdk.Memo.text('Payment from Prep-Pulse'))
      .setTimeout(1800) // Extended from 300 to 1800 seconds (30 minutes) to give more time for signing
      .build();
      tx.networkId = StellarSdk.hash(Buffer.from(StellarSdk.Networks.TESTNET));

      
      
      console.log('Transaction Details:', {
          networkPassphrase: tx.networkPassphrase, // Should show TESTNET passphrase
          sourceAccount: tx.source,
          fee: tx.fee,
          sequence: tx.sequence
        });
        
        console.error("before .toXDR ",tx)
        console.log("Network ID set:", tx.networkId.toString('hex'));
      const transactionXDR = tx.toXDR();
      console.error("after .toXDR ",transactionXDR)

    return NextResponse.json({ transactionXDR });
  } catch (err: any) {
    console.error('Error creating transaction:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error while creating transaction' },
      { status: 500 }
    );
  }
}