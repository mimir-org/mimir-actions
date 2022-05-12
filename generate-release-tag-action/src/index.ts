import * as core from "@actions/core";
import { bumpReleaseTag, getTagWithPrefix, getVersioningScheme } from "./utils";
import { getLatestReleaseTag, getRelatedPullRequestLabel, pushTag } from "./octo";

const run = async () => {
  try {
    const token = core.getInput("github_token");
    const prefix = core.getInput("prefix");

    const [currentReleaseTag, labelName] = await Promise.all([
      getLatestReleaseTag(token),
      getRelatedPullRequestLabel(token),
    ]);

    core.info(`Found current release tag: ${currentReleaseTag}`);
    core.info(`Found label name: ${labelName}`);

    if (labelName.length === 0) return;

    const rawTag = bumpReleaseTag(currentReleaseTag, getVersioningScheme(labelName));

    if (!rawTag) {
      core.setFailed(`Invalid semver tag: ${currentReleaseTag}. Could not increment release.`);
      return;
    }

    const prefixTag = getTagWithPrefix(rawTag, prefix);

    core.info(`Create new release tag: ${prefixTag}`);

    await pushTag(token, prefixTag);

    core.setOutput("new_tag", prefixTag);
    core.setOutput("raw_tag", rawTag);
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

run();
