import { getTracksByIds } from "./musicCatalog";

const contextTags = [
  { timeTags: ["morning", "afternoon", "evening"], weatherTags: ["sunny", "cloudy"], locationTags: ["seoul", "seongbuk", "urban"] },
  { timeTags: ["evening", "night"], weatherTags: ["cloudy", "rain"], locationTags: ["seoul", "seongbuk", "urban"] },
  { timeTags: ["afternoon", "evening", "night"], weatherTags: ["cloudy", "rain"], locationTags: ["seoul", "urban"] },
  { timeTags: ["morning", "afternoon"], weatherTags: ["sunny", "cloudy"], locationTags: ["seoul", "seongbuk"] },
  { timeTags: ["morning", "afternoon"], weatherTags: ["sunny"], locationTags: ["seoul", "urban"] },
  { timeTags: ["evening", "night"], weatherTags: ["sunny", "cloudy"], locationTags: ["seoul", "urban"] },
  { timeTags: ["night"], weatherTags: ["rain", "cloudy"], locationTags: ["seoul", "seongbuk", "urban"] },
  { timeTags: ["evening", "night"], weatherTags: ["rain", "snow", "cloudy"], locationTags: ["seoul", "seongbuk"] },
  { timeTags: ["afternoon", "evening"], weatherTags: ["sunny", "cloudy"], locationTags: ["seoul", "urban"] },
  { timeTags: ["morning", "afternoon", "evening"], weatherTags: ["sunny", "rain", "cloudy"], locationTags: ["seoul", "seongbuk", "urban"] },
];

export const localTracks = getTracksByIds([
  "fate-of-ophelia",
  "birds-of-a-feather",
  "blinding-lights",
  "gone-are-the-days",
  "traveler",
  "sweetener",
  "tattoo",
  "puppet-show",
  "style",
  "rich-man",
]).map((track, index) => ({ ...track, ...contextTags[index] }));

export const defaultRecommendedTracks = localTracks.slice(0, 5);
