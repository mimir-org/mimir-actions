import * as core from "@actions/core";
import { bumpPreReleaseTag, bumpReleaseTag, getVersioningSchemeFromLabelName, isTarget } from "./utils";
import { Input, Target } from "./types";
import { ReleaseType } from "semver";
import {
  getLatestReleaseTag,
  getPreviousPreRelease as getLatestPreReleaseTag,
  getRelatedPullRequestLabel,
} from "./octo";

export const processInputs = (): Input => {
  return {
    token: core.getInput("github_token"),
    target: getValidTarget(core.getInput("target")),
    prefix: core.getInput("prefix"),
    suffix: core.getInput("suffix"),
    shouldPushNewTag: core.getInput("should_push_new_tag") === "true",
  };
};

export const getReleaseTagAndVersioningScheme = async (input: Input): Promise<[string, ReleaseType]> => {
  const [currentReleaseTag, labelName] = await Promise.all([
    getLatestReleaseTag(input.token),
    getRelatedPullRequestLabel(input.token),
  ]);

  if (labelName.length === 0 && !isTarget(input.target)) {
    core.info("No semantic versioning scheme specified. No release created.");
    process.exit(0);
  }
  const versioningScheme = getVersioningSchemeFromLabelName(labelName) ?? input.target;

  if (!versioningScheme) {
    core.error("Invalid versioning scheme provided. Valid pull request label or target must be provided.");
    process.exit(1);
  }

  return [currentReleaseTag, versioningScheme];
};

export const generateNewReleaseTag = async (
  input: Input,
  currentReleaseTag: string,
  versioningScheme: ReleaseType
): Promise<string> => {
  const newReleaseTagRaw = await getNewReleaseTag(input, currentReleaseTag, versioningScheme);

  if (!newReleaseTagRaw) {
    core.setFailed(`Invalid semver tag: ${currentReleaseTag}. Could not increment release.`);
    process.exit(1);
  }

  return newReleaseTagRaw;
};

const getNewReleaseTag = async (
  input: Input,
  currentReleaseTag: string,
  versioningScheme: ReleaseType
): Promise<string | null> => {
  const newReleaseTagRaw = bumpReleaseTag(currentReleaseTag, versioningScheme);

  if (!input.suffix) return newReleaseTagRaw;

  const latestPreReleaseTag = await getLatestPreReleaseTag(input.token, newReleaseTagRaw, input.suffix);

  const newReleaseTag = bumpPreReleaseTag(versioningScheme, input.suffix, latestPreReleaseTag, currentReleaseTag);

  return newReleaseTag;
};

const getValidTarget = (target: string): Target | undefined => {
  if (isTarget(target)) return target;

  if (target === "") return undefined;

  core.error(`Invalid target provided: ${target}. Only major, minor, patch are valid values for target.`);
  process.exit(1);
};
