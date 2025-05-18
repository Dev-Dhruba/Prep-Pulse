// // app/api/submit-payment/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1) Parse and validate
    const { signedXDR } = await request.json();
    if (!signedXDR || typeof signedXDR !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid parameter: signedXDR must be a base64 string.' },
        { status: 400 }
      );
    }

    // 2) Submit via Horizon REST
    const horizonUrl = 'https://horizon-testnet.stellar.org';
    const res = await fetch(`${horizonUrl}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ tx: signedXDR }),
    });    const payload = await res.json();
    console.log("Horizon response:", payload);
    
    // 3) Handle Horizon errors
    if (!res.ok) {
      // Log detailed error information
      if (payload.extras?.result_codes) {
        console.error("Transaction error codes:", {
          transaction: payload.extras.result_codes.transaction,
          operations: payload.extras.result_codes.operations
        });
      }
      return NextResponse.json(
        {
          error:    payload.title   || 'Transaction submission failed',
          details: {
            status: res.status,
            detail: payload.detail,
            extras: payload.extras,
          },
        },
        { status: 400 }
      );
    }

    // 4) Success response
    return NextResponse.json({
      success:          true,
      transactionHash:  payload.hash,
      ledger:           payload.ledger,
      createdAt:        payload.created_at,
    });
  } catch (err: any) {
    console.error('General error in submit-payment:', err);
    return NextResponse.json(
      { error: `Server error: ${err.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}