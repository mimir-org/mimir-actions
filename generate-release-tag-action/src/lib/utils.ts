import semver, { ReleaseType } from "semver";
import { ReleaseTypeDict, Target } from "./types";

export const RELEASE_TYPES: ReleaseTypeDict = {
  major: "major",
  minor: "minor",
  patch: "patch",
};

export const PRE_RELEASE_TYPES: ReleaseTypeDict = {
  major: "premajor",
  minor: "preminor",
  patch: "prepatch",
};

type Labels = {
  name?: string;
}[];

export const getValidLabelName = (labels: Labels): string => {
  const labelNames = labels
    .map((label) => label.name)
    .filter((labelName): labelName is string => !!labelName)
    .filter((labelName) => labelName.includes("release:"));

  return labelNames[0] ?? "";
};

export const bumpReleaseTag = (
  prevReleaseTag: string,
  versioningScheme: ReleaseType,
  suffix: string | undefined = undefined
): string | null => {
  if (!versioningScheme || !isReleaseType(versioningScheme)) return null;

  const tag = semver.inc(prevReleaseTag, versioningScheme, undefined, suffix);

  return tag;
};

export const bumpPreReleaseTag = (
  versioningScheme: ReleaseType,
  suffix: string,
  latestPreReleaseTag: string | null,
  currentReleaseTag: string
): string | null => {
  return latestPreReleaseTag
    ? bumpReleaseTag(latestPreReleaseTag, "prerelease", suffix)
    : bumpReleaseTag(currentReleaseTag, PRE_RELEASE_TYPES[versioningScheme], suffix);
};

export const getTagWithPrefix = (tag: string | null, prefix: string): string | null => {
  if (!tag) return null;

  return prefix + tag;
};

export const getVersioningSchemeFromLabelName = (labelName: string | undefined): ReleaseType | null => {
  const split = labelName?.split(":");

  if (split?.length !== 2) return null;

  const scheme = split[1];

  if (isReleaseType(scheme)) return scheme;

  return null;
};

export const isTarget = (versioningScheme: string | undefined): versioningScheme is Target =>
  !!versioningScheme && Object.values(RELEASE_TYPES).includes(versioningScheme as ReleaseType);

export const isReleaseType = (versioningScheme: string): versioningScheme is ReleaseType =>
  Object.values(RELEASE_TYPES).includes(versioningScheme as ReleaseType) ||
  Object.values(PRE_RELEASE_TYPES).includes(versioningScheme as ReleaseType) ||
  versioningScheme === "prerelease";
