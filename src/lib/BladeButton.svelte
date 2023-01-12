<script lang="ts">
    import {BladeSigner, HederaNetwork} from '@bladelabs/blade-web3.js';
    import {TransferTransaction} from "@hashgraph/sdk"

    let connectedId: string
    let bladeSigner: any 
    async function initBlade() {
        bladeSigner = new BladeSigner();
        const params = {
        network: HederaNetwork.Testnet,
        // dAppCode - optional while testing, request specific one by contacting us.
        dAppCode: "yourAwesomeApp"
        }
        // create session with optional parameters.
        await bladeSigner.createSession(params);

        // bladeSigner object can now be used.
        connectedId = bladeSigner.getAccountId().toString();
    }

    let transact = async () => {
		const body = {
			connectedId
		}

		const res = await fetch('/api/transaction', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})

		const bytes = await res.json()
		console.log(bytes)
		const tx = TransferTransaction.fromBytes(bytes.data)
		let submit = await bladeSigner.call(tx)
		console.log(submit)
	}
</script>

<button on:click={initBlade}>Pair</button>

{#if connectedId}
<button on:click={transact}>Transact</button>
{/if}