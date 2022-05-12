import * as core from "@actions/core";
import { pushTag } from "./lib/octo";
import { generateNewReleaseTag, getReleaseTagAndVersioningScheme, processInputs } from "./lib";
import { getTagWithPrefix } from "./lib/utils";

try {
  const input = processInputs();

  const [currentReleaseTag, versioningScheme] = await getReleaseTagAndVersioningScheme(input);

  core.info(`Current release: ${currentReleaseTag}`);
  core.info(`Versioning scheme: ${currentReleaseTag}`);

  const [newReleaseTag, rawTag] = await generateNewReleaseTag(input, currentReleaseTag, versioningScheme);

  core.info(`Create new release tag: ${newReleaseTag}`);

  if (input.shouldPushNewTag) await pushTag(input.token, newReleaseTag);

  core.setOutput("new_tag", getTagWithPrefix(rawTag, input.prefix));
  core.setOutput("raw_tag", rawTag);
} catch (error: any) {
  core.setFailed(error.message);
  process.exit(1);
}
