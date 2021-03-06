export async function getChangedPRFiles(
  client,
  repo,
  owner,
  pullNumber
) {
  try {
    const list = await client.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber
    });
    
    const files = list.data.map(file => file.filename).filter(file => file);

    return files;
  } catch (error) {
    const eString = `There was an error getting change files for repo:${repo} owner:${owner} pr:${pullNumber}`;

    throw new Error(eString);
  }
}

export async function getChangedFiles(
  client,
  repo,
  owner,
  pr
) {
  try {
    let files = await getChangedPRFiles(client, repo, owner, pr)
    return files
  } catch (error) {
    throw error;
  }
}