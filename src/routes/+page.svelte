<script lang="ts">
	import { HashConnect } from 'hashconnect';
	import { browser } from '$app/environment';
	import { TransferTransaction } from '@hashgraph/sdk';
	import BladeButton from '$lib/BladeButton.svelte';

	let hashconnect: any
	let initData: any
	let connectedId: string
	let signer: any
	let appMetadata	= {
		name: "dApp Example",
		description: "An example hedera dApp",
		icon: "https://absolute.url/to/icon.png"
	}	

	const initHashpack = async () => {
		hashconnect = new HashConnect()
		initData = await hashconnect.init(appMetadata, "testnet", false)
		return initData
	}

	if (browser) {
	// client-only code here
		initHashpack()
			.then(res => {
				hashconnect.pairingEvent.once((pairingData) => {
					connectedId = pairingData.accountIds[0]
					console.log(connectedId)
					const provider = hashconnect.getProvider("testnet", res.topic, connectedId)
					signer = hashconnect.getSigner(provider)
				})
			})
	}

	let onClick = () => {
		hashconnect.connectToLocalWallet(initData.pairingString, initData.extensionMetadata);
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
		let submit = await tx.executeWithSigner(signer)
		console.log(submit)
	}

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<h1>Initiate tx</h1>
<button on:click={onClick}>Pair</button>
{#if connectedId}
<button on:click={transact}>Transact</button>
{/if}

<h1>Blade options</h1>
<BladeButton />