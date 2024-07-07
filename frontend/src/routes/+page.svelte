<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	const upload = async (event: Event) => {
		if (event == null) return;

		const target = event.target as HTMLInputElement;

		// @ts-ignore
		const file: File | null = target.file.files[0];
		// @ts-ignore
		const description: string | null = target.description.value;
		// @ts-ignore
		const name: string | null = target.name.value;

		console.log({ file, name, description });
		if (file == null || description == null || name == null) return;

		const formData = new FormData();
		formData.append('file', file);
		formData.append('name', name);
		formData.append('description', description);

		try {
			const response = await fetch('http://localhost:4321/upload', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				alert(`${name} uploaded successfully`);
			} else {
				alert(`${name} failed to upload`);
			}
		} catch (error) {
			alert(`${name} failed to upload`);
		}

		updateDb();
		event.preventDefault();
	};

	const db: Writable<any[]> = writable([]);
	const updateDb = () => {
		try {
			fetch('http://localhost:4321/files').then((res) => {
				if (res.ok)
					res.json().then((data) => {
						db.set(data);
					});
			});
		} catch {}
	};
	onMount(updateDb);

	let fileId = '';
	let file: any = null;

	const getFile = async () => {
		try {
			const response = await fetch(
				`http://localhost:4321/file/${fileId}`
			);
			if (response.ok) {
				file = await response.json();
			} else {
				file = null;
			}
		} catch (error) {
			file = null;
		}
	};

	const rename = async (id: string) => {
		const newName = prompt('Enter new name');
		if (newName == null) return;

		try {
			const response = await fetch(`http://localhost:4321/rename/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ newName }),
			});

			if (response.ok) {
				alert('File renamed successfully');
			} else {
				alert('Failed to rename file');
			}
		} catch (error) {
			alert('Failed to rename file');
		}

		updateDb();
	};

	const changeDescription = async (id: string) => {
		const newDescription = prompt('Enter new description');
		if (newDescription == null) return;

		try {
			const response = await fetch(
				`http://localhost:4321/description/${id}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ newDescription }),
				}
			);

			if (response.ok) {
				alert('Description changed successfully');
			} else {
				alert('Failed to change description');
			}
		} catch (error) {
			alert('Failed to change description');
		}

		updateDb();
	};

	const deleteFile = async (id: string) => {
		try {
			const response = await fetch(`http://localhost:4321/delete/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				alert('File deleted successfully');
			} else {
				alert('Failed to delete file');
			}
		} catch (error) {
			alert('Failed to delete file');
		}

		updateDb();
	};
</script>

<main>
	<form on:submit={upload}>
		<h2>upload:</h2>
		<input type="file" name="file" id="file" />
		<input type="text" name="name" id="name" placeholder="name" />
		<textarea name="description" id="description" placeholder="description"
		></textarea>
		<button type="submit">upload</button>
	</form>
	<hr />
	<button on:click={updateDb}>update </button>
	<table>
		{#if $db.length}
			<tr>
				{#each Object.keys($db[0]) as field}
					<td>{field}</td>
				{/each}
				<td>actions</td>
			</tr>
			{#each $db as file}
				<tr>
					{#each Object.entries(file) as entry}
						<td>
							{entry[1]}
						</td>
					{/each}
					<td>
						<button on:click={() => rename(file.id)}>rename</button>
						<button on:click={() => deleteFile(file.id)}>
							delete
						</button>
						<button on:click={() => changeDescription(file.id)}>
							change description
						</button>
						<a href={`http://localhost:4321/download/${file.id}`}>
							download
						</a>
					</td>
				</tr>
			{/each}
		{:else}
			nothing
		{/if}
	</table>
	<hr />

	<section>
		<form on:submit={getFile}>
			<h2>Get File by ID:</h2>
			<input
				type="text"
				bind:value={fileId}
				placeholder="Enter File ID"
			/>
			<button>Get File</button>
		</form>
	</section>

	{#if file}
		<table>
			<tr>
				{#each Object.keys(file) as field}
					<td>{field}</td>
				{/each}
				<td>actions</td>
			</tr>
			<tr>
				{#each Object.entries(file) as entry}
					<td>
						{entry[1]}
						{#if entry[0] == 'name'}
							<button on:click={() => rename(file.id)}>
								rename
							</button>
							<button on:click={() => deleteFile(file.id)}>
								delete
							</button>
						{/if}
						{#if entry[0] === 'description'}
							<button on:click={() => changeDescription(file.id)}>
								change description
							</button>
						{/if}
					</td>
				{/each}
				<td>
					<a href={`http://localhost:4321/download/${file.id}`}>
						download
					</a>
				</td>
			</tr>
		</table>
	{:else if fileId}
		<p>No file found.</p>
	{/if}
</main>

<style>
	:global(body) {
		font-family: sans-serif;
	}
	main {
		width: 80%;
		margin: 10px auto;
	}
	form {
		display: flex;
		gap: 5px;
		flex-direction: column;
		width: fit-content;
		margin: 80px auto 20px auto;
		min-width: 400px;
	}
	h2 {
		margin: 10px 0;
		font-size: 18px;
	}
	form button {
		width: 80px;
		margin: 40px auto 0 auto;
		border-radius: 10px;
		border: solid 1px #333;
	}
	table {
		border-top: solid #333 1px;
		border-right: solid #333 1px;
		border-spacing: 0;
		margin: 10px auto 0 auto;
	}
	td {
		border-bottom: solid #333 1px;
		border-left: solid #333 1px;
		padding: 5px 20px 5px 10px;
	}
	hr {
		margin: 20px 0;
	}
</style>
