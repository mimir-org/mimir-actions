import * as core from "@actions/core";
import * as github from "@actions/github";
import { getValidLabelName } from "./utils";

export const getLatestReleaseTag = async (token: string): Promise<string> => {
  const octokit = github.getOctokit(token);

  const release = await octokit.rest.repos.getLatestRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  });

  return release.data.tag_name;
};

export const getPreviousPreRelease = async (
  token: string,
  rawTag: string | null,
  suffix: string
): Promise<string | null> => {
  core.debug("Getting previous pre-release");

  const octokit = github.getOctokit(token);

  const refs = await octokit.request("GET /repos/{owner}/{repo}/git/matching-refs/{ref}", {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    ref: `tags/${rawTag}-${suffix}`,
  });

  if (refs.data.length === 0) return null;

  const preReleaseRefsSorted = refs.data.sort((a, b) => b.ref.localeCompare(a.ref, undefined, { numeric: true }));

  core.debug(`Latest pre-release tag retrieved: ${preReleaseRefsSorted[0].ref}`);

  // ref is always of the form refs/tags/{tag}
  const preReleaseTag = preReleaseRefsSorted[0].ref.split("/")[2];

  return preReleaseTag;
};

export const getRelatedPullRequestLabel = async (token: string): Promise<string> => {
  const octokit = github.getOctokit(token);

  const pullRequests = await octokit.rest.pulls.list({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    sort: "updated",
    direction: "desc",
    state: "closed",
    per_page: 100,
  });

  const pull = pullRequests.data.find((p) => p.merge_commit_sha === github.context.sha);

  if (!pull) return "";

  return getValidLabelName(pull.labels);
};

export const pushTag = async (token: string, tag: string) => {
  const octokit = github.getOctokit(token);

  await octokit.rest.git.createTag({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag,
    type: "commit",
    object: github.context.sha,
    message: `Release ${tag}`,
  });

  await octokit.rest.git.createRef({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    ref: `refs/tags/${tag}`,
    sha: github.context.sha,
  });
};
