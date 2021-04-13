export async function getChangedPRFiles(
  client,
  repo,
  owner,
  pullNumber
) {
  try {
    const files = await client.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber
    });

    console.log(JSON.stringify(files))
    return files;
  } catch (error) {
    const eString = `There was an error getting change files for repo:${repo} owner:${owner} pr:${pullNumber}`;

    throw new Error(eString);
  }
}

export async function getChangedFiles(
  client,
  repo,
  owner
) {
  try {
    let files = await getChangedPRFiles(client, repo, owner, pr)
    return files
  } catch (error) {
    throw error;
  }
}