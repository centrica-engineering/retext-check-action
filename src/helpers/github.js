export async function getChangedPRFiles(
  client,
  repo,
  owner,
  pullNumber
) {
  try {
    const options = client.pulls.listFiles.endpoint.merge({
      owner,
      repo,
      pull_number: pullNumber
    });
    const files = await client.paginate(
      options,
      response => response.data
    );
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
    const pError = JSON.parse(error.message)
    if (pError.from.includes('getChanged')) {
      throw new Error(
        JSON.stringify(
          { ...pError, ...{ from: `${error.status}/${error.name}` } },
          null,
          2
        )
      );
    }

    const eString = `There was an error getting change files outputs pr: ${pr}`;

    throw new Error(eString)
  }
}