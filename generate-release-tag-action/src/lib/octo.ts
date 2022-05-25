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
  const octokit = github.getOctokit(token);

  const releases = await octokit.rest.repos.listReleases({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  });

  const preReleases = releases.data
    .filter((x) => x.prerelease && x.tag_name.includes(`${rawTag}-${suffix}`))
    .sort((a, b) => b.tag_name.localeCompare(a.tag_name, undefined, { numeric: true }));

  if (preReleases.length === 0) return null;

  return preReleases[0].tag_name;
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
