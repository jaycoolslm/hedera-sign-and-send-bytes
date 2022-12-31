import { json } from '@sveltejs/kit';
import { TransferTransaction, AccountId , TransactionId, PrivateKey} from '@hashgraph/sdk';
 
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {connectedId} = await request.json()

    const transactiondId = TransactionId.generate(connectedId)
    
    const tx = new TransferTransaction()
        .addHbarTransfer(import.meta.env.VITE_ID, -100)
        .addHbarTransfer(connectedId, 100)
        .setNodeAccountIds([new AccountId(3)])
        .setTransactionId(transactiondId)
        .freeze()
    
    const signed = await tx.sign(PrivateKey.fromString(import.meta.env.VITE_PW))
    const bytes = signed.toBytes()
  return json(bytes);
}