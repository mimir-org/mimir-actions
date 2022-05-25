import { expect, test, describe } from "@jest/globals";
import {
  bumpPreReleaseTag,
  bumpReleaseTag,
  getTagWithPrefix,
  getValidLabelName,
  PRE_RELEASE_TYPES,
  RELEASE_TYPES,
} from "../src/lib/utils";

const PREV_RELEASE_TAG = "1.2.0";
const PREV_PRE_RELEASE_TAG = "1.2.0-rc.0";
const PRE_RELEASE_SUFFIX = "rc";

describe("BumpReleaseTag produces valid version", () => {
  test("should produce valid major version", () => {
    const newReleaseTag = getTagWithPrefix(bumpReleaseTag(PREV_RELEASE_TAG, RELEASE_TYPES.major), "v");
    expect(newReleaseTag).toEqual("v2.0.0");
  });

  test("should produces valid minor version", () => {
    const newReleaseTag = getTagWithPrefix(bumpReleaseTag(PREV_RELEASE_TAG, RELEASE_TYPES.minor), "v");
    expect(newReleaseTag).toEqual("v1.3.0");
  });

  test("should produce valid patch version", () => {
    const newReleaseTag = getTagWithPrefix(bumpReleaseTag(PREV_RELEASE_TAG, RELEASE_TYPES.patch), "v");
    expect(newReleaseTag).toEqual("v1.2.1");
  });

  test("should produce valid premajor version", () => {
    const newReleaseTag = getTagWithPrefix(
      bumpReleaseTag(PREV_RELEASE_TAG, PRE_RELEASE_TYPES.major, PRE_RELEASE_SUFFIX),
      "v"
    );
    expect(newReleaseTag).toEqual("v2.0.0-rc.0");
  });

  test("should produces valid preminor version", () => {
    const newReleaseTag = getTagWithPrefix(
      bumpReleaseTag(PREV_RELEASE_TAG, PRE_RELEASE_TYPES.minor, PRE_RELEASE_SUFFIX),
      "v"
    );
    expect(newReleaseTag).toEqual("v1.3.0-rc.0");
  });

  test("should produce valid prepatch version", () => {
    const newReleaseTag = getTagWithPrefix(
      bumpReleaseTag(PREV_RELEASE_TAG, PRE_RELEASE_TYPES.patch, PRE_RELEASE_SUFFIX),
      "v"
    );
    expect(newReleaseTag).toEqual("v1.2.1-rc.0");
  });

  test("should produce valid version, when no prefix is given", () => {
    const newReleaseTag = getTagWithPrefix(bumpReleaseTag(PREV_RELEASE_TAG, RELEASE_TYPES.major), "");
    expect(newReleaseTag).toEqual("2.0.0");
  });
});

describe("BumpPrevReleaseTag produces valid version", () => {
  test("should produce valid major version, when no latest prevrelease is given", () => {
    const newReleaseTag = getTagWithPrefix(bumpPreReleaseTag("major", PRE_RELEASE_SUFFIX, null, PREV_RELEASE_TAG), "v");
    expect(newReleaseTag).toEqual("v2.0.0-rc.0");
  });
  test("should produce valid minor version, when no latest prevrelease is given", () => {
    const newReleaseTag = getTagWithPrefix(bumpPreReleaseTag("minor", PRE_RELEASE_SUFFIX, null, PREV_RELEASE_TAG), "v");
    expect(newReleaseTag).toEqual("v1.3.0-rc.0");
  });
  test("should produce valid patch version, when no latest prevrelease is given", () => {
    const newReleaseTag = getTagWithPrefix(bumpPreReleaseTag("patch", PRE_RELEASE_SUFFIX, null, PREV_RELEASE_TAG), "v");
    expect(newReleaseTag).toEqual("v1.2.1-rc.0");
  });

  test("should produce valid major version, with latest prevrelease given", () => {
    const newReleaseTag = getTagWithPrefix(
      bumpPreReleaseTag("major", PRE_RELEASE_SUFFIX, PREV_PRE_RELEASE_TAG, PREV_RELEASE_TAG),
      "v"
    );
    expect(newReleaseTag).toEqual("v1.2.0-rc.1");
  });
  test("should produce valid minor version, with latest prevrelease given", () => {
    const newReleaseTag = getTagWithPrefix(
      bumpPreReleaseTag("minor", PRE_RELEASE_SUFFIX, PREV_PRE_RELEASE_TAG, PREV_RELEASE_TAG),
      "v"
    );
    expect(newReleaseTag).toEqual("v1.2.0-rc.1");
  });
  test("should produce valid patch version, withlatest prevrelease given", () => {
    const newReleaseTag = getTagWithPrefix(
      bumpPreReleaseTag("patch", PRE_RELEASE_SUFFIX, PREV_PRE_RELEASE_TAG, PREV_RELEASE_TAG),
      "v"
    );
    expect(newReleaseTag).toEqual("v1.2.0-rc.1");
  });
  test("should produce valid version, when no prefix is given", () => {
    const newReleaseTag = getTagWithPrefix(
      bumpPreReleaseTag("major", PRE_RELEASE_SUFFIX, PREV_PRE_RELEASE_TAG, PREV_RELEASE_TAG),
      ""
    );
    expect(newReleaseTag).toEqual("1.2.0-rc.1");
  });
});

describe("Finds valid label name", () => {
  test("should return valid label name, given valid labels present", () => {
    const labels = [{ name: "release:major" }, { name: undefined }, { name: "relese:minor" }];
    const labelName = getValidLabelName(labels);
    expect(labelName).toEqual("release:major");
  });

  test("should return empty string, if no valid label present", () => {
    const labels = [{ name: undefined }, { name: "relese:minor" }];
    const labelName = getValidLabelName(labels);
    expect(labelName).toEqual("");
  });
});
