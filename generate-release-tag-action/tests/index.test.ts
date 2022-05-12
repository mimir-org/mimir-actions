import { expect, test, describe } from "@jest/globals";
import { bumpReleaseTag, getTagWithPrefix, getValidLabelName, RELEASE_TYPES } from "../src/utils";

const PREV_RELEASE_TAG = "v1.2.0";

describe("Produces valid version", () => {
  test("should produce valid major version", () => {
    const newReleaseTag = getTagWithPrefix(bumpReleaseTag(PREV_RELEASE_TAG, RELEASE_TYPES.Major), "v");
    expect(newReleaseTag).toEqual("v2.0.0");
  });

  test("should produces valid minor version", () => {
    const newReleaseTag = getTagWithPrefix(bumpReleaseTag(PREV_RELEASE_TAG, RELEASE_TYPES.Minor), "v");
    expect(newReleaseTag).toEqual("v1.3.0");
  });

  test("should produce valid patch version", () => {
    const newReleaseTag = getTagWithPrefix(bumpReleaseTag(PREV_RELEASE_TAG, RELEASE_TYPES.Patch), "v");
    expect(newReleaseTag).toEqual("v1.2.1");
  });

  test("should produce no tag on missing versioning scheme", () => {
    const newReleaseTag = getTagWithPrefix(bumpReleaseTag(PREV_RELEASE_TAG, ""), "v");
    expect(newReleaseTag).toEqual("");
  });

  test("should produce valid version, when no prefix is given", () => {
    const newReleaseTag = getTagWithPrefix(bumpReleaseTag(PREV_RELEASE_TAG, RELEASE_TYPES.Major), "");
    expect(newReleaseTag).toEqual("2.0.0");
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
